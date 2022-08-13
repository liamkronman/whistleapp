import React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Dimensions, Pressable, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import { selectFollowers, selectFollowing, setFollowers, setFollowing, resetUserInfo, setUsername, setFollowerFollowing } from '../redux/slices/userSlice';
import axios from 'axios';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const FollowDisplay = (props) => {
    const isFollower = props.isFollower;
    const navigation = props.navigation;
    const username = props.username;
    const [refreshing, setRefreshing] = React.useState(false);
    const accessToken = useSelector(selectAccessToken);
    const users = useSelector(isFollower ? selectFollowers : selectFollowing);
    const dispatch = useDispatch();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        dispatch(setUsername(username));
        dispatch(setFollowerFollowing);
    }, []);

    function handleFollowPress(follow) {
        const isFollowing = follow.isFollowing;
        const username = isFollower ? follow.follower : follow.followed;

        if (isFollowing) {
            axios.post("https://trywhistle.app/api/user/unfollowuser", {
                username: username
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            })
            .then(res => {
                dispatch(setFollowerFollowing)
            })
            .catch(err => {
                console.log(err);
            });
        } else {
            axios.post("https://trywhistle.app/api/user/followuser", {
                username: username
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            })
            .then(res => {
                dispatch(setFollowerFollowing);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    return (
        <View style={{ backgroundColor: '#ECEEFF', height: Dimensions.get('window').height - 220 }}>
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 70, alignItems: 'center', padding: 25 }}>
                        {
                            isFollower
                            ? <Pressable onPress={() => navigation.navigate('UserFeature', {username: item.follower})}><Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: 'black' }}>{item.follower}</Text></Pressable>
                            : <Pressable onPress={() => navigation.navigate('UserFeature', {username: item.followed})}><Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: 'black' }}>{item.followed}</Text></Pressable>
                        }
                        {
                            item.isFollowing
                            ? <TouchableOpacity style={{ width: 113, height: 33, backgroundColor: 'white', borderWidth: 1, borderColor: '#5B57FA', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }} onPress={() => handleFollowPress(item)}><Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#5B57FA' }}>Following</Text></TouchableOpacity>
                            : <TouchableOpacity style={{ width: 113, height: 33, backgroundColor: '#5B57FA', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }} onPress={() => handleFollowPress(item)}><Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: 'white' }}>Follow</Text></TouchableOpacity>
                        }
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#2C65F6"
                    />
                }
            />
        </View>
    )
};

export default FollowDisplay;