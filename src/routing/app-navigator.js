import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native'

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
        <AppTabs.Navigator initialRouteName='Feed'>
            <AppTabs.Screen name="Feed" 
                options={{ 
                    headerStyle: {
                        backgroundColor: '#ECEEFF'
                    },
                    headerTintColor: 'black',
                    headerTitle: (props) => <Header {...props} /> 
                }} 
                component={Feed} />
            <AppTabs.Screen name="Publish" 
                options={{ 
                    headerStyle: {
                        backgroundColor: '#ECEEFF'
                    },
                    headerTintColor: 'black',
                    headerTitle: (props) => <Header {...props} /> 
                }}
                component={Publish} />
            <AppTabs.Screen name="Profile"
                options={{ 
                    headerStyle: {
                        backgroundColor: '#ECEEFF'
                    },
                    headerTintColor: 'black',
                    headerTitle: (props) => <Header {...props} /> 
                }}
                component={Profile} />
        </AppTabs.Navigator>
    )
}

export default AppNavigator;