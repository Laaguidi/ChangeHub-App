// screens/User.js

import React from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet } from 'react-native';

const User = ({ navigation }) => {
    // Static placeholder data for now
    const user = {
        name: 'John Doe',
        location: 'New York City',
        profilePicture: 'https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?q=80&w=2005&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // User Profile Picture (Placeholder)
    };

    const products = [
        {
            id: '1',
            name: 'iPhone 12',
            description: 'Brand new, sealed.',
            image: 'https://images.unsplash.com/photo-1599950755346-a3e58f84ca63?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder Product Image
        },
        {
            id: '2',
            name: 'MacBook Pro',
            description: 'Lightly used, excellent condition.',
            image: 'https://images.unsplash.com/photo-1518448828347-28e2cf0d6e28?q=80&w=2872&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder Product Image
        },
        {
            id: '3',
            name: 'Sony Headphones',
            description: 'Noise-canceling, barely used.',
            image: 'https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=2913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder Product Image
        },
    ];

    const wishlist = [
        { id: '1', title: 'Watch' },
        { id: '2', title: 'Canon Camera' },
        { id: '3', title: 'Bicycle' },
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

                {/* List of Products */}
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productDescription}>{item.description}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Wishlist Section */}
            <View style={styles.wishlistSection}>
                <Text style={styles.wishlistTitle}>Wishlist</Text>
                {/* Display wishlist items */}
                <FlatList
                    data={wishlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Text style={styles.wishlistItem}>• {item.title}</Text>
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
        width: 150,
        height: 150,
        borderRadius: 75, // Circular image
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
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10, // Slightly rounded corners for product images
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productDescription: {
        fontSize: 14,
        color: 'gray',
    },
    wishlistSection: {
        marginTop: 20,
    },
    wishlistTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    wishlistItem: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 5,
    },
});

export default User;
