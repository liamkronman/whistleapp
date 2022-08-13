import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Activity from '../app/Activity';
import WhistleFeature from "../app/WhistleFeature";
import UserFeature from "../app/UserFeature";
import FollowNavigator from "./follow-navigator";

const ActivityTabs = createNativeStackNavigator();

const ActivityNavigator = () => {
    return (
        <ActivityTabs.Navigator initialRouteName="Activity" screenOptions={{
            headerShown: false
        }}>
            <ActivityTabs.Screen name="Activity" component={Activity} />
            <ActivityTabs.Screen name="WhistleFeature" component={WhistleFeature} />
            <ActivityTabs.Screen name="UserFeature" component={UserFeature} />
            <ActivityTabs.Screen name="FollowNavigator" component={FollowNavigator} />
        </ActivityTabs.Navigator>
    );
}

export default ActivityNavigator;