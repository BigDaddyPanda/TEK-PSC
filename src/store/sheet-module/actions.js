/*
export function someAction (context) {
}
*/

import { firestoreAction } from "vuexfire";
const nanoid = require("nanoid");
import { db } from "boot/firebase";

export const bindSheetsRef = firestoreAction(context => {
  return context.bindFirestoreRef("sheets", db.collection("sheets"));
});

// export const addNewSheet = function(context) {
//   context.commit("setSheet", newSheet);
// };
// export const dismissSheet = function(context) {
//   context.commit("setSheet", {});
// };
// export const openSheet = function(context, payload) {
//   context.commit("setSheet", payload);
// };

export const saveSheet = firestoreAction((context, payload) => {
  payload.sheetId = nanoid();
  return db.collection("sheets").add(payload);
});
export const updateSheet = firestoreAction((context, payload) => {
  // return db.collection("sheets").add(payload);
  let lid = null;
  return db
    .collection("sheets")
    .where("sheetId", "==", payload.sheetId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        lid = doc.id;
        if (lid) {
          db.collection("sheets")
            .doc(lid)
            .update({
              ...payload
            });
        }
      });
    });
});
export const togglePublic = firestoreAction((context, payload) => {
  let lid = null;
  return db
    .collection("sheets")
    .where("sheetId", "==", payload.sheetId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        lid = doc.id;
        if (lid) {
          db.collection("sheets")
            .doc(lid)
            .update({
              isPublic: !payload.isPublic
            });
        }
      });
    });
});

export const removeSheet = firestoreAction((context, payload) => {
  let sheetId = null;
  // console.log(payload.sheetId);
  return db
    .collection("sheets")
    .where("sheetId", "==", payload.sheetId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        sheetId = doc.id;
        if (sheetId) {
          db.collection("sheets")
            .doc(sheetId)
            .delete();
        }
      });
    });
});
