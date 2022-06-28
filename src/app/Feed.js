import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSignOut } from '../redux/slices/authSlice';

const Feed = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setSignOut);
    }

    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 20, fontSize: 15 }}>Welcome!</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.btn}>
                <Text style={styles.text}>Log out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Feed;

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