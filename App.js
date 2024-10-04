// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from './screens/Register';
import Login from './screens/Login';
import User from './screens/User';
import Product from './screens/Product'; // Import the new Product screen
import AddProduct from './screens/AddProduct';


const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Register">
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="User" component={User} />
                {/* Product Detail Screen */}
                <Stack.Screen
                    name="Product"
                    component={Product}
                    options={{ title: 'Product Details' }} // Customize header title
                />
                <Stack.Screen name="AddProduct" component={AddProduct} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
