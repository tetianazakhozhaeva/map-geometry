import { createStore } from 'redux'
import allReducers from './allReducers'

let store = createStore(allReducers);

export default store;