/*
 */
import _ from "lodash";
export function allContestsGetter(state) {
  return _.sortBy(state.contests, ["name", "addedDate"]);
}
export function getContestGroupList(state) {
  return _.groupBy(
    _.sortBy(state.contests, ["name", "addedDate"]),
    "groupName"
  );
}
