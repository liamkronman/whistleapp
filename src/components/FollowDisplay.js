import * as React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import axios from 'axios';

const FollowDisplay = (props) => {
    const users = props.users;
    const isFollower = props.isFollower;
    const navigation = props.navigation;
    const [usersState, updateUsersState] = React.useState(users)

    const handleFollowPress = (user) => {
        if (user.isFollowing) {

        }
    }

    return (
        <View style={{ backgroundColor: '#ECEEFF', height: Dimensions.get('window').height - 220 }}>
            <FlatList
                data={usersState}
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