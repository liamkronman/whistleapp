import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Feed from '../app/Feed';
import UserFeature from '../app/UserFeature';
import WhistleFeature from "../app/WhistleFeature";

const FeedTabs = createNativeStackNavigator();

const FeedNavigator = () => {
    return (
        <FeedTabs.Navigator initialRouteName="Feed" screenOptions={{
            headerShown: false
        }}>
            <FeedTabs.Screen name="Feed" component={Feed} />
            <FeedTabs.Screen name="UserFeature" component={UserFeature} />
            <FeedTabs.Screen name="WhistleFeature" component={WhistleFeature} />
        </FeedTabs.Navigator>
    );
}

export default FeedNavigator;