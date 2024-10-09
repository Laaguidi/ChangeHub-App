// redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../../firebaseService';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const products = await getProducts();
    return products;
});

// Async thunk for adding a new product
export const addProduct = createAsyncThunk('products/addProduct', async (productData) => {
    const { id, ...data } = productData;
    await createProduct(id, data);
    return productData;
});

// Async thunk for updating a product
export const updateProductAction = createAsyncThunk('products/updateProduct', async ({ productId, productData }) => {
    await updateProduct(productId, productData);
    return { id: productId, ...productData };
});

// Async thunk for deleting a product
export const deleteProductAction = createAsyncThunk('products/deleteProduct', async (productId) => {
    await deleteProduct(productId);
    return productId;
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
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProductAction.fulfilled, (state, action) => {
                const index = state.products.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProductAction.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product.id !== action.payload);
            });
    },
});

export default productSlice.reducer;
