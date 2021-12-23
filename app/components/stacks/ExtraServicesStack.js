import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import ExtraServiceScreen from '../../screens/ExtraServicesScreen'
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

  const ExtraServicesStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ExtraServices">
      <Stack.Screen name="ExtraServices" component={ ExtraServiceScreen }
      options = {() => ({
        headerTitle: 'Other Services',
        headerLeft: () =><HeaderBackButton tintColor={'#fff'} onPress={() => navigation.goBack(null)} />,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:17,
          fontFamily:'Roboto',
        },
        headerTintColor: '#fff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}
export default ExtraServicesStack