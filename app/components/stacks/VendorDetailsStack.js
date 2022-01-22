import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import VendorDetailsScreen from '../../screens/VendorDetailsScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const VendorDetailsStack = ({ navigation }) => {
                                                                
    return(
      <Stack.Navigator initialRouteName="VendorDetails">
      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen}
      options = {() => ({
        headerTitle: 'Vendor Details',
        headerLeft: () => <HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack(null)}/>,
        headerStyle:{
          backgroundColor:styles.colors.primary,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
        },
        headerTintColor: '#ffffff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default VendorDetailsStack