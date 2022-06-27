import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { signup } from '../redux/slices/authSlice';

const SignUp = () => {
    const dispatch = useDispatch();
    const [message, updateMessage] = React.useState("");
    const [username, updateUsername] = React.useState("");
    const [phoneNumber, updatePhoneNumber] = React.useState("");
    const [password, updatePassword] = React.useState("");
    const [confirmPassword, updateConfirmPassword] = React.useState("");

    const handleSignUp = () => {
        if (confirmPassword === password) {
            const user = {
                isLoggedIn: true,
                phoneNumber: '9177569151',
                username: 'lkronhubbard'
            };
            
            const signupThunk = signup(user)
            dispatch(signupThunk);
        } else {
            updateMessage("Passwords do not match.");
            updatePassword("");
            updateConfirmPassword("");
        }
    }

    return (
        <View style={styles.container}>
            {
                message
                ? <Text style={styles.errorText}>{message}</Text>
                : <></>
            }
            <TextInput editable length={40} value={username} placeholder="Set a username..." onChangeText={updateUsername} autoFocus={true} />
            <TextInput editable length={40} value={phoneNumber} keyboardType="numeric" placeholder="1234567890" onChangeText={updatePhoneNumber} />
            <TextInput secureTextEntry={true} editable length={40} value={password} placeholder="Set a password..." onChangeText={updatePassword} />
            <TextInput secureTextEntry={true} editable length={40} value={confirmPassword} placeholder="Re-enter password..." onChangeText={updateConfirmPassword} />
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
    },
    errorText: {
        color: 'red',
        fontSize: 20
    }
})