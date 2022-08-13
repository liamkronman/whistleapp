import React from 'react';
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import { View, Dimensions } from 'react-native';

import FollowDisplay from '../components/FollowDisplay';

const FollowTabs = createMaterialTopTabNavigator();

function FollowNavigator({route, navigation}) {
    const { isFollowersSelected, username } = route.params;
    let initialRoute = isFollowersSelected ? 'Followers' : 'Following';
    
    return (
        <View style={{ backgroundColor: '#ECEEFF', height: Dimensions.get('window').height - 170 }}>
            <FollowTabs.Navigator initialRouteName={initialRoute} screenOptions={{
                tabBarActiveTintColor: '#5B57FA',
                tabBarInactiveTintColor: '#9B9B9B',
                tabBarLabelStyle: {
                    fontSize: 18,
                    textTransform: 'none',
                    fontFamily: 'WorkSans-Bold',
                },
                tabBarStyle: {
                    backgroundColor: '#ECEEFF',
                    height: 50,
                },
                indicatorStyle: {
                    backgroundColor: '#93B9F2',
                    height: 2,
                },
            }}>
                <FollowTabs.Screen name="Followers" children={() => <FollowDisplay isFollower={true} username={username} navigation={navigation} />} />
                <FollowTabs.Screen name="Following" children={() => <FollowDisplay isFollower={false} username={username} navigation={navigation}/>} />
            </FollowTabs.Navigator>
        </View>
    );
}

export default FollowNavigator;