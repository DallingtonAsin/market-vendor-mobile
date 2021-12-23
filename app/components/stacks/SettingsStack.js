import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import SettingsScreen from '../../screens/SettingsScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const SettingsStack = ({ navigation }) => {
                                                                    
    return(
      <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingsScreen}
      options = {() => ({
        headerTitle: 'Settings',
        icon: () => <Icon name='cog'/>,
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
export default SettingsStack