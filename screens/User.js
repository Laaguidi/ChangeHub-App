import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, FlatList, ScrollView, StyleSheet, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { db, auth, storage } from '../firebase'; // Import Firebase Firestore, Authentication, and Storage
import { Icon } from 'react-native-elements'; // Import the Icon component for burger menu
import * as ImagePicker from 'expo-image-picker'; // Import Image Picker for selecting images
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions

const User = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false); // State to manage burger menu visibility
    const [newName, setNewName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch user data and user-specific products
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDoc = await db.collection('users').doc(currentUser.uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        setUser(userData);
                        setNewName(userData.fullName);
                        setNewLocation(userData.city);
                        setNewProfilePicture(userData.profilePicture);
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

    // Function to handle image picking from the device
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Set selected image URI
        }
    };

    // Function to handle user information update with image upload
    const handleUpdateUserInfo = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                let profilePictureUrl = newProfilePicture;

                // If an image is selected, upload it to Firebase Storage
                if (selectedImage) {
                    const imageRef = ref(storage, `profilePictures/${currentUser.uid}.jpg`);
                    const img = await fetch(selectedImage);
                    const bytes = await img.blob();

                    // Upload the image to Firebase Storage
                    await uploadBytes(imageRef, bytes);
                    profilePictureUrl = await getDownloadURL(imageRef);
                }

                const updatedUser = {
                    fullName: newName,
                    city: newLocation,
                    profilePicture: profilePictureUrl,
                };

                // Update user info in Firestore
                await db.collection('users').doc(currentUser.uid).set(updatedUser, { merge: true });

                // Update state to reflect changes
                setUser(updatedUser);
                setModalVisible(false);
                Alert.alert("Success", "Your information has been updated.");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
            Alert.alert("Error", "Failed to update your information. Please try again.");
        }
    };

    const handleProductPress = (product) => {
        navigation.navigate('Product', { product });
    };

    // Function to handle account deletion
    const deleteUserAccount = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Show confirmation alert
                Alert.alert(
                    "Delete Account",
                    "Are you sure you want to delete your account? This action cannot be undone.",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Delete",
                            style: "destructive",
                            onPress: async () => {
                                try {
                                    // Delete user's products
                                    const productsSnapshot = await db.collection('products').where('userId', '==', currentUser.uid).get();
                                    const deleteProductPromises = productsSnapshot.docs.map((doc) => doc.ref.delete());
                                    await Promise.all(deleteProductPromises);

                                    // Delete user's profile from Firestore
                                    await db.collection('users').doc(currentUser.uid).delete();

                                    // Delete user from Firebase Authentication
                                    await currentUser.delete();

                                    // Navigate back to the login screen
                                    navigation.navigate('Login');
                                    Alert.alert("Success", "Your account has been deleted.");
                                } catch (error) {
                                    console.error("Error deleting account: ", error);
                                    Alert.alert("Error", "Failed to delete your account. Please try again.");
                                }
                            },
                        },
                    ]
                );
            }
        } catch (error) {
            console.error("Error deleting user account: ", error);
            Alert.alert("Error", "Failed to delete your account. Please try again.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>User Profile</Text>
                {/* Burger menu icon */}
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Icon name="menu" size={30} color="black" />
                </TouchableOpacity>
            </View>

            {user && (
                <View style={styles.userInfoSection}>
                    {user.profilePicture ? (
                        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
                    ) : (
                        <Text>No Profile Picture</Text>
                    )}
                    <Text style={styles.userName}>{user.fullName}</Text>
                    <Text style={styles.userLocation}>{user.city}</Text>

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
                {products.length > 0 ? (
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleProductPress(item)}>
                                <View style={styles.productCard}>
                                    {/* Check if images array and the first image exist */}
                                    <Image
                                        source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150' }}
                                        style={styles.productImage}
                                    />
                                    <View style={styles.productDetails}>
                                        <Text style={styles.productName}>{item.name}</Text>
                                        <Text style={styles.productDescription}>{item.description}</Text>
                                        <Text style={styles.productCondition}>Condition: {item.condition}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <Text>No products found</Text>
                )}
            </View>

            {/* Wishlist Section */}
            <View style={styles.wishlistSection}>
                <Text style={styles.wishlistTitle}>Wishlist</Text>
                {wishlist.length === 0 ? (
                    <Text style={styles.wishlistItem}>No items in wishlist yet.</Text>
                ) : (
                    wishlist.map((item) => (
                        <Text key={item.id} style={styles.wishlistItem}>
                            {item.title}
                        </Text>
                    ))
                )}
                <Button title="Add to Wishlist" onPress={() => navigation.navigate('AddWishlist')} />
            </View>

            {/* Burger Menu Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <View style={styles.menuContainer}>
                    <View style={styles.menuContent}>
                        <Text style={styles.menuItem} onPress={() => setMenuVisible(false)}>Profile</Text>
                        <Text style={styles.menuItem} onPress={() => navigation.navigate('AddProduct')}>Add Product</Text>
                        <Text style={styles.menuItem} onPress={deleteUserAccount} style={{ color: 'red' }}>Delete Account</Text>
                        <Text style={styles.menuItem} onPress={() => navigation.navigate('Login')}>Logout</Text>
                    </View>
                </View>
            </Modal>

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
                            placeholder="Full Name"
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={newLocation}
                            onChangeText={setNewLocation}
                        />
                        <TouchableOpacity onPress={pickImage}>
                            <Text style={styles.pickImageText}>Pick Profile Picture</Text>
                        </TouchableOpacity>
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}

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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContent: {
        width: 250,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    menuItem: {
        fontSize: 18,
        marginVertical: 10,
        textAlign: 'center',
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
    pickImageText: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'center',
        marginBottom: 10,
    },
    previewImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
});

export default User;
