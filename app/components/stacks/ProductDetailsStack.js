import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import styles from '../../../assets/css/styles';
import { CartIcon } from '../CartIcon';

const Stack = createStackNavigator();

const ProductDetailsStack = ({ navigation }) => {
                                                                    
    return(
      <Stack.Navigator initialRouteName="ProductDetails">
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen}
      options = {() => ({
        headerTitle: 'Product Details',
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
export default ProductDetailsStack