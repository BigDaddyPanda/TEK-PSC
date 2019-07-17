import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'
import authStore from "./auth-module";
import lessonStore from "./lesson-module";
import sheetStore from "./sheet-module";
import chatStore from "./chat-store";
import progressStore from "./progress-module";
import contestStore from "./contest-module";

import { vuexfireMutations } from "vuexfire";
Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      authStore,
      sheetStore,
      chatStore,
      progressStore,
      lessonStore,
      contestStore
    },
    mutations: {
      // firebase mutation required for functionality
      ...vuexfireMutations
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  // if (process.env.DEV && module.hot) {
  //   module.hot.accept(['./showcase'], () => {
  //     const newShowcase = require('./showcase').default
  //     Store.hotUpdate({ modules: { showcase: newShowcase } })
  //   })
  // }

  return Store;
}
