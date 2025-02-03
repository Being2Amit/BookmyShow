import { legacy_createStore } from 'redux'
import myreducer from './reducer';

var store=legacy_createStore(myreducer)
export default store;