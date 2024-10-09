// redux/actions/userActions.js
import { saveUser, getUser } from '../../firebaseService';
import { USER_UPDATE, FETCH_USER_SUCCESS } from './types';

export const updateUser = (userId, userData) => async (dispatch) => {
    const success = await saveUser(userId, userData);
    if (success) {
        dispatch({
            type: USER_UPDATE,
            payload: userData,
        });
    }
};

export const fetchUser = (userId) => async (dispatch) => {
    const userData = await getUser(userId);
    dispatch({
        type: FETCH_USER_SUCCESS,
        payload: userData,
    });
};
