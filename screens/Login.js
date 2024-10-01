// screens/Login.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase'; // Import Firebase

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                Alert.alert('Login successful!');

                // Navigate to the User page upon successful login
                navigation.navigate('User');
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to TradeHub to continue swapping.</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />

            <Button title="Log In" onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Don’t have an account? Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    link: {
        marginTop: 10,
        color: '#1E90FF',
        textAlign: 'center',
    },
});

export default Login;
