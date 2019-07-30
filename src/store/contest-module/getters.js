/*
 */
import _ from "lodash";
export function allContestsGetter(state) {
  return _.reverse(_.sortBy(state.contests, ["addedDate", "name"]));
}
export function getContestGroupList(state) {
  return _.reverse(
    _.groupBy(_.sortBy(state.contests, ["addedDate", "name"]), "groupName")
  );
}
// ['Online Round','Daily Sheet','Local Contest']
export function getOnlineRound(state) {
  return _.groupBy(_.filter(state.contests, ["nature", "Online Round"]), "groupName")
}
export function getLocalContests(state) {
  return _.groupBy(_.filter(state.contests, ["nature", "Local Contest"]), "groupName")
}
export function getDailySheets(state) {
  return _.groupBy(_.filter(state.contests, ["nature", "Daily Sheet"]), "groupName")
}

export function getGroupedStandings(state) {
  const allCont = _.reverse(_.sortBy(state.contests, ["addedDate", "name"]));
  const Ret = {
    "Online Round": _.groupBy(_.filter(allCont, ["nature", "Online Round"]), "groupName"),
    "Daily Sheet": _.groupBy(_.filter(allCont, ["nature", "Daily Sheet"]), "groupName"),
    "Local Contest": _.groupBy(_.filter(allCont, ["nature", "Local Contest"]), "groupName")
  };
  return (Ret)
}
