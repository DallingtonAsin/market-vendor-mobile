import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SigninScreen from '../../screens/SigninScreen';
import SignupScreen from '../../screens/SignupScreen';
import ResetPasswordScreen from '../../screens/ResetPasswordScreen';

const Stack = createStackNavigator();

const AppRootStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator> 
    )
}

export default AppRootStack