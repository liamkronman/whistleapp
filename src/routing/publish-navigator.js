import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PublishOne from '../app/PublishOne';
import PublishTwo from '../app/PublishTwo';
import PublishThree from '../app/PublishThree';
import PublishFour from '../app/PublishFour';
import PreviewWhistle from '../app/PreviewWhistle';

const PublishTabs = createNativeStackNavigator();

const PublishNavigator = () => {
    return (
        <PublishTabs.Navigator initialRouteName="PublishOne" screenOptions={{ 
            headerShown: false
        }}>
            <PublishTabs.Screen name="PublishOne" component={PublishOne} />
            <PublishTabs.Screen name="PublishTwo" component={PublishTwo} />
            <PublishTabs.Screen name="PublishThree" component={PublishThree} />
            <PublishTabs.Screen name="PublishFour" component={PublishFour} />
            <PublishTabs.Screen name="PreviewWhistle" component={PreviewWhistle} />
        </PublishTabs.Navigator>
    );
}

export default PublishNavigator;