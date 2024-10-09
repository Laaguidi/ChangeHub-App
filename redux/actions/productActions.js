// redux/actions/productActions.js
import { createProduct, updateProduct, deleteProduct, getProducts } from '../../firebaseService';
import { PRODUCT_ADD, PRODUCT_UPDATE, PRODUCT_DELETE, FETCH_PRODUCTS_SUCCESS } from './types';

export const addProduct = (productId, productData) => async (dispatch) => {
    const success = await createProduct(productId, productData);
    if (success) {
        dispatch({
            type: PRODUCT_ADD,
            payload: { id: productId, ...productData },
        });
    }
};

export const updateProductAction = (productId, productData) => async (dispatch) => {
    const success = await updateProduct(productId, productData);
    if (success) {
        dispatch({
            type: PRODUCT_UPDATE,
            payload: { id: productId, ...productData },
        });
    }
};

export const deleteProductAction = (productId) => async (dispatch) => {
    const success = await deleteProduct(productId);
    if (success) {
        dispatch({
            type: PRODUCT_DELETE,
            payload: productId,
        });
    }
};

export const fetchProducts = () => async (dispatch) => {
    const products = await getProducts();
    dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: products,
    });
};
