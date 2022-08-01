import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Feed from '../app/Feed';
import UserFeature from '../app/UserFeature';
import WhistleFeature from "../app/WhistleFeature";
import FollowNavigator from "./follow-navigator";

const FeedTabs = createNativeStackNavigator();

const FeedNavigator = () => {
    return (
        <FeedTabs.Navigator initialRouteName="Feed" screenOptions={{
            headerShown: false
        }}>
            <FeedTabs.Screen name="Feed" component={Feed} />
            <FeedTabs.Screen name="UserFeature" component={UserFeature} />
            <FeedTabs.Screen name="WhistleFeature" component={WhistleFeature} />
            <FeedTabs.Screen name="FollowNavigator" component={FollowNavigator} />
        </FeedTabs.Navigator>
    );
}

export default FeedNavigator;