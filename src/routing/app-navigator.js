import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';
import { Home, Plus, BarChart2, User } from "react-native-feather";

import FeedNavigator from './feed-navigator';
import PublishNavigator from './publish-navigator';
import ProfileNavigator from './profile-navigator';
import ActivityNavigator from './activity-navigator';

import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
};

const AppTabs = createBottomTabNavigator();

function Header() {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 132, marginBottom: 14, marginRight: 213 }}>
            <View style={{ flex: 1 }}>
                <Image
                    style={{ width: 35, height: 46 }}
                    source={require('../../assets/images/whistle-icon.png')}
                    />
            </View>
            <View style={{ flex: 3, alignItems: 'flex-end', paddingTop: 10 }}>
                <Text style={{ fontFamily: 'GemunuLibre-Regular', fontSize: 35, color: '#769BFB' }}>whistle</Text>
            </View>
        </View>
    );
}

const AppNavigator = () => {
    return (
        <AppTabs.Navigator initialRouteName='FeedNavigator' screenOptions={{ 
            headerStyle: {
                backgroundColor: '#ECEEFF'
            },
            headerTintColor: 'black',
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: '#ECEEFF' },
            tabBarActiveTintColor: '#2249D2',
            tabBarInactiveTintColor: '#97AAEC',
            headerTitle: (props) => <Header {...props} />
        }} screenListeners={{ 
            tabPress: (e) => {
                ReactNativeHapticFeedback.trigger("impactLight", options);
            }
        }}>
            <AppTabs.Screen name="FeedNavigator" component={FeedNavigator} options={{
                tabBarIcon: (tabInfo) => <Home width={32} height={32} color={tabInfo.color} />
            }} />
            <AppTabs.Screen name="PublishNavigator" component={PublishNavigator} options={{
                tabBarIcon: (tabInfo) => <Plus width={32} height={32} color={tabInfo.color} />
            }} />
            <AppTabs.Screen name="ActivityNavigator" component={ActivityNavigator} options={{
                tabBarIcon: (tabInfo) => <BarChart2 width={32} height={32} color={tabInfo.color} />
            }} />
            <AppTabs.Screen name="ProfileNavigator" component={ProfileNavigator} options={{
                tabBarIcon: (tabInfo) => <User width={32} height={32} color={tabInfo.color} />
            }} />
        </AppTabs.Navigator>
    )
}

export default AppNavigator;