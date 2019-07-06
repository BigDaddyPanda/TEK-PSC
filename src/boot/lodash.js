import _ from "lodash";
const nanoid = require("nanoid");
const moment = require("moment");

export default async ({ Vue }) => {
  Vue.prototype.$_ = _;
  Vue.prototype.$moment = moment;
  Vue.prototype.$nanoid = () => nanoid(36);
};
