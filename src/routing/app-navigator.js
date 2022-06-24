import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Feed from '../app/Feed';

const AppStack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <AppStack.Navigator initialRouteName='Feed'>
            <AppStack.Screen name="Feed" component={Feed} />
        </AppStack.Navigator>
    )
}

export default AppNavigator;