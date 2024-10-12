import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase';
import { createProduct } from '../firebaseService';
import { useNavigation } from '@react-navigation/native';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCondition, setProductCondition] = useState('');
    const [productImage, setProductImage] = useState(null);
    const navigation = useNavigation();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProductImage(result.assets[0].uri);
        }
    };

    const handleAddProduct = async () => {
        if (productName && productDescription && productImage) {
            const userId = auth.currentUser?.uid; // Get current user's ID
            if (!userId) {
                alert('Please log in to add a product');
                return;
            }

            const newProduct = {
                name: productName,
                description: productDescription,
                condition: productCondition,
                image: productImage,
                category: selectedCategory,  // This could be "Femmes", "Hommes", etc.
                userId,  // Associate the product with the current user
            };


            const success = await createProduct(newProduct);
            if (success) {
                navigation.goBack();
            } else {
                alert('Failed to add product');
            }
        } else {
            alert('Please fill out all fields');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={productName}
                onChangeText={setProductName}
            />
            <TextInput
                style={styles.input}
                placeholder="Product Description"
                value={productDescription}
                onChangeText={setProductDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Product Condition"
                value={productCondition}
                onChangeText={setProductCondition}
            />
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Pick an image</Text>
            </TouchableOpacity>
            {productImage && <Image source={{ uri: productImage }} style={styles.previewImage} />}
            <Button title="Add Product" onPress={handleAddProduct} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    imagePicker: {
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
    },
    previewImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default AddProduct;
