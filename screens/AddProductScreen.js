// screens/AddProductScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { firestore } from '../firebase';

export default function AddProductScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    const handleAddProduct = () => {
        firestore.collection('products').add({
            name,
            description,
            image, // URL to product image
            createdAt: new Date(),
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <TextInput
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
                style={styles.input}
            />
            <Button title="Add Product" onPress={handleAddProduct} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});
