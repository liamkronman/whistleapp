import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Profile from '../app/Profile';
import WhistleFeature from "../app/WhistleFeature";
import UserFeature from "../app/UserFeature";

const ProfileTabs = createNativeStackNavigator();

const ProfileNavigator = () => {
    return (
        <ProfileTabs.Navigator initialRouteName="Profile" screenOptions={{
            headerShown: false
        }}>
            <ProfileTabs.Screen name="Profile" component={Profile} />
            <ProfileTabs.Screen name="WhistleFeature" component={WhistleFeature} />
            <ProfileTabs.Screen name="UserFeature" component={UserFeature} />
        </ProfileTabs.Navigator>
    );
}

export default ProfileNavigator;