import { FETCH_USER_SUCCESS, UPDATE_USER_SUCCESS } from '../actions/userActions';

const initialState = {
    user: null,
    loading: true,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
            };
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
                loading: false,
            };
        default:
            return state;
    }
};

export default userReducer;
