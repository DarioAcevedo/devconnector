import {v4 as uuidv4} from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// Make alerts to appear on the page load

export const setAlert = (msg, alertType) => dispatch => {
    //Set an ID for the alert in order to have some ID in case you wanna delete alert
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: {  msg, alertType, id }
    });
    //After some minutes, hide the alert
    setTimeout(()=> dispatch({
        type: REMOVE_ALERT,
        payload: id
    }), 3000);
};