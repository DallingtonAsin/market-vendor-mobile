import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import HelpScreen from '../../screens/HelpScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const HelpStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Help">
      <Stack.Screen name="Help" component={HelpScreen}
      options = {() => ({
        headerTitle: 'Contact Us',
        headerLeft: () => <HeaderBackButton tintColor={styles.colors.white} onPress={() => navigation.goBack()} />,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
        },
        headerTintColor: styles.colors.white,
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}
export default HelpStack