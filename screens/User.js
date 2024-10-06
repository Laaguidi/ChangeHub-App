import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, FlatList, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const User = ({ navigation, route }) => {
    const [products, setProducts] = useState([
        {
            id: '1',
            name: 'iPhone 12',
            description: 'Brand new, sealed.',
            condition: 'New',
            image: 'https://images.unsplash.com/photo-1599950755346-a3e58f84ca63?q=80&w=2787&auto=format&fit=crop',
        },
        {
            id: '2',
            name: 'MacBook Pro',
            description: 'Lightly used, excellent condition.',
            condition: 'Used',
            image: 'https://images.unsplash.com/photo-1518448828347-28e2cf0d6e28?q=80&w=2872&auto=format&fit=crop',
        },
        {
            id: '3',
            name: 'Sony Headphones',
            description: 'Noise-canceling, barely used.',
            condition: 'Used',
            image: 'https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=2913&auto=format&fit=crop',
        },
    ]);

    // Wishlist (titles only)
    const [wishlist, setWishlist] = useState([
        { id: '1', title: 'Watch' },
        { id: '2', title: 'Camera' },
        { id: '3', title: 'Bicycle' },
    ]);

    // Retrieve the new product added from AddProduct screen via navigation params
    useEffect(() => {
        if (route.params?.newProduct) {
            setProducts((prevProducts) => [...prevProducts, route.params.newProduct]);
        }
    }, [route.params?.newProduct]);

    const user = {
        name: 'John Doe',
        location: 'New York City',
        profilePicture: 'https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?q=80&w=2005&auto=format&fit=crop',
    };

    const handleProductPress = (product) => {
        navigation.navigate('Product', { product });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.userInfoSection}>
                <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userLocation}>{user.location}</Text>
            </View>

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
                        <TouchableOpacity onPress={() => handleProductPress(item)}>
                            <View style={styles.productCard}>
                                <Image source={{ uri: item.image }} style={styles.productImage} />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productDescription}>{item.description}</Text>
                                    <Text style={styles.productCondition}>Condition: {item.condition}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Wishlist Section */}
            <View style={styles.wishlistSection}>
                <Text style={styles.wishlistTitle}>Wishlist</Text>
                {wishlist.map((item) => (
                    <Text key={item.id} style={styles.wishlistItem}>
                        {item.title}
                    </Text>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
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
        borderRadius: 75,
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
        marginBottom: 20,
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
        borderRadius: 10,
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
    productCondition: {
        fontSize: 14,
        color: '#007bff',
        marginTop: 5,
    },
    wishlistSection: {
        marginTop: 30,
    },
    wishlistTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    wishlistItem: {
        fontSize: 16,
        paddingVertical: 5,
        color: '#333',
    },
});

export default User;
