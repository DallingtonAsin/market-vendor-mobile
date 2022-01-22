import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import OrdersScreen from '../../screens/OrdersScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const OrdersStack = ({ navigation }) => {
                                                                
    return(
      <Stack.Navigator initialRouteName="Orders">
      <Stack.Screen name="Orders" component={OrdersScreen}
      options = {() => ({
        headerTitle: 'Orders',
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
export default OrdersStack