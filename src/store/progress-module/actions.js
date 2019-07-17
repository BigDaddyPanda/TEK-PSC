import axios from "axios";
import { db, firebase } from "boot/firebase";
import { Notify, Dialog } from "quasar";
import AchievementDialog from "../../components/WeekActivity/AchievementDialog";
import _ from "lodash";
import DefaultProgress from "./state";
import achievement from "../../utils/achievements";
// import { firestoreAction } from "vuexfire";

// export const setProgressRef = firestoreAction(context => {
//   let user = firebase.auth().currentUser;
//   if (user) {
//     return context.bindFirestoreRef(
//       "onlineProgress",
//       db.collection("progress").doc(user.uid)
//     );
//   }
// });

/**
 * to be used as the first step to load
 * progress data, or the profile,
 * however the loaded data are those in the state
 * @param {*} context
 */

export function loadProgress(context) {
  const user = firebase.auth().currentUser;
  db.collection("progress")
    .doc(user.uid)
    .get()
    .then(snapshot => {
      let progress = {};
      if (!snapshot.exists) {
        db.collection("progress")
          .doc(user.uid)
          .set({
            progress: DefaultProgress.progress,
            successfullSubmissions: DefaultProgress.successfullSubmissions,
            joinTimeSeconds: new Date().valueOf()
          })
          .then(() => {
            Notify.create({
              color: "warning",
              message: "Please consider updating your CodeForces"
            });
            db.collection("progress")
              .doc(user.uid)
              .then(r => {
                progress = r.data();
                context.commit("setProgress", progress.progress);
              });
          });
      } else {
        progress = snapshot.data();
        context.commit("setProgress", progress.progress);
      }
    })
    .catch(error => {
      Notify.create(error.toString());
    });
}

/**
 * get the user submissions from firebase/firesotre
 * used in the history tracker
 * @param {*} context
 * @param {*} payload containing user uid and codeforcesHandler
 */

export function getSuccessSubmissions(context, payload) {
  db.collection("progress")
    .doc(payload.uid)
    .get()
    .then(snapshot => {
      if (snapshot.exists) {
        const profile = snapshot.data();
        context.commit("setSubmissions", profile.successfullSubmissions);
      }
    });
}
/**
 * Checkes previous stored submissions and match with
 * any new updates
 * to be used for data refreshing
 * @param {*} context
 * @param {*} payload containing user uid and codeforcesHandler
 */
export function updateMySuccessfulSubmissions(context, payload) {
  let success = [];
  db.collection("progress")
    .doc(payload.uid)
    .get()
    .then(snapshot => {
      const profile = snapshot.data();
      axios
        .get(
          "https://codeforces.com/api/user.status?handle=" +
            payload.codeforcesHandle
        )
        .then(response => {
          success = response.data.result
            .filter(
              e =>
                e["verdict"] === "OK" &&
                e["creationTimeSeconds"] > profile.joinTimeSeconds / 1000
            )
            .map(e => ({
              contestId: e.contestId,
              problem: e.problem,
              problemLink: `http://codeforces.com/problemset/problem/${
                e.contestId
              }/${e.problem.index}`,
              verdict: e.verdict,
              creationTimeSeconds: e.creationTimeSeconds * 1000,
              programmingLanguage: e.programmingLanguage
            }));
          const allSuccessSubmission = _.uniqWith(
            [...profile.successfullSubmissions, ...success],
            (sx, sy) => sx.problemLink === sy.problemLink
          );

          db.collection("progress")
            .doc(payload.uid)
            .update({ successfullSubmissions: allSuccessSubmission })
            .then(() => {
              context.commit("setSubmissions", allSuccessSubmission);
            });
        });
    });
}

/**
 *
 * given the progress.level schema, we add the received
 * lesson id to the progress, if not existing,
 * and increase the overall xp and level
 *
 * level: {
 *   totalXP: 0,
 *   level: 0,
 *   lessons: [
 *      {
 *        lessonId,
 *        lessonName,
 *        lessonTags,
 *        gainedXP
 *      }
 *   ]
 * @param {*} context
 */
export function submitUnlockingNewLesson(context, lessonSchema) {
  const user = firebase.auth().currentUser;
  db.collection("progress")
    .doc(user.uid)
    .get()
    .then(resp => {
      if (resp.exists) {
        let userData = resp.data();
        let solvedLessons = userData.progress.level.lessons;
        let alreadySolved = _.find(solvedLessons, [
          "lessonId",
          lessonSchema.lessonId
        ]);

        if (!alreadySolved) {
          let newCompleter = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          };
          db.collection("lessons")
            .where("lessonId", "==", lessonSchema.lessonId)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                db.collection("lessons")
                  .doc(doc.id)
                  .update({
                    completedBy: firebase.firestore.FieldValue.arrayUnion(
                      newCompleter
                    )
                  });
              });
            });
          db.collection("progress")
            .doc(user.uid)
            .update({
              "progress.level.lessons": firebase.firestore.FieldValue.arrayUnion(
                lessonSchema
              ),
              "progress.level.totalXP": firebase.firestore.FieldValue.increment(
                lessonSchema.gainedXP
              )
            });
        }
      }
    });
}
/**
 * once any of my counters increases, I submit the changes to my
 * profile on firebase
 * uuid>progress>achievements
 * @param {*} context
 * @param {*} update ={lessonCount,problemCount,contestsCount}
 */
export function updateMyAchievements(context) {
  let candidateAchievements = [],
    progress,
    user = firebase.auth().currentUser,
    lessonsCount = 0,
    problemsCount = 0,
    contestsCount = 0;
  if (user) {
    db.collection("progress")
      .doc(user.uid)
      .get()
      .then(snap => {
        if (snap.exists) {
          let snapshot = snap.data();
          progress = snapshot.progress;
          problemsCount = snapshot.successfullSubmissions.length;
          lessonsCount = progress.level.lessons.length;
          contestsCount = progress.contestStandings.length;
          candidateAchievements = achievement.filterAchievements(
            lessonsCount,
            problemsCount,
            contestsCount
          );
          let newAchievements = _.uniqBy(
            _.differenceBy(
              candidateAchievements,
              progress.achievements,
              "name"
            ),
            "name"
          );
          let claimedAchievements = _.map(
            _.unionBy(newAchievements, progress.achievements, "name"),
            e => ({ ...e, claimedOn: new Date().valueOf() })
          );
          if (!_.isEmpty(newAchievements)) {
            db.collection("progress")
              .doc(user.uid)
              .update({
                "progress.achievements": claimedAchievements
              })
              .then(() => {
                newAchievements.map(e => {
                  Dialog.create({
                    component: AchievementDialog,
                    achievement: e
                    // ...more.props...
                  })
                    .onOk(() => {
                      // console.log("OK");
                    })
                    .onCancel(() => {
                      // console.log("Cancel");
                    })
                    .onDismiss(() => {
                      // console.log("Called on OK or Cancel");
                    });
                });
              });
          }
        }
      });
  }
}
