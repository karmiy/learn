import { MutationTree, ActionTree, Commit, ActionContext, GetterTree } from 'vuex';
import { RootState } from '../../index';

export interface IFood {
    id: number;
    name: string;
    price: number;
}

export interface State {
    foodList: Array<IFood>;
}

const state: State = {
    foodList: [{
        id: 1,
        name: 'apple',
        price: 3,
    }]
}

const mutations: MutationTree<State> = {
    addFood(state, food: IFood) {
        state.foodList.push(food);
    }
}

const actions: ActionTree<State, RootState> = {
    /* doubleAdd(context: ActionContext<State, RootState>, food: IFood) {
        console.log(context.state, context.getters, context.rootState, context.rootGetters);
        
        for(let i = 0; i < 2; i++) {
            context.commit('addFood', food);
            // context.commit('createTodo', food, { root: true });
        }
    } */
    doubleAdd: {
        root: true,
        handler(context: ActionContext<State, RootState>, food: IFood) {
            console.log(context.getters, context.rootGetters);
            for(let i = 0; i < 2; i++) {
                context.commit('addFood', food);
            }
        }
    }
}

const getters: GetterTree<State, RootState> = {
    foodCount(state, getters, rootState, rootGetters): number {
        // console.log(state);
        console.log(state, getters, rootState, rootGetters);
        
        return state.foodList.length;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}