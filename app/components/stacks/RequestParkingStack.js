import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import RequestParkingScreen from '../../screens/RequestParkingScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();


 const RequestParkingStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="RequestParking">
      <Stack.Screen name="RequestParking" component={ RequestParkingScreen }
      options = {() => ({
        headerTitle: 'Request Parking',
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

export default RequestParkingStack