import React, {useState, useEffect, useContext} from 'react';
import {View,Text,Alert, StyleSheet, Button, ScrollView, TouchableOpacity, SafeAreaView} from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import design from '../../assets/css/styles';
import { UIActivityIndicator } from 'react-native-indicators';
import { AuthContext } from '../context/context';
import Dropdown from 'react-native-modal-dropdown';
import * as theme from '../../assets/theme';
import ProfileContext from '../context/index';


const initialState = {
  item: '',
  quantity: '0',
  vendor: '',
  delivery_date: '',
  address: '',
  
}
const ShopScreen = () => {
  
  const [state, setState] = React.useState(initialState);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState();
  const [vendors, setVendors] = useState([]);
  
  const {profile, setProfile} = useContext(ProfileContext);
  const { getVendors, submitShoppingOrder } = React.useContext(AuthContext);
  
  useEffect(() => {
    fetchVendors();
  },[])
  
  
  const fetchVendors = async() => {
    const data = await getVendors();
    console.log("Response", data);
    let vendors = [];
    for(let i = 0; i < data.length; i++) {
      let name = data[i]['first_name'];
      vendors.push(name);
    }
    setVendors(vendors);
    console.log("Vendors", vendors);
    
  }
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  
  const handleConfirm = (selected_date) => {
    let date = new Date(selected_date);
    date = date.toISOString().substring(0, 10);
    setState({ 
      ...state,
      delivery_date: date,
    });
    hideDatePicker();
  };
  
  const submitOrder = async() => {
    const item = state.item;
    const quantity = state.quantity;
    const address= state.address;
    const delivery_date = state.delivery_date;
    const vendor = state.vendor;
    const customer_id = profile.id;

    if(!vendor || vendor == "Select Vendor"){
      alert("Please select vendor");
      return;
    }
    if(!item){
      alert("Please enter item");
      return;
    }
    if(!quantity || quantity == '0'){
      alert("Please enter quantity");
      return;
    }
    if(!address){
      alert("Please enter address");
      return;
    }
    if(!delivery_date){
      alert("Please enter delivery date");
      return;
    }

    if(!customer_id){
      alert("Unable to capture your id");
      return;
    }

    if(vendor && item && quantity && address && delivery_date && customer_id){
        let reqParams = {
          item: item,
          quantity: quantity,
          vendor: vendor,
          delivery_date: delivery_date,
          customer_id: customer_id,
          address: address,
        }
        setIsLoading(true);
        let response = await submitShoppingOrder(reqParams);
        console.log("Response", response);
        if(response.statusCode == 1){
          setState(initialState);
        }
        let message = response.message
        setIsLoading(false);
        Alert.alert("Message", message);
     
    } 

    
   
  }
  
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={{ flexGrow:1 }}> 
    <View style={styles.body}>

    <View>
    <Text style={styles.text}>Vendor: {state.delivery_date}</Text>
    <Dropdown
    defaultIndex={0}
    options={vendors}
    style={styles.vendorsDropDown}
    defaultValue={"Select Vendor"}
    defaultTextStyle={{fontSize:16}}
    textStyle={{fontSize:16}}
    onSelect={(index, value) => setState({...state, vendor: value})}
    renderRow={(option) => (
      <Text style={styles.DropdownOption}>{option}</Text>
      )}
      />
      </View>
    
    <View>
    <Text style={styles.text}>Item</Text>
    <TextInput
    label="Item Name"
    mode="outlined"
    label={"item"}
    value={state.item}
    onChangeText={text => setState({...state, item: text})}
    style={styles.textInput}
    />
    </View>
    
    <View>
    <Text style={styles.text}>Quantity</Text>
    <TextInput
    label="Quantity"
    mode="outlined"
    keyboardType='numeric'
    label={"quantity"}
    value={state.quantity}
    onChangeText={text => setState({...state, quantity: text})}
    style={styles.textInput}
    
    />
    </View>
    
    
    
    <Text style={styles.text}>Delivery information</Text>
    
    <View>
    <TextInput
    label="Email"
    mode="outlined"
    label={"Your address"}
    value={state.address}
    style={styles.textInput}
    onChangeText={text => setState({...state, address: text})}
    />
    </View>
    
    
    
    <View style={{paddingBottom:15, paddingTop:10}}>
    <View>
    <Text style={styles.text}>Delivery Date: {state.delivery_date}</Text>
    <Button title="Set delivery date" onPress={showDatePicker} color={design.colors.success}/>
    </View>
    
    
    
    <DateTimePickerModal
    isVisible={isDatePickerVisible}
    mode="date"
    onConfirm={handleConfirm}
    onCancel={hideDatePicker}
    />
    </View>
    

      
      
      
      
      </View>
      
      
      
      <View style={styles.footer}>
      <TouchableOpacity style={design.btnPrimary} onPress={() => submitOrder()}>
      <Text style={{color:'#fff', textTransform:'capitalize', fontSize:15}}>
      {isLoading ? <UIActivityIndicator color='white' /> : 'Submit Order' } 
      </Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
      </SafeAreaView>
      )
    }
    
    export default ShopScreen;
    
    const styles = StyleSheet.create({
      container:{
        flex:1,
        backgroundColor:'#e2e2e2',
        padding:10,
        borderWidth:1,
        borderRadius:10,
      },
      body:{
        flex:1,
        backgroundColor:'#fff',
        padding:10,
      },
      footer:{
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      },
      text:{
        fontSize:16,
      },
      textInput: {
        backgroundColor: '#fff',
      },
      
      vendorsDropDown: {
        borderRadius: theme.SIZES.base / 2,
        borderColor: theme.COLORS.overlay,
        borderWidth: 1,
        padding: theme.SIZES.base*1.3,
        width:'98%',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: theme.SIZES.font*0.95,
      },
      DropdownOption: {
        padding: 5,
        fontSize: 18,
      },
      
    })
