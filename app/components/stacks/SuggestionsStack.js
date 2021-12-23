
import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import SuggestionsScreen from '../../screens/SuggestionsScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();


 const SuggestionsStack = ({ navigation }) => {
                            
    return(
      <Stack.Navigator initialRouteName="Suggestions">
      <Stack.Screen name="Suggestions" component={SuggestionsScreen}
      options = {() => ({
        headerTitle: 'Feedback',
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
export default SuggestionsStack