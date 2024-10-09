// redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser, saveUser } from '../../firebaseService';

// Async thunk for fetching user data
export const fetchUser = createAsyncThunk('user/fetchUser', async (userId) => {
    const user = await getUser(userId);
    return user;
});

// Async thunk for updating user data
export const updateUser = createAsyncThunk('user/updateUser', async ({ userId, userData }) => {
    await saveUser(userId, userData);
    return userData;
});

// Initial state
const initialState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
            });
    },
});

export default userSlice.reducer;
