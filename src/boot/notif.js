import { Notify } from "quasar";
const notif = (type, message) => {
  Notify.create({
    color: type,
    message: message
  });
};

export default async ({ Vue }) => {
  Vue.prototype.$positive = message => notif("positive", message);
  Vue.prototype.$warning = message => notif("warning", message);
  Vue.prototype.$negative = message => notif("negative", message);
  Vue.prototype.$info = message => notif("info", message);
};
