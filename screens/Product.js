import React, { useState } from 'react';
import {
    View, Text, Image, StyleSheet, FlatList, Button, Alert, Modal,
    TextInput, TouchableOpacity, ScrollView
} from 'react-native';
import { deleteProduct, updateProduct } from '../firebaseService'; // Import the service functions
import { useDispatch } from 'react-redux';
import { deleteProductAction, updateProductAction } from '../redux/slices/productSlice';

const Product = ({ route, navigation }) => {
    const { product } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [updatedName, setUpdatedName] = useState(product.name);
    const [updatedDescription, setUpdatedDescription] = useState(product.description);
    const [updatedCondition, setUpdatedCondition] = useState(product.condition);
    const [updatedImage, setUpdatedImage] = useState(product.image);
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
                            navigation.goBack(); // Navigate back to User screen after deleting
                        } else {
                            Alert.alert('Error', 'Failed to delete the product. Please try again.');
                        }
                    }
                },
            ]
        );
    };

    // Handler for updating the product details
    const handleUpdateProduct = async () => {
        const updatedProduct = {
            name: updatedName,
            description: updatedDescription,
            condition: updatedCondition,
            image: updatedImage,
        };

        const success = await updateProduct(product.id, updatedProduct);
        if (success) {
            dispatch(updateProductAction({ productId: product.id, productData: updatedProduct }));
            setModalVisible(false);
            navigation.goBack(); // Navigate back to User screen to reflect changes
        } else {
            Alert.alert('Error', 'Failed to update the product. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Product Image */}
            <Image source={{ uri: product.image }} style={styles.productImage} />

            {/* Product Information */}
            <View style={styles.infoSection}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productCondition}>Condition: {product.condition}</Text>
            </View>

            {/* Delete and Update Buttons */}
            <View style={styles.actionButtons}>
                <Button title="Update" onPress={() => setModalVisible(true)} color="#007bff" />
                <Button title="Delete" onPress={handleDelete} color="#dc3545" />
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
                        <TextInput
                            style={styles.input}
                            placeholder="Product Image URL"
                            value={updatedImage}
                            onChangeText={setUpdatedImage}
                        />

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
});

export default Product;
