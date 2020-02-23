import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';

import thunk from 'redux-thunk';

import createSagaMiddleware from 'redux-saga';
import mySagas from './sagas';
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

// redux-thunk
// const enhancer = composeEnhancers(applyMiddleware(thunk));

// redux-saga
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

// const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const store = createStore(reducer, enhancer);

// redux-saga
sagaMiddleware.run(mySagas);

export default store;