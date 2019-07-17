/*
 */
import _ from "lodash";
export function allContestsGetter(state) {
  return state.contests;
}
export function getContestGroupList(state) {
  return _.groupBy(state.contests, "groupName");
}
