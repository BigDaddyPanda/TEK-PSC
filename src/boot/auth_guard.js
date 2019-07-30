/* eslint-disable */
import { Notify } from "quasar";
let myHistory = [];
export default ({ router, store, Vue }) => {
  if (!Vue.prototype.$myHistory) {
    Vue.prototype.$myHistory = {};
  }
  router.beforeEach((to, from, next) => {
    let { title } = to.meta;
    if (to.params.handle) {
      title += " - " + to.params.handle + " Profile";
    }
    document.title = title;

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
