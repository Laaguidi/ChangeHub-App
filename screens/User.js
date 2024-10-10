import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { db, auth } from '../firebase';

const User = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDoc = await db.collection('users').doc(currentUser.uid).get();
                    if (userDoc.exists) {
                        setUser(userDoc.data());
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        const fetchProducts = () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                return db.collection('products')
                    .where('userId', '==', currentUser.uid)
                    .onSnapshot((snapshot) => {
                        const productsData = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setProducts(productsData);
                    }, (error) => {
                        console.error('Failed to fetch products from Firestore:', error);
                    });
            }
        };

        fetchUserData();
        const unsubscribeProducts = fetchProducts();

        return () => {
            if (unsubscribeProducts) {
                unsubscribeProducts();
            }
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {user && (
                <View style={styles.userInfoSection}>
                    <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
                    <Text style={styles.userName}>{user.fullName}</Text>
                    <Text style={styles.userLocation}>{user.city}</Text>

                    <Button title="Update Info" onPress={() => navigation.navigate('UpdateUser')} />
                </View>
            )}

            <View style={styles.productsSection}>
                <View style={styles.productsHeader}>
                    <Text style={styles.productsTitle}>Products</Text>
                    <Button title="Add New Product" onPress={() => navigation.navigate('AddProduct')} />
                </View>

                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('Product', { product: item })}>
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
});

export default User;
