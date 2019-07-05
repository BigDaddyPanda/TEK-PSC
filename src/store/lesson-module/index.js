import state from "./state";
import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";
import { vuexfireMutations } from "vuexfire";

export default {
  namespaced: true,
  state,
  getters,
  mutations: {
    ...vuexfireMutations,
    ...mutations
  },
  actions
};
