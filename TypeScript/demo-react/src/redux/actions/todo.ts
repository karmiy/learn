import { Todo } from '../models/todo';
export enum ActionTodoConstants {
    ADD_TODO = 'todo/add',
    TOGGLE_TODO = 'todo/toggle',
}

let id = 0;

const addTodo = (name: string) => ({
    payload: {
        todo: {
            done: false,
            id: id++,
            name,
        }
    },
    type: ActionTodoConstants.ADD_TODO,
});

const toggleTodo = (id: number) => ({
    payload: {
        id,
    },
    type: ActionTodoConstants.TOGGLE_TODO,
});

// export type AddTodoAction = ReturnType<typeof addTodo>;
export type AddTodoAction = {
    type: ActionTodoConstants.ADD_TODO;
    payload: { 
        todo: Todo;
    }
};
// export type ToggleTodoAction = ReturnType<typeof toggleTodo>;
export type ToggleTodoAction = {
    type:  ActionTodoConstants.TOGGLE_TODO;
    payload: {
        id: number;
    }
};
export type Action = AddTodoAction | ToggleTodoAction;