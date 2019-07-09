import _ from "lodash";
export function setProgress(state, payload) {
  state.profile = _.cloneDeep(payload);
}
export function setSubmissions(state, payload) {
  state.userSubmissions = _.cloneDeep(payload);
}
