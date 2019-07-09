/* eslint-disable */
import { Notify } from "quasar";
export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    let authed = store.state.authStore.user;
    if (to.matched.some(record => record.meta.private) && !authed) {
      Notify.create({
        message: "You cannont access as Anonymous User",
        color: "negative"
      });
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
        next("/psc/");
      } else {
        next();
      }
    }
  });
};
