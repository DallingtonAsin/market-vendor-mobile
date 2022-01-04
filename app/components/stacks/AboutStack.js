import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import AboutScreen from '../../screens/AboutScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const AboutStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="About">
      <Stack.Screen name="About" component={AboutScreen}
      options = {() => ({
        headerTitle: 'About Us',
        headerLeft: () => <HeaderBackButton tintColor={styles.colors.white} onPress={() => navigation.goBack(null)} />,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:20,
          fontWeight:'bold',
        },
        headerTintColor: styles.colors.white,
      })}>
      </Stack.Screen>
      </Stack.Navigator>
      )
    
    }
export default AboutStack;