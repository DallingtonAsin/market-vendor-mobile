import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import ParkingFeesScreen from '../../screens/ParkingFeesScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

  const ParkingFeesStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ParkingFees">
      <Stack.Screen name="ParkingFees" component={ ParkingFeesScreen }
      options = {() => ({
        headerTitle: 'Parking Fees',
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
export default ParkingFeesStack;