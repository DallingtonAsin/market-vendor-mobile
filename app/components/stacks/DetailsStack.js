import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import Details from '../../screens/Business/Details';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();


const DetailsStack = ({ navigation }) => {
                                                                      
    return(
      <Stack.Navigator initialRouteName="Details">
      <Stack.Screen name="Details" component={Details}
      options = {() => ({
        headerTitle: 'Details',
        icon: () => <Icon name='cog'/>,
        headerLeft:  () =>  <HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack()}  />,
        headerStyle:{
          backgroundColor:styles.colors.success,
        },
        headerTitleStyle:{
          fontSize:17,
          fontFamily:'Roboto',
        },
        headerTintColor: '#ffffff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default DetailsStack