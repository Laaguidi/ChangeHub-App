import React from 'react';
import { View, Text, Image, Button, FlatList, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel'; // Importing the carousel

const { width } = Dimensions.get('window'); // Get screen width for carousel

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
        { id: '1', title: 'Watch', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: '2', title: 'Canon Camera', image: 'https://images.unsplash.com/photo-1495844138710-938feaeeadcc?q=80&w=3006&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: '3', title: 'Bicycle', image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2844&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ];

    // Render Wishlist Item for Carousel
    const renderWishlistItem = ({ item }) => (
        <View style={styles.wishlistCard}>
            <Image source={{ uri: item.image }} style={styles.wishlistImage} />
            <Text style={styles.wishlistTitle}>{item.title}</Text>
        </View>
    );

    // Function to handle navigation when a product is clicked
    const handleProductPress = (product) => {
        navigation.navigate('Product', { product });
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                        <TouchableOpacity onPress={() => handleProductPress(item)}>
                            <View style={styles.productCard}>
                                <Image source={{ uri: item.image }} style={styles.productImage} />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productDescription}>{item.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Wishlist Section */}
            <View style={styles.wishlistSection}>
                <Text style={styles.wishlistHeader}>Wishlist</Text>
                <Carousel
                    loop={true}
                    width={width * 0.8} // Adjust width to fit within the page
                    height={200} // Set height for the carousel
                    //autoPlay={true}
                    data={wishlist}
                    scrollAnimationDuration={1000}
                    renderItem={renderWishlistItem}
                    style={styles.carouselStyle}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // Allows scrolling beyond the available space
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
        marginBottom: 20, // Add margin to separate sections
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
    wishlistHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    wishlistCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    wishlistImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    wishlistTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    carouselStyle: {
        alignSelf: 'center', // Center the carousel
    },
});

export default User;
