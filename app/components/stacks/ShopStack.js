import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import ShopScreen from '../../screens/ShopScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const ShopStack = ({ navigation }) => {
                                                                    
    return(
      <Stack.Navigator initialRouteName="Shop">
      <Stack.Screen name="Shop" component={ShopScreen}
      options = {() => ({
        headerTitle: 'Shop',
        icon: () => <Icon name='cog'/>,
        headerLeft: () =><HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack(null)}  />,
        
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
export default ShopStack