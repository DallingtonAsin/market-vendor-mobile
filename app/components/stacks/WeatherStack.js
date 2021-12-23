import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import WeatherScreen from '../../screens/WeatherScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();


const WeatherStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Weather">
      <Stack.Screen name="Weather" component={WeatherScreen}
      options = {() => ({
        headerTitle: 'Weather',
        headerLeft: () => <HeaderBackButton tintColor={styles.colors.dark} onPress={() => navigation.goBack()} />, // <DrawerNavigationStructure color={'#fff'} navigationProps = {navigation}/>,
        headerStyle:{
          backgroundColor:styles.colors.white,
        },
        headerTitleStyle:{
          fontSize:19,
          fontWeight:'bold',
          fontFamily:'Roboto',
          
        },
        headerTintColor: styles.colors.dark,
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}
export default WeatherStack