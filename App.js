// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { store } from './redux/store';
import User from './screens/User';
import Product from './screens/Product';
import Register from './screens/Register';
import Login from './screens/Login';
import AddProduct from './screens/AddProduct';
import Home from "./screens/Home";

const Stack = createStackNavigator();

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="User" component={User} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Product" component={Product} />
                    <Stack.Screen name="AddProduct" component={AddProduct} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
