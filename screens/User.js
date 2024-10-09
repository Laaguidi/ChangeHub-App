import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, Button, FlatList, ScrollView, StyleSheet, Dimensions,
    TouchableOpacity, Modal, TextInput, Alert
} from 'react-native';
import { db, auth } from '../firebase'; // Import Firebase Firestore and Authentication
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice'; // Redux fetch action

const { width } = Dimensions.get('window');

const User = ({ navigation }) => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);
    const user = useSelector((state) => state.user.user);

    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDoc = await db.collection('users').doc(currentUser.uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData.createdAt) {
                            userData.createdAt = userData.createdAt.toDate().toISOString();
                        }
                        setNewName(userData.name);
                        setNewLocation(userData.location);
                        setNewProfilePicture(userData.profilePicture);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            dispatch(fetchProducts());
        }
    }, [dispatch]);

    const handleUpdateUserInfo = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const updatedUser = {
                    name: newName,
                    location: newLocation,
                    profilePicture: newProfilePicture,
                };

                await db.collection('users').doc(currentUser.uid).set(updatedUser, { merge: true });
                Alert.alert("Success", "Your information has been updated.");
                setModalVisible(false);
            }
        } catch (error) {
            console.error("Error updating user info:", error);
            Alert.alert("Error", "Failed to update your information. Please try again.");
        }
    };

    const handleProductPress = (product) => {
        navigation.navigate('Product', { product });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {user && (
                <View style={styles.userInfoSection}>
                    <Image source={{ uri: newProfilePicture }} style={styles.profilePicture} />
                    <Text style={styles.userName}>{newName}</Text>
                    <Text style={styles.userLocation}>{newLocation}</Text>

                    {/* Button to open modal for updating user info */}
                    <Button title="Update Info" onPress={() => setModalVisible(true)} />
                </View>
            )}

            <View style={styles.productsSection}>
                <View style={styles.productsHeader}>
                    <Text style={styles.productsTitle}>Products</Text>
                    <Button title="Add New Product" onPress={() => navigation.navigate('AddProduct')} />
                </View>

                {/* List of Products */}
                <FlatList
                    data={products.filter((item) => item.name && item.condition && item.image)} // Filtering out incomplete products
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

                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={newLocation}
                            onChangeText={setNewLocation}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Profile Picture URL"
                            value={newProfilePicture}
                            onChangeText={setNewProfilePicture}
                        />

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
