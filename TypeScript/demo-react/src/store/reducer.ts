import { ItemActionConstants, ShopActionConstants, ItemAction, ShopAction } from './action-type';
import { Reducer, combineReducers } from 'redux';
import { ItemState, ShopState } from './model';

const defaultItemState: ItemState = {
    inputValue: 'something',
    list: [
        '4:00 起床',
        '5:00 跑步'
    ]
};

const itemReducer: Reducer<ItemState, ItemAction> = (state = defaultItemState, action) => {
    switch (action.type) {
        case ItemActionConstants.CHANGE_INPUT_VALUE:
            return {
                ...state,
                inputValue: action.value,
            }
        case ItemActionConstants.ADD_ITEM:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.item,
                ]
            }
        case ItemActionConstants.GET_LIST:
            return {
                ...state,
                list: action.data,
            }
        default:
            return state;
    }
}

const defaultShopState: ShopState = {
    count: 0,
    name: 'k013'
};

const shopReducer: Reducer<ShopState, ShopAction> = (state = defaultShopState, action) => {
    switch (action.type) {
        case ShopActionConstants.INCREMENT:
            return {
                ...state,
                count: state.count + 1,
            }
        case ShopActionConstants.DECREMENT:
            return {
                ...state,
                count: state.count - 1,
            }
        case ShopActionConstants.RENAME:
            return {
                ...state,
                name: action.value,
            }
        default:
            return state;
    }
}

// export default itemReducer;
const rootReducer = combineReducers({
    item: itemReducer,
    shop: shopReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;