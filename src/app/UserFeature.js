import React from 'react';
import { ChevronLeft } from "react-native-feather";
import { StyleSheet, View, Dimensions } from "react-native";
import UserDisplay from '../components/UserDisplay';

const UserFeature = ({ route, navigation }) => {
    const { username } = route.params;

    return (
        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 170, backgroundColor: '#ECEEFF' }}>
            <UserDisplay isOwner={false} navigation={navigation} username={username} />
            <ChevronLeft onPress={() => navigation.pop()} style={styles.backBtn} width={34} height={34}  />
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