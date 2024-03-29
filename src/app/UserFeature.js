import React from 'react';
import { ChevronLeft } from "react-native-feather";
import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import { useDispatch } from 'react-redux';
import { setFollowerFollowing, setUsername } from '../redux/slices/userSlice';
import UserDisplay from '../components/UserDisplay';

const UserFeature = ({ route, navigation }) => {
    const { username } = route.params;
    const dispatch = useDispatch();
    dispatch(setFollowerFollowing);
    dispatch(setUsername(username));

    return (
        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 170, backgroundColor: '#ECEEFF' }}>
            <UserDisplay isOwner={false} navigation={navigation} username={username} />
            <Pressable onPress={() => navigation.pop()} style={styles.backBtn}>
                <ChevronLeft width={34} height={34} />
            </Pressable>
        </View>
    );
}

export default UserFeature;

const styles = StyleSheet.create({
    backBtn: {
        position: 'absolute',
        alignSelf: 'flex-start', 
        top: 12, 
        left: 12,
        color: '#2C65F6'
    }
});