// screens/User.js

import React from 'react';
import { View, Text, Image, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const User = ({ navigation }) => {
    // Static placeholder data for now
    const user = {
        name: 'John Doe',
        location: 'New York City',
        profilePicture: 'https://via.placeholder.com/100', // Placeholder image
    };

    const products = [
        { id: '1', name: 'iPhone 12', description: 'Brand new, sealed.' },
        { id: '2', name: 'MacBook Pro', description: 'Lightly used, excellent condition.' },
        { id: '3', name: 'Sony Headphones', description: 'Noise-canceling, barely used.' },
    ];

    return (
        <View style={styles.container}>
            {/* User Info Section */}
            <View style={styles.userInfoSection}>
                <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userLocation}>{user.location}</Text>
            </View>

            {/* Products Section */}
            <View style={styles.productsSection}>
                <View style={styles.productsHeader}>
                    <Text style={styles.productsTitle}>Products</Text>
                    <Button title="Add New Product" onPress={() => navigation.navigate('AddProduct')} />
                </View>

                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    userInfoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    userLocation: {
        fontSize: 16,
        color: 'gray',
    },
    productsSection: {
        flex: 1,
    },
    productsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    productsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    productCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productDescription: {
        fontSize: 14,
        color: 'gray',
    },
});

export default User;
