import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../navigators/CustomDrawer';
import { Dimensions } from 'react-native';

import AppTabStack from  './AppTabStack';
import ShopStack from  './ShopStack';
import OrdersStack from  './OrdersStack';
import OrderDetailsStack from  './OrderDetailsStack';
import VendorsStack from  './VendorsStack';
import VendorDetailsStack from  './VendorDetailsStack';
import TopupStack from  './TopupStack';
import NotificationStack from  './NotificationStack';
import PaymentStatementStack from  './PaymentStatementStack';
import ProfileStack from  './ProfileStack';
import EditProfileStack from  './EditProfileStack';
import ChangePasswordStack from  './ChangePasswordStack';
import SettingsStack from  './SettingsStack';
import HelpStack from  './HelpStack';
import CartStack from  './CartStack';
import ProductDetailsStack from  './ProductDetailsStack';



// import { ProductsList } from './screens/ProductsList.js';
// import { ProductDetails } from './screens/ProductDetails.js';
// import { Cart } from './screens/Cart.js';
// import { CartIcon } from './components/CartIcon.js';
// import { CartProvider } from './CartContext.js';


const Drawer = createDrawerNavigator();

const DrawerScreenStack = () => {
    return(
        <Drawer.Navigator 
        drawerStyle={{ width:Dimensions.get('window').width - 100, }}
        drawerContent= {(props) => <CustomDrawer {...props} />
        }>
        <Drawer.Screen name="Home" component={AppTabStack} />

        <Drawer.Screen name="Shop" component={ShopStack}/>
        <Drawer.Screen name="Cart" component={CartStack}/>
        <Drawer.Screen name="ProductDetails" component={ProductDetailsStack}/>

        <Drawer.Screen name="Orders" component={OrdersStack}/>
        <Drawer.Screen name="OrderDetails" component={OrderDetailsStack}/>

        <Drawer.Screen name="Vendors" component={VendorsStack}/>
        <Drawer.Screen name="VendorDetails" component={VendorDetailsStack}/>

        <Drawer.Screen name="TopUp" component={TopupStack}/>
        <Drawer.Screen name="Notifications" options ={{ drawerLabel: 'Notification' }} component={NotificationStack}/>
        <Drawer.Screen name="PaymentHistory" component={PaymentStatementStack}/>


        <Drawer.Screen name="Profile" component={ProfileStack}/>
        <Drawer.Screen name="EditProfile" component={EditProfileStack}/>
        <Drawer.Screen name="ChangePassword" component={ChangePasswordStack}/>
        <Drawer.Screen name="Settings" options ={{ drawerLabel: 'Settings' }} component={SettingsStack}/>
        <Drawer.Screen name="Help" options ={{ drawerLabel:'Help' }} component={HelpStack}/>

     

        </Drawer.Navigator>
    )
}
export default DrawerScreenStack