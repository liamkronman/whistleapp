import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Activity from '../app/Activity';
import WhistleFeature from "../app/WhistleFeature";

const ActivityTabs = createNativeStackNavigator();

const ActivityNavigator = () => {
    return (
        <ActivityTabs.Navigator initialRouteName="Activity" screenOptions={{
            headerShown: false
        }}>
            <ActivityTabs.Screen name="Activity" component={Activity} />
            <ActivityTabs.Screen name="WhistleFeature" component={WhistleFeature} />
        </ActivityTabs.Navigator>
    );
}

export default ActivityNavigator;