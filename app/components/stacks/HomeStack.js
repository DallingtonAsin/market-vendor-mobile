import React from 'react';
import { createStackNavigator} from '@react-navigation/stack'
import DrawerNavigationStructure from '../DrawerNavigationStructure'
import HomeScreen from '../../screens/HomeScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}
      options = {() => ({
        headerTitle: 'Home',
        headerLeft: () => <DrawerNavigationStructure color={styles.colors.white} navigationProps = {navigation}/>,
        headerStyle:{
          backgroundColor: styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
        },
        headerTintColor: styles.colors.white,
      })}>
      </Stack.Screen>
      </Stack.Navigator>
      )
    
}
export default HomeStack;