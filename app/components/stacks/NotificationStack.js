import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import NotificationScreen from '../../screens/NotificationScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const NotificationStack = ({ navigation }) => {
                                                                
    return(
      <Stack.Navigator initialRouteName="Notification">
      <Stack.Screen name="Notifications" component={NotificationScreen}
      options = {() => ({
        headerTitle: 'Notifications',
        headerLeft: () => <HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack(null)}/>,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
        },
        headerTintColor: '#ffffff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default NotificationStack