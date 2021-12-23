import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import ParkingAreasScreen from '../../screens/ParkingAreasScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const ParkingAreasStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ParkingAreas">
      <Stack.Screen name="ParkingAreas" component={ ParkingAreasScreen }
      options = {() => ({
        headerTitle: 'Parking Areas',
        headerLeft: () =><HeaderBackButton tintColor={'#fff'} onPress={() => navigation.goBack(null)} />,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
          fontFamily:'Roboto',
        },
        headerTintColor: '#fff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}

export default ParkingAreasStack;