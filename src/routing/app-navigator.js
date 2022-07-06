import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';
import { Home, Plus, User } from "react-native-feather";

import Feed from '../app/Feed';
import Publish from '../app/Publish';
import Profile from '../app/Profile';

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
        <AppTabs.Navigator initialRouteName='Feed' screenOptions={{ 
            headerStyle: {
                backgroundColor: '#ECEEFF'
            },
            headerTintColor: 'black',
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: '#ECEEFF', flexDirection: 'row', justifyContent: 'space-between' },
            tabBarActiveTintColor: '#2249D2',
            tabBarInactiveTintColor: '#97AAEC',
            headerTitle: (props) => <Header {...props} /> 
        }}>
            <AppTabs.Screen name="Feed" component={Feed} options={{
                tabBarButton: props => <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Home width={34} height={34} {...props} /></View>
            }} />
            <AppTabs.Screen name="Publish" component={Publish} options={{
                tabBarButton: props => <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Plus width={34} height={34} {...props} /></View>
            }} />
            <AppTabs.Screen name="Profile" component={Profile} options={{
                tabBarButton: props => <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><User width={34} height={34} {...props} /></View>
            }} />
        </AppTabs.Navigator>
    )
}

export default AppNavigator;