import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import PaymentHistoryScreen from '../../screens/PaymentHistoryScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const PaymentStatementStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Statement">
      <Stack.Screen name="Statement" component={PaymentHistoryScreen}
      options = {() => ({
        headerTitle: 'Transaction History',
        headerLeft: () => <HeaderBackButton tintColor={styles.colors.white} onPress={() => navigation.goBack(null)} />, // <DrawerNavigationStructure color={'#fff'} navigationProps = {navigation}/>,
        headerStyle:{
          backgroundColor:styles.colors.primary,
        },
        headerTitleStyle:{
          fontSize:18,
          fontWeight:'bold',
        },
        headerTintColor: styles.colors.white,
      })
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}
export default PaymentStatementStack