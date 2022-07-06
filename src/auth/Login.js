import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectLoginMessage } from '../redux/slices/authSlice';
import SignUp from "./SignUp";

const Login = ({navigation}) => {
    const dispatch = useDispatch();
    const [username, updateUsername] = React.useState("");
    const [password, updatePassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const message = useSelector(selectLoginMessage);

    const handleLogin = () => {
        if (username && password) {
            setIsLoading(true);
            const user = {
                username: username,
                password: password
            };

            const loginThunk = login(user);
            dispatch(loginThunk);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, {
                flexDirection: "column"
            }]}>
                {
                    message
                    ? <Text style={styles.errorText}>{message}</Text>
                    : <></>
                }
                <View style={{ flex: 1 }}>
                    <Text style={styles.topTitle}>Log In</Text>
                </View>
                <View style={{ flex: 1.5, alignItems: "flex-start" }}>
                    <Text style={ styles.inputTitle }>Username</Text>
                    <TextInput editable length={40} value={username} style={styles.input} placeholderTextColor="#9D9D9D" placeholder="Enter your username..." onChangeText={updateUsername} />
                </View>
                <View style={{ flex: 1.5, alignItems: "flex-start" }}>
                    <Text style={ styles.inputTitle }>Password</Text>
                    <TextInput secureTextEntry={true} editable length={40} value={password} style={styles.input} placeholderTextColor="#9D9D9D" placeholder="Enter your password..." onChangeText={updatePassword} />
                </View>
                <View style={{ flex: 1.5, alignItems: "flex-start" }}>
                    {
                        isLoading && !(message)
                        ? <View style={styles.submitBtn}>
                            <ActivityIndicator size="small" color="#ffffff" />
                        </View>
                        : <TouchableOpacity onPress={handleLogin} style={styles.submitBtn}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 90,
        paddingBottom: 375,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
    },
    topTitle: {
        fontFamily: 'WorkSans-Bold',
        fontSize: 40,
        color: '#2C65F6'
    },
    inputTitle: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        color: '#6187EB',
        marginBottom: 4,
    },
    input: {
        width: 293,
        height: 53,
        borderRadius: 8,
        backgroundColor: '#D8E5FF',
        padding: 16,
        color: 'black',
        fontSize: 18,
        fontFamily: 'WorkSans-Medium'
    },
    submitBtn: {
        backgroundColor: '#3E3BE3',
        alignItems: 'center',
        justifyContent: 'center',
        width: 293,
        height: 66,
        paddingVertical: 10,
        borderRadius: 6
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'WorkSans-Medium'
    },
    errorText: {
        color: 'red',
        fontSize: 20,
        fontFamily: 'WorkSans-Medium'
    }
})