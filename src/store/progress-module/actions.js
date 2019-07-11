import axios from "axios";
import { db, firebase } from "boot/firebase";
import { Notify } from "quasar";
import _ from "lodash";
import DefaultProgress from "./state";

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
            joinTimeSeconds: Math.floor(new Date().valueOf() / 1000)
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
                e["creationTimeSeconds"] > profile.joinTimeSeconds
            )
            .map(e => ({
              contestId: e.contestId,
              problem: e.problem,
              problemLink: `http://codeforces.com/problemset/problem/${
                e.contestId
              }/${e.problem.index}`,
              verdict: e.verdict,
              creationTimeSeconds: e.creationTimeSeconds,
              programmingLanguage: e.programmingLanguage
            }));
          const allSuccessSubmission = _.uniqWith(
            [...profile.successfullSubmissions, ...success],
            _.isEqual
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
