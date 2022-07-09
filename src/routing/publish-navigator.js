import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PublishOne from '../app/PublishOne';
import PublishTwo from '../app/PublishTwo';

const PublishTabs = createNativeStackNavigator();

const PublishNavigator = () => {
    return (
        <PublishTabs.Navigator initialRouteName="PublishOne" screenOptions={{ 
            headerShown: false
        }}>
            <PublishTabs.Screen name="PublishOne" component={PublishOne} />
            <PublishTabs.Screen name="PublishTwo" component={PublishTwo} />
        </PublishTabs.Navigator>
    );
}

export default PublishNavigator;