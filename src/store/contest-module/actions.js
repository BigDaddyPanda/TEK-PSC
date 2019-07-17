/*
export function someAction (context) {
}
*/

/*
export function someAction (context) {
}
*/

import { firestoreAction } from "vuexfire";
const nanoid = require("nanoid");
import { db, firebase } from "boot/firebase";
import { Notify } from "quasar";

export const bindContestsRef = firestoreAction(context => {
  return context.bindFirestoreRef("contests", db.collection("contests"));
});

export const saveContest = firestoreAction((context, payload) => {
  payload.contestId = nanoid();
  payload.editor = firebase.auth().currentUser
    ? firebase.auth().currentUser.displayName ||
      firebase.auth().currentUser.email
    : "Unknown";
  payload.standings = [];
  return db
    .collection("contests")
    .add(payload)
    .then(() => {
      Notify.create({
        color: "positive",
        message: `Successfully saved the ${payload.name} Contest`
      });
    });
});
export const updateContest = firestoreAction((context, payload) => {
  let lid = null;
  return db
    .collection("contests")
    .where("contestId", "==", payload.contestId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        lid = doc.id;
        if (lid) {
          db.collection("contests")
            .doc(lid)
            .update({
              ...payload
            });
        }
      });
    })
    .then(() => {
      Notify.create({
        color: "positive",
        message: `Successfully updated the ${payload.name} Contest`
      });
    });
});

export const removeContest = firestoreAction((context, payload) => {
  let contestId = null;
  return db
    .collection("contests")
    .where("contestId", "==", payload.contestId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        contestId = doc.id;
        if (contestId) {
          db.collection("contests")
            .doc(contestId)
            .delete();
        }
      });
    });
});
