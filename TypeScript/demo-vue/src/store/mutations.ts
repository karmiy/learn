import { MutationTree } from 'vuex';
import { State, ITodo } from './state';

export const mutations: MutationTree<State> = {
    createTodo(state, todo: ITodo) {
        state.todoList.push(todo);
    }
}