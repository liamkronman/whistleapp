import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app-navigator';
import AuthNavigator from './auth-navigator';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/slices/authSlice';

const AppRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const config = {
    screens: {
      ActivityNavigator: {
        screens: {
          Activity: 'activity'
        },
      },
    },
  };

  const linking = {
    prefixes: ['whistle://', 'https://trywhistle.app/', 'http://*.trywhistle.app/'],
    config,
  };

  return (
    <NavigationContainer linking={linking}>
      {
        isLoggedIn ? <AppNavigator /> : <AuthNavigator />
      }
    </NavigationContainer>
  )
}

export default AppRoute;