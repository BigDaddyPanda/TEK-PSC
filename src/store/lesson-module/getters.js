/*
 */
import _ from "lodash";
export function adminLessonsGetter(state) {
  return state.lessons;
}
export function LessonsGetter(state) {
  return state.lessons.filter(e => e.isPublic);
}

export function weekActivityGetter(state) {
  return state.lessons.filter(e => e.isWeekActivity)[0] || {};
}
export function allPublicLessonsGetter(state) {
  return state.lessons.filter(e => !e.isWeekActivit);
}

export function AllLessonsGetter(state) {
  return state.lessons;
}
export function lessonPreview(state) {
  if (_.isEmpty(state.lessonPreview)) {
    return {
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
          correct: []
        }
      ],
      nextLesson: ""
    };
  }
  return state.lessonPreview;
}
