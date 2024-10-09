// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; // Updated path to slices
import productReducer from './slices/productSlice'; // Updated path to slices

export const store = configureStore({
    reducer: {
        user: userReducer,
        products: productReducer,
    },
});
