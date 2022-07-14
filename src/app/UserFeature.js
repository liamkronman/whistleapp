import React from 'react';
import UserDisplay from '../components/UserDisplay';

const UserFeature = ({ route, navigation }) => {
    const { username } = route.params;

    return (
        <UserDisplay isOwner={false} navigation={navigation} username={username} />
    );
}

export default UserFeature;