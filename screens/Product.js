import React, { useState } from 'react';
import {
    View, Text, Image, StyleSheet, FlatList, Button, Alert, Modal,
    TextInput, TouchableOpacity, ScrollView
} from 'react-native';

const Product = ({ route, navigation }) => {
    const { product } = route.params;

    // Placeholder data for products the owner wishes to exchange with
    const exchangeOptions = [
        { id: '1', title: 'Samsung Galaxy Watch', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=3000&auto=format&fit=crop' },
        { id: '2', title: 'Nikon DSLR Camera', image: 'https://images.unsplash.com/photo-1519183071298-a2962c3dd95e?q=80&w=3000&auto=format&fit=crop' },
        { id: '3', title: 'Mountain Bike', image: 'https://images.unsplash.com/photo-1565294124524-200bb738cdb0?q=80&w=3000&auto=format&fit=crop' },
    ];

    // State for modal visibility and updated product info
    const [modalVisible, setModalVisible] = useState(false);
    const [updatedName, setUpdatedName] = useState(product.name);
    const [updatedDescription, setUpdatedDescription] = useState(product.description);
    const [updatedCondition, setUpdatedCondition] = useState(product.condition);
    const [updatedImage, setUpdatedImage] = useState(product.image);

    // Handler for delete button
    const handleDelete = () => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => {
                        navigation.navigate('User', { deletedProductId: product.id });
                    }},
            ]
        );
    };

    // Handler for registering the updated product details
    const handleUpdateProduct = () => {
        const updatedProduct = {
            ...product,
            name: updatedName,
            description: updatedDescription,
            condition: updatedCondition,
            image: updatedImage
        };

        // Navigate back to the User screen with updated product details
        navigation.navigate('User', { updatedProduct });
        setModalVisible(false);
    };

    const renderExchangeOption = ({ item }) => (
        <View style={styles.exchangeCard}>
            <Image source={{ uri: item.image }} style={styles.exchangeImage} />
            <Text style={styles.exchangeTitle}>{item.title}</Text>
        </View>
    );

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

            {/* Exchange Options */}
            <View style={styles.exchangeSection}>
                <Text style={styles.exchangeHeader}>Products Owner Wishes to Exchange With</Text>
                <FlatList
                    data={exchangeOptions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderExchangeOption}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Back Button */}
            <View style={styles.backButton}>
                <Button title="Back to Profile" onPress={() => navigation.goBack()} />
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
    exchangeSection: {
        marginBottom: 30,
    },
    exchangeHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    exchangeCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginRight: 15,
        elevation: 3,
        width: 150,
    },
    exchangeImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    exchangeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    backButton: {
        marginTop: 10,
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
