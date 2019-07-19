import _ from "lodash";
/**
 *
 * @param {*} state
 * @param {*} payload denoting the user progress
 */
export function setProgress(state, payload) {
  state.progress = _.cloneDeep(payload);
}

/**
 *
 * @param {*} state
 * @param {*} payload denoting the user successfull submissions
 */
export function setSubmissions(state, payload) {
  state.successfullSubmissions = _.cloneDeep(payload);
}
export function setContestSubmissions(state, payload) {
  state.contestSubmissions = _.cloneDeep(payload);
}
