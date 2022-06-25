import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSignIn } from '../redux/slices/authSlice';

const SignUp = () => {
    const dispatch = useDispatch();

    const handleSignUp = () => {
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
            <TouchableOpacity onPress={handleSignUp} style={styles.btn}>
                <Text style={styles.text}>Sign In</Text>
            </TouchableOpacity>

        </View>
    )
}

export default SignUp;

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