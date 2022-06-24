import { createAppContainer, createSwitchNavigator } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UsernameInput from "../auth/UsernameInput";
import PhoneNumberInput from "../auth/PhoneNumberInput";
import PasswordInput from "../auth/PasswordInput";
import AuthHome from "../auth/AuthHome";
import Login from "../auth/Login";
import Logout from "../auth/Logout";

import Feed from "../app/Feed";

const SignupStack = createNativeStackNavigator(
  {
    Username: UsernameInput,
    PhoneNumber: PhoneNumberInput,
    Password: PasswordInput,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Username',
  }
);

const AuthStack = createNativeStackNavigator(
  {
    AuthHome: AuthHome,
    Signup: SignupStack,
    Login: Login,
    Logout: Logout,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  }
);

const AppStack = createNativeStackNavigator(
  {
    Feed: Feed,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Feed',
  }
);

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthStack,
      App: AppStack,
    },
    {
      initialRouteName: 'Auth',
    }
  )
);

export default createAppContainer(AppNavigator);