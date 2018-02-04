import {createStore, applyMiddleware} from 'redux'
import allReducers from './allReducers'
import {createLogger} from 'redux-logger'

export default function configureStore() {
    const logger = createLogger();
    const store = createStore(
        allReducers,
        applyMiddleware(logger)
    );

    return store;
}