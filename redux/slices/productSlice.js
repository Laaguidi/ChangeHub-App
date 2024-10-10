import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../../firebaseService';

// Async thunk for deleting a product
export const deleteProductAction = createAsyncThunk('products/deleteProduct', async (productId) => {
    await deleteProduct(productId);
    return productId;
});

// Async thunk for updating a product
export const updateProductAction = createAsyncThunk('products/updateProduct', async ({ productId, productData }) => {
    await updateProduct(productId, productData);
    return { id: productId, ...productData };
});

// Initial state
const initialState = {
    products: [],
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Delete Product
            .addCase(deleteProductAction.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product.id !== action.payload);
            })
            // Update Product
            .addCase(updateProductAction.fulfilled, (state, action) => {
                const index = state.products.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            });
    },
});

export default productSlice.reducer;
