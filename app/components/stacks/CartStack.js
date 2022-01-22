import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import CartScreen from '../../screens/CartScreen';
import styles from '../../../assets/css/styles';
import { CartIcon } from '../CartIcon';

const Stack = createStackNavigator();

const CartStack = ({ navigation }) => {
                                                                    
    return(
      <Stack.Navigator initialRouteName="Cart">
      <Stack.Screen name="Cart" component={CartScreen}
      options = {() => ({
        headerTitle: 'Cart',
        icon: () => <Icon name='cog'/>,
        headerLeft: () =><HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack(null)}  />,
        headerRight: () => <CartIcon navigation={navigation}/>,
        
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
export default CartStack

{/* <Stack.Screen name='ProductDetails' component={ProductDetails} 
options={({ navigation }) => ({
  title: 'Product details',
  headerTitleStyle: styles.headerTitle,
  headerRight: () => <CartIcon navigation={navigation}/>,
})} />
<Stack.Screen name='Cart' component={Cart} 
options={({ navigation }) => ({
  title: 'My cart',
  headerTitleStyle: styles.headerTitle,
  headerRight: () => <CartIcon navigation={navigation}/>,
})} /> */}
