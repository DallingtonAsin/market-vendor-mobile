import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import OrderDetailsScreen from '../../screens/OrderDetailsScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const OrderDetailsStack = ({ navigation }) => {
                                                                
    return(
      <Stack.Navigator initialRouteName="OrderDetails">
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen}
      options = {() => ({
        headerTitle: 'Order Details',
        headerLeft: () => <HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack(null)}/>,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
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
export default OrderDetailsStack