import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,StatusBar,
} from 'react-native';
import { SIZES } from '../../constants';
import OptionItem from '../components/OptionItem';
import design from '../../assets/css/styles';
import ProfileContext from '../context/index';
import * as theme from '../../assets/theme';
import {currency} from '@env';

const HomeScreen = props => {
  
  const {profile, setProfile} = useContext(ProfileContext);
  
  return (
    <>
    
    <StatusBar
    backgroundColor={design.colors.primary}
    />
    
    
    <View style={styles.container}>
    
    
    
    <View style={{ flex: 1, paddingHorizontal: SIZES.padding, alignItems: "center", justifyContent: "center"}}>
    <View style={{flexDirection: 'column' }}>
    <Text style={{
      color: '#fff',
      fontSize: 30,
      textAlign: 'center',
    }}>Wallet Balance</Text>
    <Text style={{
      color: '#fff',
      fontSize: 28,
      textAlign: 'center',
      fontWeight: "bold",
    }}>{currency}. {profile.account_balance }</Text>
    </View>
    </View>
    
    
    <View style={{ flex: 2, backgroundColor:design.colors.white, 
      borderTopLeftRadius:25, borderTopRightRadius:25 }}>
      
      <View style={{ flex:1,  padding:10,  borderColor:design.colors.primary}}>
      
      <Text style={{fontSize:18, textAlign:'center', fontWeight:'bold',
      color: design.colors.parksmart, opacity:0.8}}>Quick Actions</Text>
      <View style={{ flexDirection: 'row',  marginTop:30, paddingHorizontal: SIZES.base }}>
      
      <OptionItem
      icon={'shopping-cart'}
      bgColor={['#fff', '#fff']}
      label="Shop"
      tintColor={'#000'}
      borderRadius={5}
      tintColor={design.colors.primary}
      onPress={() => props.navigation.navigate("Shop")}
      />
      <OptionItem
      icon={"list"}
      bgColor={['#fff', '#fff']}
      label="Orders"
      tintColor={'#000'}
      tintColor={design.colors.primary}
      borderRadius={5}
      onPress={() => props.navigation.navigate("Orders") }
      />
      
      <OptionItem
      icon={"user"}
      bgColor={['#fff', '#fff']}
      label="Vendors"
      tintColor={'#000'}
      borderRadius={5}
      tintColor={design.colors.primary}
      onPress={() => props.navigation.navigate("Vendors") }
      />
      
      
      </View>
      
      <View style={{flexDirection: 'row', marginTop: SIZES.radius, paddingHorizontal: SIZES.base }}>
      
      <OptionItem
      icon={"plus-circle"}
      bgColor={['#fff', '#fff']}
      label="Top Up"
      tintColor={'#000'}
      borderRadius={5}
      tintColor={design.colors.primary}
      onPress={() => props.navigation.navigate("TopUp")}
      />
      
      <OptionItem
      icon={"book"}
      bgColor={['#fff', '#fff']}
      label="Statements"
      tintColor={'#000'}
      borderRadius={5}
      tintColor={design.colors.primary}
      onPress={() => props.navigation.navigate("PaymentHistory") }
      />
      
      <OptionItem
      icon={"gear"}
      bgColor={['#fff', '#fff']}
      label="Settings"
      tintColor={'#000'}
      borderRadius={5}
      tintColor={design.colors.primary}
      onPress={() => props.navigation.navigate("Settings")}
      />
      
      </View>
      
      </View>
      </View>
      
      </View>
      </>
      );
    };
    
    export default HomeScreen;
    
    const styles = StyleSheet.create({
      
      container: {
        flex: 1,
        backgroundColor: design.colors.primary,
      },
      
      uploadOptions:{
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center'
      },
      
      
      
      shadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
      },
      
      
      SheetContentContainer: {
        backgroundColor: 'white',
        padding: 16,
        paddingTop:0,
        // height:'auto',
      },
      
      contentContainer: {
        // flex: 1,
        alignItems: 'center',
        
        
      },
      
      card:{
        flex:1,
      },
      
      
      input: {
        backgroundColor: '#ffffff',
        borderRadius: 3,
        padding:10,
        borderWidth: 0.5,
        borderColor:design.colors.primary,
      },
      
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      
      
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      
      divider:{
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop:20
      },
      
      cardContainer:{
        flexDirection: "row",
        textAlign:'center',
        flexWrap: 'wrap',
      },
      
      
      
      
      bottomSheetButton:{
        flexDirection: 'row',
        borderWidth:1, 
        marginTop:15,
        marginBottom:60,
        height:50,
        width:'70%',
        padding:15,
        borderRadius:30,
        borderColor:design.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      inputContainer:{
        padding:10,
        
      },
      scrollView: {
        flex: 1, 
      },
      bottomSheetContainer:{
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey',
      },
      
      footer:{
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        
      },
      
      vehiclesDropdown: {
        borderRadius: theme.SIZES.base / 2,
        borderColor: theme.COLORS.overlay,
        borderWidth: 1,
        padding: theme.SIZES.base*1.3,
        width:350,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: theme.SIZES.font*0.95,
      },
      
      vehiclesDropdownOption: {
        padding: 5,
        fontSize: 18,
      },
      indicator: {
        position: "absolute",
        width: 10,
        height: 4,
        backgroundColor: "#999",
      },
      
      customBottomSheetHeader: {
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
      },
      
      bottomSheetHeader: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      
      panelHeader: {
        alignItems: 'center',
      },
      
      panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#999',
        marginTop: 8,
        marginBottom: 10,
        
      },
      
      panel: {
        backgroundColor: '#FFFFFF',
      },
      
      panelTitle: {
        fontSize: 22,
        height: 35,
      },
      panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
      },
      
      
      
      
      
      
      
      
    });
    
    
    