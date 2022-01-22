import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Platform,SectionList,Dimensions,
    StyleSheet, ScrollView, RefreshControl,useWindowDimensions , 
    Text, View, Pressable, TextInput, TouchableOpacity,
    Alert, FlatList} from 'react-native';
    import Icon from 'react-native-vector-icons/FontAwesome';
    import SearchableDropdown from 'react-native-searchable-dropdown';
    import {TimePicker} from 'react-native-simple-time-picker';
    import DateTimePicker from '@react-native-community/datetimepicker';
    import design from '../../assets/css/styles';
    import MainService from '../redux/services/main.service';
    import { Avatar, Card, Title, Paragraph, Searchbar  } from 'react-native-paper';
    import CustomLoader from '../components/CustomActivityIndicator';
    import { Rating, AirbnbRating, Button, Tab } from 'react-native-elements';
    import { TabView,TabBar, SceneMap } from 'react-native-tab-view';
    import { AuthContext } from '../context/context';
    import FastImage from 'react-native-fast-image';
    import FontAwesome from 'react-native-vector-icons/FontAwesome';
    import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
    
    
    const VendorsScreen = (props) => {
        
        
        const { getVendors } = React.useContext(AuthContext);
        const [refreshing, setRefreshing] = useState(false);
        const [vendors, setVendors] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [searchQuery, setSearchQuery] = useState('');
       
       
                const nearByParkings = () => (
                    !isLoading ? 
                    <View style={{marginTop:20}}>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={vendors}
                    renderItem={({item}) => CardComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }
                    />
                    </View>
                    :  <CustomLoader color={design.colors.orange}/>
                    );
                
           
                
                
                const CardComponent = (item) => (
                    <TouchableOpacity onPress={() => goToVendorDetailsScreen(item)} style={{flexDirection:'row'}}>

                    <FastImage
                    style={{
                        width: '35%',
                        height: '98%',
                        borderRadius: 15
                    }}
                    source={{
                        uri: 'https://image.shutterstock.com/image-photo/young-african-buying-fruits-market-260nw-1733879702.jpg',
                    }}
                 
                    />
                    <View style={{flexDirection:'column', padding:10}}>
                    <View style={{flexDirection:'column'}}>
                    <Title>{item.first_name} {item.last_name}</Title>
                   
                    </View>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    
                    <View style={{justifyContent:'flex-start'}}>
                    <Text style={{color:design.colors.black, fontSize:14}}>{item.address}</Text>
                    </View>
                  
                    </View>
                  
                        </View>
                        
                
                        
                        
                        </TouchableOpacity>
                        );
                        
                   
                        const goToVendorDetailsScreen = (item) => { 
                            props.navigation.navigate("VendorDetails", {
                                screen: 'VendorDetails',
                                params: { vendor_id: item.id }
                            });
                        }
                        
                        const onRefresh = React.useCallback(async () => {
                            setRefreshing(true);
                            const timer = setTimeout(() => {
                                setRefreshing(false);
                            }, 1000);
                            return () => clearTimeout(timer);
                        }, [refreshing]);
                        
                        const fetchVendors = async() => {
                            const parkings = await getVendors();
                            if(parkings.length > 0) {
                                setVendors(parkings);
                            }
                            setIsLoading(false);
                        }
                        
                        React.useEffect(() => {
                            fetchVendors();
                        }, []);
                  
                        
                                return (
                                    
                                    <SafeAreaView
                                    style={styles.scrollView}
                                    >
                                    
                                    <ScrollView 
                                    horizontal={true} 
                                    contentContainerStyle={{width: '100%'}}>
                                     {nearByParkings()}
                                    </ScrollView>
                                    
                                    </SafeAreaView>
                                    );
                                };
                                
                                export default VendorsScreen;
                                
                                const styles = StyleSheet.create({
                                    container: {
                                        flex: 1,
                                    },
                                    scrollView: {
                                        flex: 1,
                                        backgroundColor: '#fff',
                                        padding: 10,
                                    },
                                    semicontainer:{
                                        flex:1,
                                        borderWidth:1,
                                        borderColor:'#C0c0c0',
                                        borderRadius:20,
                                        shadowColor: "#000",
                                        height: '100%',
                                        shadowOpacity: 0.6,
                                        padding:15,
                                        shadowRadius: 10.32,
                                        shadowOffset: {
                                            width: 0,
                                            height: 8,
                                        }
                                    },
                                    titleText: {
                                        padding: 8,
                                        fontSize: 14,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                    },
                                    headingText: {
                                        padding: 8,
                                        textTransform:'uppercase'
                                    },
                                    signIn: {
                                        width: '100%',
                                        height: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 50,
                                        backgroundColor: design.colors.primary
                                        
                                    },
                                    textSign: {
                                        fontSize: 15,
                                        fontWeight: 'bold'
                                    },
                                    input: {
                                        padding: 10,
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        backgroundColor: '#FAF7F6',
                                        borderRadius:5,
                                    }
                                    
                                });