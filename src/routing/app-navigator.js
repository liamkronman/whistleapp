import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Feed from '../app/Feed';
import Publish from '../app/Publish';
import Profile from '../app/Profile';

const AppTabs = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <AppTabs.Navigator initialRouteName='Feed'>
            <AppTabs.Screen name="Feed" component={Feed} />
            <AppTabs.Screen name="Publish" component={Publish} />
            <AppTabs.Screen name="Profile" component={Profile} />
        </AppTabs.Navigator>
    )
}

export default AppNavigator;