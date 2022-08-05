import React from 'react';
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import { View, Dimensions } from 'react-native';

import FollowDisplay from '../components/FollowDisplay';

const FollowTabs = createMaterialTopTabNavigator();

function FollowNavigator({route, navigation}) {
    const { followers, following, isFollowersSelected} = route.params;
    const [initialRoute, setInitialRoute] = React.useState(isFollowersSelected ? 'Followers' : 'Following');
    
    return (
        <View style={{ backgroundColor: '#ECEEFF', height: Dimensions.get('window').height - 170 }}>
            <FollowTabs.Navigator initialRouteName={initialRoute} tabBarOptions={{
                activeTintColor: '#5B57FA',
                inactiveTintColor: '#9B9B9B',
                labelStyle: {
                    fontSize: 18,
                    textTransform: 'none',
                    fontFamily: 'WorkSans-Bold',
                },
                style: {
                    backgroundColor: '#ECEEFF',
                    height: 50,
                },
                indicatorStyle: {
                    backgroundColor: '#93B9F2',
                    height: 2,
                },
            }}>
                <FollowTabs.Screen name="Followers" children={() => <FollowDisplay users={followers} isFollower={true} navigation={navigation} />} />
                <FollowTabs.Screen name="Following" children={() => <FollowDisplay users={following} isFollower={false} navigation={navigation}/>} />
            </FollowTabs.Navigator>
        </View>
    );
}

export default FollowNavigator;