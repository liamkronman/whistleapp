import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Button, View, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signup, selectSignupMessage } from '../redux/slices/authSlice';

const SignUp = ({ navigation }) => {
    const dispatch = useDispatch();
    const [message, updateMessage] = React.useState("");
    const [username, updateUsername] = React.useState("");
    const [password, updatePassword] = React.useState("");
    const [confirmPassword, updateConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const signupMessage = useSelector(selectSignupMessage);

    const handleSignUp = () => {
        if (username && password && confirmPassword) {
            if (confirmPassword === password) {
                updateMessage("");
                setIsLoading(true);
                const user = {
                    username: username,
                    password: password
                };
                
                const signupThunk = signup(user)
                dispatch(signupThunk);
            } else {
                updateMessage("Passwords do not match.");
                updatePassword("");
                updateConfirmPassword("");
            }
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
                    : signupMessage
                    ? <Text style={styles.errorText}>{signupMessage}</Text>
                    : <></>
                }
                <View style={{ flex: 1 }}>
                    <Text style={styles.topTitle}>Join</Text>
                </View>
                <View style={{ flex: 1.5, alignItems: "flex-start" }}>
                    <Text style={ styles.inputTitle }>Username</Text>
                    <TextInput editable length={40} style={styles.input} placeholderTextColor="#9D9D9D" value={username} placeholder="Set a username..." onChangeText={updateUsername} />
                </View>
                <View style={{ flex: 1.5, alignItems: "flex-start" }}>
                    <Text style={ styles.inputTitle }>Password</Text>
                    <TextInput secureTextEntry={true} editable style={styles.input} placeholderTextColor="#9D9D9D" length={40} value={password} placeholder="Set a password..." onChangeText={updatePassword} />
                </View>
                <View style={{ flex: 1.5, alignItems: "flex-start" }}>
                <Text style={ styles.inputTitle }>Confirm Password</Text>
                    <TextInput secureTextEntry={true} editable length={40} style={styles.input} placeholderTextColor="#9D9D9D" value={confirmPassword} placeholder="Re-enter password..." onChangeText={updateConfirmPassword} />
                </View>
                <View style={{ flex: 1.5, alignItems: "center" }}>
                    {
                        isLoading && !(message) && !(signupMessage)
                        ? <View style={styles.submitBtn}>
                            <ActivityIndicator size="small" color="#ffffff" />
                        </View>
                        : <TouchableOpacity onPress={handleSignUp} style={styles.submitBtn}>
                            <Text style={styles.buttonText}>Let's Go!</Text>
                        </TouchableOpacity>
                    }
                    <Text style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
                        Not my first time....
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 90,
        paddingBottom: 280,
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
    loginBtn: {
        color: '#4164BD',
        fontSize: 18,
        fontFamily: 'WorkSans-SemiBold',
        marginTop: 6
    },
    errorText: {
        color: 'red',
        fontSize: 20,
        fontFamily: 'WorkSans-Medium'
    }
})