import React, {useState, useContext, useEffect} from 'react';
import {Text, SafeAreaView, Image, 
  RefreshControl, View, FlatList,ScrollView,
  TouchableOpacity, StyleSheet} from 'react-native';
  import { AuthContext } from '../context/context';
  import styles from '../../assets/css/styles';
  import CustomLoader from '../components/CustomActivityIndicator';
  import { icons } from '../../constants';
  import {APP_NAME, currency} from '@env';
  import {callHelpLine} from '../components/SharedCommons';
  import FontAwesome from 'react-native-vector-icons/FontAwesome5';
  
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const  OrderDetailsScreen = ({route, navigation}) => {
    
    const [orderInfo, setOrderInfo] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    
    const { orderNo } = route.params;
    
    const { getOrderInfo } = React.useContext(AuthContext);
    
    
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() =>{
        fetchOrderDetails();
        setRefreshing(false);
      });
    });
    
    const fetchOrderDetails = async() => {
      try{
        const order_details = await getOrderInfo(orderNo);
        console.log("Order information", order_details);
        if(order_details.length > 0){
          setOrderInfo(order_details);
        }
        setIsLoading(false);
      }catch(e){
        console.log("Error on async storage", e);
      }
    }
    
    useEffect(() => {
      setIsLoading(true);
      fetchOrderDetails();
    }, [orderNo])
    
    
    const renderComponent = (item) => {
      return ( 
        
        
        <SafeAreaView>
        <ScrollView 
        style={{flexDirection: 'column'}}
        >
        
        <View  style={{flex:1, flexDirection: 'row', padding:10, justifyContent:'space-between', right:10}}>
        <FontAwesome name={"shopping-cart"} size={55} style={styles.vehicle.icon} color={styles.colors.success}/>
        <View>
        
        <Text style={innerStyles.headerTitle}>Order</Text>
        <Text style={innerStyles.headerText}>{item.request_date}</Text>
        <Text style={innerStyles.headerText}>{APP_NAME} Wallet</Text>
        </View>
        
        <View>
        <Text style={innerStyles.headerTitle}>{item.amount}</Text>
        <Text style={innerStyles.headerText}>{currency}</Text> 
        </View>
        
        </View>
        
        
        <View style={innerStyles.orderInfoContainer}>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Name</Text>
        <Text style={innerStyles.info}>{item.customer_name}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Telephone</Text>
        <Text style={innerStyles.info}>{item.phone_number}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Order No</Text>
        <Text style={innerStyles.info}>{item.order_no}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Address</Text>
        <Text style={innerStyles.info}>{item.address}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Vendor</Text>
        <Text style={innerStyles.info}>{item.vendor}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Items</Text>
        <Text style={innerStyles.info}>{item.items}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Amount</Text>
        <Text style={innerStyles.info}>{item.amount}</Text>
        </View>
        
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Request Date</Text>
        <Text style={innerStyles.info}>{item.request_date}</Text>
        </View>
        
        
        
        
        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Status</Text>
        <Text style={innerStyles.info}>{item.status}</Text>
        </View>
        </View>
        
        
        
        
        
        <View style={innerStyles.footer}>
        <TouchableOpacity
        style={innerStyles.callButton}
        onPress={() => callHelpLine(item.phone_number)}>
        <FontAwesome name={"phone-alt"} size={18} style={styles.vehicle.icon} color={"#fff"}/>
        <Text style={innerStyles.helpCenterText}>Call vendor</Text>
        </TouchableOpacity>
        </View>
        
        
        </ScrollView>
        
        </SafeAreaView>
        
        );
      }
      
      const NoOrders = () =>{
        return (
          <View style={innerStyles.noContentContainer}>
          <Text style={innerStyles.text}>No Orders found</Text>
          </View>
          );
        }
        const FlatListItemSeparator = () => {
          return (
            <View style={innerStyles.divider}/>
            );
          }
          
          if(isLoading){
            return <CustomLoader color={styles.colors.orange}/>
          }
          
          if(!isLoading){
            return (<SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <FlatList style= {{ backgroundColor:'#ffffff', height:'100%' }}
            data={orderInfo}
            renderItem={({ item }) => renderComponent(item)}
            keyExtractor={(item, index) => String(index)}
            ListEmptyComponent={<NoOrders/>} 
            ItemSeparatorComponent={FlatListItemSeparator}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            /> 
            </SafeAreaView>
            );
          }
          
          
        }
        
        
        export default OrderDetailsScreen; 
        const innerStyles = StyleSheet.create({
          container:{
            flex:1,
            padding:8,
            flexDirection:'row',
            
          },
          noContentContainer:{
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
            padding:10,
            
          },
          text:{
            fontSize: 18,
            fontWeight: 'bold',
          },
          description: {
            right:15,
            left:0,
            
          },
          divider:{
            width:'100%',
            height:1,
            marginTop:5,
            backgroundColor:'#e2e2e2',
          },
          
          orderInfoContainer:{
            flex: 1,
            borderWidth:1, 
            borderColor:'#e2e2e2',
            padding:10,
            margin:10,
            borderRadius:5,
            marginTop:20,
          },
          
          
          subtitle: {
            fontWeight:'bold',
            opacity:0.9, 
            fontSize:18, 
            color:styles.colors.parksmart,
            opacity:0.8,
          },
          
          info:{
            color:'#808080',
            fontSize:17
          },
          
          headerTitle:{
            fontSize:18,
            fontWeight: 'bold',
            color:styles.colors.primary
          },
          
          headerText:{
            fontSize:16,
            color: '#808080',
          },
          
          footer:{
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
            bottom: 0,
            marginTop: 25,
            //  position: 'absolute',
          },
          
          helpCenterText:{
            fontSize:18,
            fontWeight:'bold',
            color:styles.colors.white,
            marginLeft:15,
            
          },
          
          callButton:{
            backgroundColor: styles.colors.primary,
            borderColor: styles.colors.primary,
            borderWidth:1,
            borderRadius:30,
            padding:12,
            width:'80%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            
          }
          
          
        });
