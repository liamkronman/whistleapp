import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Feed = () => {
    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 20, fontSize: 15 }}>Welcome!</Text>
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