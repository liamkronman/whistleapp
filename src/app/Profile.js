import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSignOut, selectUsername, selectProfilePic, selectAccessToken, updateProfilePic } from '../redux/slices/authSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

const Feed = () => {
    const dispatch = useDispatch();
    const username = useSelector(selectUsername);
    const profilePic = useSelector(selectProfilePic);
    const accessToken = useSelector(selectAccessToken);

    const handleLogout = () => {
        dispatch(setSignOut());
    }

    const handleUpdateProfilePic = () => {
        launchImageLibrary({mediaType: 'photo'}, (result) => {
            if (result.didCancel) {
                console.log('User cancelled image picker.');
            } else {
                ImageResizer.createResizedImage(
                    result.assets[0].uri,
                    200,
                    260,
                    "PNG",
                    50
                )
                .then(photo => {
                    console.log()
                    const updateProfilePicThunk = updateProfilePic(accessToken, photo.uri);
                    dispatch(updateProfilePicThunk);
                })
                .catch(err => {
                    console.log('Photo not compressed properly.')
                })
            }
        })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleUpdateProfilePic} style={profilePic ? styles.profileSel : styles.profileSelNoImage}>
                {profilePic && <ImageBackground style={styles.backgroundImage} imageStyle={{borderRadius: 20}} source={{uri: profilePic.uri}} />}
                <View style={styles.plusSign}><Text style={styles.plus}>+</Text></View>
            </TouchableOpacity>
            <Text style={{ marginBottom: 20, fontSize: 15 }}>{username}</Text>
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
    },
    profileSel: {
        height: 260,
        width: 200,
        borderRadius: 20,
        shadowOffset : { height: 4, width: 0},
        shadowOpacity: 0.8,
        alignSelf: 'center',
    },
    profileSelNoImage: {
        height: 260,
        width: 200,
        borderRadius: 20,
        shadowOffset : { height: 4, width: 0},
        shadowOpacity: 0.8,
        alignSelf: 'center',
        backgroundColor: '#4f4f4f',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
        height: 260,
        width: 200,
    },
    plusSign: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: '#2CB67D',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 160,
        marginTop: 220,
    },
    plus: {
        color: 'white',
        fontSize: 50,
    },
})