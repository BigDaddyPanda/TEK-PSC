import axios from "axios";
import { db, firebase } from "boot/firebase";
import { Notify } from "quasar";
import _ from "lodash";

/**
 * to be used as the first step to load
 * progress data, or the profile,
 * however the loaded data are those in the state
 * @param {*} context
 */

export function loadProgress(context) {
  const user = firebase.auth().currentUser;
  const newProgress = require("./state");
  db.collection("progress")
    .doc(user.uid)
    .get()
    .then(snapshot => {
      let progress = {};
      if (!snapshot.exists) {
        db.collection("progress")
          .doc(user.uid)
          .set(newProgress.progress)
          .the(() => {
            Notify.create("Please consider updating your CodeForces");
            db.collection("progress")
              .doc(user.uid)
              .then(r => {
                progress = r.data();
                context.commit("setProgress", progress);
              });
          });
      } else {
        progress = snapshot.data();
        context.commit("setProgress", progress);
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
 * @param {*} payload
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
 * @param {*} payload
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
            payload.codeforcesHandler
        )
        .then(response => {
          success = response.data.result
            .filter(e => e["verdict"] === "OK")
            .map(e => ({
              contestId: e.contestId,
              problem: e.problem,
              problemLink: `http://codeforces.com/problemset/problem/${
                e.contestId
              }/${e.problem.index}`,
              verdict: e.verdict,
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
