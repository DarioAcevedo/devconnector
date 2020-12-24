import { combineReducers } from 'redux';
import alert from './alert';
import auth from './Auth';

export default combineReducers({
    alert,
    auth
});