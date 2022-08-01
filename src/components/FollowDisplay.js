import * as React from 'react';
import { View } from 'react-native';

const FollowDisplay = (props) => {
    const users = props.users;
    console.log(users);

    return (
        <View style={{ backgroundColor: 'red' }}>
        </View>
    )
};

export default FollowDisplay;