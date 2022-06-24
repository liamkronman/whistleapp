import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app-navigator';
import AuthNavigator from './auth-navigator';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from '../redux/slices/authSlice';

const AppRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <NavigationContainer>
      {
        isLoggedIn ? <AppNavigator /> : <AuthNavigator />
      }
    </NavigationContainer>
  )
}

export default AppRoute;