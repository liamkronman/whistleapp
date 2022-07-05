import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from "../auth/Login";
import SignUp from "../auth/SignUp";

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName='SignUp' screenOptions={{
            headerShown: false,
            header: () => null,
            contentStyle: { backgroundColor: '#ECEEFF' },
          }}>
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <AuthStack.Screen name="Login" component={Login} />
        </AuthStack.Navigator>
    )
}

export default AuthNavigator;