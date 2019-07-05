/*
 */
import _ from "lodash";
export function dialog(state) {
  return state.dialog;
}
export function lessonPreview(state) {
  if (_.isEmpty(state.lessonPreview)) {
    return {
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
  }
  return state.lessonPreview;
}
