import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, Button, FlatList, ScrollView, StyleSheet, Dimensions,
    TouchableOpacity, Modal, TextInput, Alert
} from 'react-native';
import { db } from '../firebase'; // Import Firestore

const { width } = Dimensions.get('window');

const User = ({ navigation, route }) => {
    const userId = route.params?.userId || ''; // Retrieve the userId from route params
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState('');

    useEffect(() => {
        // Fetch user data from Firestore
        const fetchUserData = async () => {
            try {
                const userDoc = await db.collection('users').doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setUser(userData);
                    setNewName(userData.fullName);
                    setNewLocation(userData.city);
                    setNewProfilePicture(userData.profilePicture);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to fetch user data from Firestore.');
            }
        };

        // Fetch user products
        const fetchProducts = async () => {
            try {
                const productsSnapshot = await db.collection('products').where('userId', '==', userId).get();
                const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsList);
            } catch (error) {
                console.error('Error fetching products:', error);
                Alert.alert('Error', 'Failed to fetch products from Firestore.');
            }
        };

        if (userId) {
            fetchUserData();
            fetchProducts();
        }
    }, [userId]);

    const handleProductPress = (product) => {
        navigation.navigate('Product', { product });
    };

    const handleUpdateUserInfo = async () => {
        try {
            await db.collection('users').doc(userId).set({
                fullName: newName,
                city: newLocation,
                profilePicture: newProfilePicture,
            }, { merge: true });
            setUser({ fullName: newName, city: newLocation, profilePicture: newProfilePicture });
            setModalVisible(false);
            Alert.alert("Success", "Your information has been updated.");
        } catch (error) {
            Alert.alert("Error", "Failed to update user information.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {user && (
                <View style={styles.userInfoSection}>
                    <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
                    <Text style={styles.userName}>{user.fullName}</Text>
                    <Text style={styles.userLocation}>{user.city}</Text>
                    <Button title="Update Info" onPress={() => setModalVisible(true)} />
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

            {/* Modal for updating user info */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Your Information</Text>
                        <TextInput style={styles.input} placeholder="Name" value={newName} onChangeText={setNewName} />
                        <TextInput style={styles.input} placeholder="Location" value={newLocation} onChangeText={setNewLocation} />
                        <TextInput style={styles.input} placeholder="Profile Picture URL" value={newProfilePicture} onChangeText={setNewProfilePicture} />
                        <Button title="Save" onPress={handleUpdateUserInfo} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                    </View>
                </View>
            </Modal>
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
