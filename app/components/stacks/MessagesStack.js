import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import MessagesScreen from '../../screens/MessagesScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const MessagesStack = ({ navigation }) => {                                                               
    return(
      <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen name="Messages" component={MessagesScreen}
      options = {() => ({
        headerTitle: 'Messages',
        headerLeft: () =><HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack(null)}  />,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
          fontFamily:'Roboto',
        },
        headerTintColor: '#ffffff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default MessagesStack