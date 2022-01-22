import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import EditProfileScreen from '../../screens/EditProfileScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();


  const EditProfileStack = ({ navigation }) => {
                                                              
    return(
      <Stack.Navigator>
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen}
      options = {() => ({
        headerTitle: 'Edit Profile',
        headerLeft: () => <HeaderBackButton tintColor={'#fff'}
        onPress={() => navigation.goBack()}/>,
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
export default EditProfileStack