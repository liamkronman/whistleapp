import React from 'react';
import UserDisplay from '../components/UserDisplay';
import { useSelector } from 'react-redux';
import { selectUsername } from '../redux/slices/authSlice';

const Profile = ({ navigation }) => {
    const username = useSelector(selectUsername);

    return (
        <UserDisplay isOwner={true} navigation={navigation} username={username} />
    );
}

export default Profile;