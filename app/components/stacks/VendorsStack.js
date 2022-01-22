import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import VendorsScreen from '../../screens/VendorsScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const VendorsStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Vendors">
      <Stack.Screen name="ParkingAreas" component={ VendorsScreen }
      options = {() => ({
        headerTitle: 'Vendors',
        headerLeft: () =><HeaderBackButton tintColor={'#fff'} onPress={() => navigation.goBack(null)} />,
        headerStyle:{
          backgroundColor:styles.colors.primary,
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

export default VendorsStack;