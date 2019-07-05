import _ from "lodash";
export function setLesson(state, payload) {
  state.lessonPreview = Object.assign({}, payload);
  state.dialog = !_.isEmpty(payload);
}

export function setAllLessons(state, payload) {
  state.lessons = payload;
}
