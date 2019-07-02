/* eslint-disable */
import { Notify } from 'quasar'
export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    let authed = store.state.authStore.loggedIn;
    if (to.matched.some(record => record.meta.private) && !authed) {
      Notify.create({
        message: "You cannont access as Anonymous User" ,
        color: "negative"
      })
      next("/");
    }
    else
      next();
  })
}
