
import React from 'react';
import {View,
        TouchableOpacity, 
        Image
    } from 'react-native';

 const DrawerNavigationStructure = (props) => {

      const state = {
        drawerColor: props.color ? props.color : '#000',
      }
      const toggleDrawer = () => {
        props.navigationProps.toggleDrawer();
      }
    
      return(
        <View style={{ flexDirection: 'row'}}>
        <TouchableOpacity onPress={toggleDrawer} style={{ color:'#000' }}>
        <Image source={require('../../assets/drawer.png')}
        style={{ width: 35, height: 30, top:1, marginLeft: 5, tintColor:state.drawerColor }}/>
        {/* <Text style={{fontSize:10, marginLeft: 8, color:state.drawerColor}}>Menu</Text> */}
        </TouchableOpacity>
        </View>
        
        );
    };
export default DrawerNavigationStructure;