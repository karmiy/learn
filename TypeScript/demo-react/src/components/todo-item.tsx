import * as React from 'react';
import { ItemState, ShopState } from '../store/model';
import store from '../store';
import { changeInput, addItem, getTodoList, getMyList } from '../store/action-creator';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/reducer';

interface ITodoItemState {
}

interface ITodoItemProps extends ItemState, ShopState {
    onInputChange(value: string): void;
    addItem(): void;
    getList(): void;
}

class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
    // state = store.getState();
    constructor(props: ITodoItemProps) {
        super(props);
        /* store.subscribe(() => {
            this.setState(store.getState());
        }); */
    }

    componentDidMount() {
        // redux-thunk
        // Error ------- ignore --------
        // const action = getTodoList();
        // store.dispatch(action);

        this.props.getList();
    }

    onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const action = changeInput(e.target.value);
        // store.dispatch(action);
        this.props.onInputChange(e.target.value);
    }

    /* addItem = () => {
        const action = addItem();
        store.dispatch(action);
    } */

    render() {
        return (
            <div>
                这是TodoItem页面
                <input type="text" value={this.props.inputValue} onChange={this.onInputChange} />
                <button onClick={this.props.addItem}>Add list item</button>
                list: {this.props.list}
            </div>
        )
    }
}

const stateToProps = (state: RootState)=>{
    const { item, shop } = state;
    return {
        inputValue: item.inputValue,
        list: item.list,
        count: shop.count,
        name: shop.name,
    }
}

/* const dispatchToProps = (dispatch: Dispatch) =>{
    return {
        onInputChange(value: string){
          const action = changeInput(value);
          
          dispatch(action);
        },
        addItem() {
            const action = addItem();
            dispatch(action);
        },
        getList() {
            const action = getTodoList();
            // dispatch(action);
        },
    }
} */
const dispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        onInputChange: value => changeInput(value),
        addItem,
        // getList: getTodoList,
        getList: getMyList,
    }, dispatch);
    /* return {
        onInputChange(e: React.ChangeEvent<HTMLInputElement>){
          const action = changeInput(e.target.value);
          
          dispatch(action);
        },
        addItem() {
            const action = addItem();
            dispatch(action);
        },
        getList() {
            const action = getTodoList();
            // dispatch(action);
        },
    } */
}

export default connect(stateToProps, dispatchToProps)(TodoItem);
// export default TodoItem;