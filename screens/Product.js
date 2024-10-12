import React, { useState } from 'react';
import {
    View, Text, Image, StyleSheet, Button, Alert, Modal,
    TextInput, TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteProductAction, updateProductAction } from '../redux/slices/productSlice';
import { deleteProduct, updateProduct } from '../firebaseService'; // Import firebase service functions
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from '../firebase';  // Import Firebase auth and storage

// Function to upload the image to Firebase Storage
const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`products/${Date.now()}_${auth.currentUser.uid}`);
    await ref.put(blob);
    const downloadURL = await ref.getDownloadURL();
    return downloadURL;
};

const Product = ({ route }) => {
    const { product } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [updatedName, setUpdatedName] = useState(product.name);
    const [updatedDescription, setUpdatedDescription] = useState(product.description);
    const [updatedCondition, setUpdatedCondition] = useState(product.condition);
    const [updatedImage, setUpdatedImage] = useState(product.image);
    const [isLoading, setIsLoading] = useState(false);  // Loading state for image upload
    const dispatch = useDispatch();

    // Handler for deleting the product
    const handleDelete = async () => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        const success = await deleteProduct(product.id);
                        if (success) {
                            dispatch(deleteProductAction(product.id));
                        } else {
                            Alert.alert('Error', 'Failed to delete the product. Please try again.');
                        }
                    }
                },
            ]
        );
    };

    // Handler for updating product details
    const handleUpdateProduct = async () => {
        try {
            setIsLoading(true);  // Start loading
            let imageUrl = updatedImage;

            // If a new image has been selected, upload it to Firebase Storage
            if (updatedImage.startsWith('file://')) {
                imageUrl = await uploadImageAsync(updatedImage);
            }

            const updatedProduct = {
                name: updatedName,
                description: updatedDescription,
                condition: updatedCondition,
                image: imageUrl,
            };

            const success = await updateProduct(product.id, updatedProduct);
            if (success) {
                dispatch(updateProductAction({ productId: product.id, productData: updatedProduct }));
                setModalVisible(false);  // Close the modal, but stay on the product page
            } else {
                Alert.alert('Error', 'Failed to update the product. Please try again.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update the product. Please try again.');
        } finally {
            setIsLoading(false);  // Stop loading
        }
    };

    // Handler for picking a new image
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUpdatedImage(result.assets[0].uri); // Set the selected image URI for uploading
        }
    };

    // Handler for adding product to wishlist
    const handleAddToWishlist = () => {
        Alert.alert('Wishlist', `Product "${product.name}" has been added to your wishlist!`);
        // Add functionality to actually add the product to the user's wishlist if required
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.productInfoContainer}>
                {/* Product Image */}
                <Image source={{ uri: updatedImage || product.image }} style={styles.productImage} />

                {/* Product Information */}
                <View style={styles.infoSection}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDescription}>{product.description}</Text>
                    <Text style={styles.productCondition}>Condition: {product.condition}</Text>
                </View>
            </View>

            {/* Delete and Update Buttons */}
            <View style={styles.actionButtons}>
                <Button title="Update" onPress={() => setModalVisible(true)} color="#007bff" />
                <Button title="Delete" onPress={handleDelete} color="#dc3545" />
            </View>

            {/* New Section for "Wish to Change With" */}
            <View style={styles.wishSection}>
                <Text style={styles.wishTitle}>Wish to Change With</Text>
                <Button title="Add to Wishlist" onPress={handleAddToWishlist} color="#28a745" />
            </View>

            {/* Modal for updating product info */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Product</Text>

                        {/* Input fields for updating product info */}
                        <TextInput
                            style={styles.input}
                            placeholder="Product Name"
                            value={updatedName}
                            onChangeText={setUpdatedName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={updatedDescription}
                            onChangeText={setUpdatedDescription}
                            multiline
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Condition (New, Used, etc.)"
                            value={updatedCondition}
                            onChangeText={setUpdatedCondition}
                        />

                        {/* Image picker for selecting a new image */}
                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            <Text style={styles.imagePickerText}>Pick a new image</Text>
                        </TouchableOpacity>

                        {updatedImage && (
                            <Image
                                source={{ uri: updatedImage }}
                                style={styles.previewImage}
                            />
                        )}

                        {/* Loading Spinner */}
                        {isLoading && <ActivityIndicator size="large" color="#007bff" />}

                        {/* Buttons to save or cancel updates */}
                        <View style={styles.modalButtons}>
                            <Button title="Register" onPress={handleUpdateProduct} />
                            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    productInfoContainer: {
        backgroundColor: '#9c88ff',
        borderRadius: 10,
        marginBottom: 20,
        padding: 20,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    infoSection: {
        marginBottom: 30,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productDescription: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    productCondition: {
        fontSize: 16,
        color: 'gray',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    // New Styles for Wish Section
    wishSection: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#7ed6df', // Light green background color
        marginBottom: 30,
        alignItems: 'center',
    },
    wishTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    imagePicker: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginBottom: 10,
    },
    imagePickerText: {
        color: '#fff',
        textAlign: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
});

export default Product;
