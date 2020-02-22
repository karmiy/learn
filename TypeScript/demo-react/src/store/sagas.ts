import { takeEvery, put } from 'redux-saga/effects';
import { getList } from './action-creator';
import { ItemActionConstants } from './action-type';

function* getMyList() {
    const data: string[] = yield new Promise<string[]>(r => {
        setTimeout(() => {
            const data = [
                '11:00 喝水',
                '12:00 吃饭'
            ];
            r(data);
        }, 2000);
    });
    const action = getList(data);
    yield put(action);
}

function* mySagas() {
    yield takeEvery(ItemActionConstants.GET_MY_LIST, getMyList);
}

export default mySagas;

