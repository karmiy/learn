export enum ItemActionConstants {
    CHANGE_INPUT_VALUE = 'changeInputValue',
    ADD_ITEM = 'addItem',
    GET_LIST = 'getList',
    GET_MY_LIST = 'getMyList',
}

export enum ShopActionConstants {
    INCREMENT = 'increment',
    DECREMENT = 'decrement',
    RENAME = 'rename',
}

/** ItemAction */
export type ChangeInputAction = {
    type: ItemActionConstants.CHANGE_INPUT_VALUE;
    value: string;
};

export type AddItemAction = {
    type: ItemActionConstants.ADD_ITEM;
    item: string;
};

export type GetListAction = {
    type: ItemActionConstants.GET_LIST;
    data: Array<string>;
};

// saga
export type GetMyListAction = {
    type: ItemActionConstants.GET_MY_LIST;
};

export type ItemAction = ChangeInputAction | AddItemAction | GetListAction;

/** ShopAction */
export type IncrementShopAction = {
    type: ShopActionConstants.INCREMENT;
}

export type DecrementShopAction = {
    type: ShopActionConstants.DECREMENT;
}

export type RenameShopAction = {
    type: ShopActionConstants.RENAME,
    value: string;
}

export type ShopAction = IncrementShopAction | DecrementShopAction | RenameShopAction;