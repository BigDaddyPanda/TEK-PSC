/*
export function someGetter (state) {
}
*/
import _ from "lodash";
export function progressGetter(state) {
  return state.progress;
}
export function successfullSubmissionsGetter(state) {
  return _.sortBy(state.successfullSubmissions).reverse();
}
