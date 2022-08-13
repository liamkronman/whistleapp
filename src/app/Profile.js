import React from 'react';
import UserDisplay from '../components/UserDisplay';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsername } from '../redux/slices/authSlice';
import { setUsername } from '../redux/slices/userSlice';

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();
    const username = useSelector(selectUsername);
    dispatch(setUsername(username));

    return (
        <UserDisplay isOwner={true} navigation={navigation} username={username} />
    );
}

export default Profile;