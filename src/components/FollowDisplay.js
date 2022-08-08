import * as React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import { selectFollowers, selectFollowing, setFollowers, setFollowing } from '../redux/slices/userSlice';
import axios from 'axios';

const FollowDisplay = (props) => {
    const isFollower = props.isFollower;
    const navigation = props.navigation;
    const accessToken = useSelector(selectAccessToken);
    const users = useSelector(isFollower ? selectFollowers : selectFollowing);
    const dispatch = useDispatch();

    const handleFollowPress = (follow) => {
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
                let newUsers = users;
                for (let i = 0; i < newUsers.length; i++) {
                    if (newUsers[i][isFollower ? "follower" : "followed"] === username) {
                        newUsers[i].isFollowing = false;
                        break;
                    }
                }
                dispatch(isFollower ? setFollowers(newUsers) : setFollowing(newUsers));
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
                let newUsers = users;
                for (let i = 0; i < newUsers.length; i++) {
                    if (newUsers[i][isFollower ? "follower" : "followed"] === username) {
                        newUsers[i].isFollowing = true;
                        break;
                    }
                }
                dispatch(isFollower ? setFollowers(newUsers) : setFollowing(newUsers));
                if (isFollower) {
                    let following = useSelector(selectFollowing);
                    following.append(res);
                }
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
                            ? <TouchableOpacity style={{ width: 113, height: 33, backgroundColor: 'white', borderWidth: 1, borderColor: '#5B57FA', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }} onPress={handleFollowPress(item)}><Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#5B57FA' }}>Following</Text></TouchableOpacity>
                            : <TouchableOpacity style={{ width: 113, height: 33, backgroundColor: '#5B57FA', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }} onPress={handleFollowPress(item)}><Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16, color: 'white' }}>Follow</Text></TouchableOpacity>
                        }
                    </View>
                )}
            />
        </View>
    )
};

export default FollowDisplay;