import { firestoreAction } from "vuexfire";

import { db } from "boot/firebase";
const newLesson = {
  name: "",
  content: "",
  editor: "",
  isWeekActivity: false,
  addedDate: "",
  backGroundPhoto: "",
  quiz: [
    {
      question: "",
      answers: [],
      correct: []
    }
  ],
  nextLessonName: ""
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
