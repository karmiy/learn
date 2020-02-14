export interface ITodo {
    id: number;
    name: string;
    isDone: boolean;
}

export interface State {
    todoList: Array<ITodo>;
}

export const state: State = {
    todoList: [],
}