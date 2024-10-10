import { FETCH_USER_SUCCESS, UPDATE_USER_SUCCESS } from '../actions/userActions';

const initialState = {
    user: null,
    loading: true,
    error: null,
};

// Helper function to serialize date fields
const serializeDates = (user) => {
    if (user?.createdAt?.toDate) {
        user.createdAt = user.createdAt.toDate().toISOString();
    }
    if (user?.updatedAt?.toDate) {
        user.updatedAt = user.updatedAt.toDate().toISOString();
    }
    return user;
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: serializeDates(action.payload),
                loading: false,
            };
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                user: serializeDates({ ...state.user, ...action.payload }),
                loading: false,
            };
        default:
            return state;
    }
};

export default userReducer;
