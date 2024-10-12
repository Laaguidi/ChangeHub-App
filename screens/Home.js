import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, Modal } from 'react-native';
import { db } from '../firebase'; // Import Firestore

const Home = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const [selectedCategory, setSelectedCategory] = useState(''); // Selected category state

    // Fetch products from Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsSnapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
                const productsData = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productsData);
                setFilteredProducts(productsData); // Set filtered products initially to all products
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // Function to filter products by category
    const filterByCategory = (category) => {
        if (category === 'Tous') {
            setFilteredProducts(products); // Show all products
        } else {
            const filtered = products.filter(product => product.category === category);
            setFilteredProducts(filtered);
        }
        setModalVisible(false); // Close the modal after selection
    };

    // Handle product press
    const handleProductPress = (product) => {
        navigation.navigate('Product', { product });
    };

    return (
        <View style={styles.container}>
            {/* Title and Search Button */}
            <View style={styles.header}>
                <Text style={styles.title}>All Products</Text>
                <Button title="Search by Category" onPress={() => setModalVisible(true)} />
            </View>

            {/* Product List */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleProductPress(item)}>
                        <View style={styles.productCard}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productDescription}>{item.description}</Text>
                                <Text style={styles.productCondition}>Condition: {item.condition}</Text>
                                <Text style={styles.productCategory}>Category: {item.category}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No products found</Text>}
            />

            {/* Modal for Category Selection */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Category</Text>
                        {['Femmes', 'Hommes', 'Enfants', 'Maison', 'Électronique', 'Animaux', 'Tous'].map(category => (
                            <Button key={category} title={category} onPress={() => filterByCategory(category)} />
                        ))}
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
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
    productCategory: {
        fontSize: 14,
        color: '#ff6347',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});

export default Home;
