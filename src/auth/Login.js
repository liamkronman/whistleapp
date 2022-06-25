import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const [username, updateUsername] = React.useState("");
    const [password, updatePassword] = React.useState("");

    const handleLogin = () => {
        const user = {
            username: username,
            password: password
        };

        const loginThunk = login(user);
        dispatch(loginThunk);
    }

    return (
        <View style={styles.container}>
            <TextInput editable length={40} value={username} placeholder="Enter your username..." onChangeText={updateUsername} autoFocus={true} />
            <TextInput secureTextEntry={true} editable length={40} value={password} placeholder="Enter your password..." onChangeText={updatePassword} />
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