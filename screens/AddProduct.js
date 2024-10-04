import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Image picker for selecting product images

const AddProduct = ({ navigation }) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCondition, setProductCondition] = useState('New');
    const [productImage, setProductImage] = useState(null);

    // Function to pick an image from the gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProductImage(result.uri);
        }
    };

    // Function to handle adding a new product
    const handleAddProduct = () => {
        if (productName && productDescription && productCondition) {
            const newProduct = {
                id: Math.random().toString(),
                name: productName,
                description: productDescription,
                condition: productCondition,
                image: productImage,
                wishlist: [],
            };
            // Here you would typically send this data to a server or state management
            // For now, we'll just navigate back to the user profile page
            navigation.navigate('User', { newProduct });
        } else {
            alert('Please fill out all fields');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Product</Text>

            {/* Product Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={productName}
                onChangeText={setProductName}
            />

            {/* Product Description Input */}
            <TextInput
                style={styles.input}
                placeholder="Product Description"
                value={productDescription}
                onChangeText={setProductDescription}
                multiline
            />

            {/* Product Condition Selector */}
            <View style={styles.conditionContainer}>
                <Text style={styles.label}>Condition:</Text>
                <TouchableOpacity
                    style={styles.conditionButton}
                    onPress={() => setProductCondition('New')}
                >
                    <Text style={productCondition === 'New' ? styles.selectedCondition : styles.conditionText}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.conditionButton}
                    onPress={() => setProductCondition('Good')}
                >
                    <Text style={productCondition === 'Good' ? styles.selectedCondition : styles.conditionText}>Good</Text>
                </TouchableOpacity>
            </View>

            {/* Image Picker */}
            <Button title="Pick an image from gallery" onPress={pickImage} />
            {productImage && <Image source={{ uri: productImage }} style={styles.productImage} />}

            {/* Submit Button */}
            <Button title="Add Product" onPress={handleAddProduct} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    conditionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
    },
    conditionButton: {
        marginHorizontal: 10,
    },
    conditionText: {
        fontSize: 16,
        color: 'gray',
    },
    selectedCondition: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
    },
});

export default AddProduct;
