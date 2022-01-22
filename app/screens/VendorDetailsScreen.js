import React, {useState, useContext, useEffect} from 'react';
import {Text, SafeAreaView, Image, 
    RefreshControl, View, FlatList,ScrollView,
    TouchableOpacity, StyleSheet} from 'react-native';
    import { AuthContext } from '../context/context';
    import styles from '../../assets/css/styles';
    import CustomLoader from '../components/CustomActivityIndicator';
    import { icons } from '../../constants';
    import FontAwesome from 'react-native-vector-icons/FontAwesome5';
    import {callHelpLine} from '../components/SharedCommons';
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    
    const  VendorDetailsScreen = ({route, navigation}) => {
        
        const [vendorInfo, setVendorInfo] = useState([]);
        const [refreshing, setRefreshing] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(true);
        
        const { vendor_id } = route.params;
        
        const { fetchVendorInfo } = React.useContext(AuthContext);
        
        
        const onRefresh = React.useCallback(() => {
            setRefreshing(true);
            wait(2000).then(() =>{
                fetchVendorDetails(vendor_id);
                setRefreshing(false);
            });
        });
        
        const fetchVendorDetails = async() => {
            try{
                const vendor_details = await fetchVendorInfo(vendor_id);
                console.log("Vendor information", vendor_details);
                console.log("Count is", vendor_details.length);
                if(vendor_details.length > 0){
                    setVendorInfo(vendor_details);
                }
                setIsLoading(false);
            }catch(e){
                console.log("Error on fetching vendor information: " + e.message);
            }
        }
        
        useEffect(() => {
            setIsLoading(true);
            fetchVendorDetails(vendor_id);
        }, [vendor_id])
        
        
        const renderComponent = (item) => {
            return ( 
                
                
                <SafeAreaView>
                <ScrollView 
                style={{flexDirection: 'column', marginTop:30}}
                >
                
                <View>
                <Text style={innerStyles.headerTitle}>Vendor Information</Text>
                </View>
                
                <View  style={{flex:1, alignItems: 'center',
                 padding:10, justifyContent:'center', right:10}}>
                 <FontAwesome name={"user"} size={80} style={styles.vehicle.icon} color={"#000"}/>
                </View>
                
                
                <View style={innerStyles.VendorInfoContainer}>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
                <Text style={innerStyles.subtitle}>Name</Text>
                <Text style={innerStyles.info}>{item.first_name} {item.last_name}</Text>
                </View>
                
                <View style={innerStyles.divider}></View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
                <Text style={innerStyles.subtitle}>Telephone</Text>
                <Text style={innerStyles.info}>{item.phone_number}</Text>
                </View>
                
                <View style={innerStyles.divider}></View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
                <Text style={innerStyles.subtitle}>Adress</Text>
                <Text style={innerStyles.info}>{item.address}</Text>
                </View>
                
                <View style={innerStyles.divider}></View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
                <Text style={innerStyles.subtitle}>Email</Text>
                <Text style={innerStyles.info}>{item.email}</Text>
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
            
            const NoVendorDetails= () =>{
                return (
                    <View style={innerStyles.noContentContainer}>
                    <Text style={innerStyles.text}>No vendor details found</Text>
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
                        data={vendorInfo}
                        renderItem={({ item }) => renderComponent(item)}
                        keyExtractor={(item, index) => String(index)}
                        ListEmptyComponent={<NoVendorDetails/>} 
                        ItemSeparatorComponent={FlatListItemSeparator}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                        /> 
                        </SafeAreaView>
                        );
                    }
                    
                    
                }
                
                
                export default VendorDetailsScreen; 
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
                    
                    VendorInfoContainer:{
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
                        fontSize:22,
                        fontWeight: 'bold',
                        color:styles.colors.primary,
                        textAlign: 'center',
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
