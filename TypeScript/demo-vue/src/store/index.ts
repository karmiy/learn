import Vue from 'vue';
import Vuex from 'vuex';
import { mutations } from './mutations';
import { state, State } from './state';
import { getters } from './getters';
import { actions } from './actions';
import cart from './modules/cart';

Vue.use(Vuex);

export type RootState = State;

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {
    cart,
  },
})

