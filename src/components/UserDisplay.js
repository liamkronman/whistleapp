import React from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity, ImageBackground, Text, RefreshControl, Alert, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSignOut, selectProfilePic, selectAccessToken, updateProfilePic } from '../redux/slices/authSlice';
import { selectFollowers, selectFollowing, setFollowers, setFollowing, resetUserInfo } from '../redux/slices/userSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { User } from "react-native-feather";
import axios from 'axios';
import { resetPublish } from '../redux/slices/publishSlice';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const UserDisplay = (props) => {
    const isOwner = props.isOwner;
    const navigation = props.navigation;
    const username = props.username;

    const dispatch = useDispatch();
    const profilePic = useSelector(selectProfilePic);
    const accessToken = useSelector(selectAccessToken);

    const [whistles, updateWhistles] = React.useState([]);
    const [lastId, updateLastId] = React.useState(null);
    const [numWhistles, updateNumWhistles] = React.useState(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const followers = useSelector(selectFollowers);
    const following = useSelector(selectFollowing);

    function getWhistles() {
        axios.post("https://trywhistle.app/api/user/getuserwhistles", {
            "username": username
        })
        .then(resp => {
            const newWhistles = resp.data.whistles;
            updateWhistles(newWhistles);
            updateLastId(newWhistles[newWhistles.length - 1].id);
            updateNumWhistles(newWhistles.length);
        })
        .catch(err => {
            console.log(err);
        })
    }

    function getFollowerFollowing() {
        axios.post("https://trywhistle.app/api/user/getuserfollowerfollowing", {
            "username": username
        }, {
            headers: {
                "x-access-token": accessToken
            }
        })
        .then(resp => {
            const newFollowers = resp.data.followers;
            const newFollowing = resp.data.following;
            console.log(resp)
            console.log(newFollowers)
            dispatch(setFollowers(newFollowers));
            dispatch(setFollowing(newFollowing));
        })
        .catch(err => {
            console.log(err);
        });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getWhistles();
        getFollowerFollowing();
    }, []);

    React.useEffect(() => {
        dispatch(resetUserInfo());
        getWhistles();
        getFollowerFollowing();
    }, []);

    const getMoreWhistles = () => {
        axios.post("https://trywhistle.app/api/user/getuserwhistles", {
            "username": username,
            "lastId": lastId
        })
        .then(resp => {
            const newWhistles = resp.data.whistles;
            if (newWhistles.length > 0) {
                updateWhistles(whistles => [...whistles, ...newWhistles]);
                updateLastId(newWhistles[newWhistles.length - 1].id);
                updateNumWhistles(numWhistles + newWhistles.length);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleLogout = () => {
        dispatch(resetPublish());
        dispatch(setSignOut());
    }

    const logoutAlert = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log out", onPress: () => handleLogout() }
            ]
        );
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

    function getExpirationDiff(exp) {
        // return a string that represents the time since expiration in largest denomination (years, months, days, hours, minutes)
        const now = new Date();
        const expDate = new Date(exp);
        
        if (expDate > now) {
            const diff = expDate - now;
            const diffSeconds = diff / 1000;
            const diffMinutes = diff / (60 * 1000);
            const diffHours = diff / (60 * 60 * 1000);
            const diffDays = diff / (24 * 60 * 60 * 1000);

            if (diffDays > 1) {
                return Math.floor(diffDays) + " days left";
            }
            if (diffHours > 1) {
                return Math.floor(diffHours) + " hours left";
            }
            if (diffMinutes > 1) {
                return Math.floor(diffMinutes) + " minutes left";
            }
            if (diffSeconds > 1) {
                return Math.floor(diffSeconds) + " seconds left";
            }
            return "0 seconds left"; 
        } else {
            const diff = now - expDate;
            const diffSeconds = diff / 1000;
            const diffMinutes = diff / (60 * 1000);
            const diffHours = diff / (60 * 60 * 1000);
            const diffDays = diff / (24 * 60 * 60 * 1000);
            const diffWeeks = diff / (7 * 24 * 60 * 60 * 1000);
            const diffMonths = diff / (30 * 24 * 60 * 60 * 1000);
            const diffYears = diff / (365 * 24 * 60 * 60 * 1000);

            if (diffYears > 1) {
                return "Expired " + Math.floor(diffYears) + " years ago";
            }
            if (diffMonths > 1) {
                return "Expired " + Math.floor(diffMonths) + " months ago";
            }
            if (diffWeeks > 1) {
                return "Expired " + Math.floor(diffWeeks) + " weeks ago";
            }
            if (diffDays > 1) {
                return "Expired " + Math.floor(diffDays) + " days ago";
            }
            if (diffHours > 1) {
                return "Expired " + Math.floor(diffHours) + " hours ago";
            }
            if (diffMinutes > 1) {
                return "Expired " + Math.floor(diffMinutes) + " minutes ago";
            }
            if (diffSeconds > 1) {
                return "Expired " + Math.floor(diffSeconds) + " seconds ago";
            }
            return "Expired 0 seconds ago"; 
        }
    }

    const renderWhistle = ( whistle ) => {
        const keys = Object.keys(whistle.item.options);
        let votes = 0;
        for (let i = 0; i < keys.length; i++) {
            votes += whistle.item.options[keys[i]];
        }

        return (
            <TouchableOpacity onPress={() => navigation.navigate('WhistleFeature', { focusedWhistle: whistle.item, isOwner: isOwner })} style={{ width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', height: 90, borderTopWidth: 1, borderTopColor: '#93B9F2' }}>
                <View style={{ flexDirection: 'row', width: Dimensions.get('window').width - 50, height: 90 }}>
                    <View style={{ flex: 3, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1.5, justifyContent: 'center' }}>
                            <Text style={styles.whistleTitle} numberOfLines={1}>{whistle.item.title}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <Text style={styles.whistleExpire}>{getExpirationDiff(whistle.item.closeDateTime)}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <View style={{ flex: 1.5, justifyContent: 'center' }}>
                            <Text style={styles.whistleVotes}>{votes} Votes</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={() => (
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
                            <Pressable style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }} onPress={() => navigation.navigate('FollowNavigator', {isFollowersSelected: true})}>
                                <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                                    <Text style={styles.followCount}>{followers ? followers.length : 0}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.followText}>followers</Text>
                                </View>
                            </Pressable>
                            <Pressable style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }} onPress={() => navigation.navigate('FollowNavigator', {isFollowersSelected: false})}>
                                <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                                    <Text style={styles.followCount}>{following ? following.length : 0}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.followText}>following</Text>
                                </View>
                            </Pressable>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            { 
                                isOwner 
                                ? <TouchableOpacity onPress={logoutAlert} style={styles.btn}>
                                    <Text style={styles.btnText}>Log Out</Text>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.btn}>
                                    <Text style={styles.btnText}>Follow</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        {/* <View style={{ flex: 0.5, justifyContent: 'center' }}>
                            <Text style={styles.backgroundText}>Placeholder Background</Text> 
                        </View> */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#93B9F2' }}>
                            <Text style={styles.whistlesHeader}>Whistles </Text>
                            <Text style={styles.whistlesHeaderNum}>({numWhistles})</Text>
                        </View>
                    </View>
                )}
                data={whistles}
                renderItem={renderWhistle}
                onEndReached={getMoreWhistles}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#2C65F6"
                    />
                }
                />
        </View>
    );
}

export default UserDisplay;

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
    btn: {
        width: 117,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#5B57FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: 'white',
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18
    },
    backgroundText: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6',
    },
    whistleTitle: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 22,
        color: '#2C65F6',
    },
    whistleExpire: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        color: '#2C65F6',
    },
    whistleVotes: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6',
    },
    whistlesHeader: {
        fontFamily: 'WorkSans-Bold',
        fontSize: 24,
        color: '#2C65F6',
    },
    whistlesHeaderNum: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 24,
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
});