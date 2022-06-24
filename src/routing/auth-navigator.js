import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UsernameInput from "../auth/UsernameInput";
import PhoneNumberInput from "../auth/PhoneNumberInput";
import PasswordInput from "../auth/PasswordInput";
import AuthHome from "../auth/AuthHome";
import Login from "../auth/Login";
import Logout from "../auth/Logout";
import SignUp from "../auth/SignUp";

const SignupStack = createNativeStackNavigator(
    {
        Username: UsernameInput,
        PhoneNumber: PhoneNumberInput,
        Password: PasswordInput,
    },
    {
        headerMode: 'none',
        initialRouteName: 'Username',
    }
);

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName='Login'>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
        </AuthStack.Navigator>
    )
}

export default AuthNavigator;