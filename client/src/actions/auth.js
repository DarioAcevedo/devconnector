import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_FAIL, REGISTER_SUCCESS, AUTH_ERROR, USER_LOADED, LOGIN_ERROR, LOGIN_SUCCESS } from './types';
import {setAuthToken} from '../utils/setAuthToken';

//Authenticate user

export const loadUser = () => async dispatch => {
    if(localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type : USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}



//Registration connection via the backend
export const register = ({ name, email, password }) => async dispatch =>{
    const config = {
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    const body = JSON.stringify({ name, email, password });
    try {
        //Send the new user to the backend
        const res = await axios.post('api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            //If the user is saved to de DB, the backend will return the token of the created user
            payload: res.data
        });
    } catch (err) {
        //The backend will return a list of errors if there where some.
        const errors = err.response.data.errors;
        if(errors){
            //Display the error list as an alert
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }
}


//Login user
export const login = ({ name, email, password }) => async dispatch =>{
    const config = {
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    const body = JSON.stringify({ name, email, password });
    try {
        //Send the new user to the backend
        const res = await axios.post('api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            //If the user is saved to de DB, the backend will return the token of the created user
            payload: res.data
        });
    } catch (err) {
        //The backend will return a list of errors if there where some.
        const errors = err.response.data.errors;
        if(errors){
            //Display the error list as an alert
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_ERROR
        });
    }
}