import { firestoreAction } from "vuexfire";
const nanoid = require("nanoid");
import { db } from "boot/firebase";
const newLesson = {
  lessonId: null,
  name: "",
  content: "",
  editor: "",
  isWeekActivity: false,
  addedDate: "",
  coverPhoto: "",
  isPublic: true,
  tags: [],
  quiz: [
    {
      question: "",
      answers: ["", "", "", ""],
      correct: [2]
    }
  ],
  nextLesson: "",
  completedBy: []
};
export const bindLessonsRef = firestoreAction(context => {
  return context.bindFirestoreRef("lessons", db.collection("lessons"));
});

export const addNewLesson = function(context) {
  context.commit("setLesson", newLesson);
};
export const dismissLesson = function(context) {
  context.commit("setLesson", {});
};
export const openLesson = function(context, payload) {
  context.commit("setLesson", payload);
};

export const saveLesson = firestoreAction((context, payload) => {
  payload.lessonId = nanoid();
  payload.order = -new Date().valueOf();
  return db.collection("lessons").add(payload);
});
export const updateLesson = firestoreAction((context, payload) => {
  // return db.collection("lessons").add(payload);
  let lid = null;
  return db
    .collection("lessons")
    .where("lessonId", "==", payload.lessonId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        lid = doc.id;
        if (lid) {
          db.collection("lessons")
            .doc(lid)
            .update({
              ...payload
            });
        }
      });
    });
});
export const markAsWeekActivity = firestoreAction((context, payload) => {
  // return db.collection("lessons").add(payload);
  let lid = null;
  return db
    .collection("lessons")
    .where("isWeekActivity", "==", true)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        lid = doc.id;
        if (lid) {
          db.collection("lessons")
            .doc(lid)
            .update({
              isWeekActivity: false
            });
        }
      });
    })
    .then(() => {
      db.collection("lessons")
        .where("lessonId", "==", payload.lessonId)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            lid = doc.id;
            if (lid) {
              db.collection("lessons")
                .doc(lid)
                .update({
                  isWeekActivity: true
                });
            }
          });
        });
    });
});

export const removeLesson = firestoreAction((context, id) => {
  let lessonId = null;
  return db
    .collection("lessons")
    .where("lessonId", "==", id)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        lessonId = doc.id;
        if (lessonId) {
          db.collection("lessons")
            .doc(lessonId)
            .delete();
        }
      });
    });
});
