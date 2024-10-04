// screens/Product.js

import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button } from 'react-native';

const Product = ({ route, navigation }) => {
    // Extract product data passed via navigation
    const { product } = route.params;

    // Placeholder data for products the owner wishes to exchange with
    const exchangeOptions = [
        { id: '1', title: 'Samsung Galaxy Watch', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=3000&auto=format&fit=crop' },
        { id: '2', title: 'Nikon DSLR Camera', image: 'https://images.unsplash.com/photo-1519183071298-a2962c3dd95e?q=80&w=3000&auto=format&fit=crop' },
        { id: '3', title: 'Mountain Bike', image: 'https://images.unsplash.com/photo-1565294124524-200bb738cdb0?q=80&w=3000&auto=format&fit=crop' },
    ];

    // Render each exchange option
    const renderExchangeOption = ({ item }) => (
        <View style={styles.exchangeCard}>
            <Image source={{ uri: item.image }} style={styles.exchangeImage} />
            <Text style={styles.exchangeTitle}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Product Image */}
            <Image source={{ uri: product.image }} style={styles.productImage} />

            {/* Product Information */}
            <View style={styles.infoSection}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productCondition}>Condition: {product.condition}</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default Product;
