/* eslint-disable */
import { Notify } from "quasar";
let myHistory = [];
export default ({ router, store, Vue }) => {
  if (!Vue.prototype.$myHistory) {
    Vue.prototype.$myHistory = {};
  }
  router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    let authed = store.state.authStore.user;
    if (to.matched.some(record => record.meta.private) && !authed) {
      Vue.prototype.$myHistory = to;
      next("/");
    } else {
      let isAdmin = store.state.authStore.isAdmin;
      if (
        to.matched.some(record => record.meta.requiresAdminShip) &&
        !isAdmin
      ) {
        Notify.create({
          message: "You cannont access as non Admin",
          color: "negative"
        });
        next(from);
      } else {
        next();
      }
    }
  });
};
