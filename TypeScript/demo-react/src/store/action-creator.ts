import { Dispatch, Action, ActionCreator } from 'redux';
import { 
    ItemActionConstants, 
    ShopActionConstants,
    ChangeInputAction,
    AddItemAction,
    GetListAction,
    GetMyListAction,
    IncrementShopAction,
    DecrementShopAction,
    RenameShopAction,
 } from './action-type';
import { ThunkAction } from 'redux-thunk';
import { ItemState } from './model';

// type ActionCreator<A extends Action> = (payload?: Omit<A, 'type'>) => A;
// R: return; S: State; E: extraArgument; A: Action
type ThunkActionCreator<R, S, E, A extends Action> = (...args: any[]) => ThunkAction<R, S ,E ,A>;

/** Item */
export const changeInput: ActionCreator<ChangeInputAction> = (value) => ({
    type: ItemActionConstants.CHANGE_INPUT_VALUE,
    value,
});

export const addItem: ActionCreator<AddItemAction> = () => ({
    type: ItemActionConstants.ADD_ITEM,
    item: 'New Item',
});

export const getList: ActionCreator<GetListAction> = (data) => ({
    type: ItemActionConstants.GET_LIST,
    data,
});

export const getMyList: ActionCreator<GetMyListAction> = () => ({
    type: ItemActionConstants.GET_MY_LIST,
});

// : ThunkActionCreator<void, ItemState, void, GetListAction>
export const getTodoList: ThunkActionCreator<void, ItemState, void, GetListAction> = () => {
    return async (dispach, getState) => {
        const data = await new Promise<string[]>(r => {
            setTimeout(() => {
                const data = [
                    '11:00 喝水',
                    '12:00 吃饭'
                ];
                r(data);
            }, 2000);
        });
        const action = getList(data);
        dispach(action);
    }
};

/** Shop */
export const incrementShop: ActionCreator<IncrementShopAction> = () => ({
    type: ShopActionConstants.INCREMENT,
});

export const decrementShop: ActionCreator<DecrementShopAction> = () => ({
    type: ShopActionConstants.DECREMENT,
});

export const renameShop: ActionCreator<RenameShopAction> = ({ value }) => ({
    type: ShopActionConstants.RENAME,
    value,
});