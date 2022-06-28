import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signup, selectSignupMessage } from '../redux/slices/authSlice';

const SignUp = () => {
    const dispatch = useDispatch();
    const [message, updateMessage] = React.useState("");
    const [username, updateUsername] = React.useState("");
    const [password, updatePassword] = React.useState("");
    const [confirmPassword, updateConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const signupMessage = useSelector(selectSignupMessage);

    const handleSignUp = () => {
        updateMessage("");
        if (confirmPassword === password) {
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                {
                    message
                    ? <Text style={styles.errorText}>{message}</Text>
                    : signupMessage
                    ? <Text style={styles.errorText}>{signupMessage}</Text>
                    : <></>
                }
                <TextInput editable length={40} value={username} placeholder="Set a username..." onChangeText={updateUsername} autoFocus={true}/>
                <TextInput secureTextEntry={true} editable length={40} value={password} placeholder="Set a password..." onChangeText={updatePassword} />
                <TextInput secureTextEntry={true} editable length={40} value={confirmPassword} placeholder="Re-enter password..." onChangeText={updateConfirmPassword} />
                {
                    isLoading && !(message) && !(signupMessage)
                    ? <View style={styles.btn}>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                    : <TouchableOpacity onPress={handleSignUp} style={styles.btn}>
                        <Text style={styles.text}>Sign Up</Text>
                    </TouchableOpacity>
                }
            </View>
        </TouchableWithoutFeedback>
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