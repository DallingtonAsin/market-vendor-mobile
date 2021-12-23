import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import LanguageScreen from '../../screens/LanguagesScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

 const LanguageStack = ({ navigation }) => {
                                
    return(
      <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Languages" component={LanguageScreen}
      options = {() => ({
        headerTitle: 'Languages',
        icon: () => <Icon name='cog'/>,
        headerLeft: () => <HeaderBackButton tintColor={'#ffffff'}
        onPress={() => navigation.goBack(null)}/>,
        
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
          fontFamily:'Roboto',
        },
        headerTintColor: '#ffffff',
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default LanguageStack