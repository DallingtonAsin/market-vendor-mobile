import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import MapScreen from '../../screens/MapScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const MapStack = ({ navigation }) => {
                              
    return(
      <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen}
      options={{headerShown: false}}
      // options = {() => ({
      //   headerTitle: 'Find Destination',
      //   icon: () => <Icon name='cog'/>,
      //   headerLeft: () => <HeaderBackButton tintColor={'#000'}
      //   onPress={() => navigation.goBack(null)}/>,
      // })}
      >
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default MapStack