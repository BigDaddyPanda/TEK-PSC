/*
export function someGetter (state) {
}
*/
import _ from 'lodash';
export function getAllSheets(state) {
  return _.reverse(_.sortBy(state.sheets, ["addedDate", "name"]));
}
