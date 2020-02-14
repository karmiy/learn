import { GetterTree } from 'vuex';
import { State } from './state';
import { RootState } from '.';

export const getters: GetterTree<State, RootState> = {
    todoCount(state): number {
        return state.todoList.length;
    }
}