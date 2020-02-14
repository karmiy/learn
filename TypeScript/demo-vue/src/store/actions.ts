import { ActionTree, Commit, ActionContext } from 'vuex';
import { ITodo, State } from './state';
import { RootState } from './index';

export const actions: ActionTree<State, RootState> = {
    doubleCreate(context: ActionContext<State, RootState>, todo: ITodo) {
        for(let i = 0; i < 2; i++) {
            context.commit('createTodo', todo);
        }
    }
}