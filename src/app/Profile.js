import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSignOut, selectUsername, selectProfilePic, selectAccessToken, updateProfilePic } from '../redux/slices/authSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { User } from "react-native-feather";

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
            console.log(result)
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
                    console.log(photo)
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
        <ScrollView>
            {/* <TouchableOpacity onPress={handleUpdateProfilePic} style={profilePic ? styles.profileSel : styles.profileSelNoImage}>
                {profilePic && <ImageBackground style={styles.backgroundImage} imageStyle={{borderRadius: 20}} source={{uri: profilePic.uri}} />}
                <View style={styles.plusSign}><Text style={styles.plus}>+</Text></View>
            </TouchableOpacity> */}
            <View style={styles.container}>
                <View style={{ flexDirection: 'column', height: 380, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ flex: 2.5, justifyContent: 'flex-end' }}>
                        <User width={120} height={120} color={"#97AAEC"} />
                    </View>
                    <View style={{ flex: 0.6 }}>
                        <Text style={styles.username}>@{username}</Text>
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'flex-start' }}>
                        <Text style={styles.lastActive}>Active</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', width: 280 }}>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                            <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                                <Text style={styles.followCount}>0</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.followText}>followers</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                            <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                                <Text style={styles.followCount}>0</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.followText}>following</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                        <Text style={styles.backgroundText}>Placeholder Background</Text> 
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Feed;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
        minHeight: Dimensions.get('window').height - 170,
    },
    username: {
        fontFamily: 'WorkSans-Bold',
        fontSize: 30,
        color: '#2C65F6',
    },
    lastActive: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#86A0E3',
    },
    followCount: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 22,
        color: '#7E7E7E',
    },
    followText: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 16,
        color: '#7E7E7E',
    },
    logoutBtn: {
        width: 117,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#5B57FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: 'white',
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18
    },
    backgroundText: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6',
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