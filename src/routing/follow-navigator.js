import React from 'react';
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';

import FollowDisplay from '../components/FollowDisplay';

const FollowTabs = createMaterialTopTabNavigator();

function FollowNavigator({route, navigation}) {
    const { followers, following, isFollowersSelected} = route.params;
    const [initialRoute, setInitialRoute] = React.useState(isFollowersSelected ? 'Followers' : 'Following');
    
    return (
        <FollowTabs.Navigator initialRouteName={initialRoute}>
            <FollowTabs.Screen name="Followers" children={() => <FollowDisplay users={followers} />} />
            <FollowTabs.Screen name="Following" children={() => <FollowDisplay users={following} />} />
        </FollowTabs.Navigator>
    );
}

export default FollowNavigator;