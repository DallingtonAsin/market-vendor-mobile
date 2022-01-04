import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import ProfileScreen from '../../screens/ProfileScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ ProfileScreen }
      options = {() => ({
        headerTitle: 'Profile',
        headerLeft: () =><HeaderBackButton tintColor={'#fff'} onPress={() => navigation.goBack(null)} />,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
        },
        headerTintColor: '#fff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}

export default ProfileStack