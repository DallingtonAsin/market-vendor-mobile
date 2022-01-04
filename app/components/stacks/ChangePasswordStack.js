import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import ChangePassword from '../../screens/ChangePasswordScreen';
import styles from '../../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();


 const ChangePasswordStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ChangePassword">
      <Stack.Screen name="ChangePassword" component={ChangePassword}
      options = {() => ({
        headerTitle: 'Change Password',
        icon: () => <Icon name='cog'/>,
        headerLeft: () =>  <HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack()}  />,
        headerRight: () => <Icon name={'cog'} style={{color:'#fff', right:15 }} size={22}
        onPress={ () => { navigation.navigate("Settings") }} />,
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
export default ChangePasswordStack