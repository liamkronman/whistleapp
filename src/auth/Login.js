import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSignIn } from '../redux/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();

    const handleLogin = () => {
        const user = {
            isLoggedIn: true,
            phoneNumber: '9177569151',
            username: 'lkronhubbard'
        };

        dispatch(setSignIn(user));
    }

    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 20, fontSize: 15 }}>Login Screen</Text>
            <TouchableOpacity onPress={handleLogin} style={styles.btn}>
                <Text style={styles.text}>Sign In</Text>
            </TouchableOpacity>

        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    btn: {
        backgroundColor: 'blue',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 10
    },
    text: {
        color: 'white',
        fontSize: 20
    }
})