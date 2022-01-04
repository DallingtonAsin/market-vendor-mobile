import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import TopUpScreen from '../../screens/TopUpScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();


const TopupStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Statement">
      <Stack.Screen name="TopUp" component={TopUpScreen}
      options = {() => ({
        headerTitle: 'Top Up',
        headerLeft: () => <HeaderBackButton tintColor={styles.colors.white} onPress={() => navigation.goBack()} />, // <DrawerNavigationStructure color={'#fff'} navigationProps = {navigation}/>,
        headerStyle:{
          backgroundColor:styles.colors.parksmart,
        },
        headerTitleStyle:{
          fontSize:19,
          fontWeight:'bold',
          
        },
        headerTintColor: styles.colors.white,
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}
export default TopupStack