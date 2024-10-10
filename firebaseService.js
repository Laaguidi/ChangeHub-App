import { db } from './firebase';

// Create or Update User Information
export const saveUser = async (userId, userData) => {
    try {
        await db.collection('users').doc(userId).set({
            ...userData,
            createdAt: userData.createdAt || new Date().toISOString(), // Ensure createdAt is a serializable format
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving user data: ', error);
        return false;
    }
};

// Get User Data
export const getUser = async (userId) => {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        return userDoc.exists ? userDoc.data() : null;
    } catch (error) {
        console.error('Error getting user data: ', error);
        return null;
    }
};

// Create Product
export const createProduct = async (productData) => {
    try {
        const userId = productData.userId;  // Make sure the userId is passed to this function
        await db.collection('products').add({ ...productData, userId });
        return true;
    } catch (error) {
        console.error('Error creating product: ', error);
        return false;
    }
};

// Get Products
export const getProducts = async () => {
    try {
        const productsSnapshot = await db.collection('products').get();
        return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting products: ', error);
        return [];
    }
};

// Update Product
export const updateProduct = async (productId, productData) => {
    try {
        await db.collection('products').doc(productId).update({
            ...productData,
            updatedAt: new Date().toISOString(), // Include updated timestamp for tracking
        });
        return true;
    } catch (error) {
        console.error('Error updating product: ', error);
        return false;
    }
};

// Delete Product
export const deleteProduct = async (productId) => {
    try {
        await db.collection('products').doc(productId).delete();
        return true;
    } catch (error) {
        console.error('Error deleting product: ', error);
        return false;
    }
};
