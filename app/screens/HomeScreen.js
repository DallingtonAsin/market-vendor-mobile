import React, {useState, useEffect, useMemo, useRef, useContext, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,StatusBar,
  TouchableHighlight,TextInput,
  Dimensions,Button,
  SafeAreaView,Keyboard,
  Alert, Pressable,
} from 'react-native';
import { images, icons, COLORS, FONTS, SIZES } from '../../constants';
import OptionItem from '../components/OptionItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { BottomSheet as BrSheet } from 'react-native-btr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Modal, Divider, Portal  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import design from '../../assets/css/styles';
import ProfileContext from '../context/index';
import { AuthContext } from '../context/context';
import { openDatabase } from 'react-native-sqlite-storage';
import { UIActivityIndicator } from 'react-native-indicators';
import FastImage from 'react-native-fast-image';
import {currency} from '@env';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';


const fall = new Animated.Value(1);

var db = openDatabase({ name: 'Customers.db' });

const initialUserState = {
  user_id: '',
  name: '',
  firstname: '',
  lastname: '',
  phoneNo: '',
  email: '',
  account_balance: 0,
  image: '',
}

const initialVehicleState= {
  id: '',
  number: '',
  name: '',
}

const HomeScreen = props => {
  
  const favParkingRef = useRef();
  const vehicleSheetRef = useRef();

   // ref
   const bottomSheetModalRef = useRef(null);

   // variables
   const snapPoints = useMemo(() => ['25%', '50%'], []);
 
   // callbacks
   const handlePresentModalPress = useCallback(() => {
     bottomSheetModalRef.current?.present();
   }, []);
   const handleSheetChanges = useCallback((index) => {
     console.log('handleSheetChanges', index);
   }, []);
  
  const [state, setData] = useState(initialUserState);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  
  
  const {profile, setProfile} = useContext(ProfileContext);
  const { getParkingAreas } = React.useContext(AuthContext);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isParkingsLoading, setIsParkingsLoading] = useState(true);
  
  
  const [vehicles, setVehicleState] = useState(null);
  const [vehicle, setVehicleData] = React.useState(initialVehicleState);
  const [nearByParkings, setNearByParkings] = useState([]);

  // console.log("Profile", profile.account_balance);
  
  
  const handleVehicleNoChange = (val) => {
    setVehicleData({
      ...vehicle,
      number: val,
    });
  }
  
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='vehicles'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS vehicles', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS vehicles(id INTEGER PRIMARY KEY AUTOINCREMENT, number VARCHAR(20), name VARCHAR(30))',
              []
              );
            }
          }
          );
        });
      }, []);
      
      
      useEffect(() => {
        populateVehicles();
      }, []);
      
      const populateVehicles = () =>{
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM vehicles',
            [],
            (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i){
                temp.push(results.rows.item(i));
                setVehicleState(temp);
              }
            }
            );
          });
        }
        
        const registerVehicle = () => {
          
          if (!vehicle.number) {
            alert('Please fill vehicle number');
            return;
          }
          if (!vehicle.name) {
            alert('Please fill vehicle name');
            return;
          }
          
          if(vehicle.number && vehicle.name) {
            setIsLoading(true);
            const number = vehicle.number;
            const name = vehicle.name;
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO vehicles (number, name) VALUES (?, ?)',
                [number, name],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    setVehicleData({...initialVehicleState});
                    populateVehicles();
                    setIsSheetVisible(false);
                    Alert.alert(
                      'Success',
                      'Vehicle registered Successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => {
                            // do nothing
                          }
                        },
                      ],
                      { cancelable: false }
                      );
                    } else {
                      alert('Registration of vehicle failed');
                    }
                    setIsLoading(false);
                  }
                  );
                });
              }
            };
            
            const updateVehicle = () => {
              
              const id = vehicle.id;
              const number = vehicle.number;
              const name = vehicle.name;
              
              if (!id) {
                alert('Please fill vehicle id');
                return;
              }
              if (!number) {
                alert('Please fill vehicle number');
                return;
              }
              if (!name) {
                alert('Please fill vehicle name');
                return;
              }
              
              db.transaction((tx) => {
                tx.executeSql(
                  'UPDATE vehicles set number=?, name=? where id=?',
                  [number, name, id],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      setVehicleData({...initialVehicleState});
                      populateVehicles();
                      setIsEditSheetVisible(false);
                      Alert.alert(
                        'Success',
                        'Vehicle updated successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () => {
                              // do nothing
                            }
                          },
                        ],
                        { cancelable: false }
                        );
                      } else alert('Updation Failed');
                    }
                    );
                  });
                };
                
                
                const deleteVehicle = (VehicleId) => {
                  
                  if(!VehicleId){
                    alert('Please select vehicle to remove');
                    return;
                  }
                  db.transaction((tx) => {
                    tx.executeSql(
                      'DELETE FROM vehicles where id=?',
                      [VehicleId],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          Alert.alert(
                            'Success',
                            'Vehicle removed successfully',
                            [
                              {
                                text: 'Ok',
                                onPress: () => {
                                  populateVehicles();
                                }
                              },
                            ],
                            { cancelable: false }
                            );
                          } else {
                            alert('Unable to remove vehicle');
                            populateVehicles();
                          }
                        }
                        );
                      });
                    };
                    
                    const cancelEditVehicle = () =>{
                      setIsEditSheetVisible(false);
                      setVehicleData({...initialVehicleState});
                    }
                    
                    
                    const handleVehicleNameChange = (val) => {
                      setVehicleData({
                        ...vehicle,
                        name: val,
                      });
                    }
                    
                    React.useEffect(() => {
                      const unsubscribe = props.navigation.addListener('focus', () => {
                        getProfile();
                      });
                      return unsubscribe;
                    }, [props.navigation]);
                    
                    const fetchParkings = async() => {
                      const parkings = await getParkingAreas();
                      if(parkings.length > 0) {
                        setNearByParkings(parkings);
                        setIsParkingsLoading(false);
                      }
                      
                    }
                    
                    useEffect(() => {
                      fetchParkings();
                    },[]);
                    
                    
                    
                    const getProfile = () => {
                      try{
                        if(profile){
                          const user_id = profile.user_id;
                          const first_name = profile.first_name;
                          const last_name = profile.last_name;
                          const name = (first_name && last_name) ? first_name + " " + last_name : '';
                          const phone_number = profile.phone_number;
                          const email = profile.email;
                          const balance = profile.account_balance
                          
                          setData({
                            ...state,
                            user_id: user_id,
                            name: name,
                            firstname: first_name,
                            lastname: last_name,
                            phoneNo: phone_number,
                            email: email,
                            account_balance: balance,
                          });
                        }
                      }catch(e){
                        console.log("Error on async storage", e);
                      }
                    }
                    
                    
                    
                    
                    const [visible, setVisible] = useState(false);
                    
                    const showModal = () => setVisible(true);
                    
                    
                    const getVehicleNo = (item) => {
                      Alert.alert(
                        'Take action',
                        'Choose action on the vehicle',
                        [
                          {
                            text: 'Edit',
                            onPress: () => {
                              setVehicleData({
                                id: item.id,
                                number: item.number,
                                name: item.name,
                              });
                              setIsEditSheetVisible(true);
                            }
                          },
                          {
                            text: 'Delete',
                            onPress: () => {
                              confirmDeleteVehicle(item);
                            }
                          },
                        ],
                        { cancelable: true }
                        );
                      }
                      
                      
                      const confirmDeleteVehicle = (item) => {
                        Alert.alert(
                          'Confirm Delete',
                          `Are you sure you want to delete this vehicle ${item.name} ${item.number} from your list?`,
                          [
                            {
                              text: 'Yes',
                              onPress: () => {
                                deleteVehicle(item.id);
                              }
                            },
                            {
                              text: 'No',
                              onPress: () => {
                                
                              }
                            },
                          ],
                          { cancelable: true }
                          );
                        }
                        
                        const toggleBottomNavigationView = () => {
                          setIsSheetVisible(!isSheetVisible);
                        };
                        
                        const toggleEditBottomNavigationView = () => {
                          setIsEditSheetVisible(!isEditSheetVisible);
                        };
                        
                        
                        const FlatListItemSeparator = () => {
                          return (
                            <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: "#e2e2e2",
                            }}
                            />
                            );
                          }
                          
                          const VehicleComponent = (item) => (
                            <View style={[design.vehicle.container,{padding:3}]}>
                            <Image
                            source={require('../../assets/images/UberX.jpeg')}
                            style={design.vehicle.image}
                            />
                            <View style={design.vehicle.middleContainer}>
                            <Text style={design.vehicle.text}>{item.number}</Text>
                            <Text style={design.vehicle.name}>{item.name}</Text>
                            </View>
                            <View style={design.vehicle.rightContainer}>
                            <Pressable onPress={() => getVehicleNo(item) }>
                            <FontAwesome name={"ellipsis-h"} size={28} style={design.vehicle.ellipsis} />
                            </Pressable>
                            </View>
                            
                            </View>
                            )
                            
                            const parkingsComponent = (item) => (
                              <View style={[design.vehicle.container,{padding:10}]}>
                              
                              <Icon name="map-marker" size={30} color="#4F8EF7" />
                              
                              <View style={design.vehicle.middleContainer}>
                              <Text style={design.vehicle.text}>{item.name}</Text>
                              <Text style={design.vehicle.name}>{item.address}</Text>
                              </View>
                              
                              <View style={design.vehicle.rightContainer}>
                              <Pressable>
                              <FontAwesome name={"ellipsis-h"} size={20} style={design.vehicle.ellipsis} />
                              </Pressable>
                              </View>
                              
                              
                              </View>
                              )
                              
                                const favParkings = () => (
                                  <View style={styles.SheetContentContainer}>
                                  <Text style={{textAlign:'center'}}>Favourite parking areas</Text>
                                  <Divider style={styles.divider}/>
                                  
                                  <SafeAreaView>
                                  <FlatList
                                  data={nearByParkings}
                                  renderItem={({item}) => parkingsComponent(item) }
                                  keyExtractor={(item, index) => { return item.id.toString()}}
                                  ItemSeparatorComponent = { FlatListItemSeparator }
                                  />
                                  </SafeAreaView>
                                  
                                  <Pressable style={styles.bottomSheetButton} onPress={showModal}>
                                  <Text style={design.vehicle.textAdd}>
                                  add favourite parking 
                                  <FontAwesome name={"arrow-right"} size={10} style={design.vehicle.icon}/>
                                  </Text>
                                  </Pressable>
                                  
                                  
                                  </View>
                                  );
                                  
                                  const renderHeader = () => {
                                    return(
                                      <View style={styles.bottomSheetHeader}>
                                      <View style={styles.panelHeader}>
                                      <View style={styles.panelHandle} />
                                      </View>
                                      </View>
                                      );
                                    }
                                    
                                    
                                    function renderDestinations(item, index) {
                                      var destinationStyle = {};
                                      
                                      if (index == 0) {
                                        destinationStyle = { marginLeft: SIZES.padding, }
                                      }
                                      
                                      return (
                                        <TouchableOpacity
                                        style={{ justifyContent: 'center', marginHorizontal: SIZES.base, ...destinationStyle }}
                                        onPress={() => { props.navigation.navigate("DestinationDetail") }}
                                        >
                                        <FastImage
                                        style={{
                                          width: SIZES.width * 0.28,
                                          height: '82%',
                                          borderRadius: 15
                                        }}
                                        source={{
                                          uri: item.image ,
                                          priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                        />
                                        <Text style={{ textAlign: 'center', marginTop: SIZES.base / 2, ...FONTS.h4 }}>{item.name}</Text>
                                        </TouchableOpacity>
                                        )
                                      }
                                      
                                      return (
                                        <>
                                        
                                        <StatusBar
                                        backgroundColor={design.colors.primary}
                                        />
                                        
                                    
                                        
                                        <BottomSheet
                                        ref={favParkingRef}
                                        snapPoints={[450, 0]}
                                        renderContent={favParkings}
                                        renderHeader={renderHeader}
                                        initialSnap={1}
                                        />
                                        
                                        
                                        <BrSheet
                                        visible={isSheetVisible}
                                        onBackButtonPress={toggleBottomNavigationView}
                                        onBackdropPress={toggleBottomNavigationView}
                                        >
                                        <SafeAreaView>
                                        <ScrollView style={styles.panel}>
                                        
                                        <View style={{ flex: 3, alignItems: 'center',padding:20, justifyContent: 'center', backgroundColor: design.colors.gray,}}>
                                        <Avatar.Icon icon={icons.uber} style={{backgroundColor:design.colors.white}} /> 
                                        </View>
                                        
                                        
                                        <View style={{ flex: 3, backgroundColor: design.colors.white, padding:20 }}>
                                        <View style={{alignItems:'center'}}>
                                        <Text style={{ padding:10, fontSize: 14, textTransform:'uppercase',fontWeight:'bold'}}>Add vehicle</Text>
                                        </View>
                                        
                                        <View style={styles.inputContainer}>
                                        <Text>Vehicle Number</Text>
                                        <TextInput 
                                        name="vehicleNumber" 
                                        value={vehicle.number}
                                        onSubmitEditing={Keyboard.dismiss}
                                        onChangeText={(val) => handleVehicleNoChange(val)}   
                                        style={styles.input} placeholder={"Enter vehicle number"}/>
                                        </View>
                                        
                                        <View style={styles.inputContainer}>
                                        <Text>Vehicle Name</Text>
                                        <TextInput 
                                        name="vehicleName" 
                                        value={vehicle.name}
                                        onSubmitEditing={Keyboard.dismiss}
                                        onChangeText={(val) => handleVehicleNameChange(val)}
                                        style={styles.input} placeholder={"Enter vehicle name"}/>
                                        </View>
                                        
                                        <View>
                                        <TouchableOpacity style={{
                                          flexDirection: 'row', 
                                          marginLeft:10,
                                          marginRight:10,
                                          marginBottom:20,
                                          marginTop:15,
                                          padding:15,
                                          borderRadius:50,
                                          borderRadius:50,
                                          justifyContent: 'center', bottom:0,
                                          backgroundColor:design.colors.primary
                                        }} onPress={ registerVehicle }>
                                        {isLoading ?
                                          <UIActivityIndicator color='white' size={30} /> :
                                          <Text style={{color:design.colors.white, marginLeft:10, textTransform:'uppercase'}}>
                                          Submit  <FontAwesome name={"arrow-right"} size={10}/></Text>
                                        }
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={{flexDirection: 'row', 
                                        borderWidth:1,
                                        marginLeft:10,
                                        marginRight:10,
                                        marginBottom:20,
                                        padding:15,
                                        borderRadius:50,
                                        borderColor:design.colors.primary,
                                        justifyContent: 'center', bottom:0, 
                                        backgroundColor:design.colors.white}} onPress={() => setIsSheetVisible(false)}>
                                        <Text style={{color:design.colors.dark, marginLeft:10, textTransform:'uppercase'}}>
                                        Cancel<FontAwesome name={"times"} size={10}/></Text>
                                        </TouchableOpacity>
                                        </View>
                                        
                                        </View>
                                        
                                        </ScrollView>
                                        </SafeAreaView>
                                        </BrSheet>
                                        
                                        
                                        <BrSheet
                                        visible={isEditSheetVisible}
                                        onBackButtonPress={toggleEditBottomNavigationView}
                                        onBackdropPress={toggleEditBottomNavigationView}
                                        >
                                        <SafeAreaView>
                                        <ScrollView style={styles.panel}>
                                        
                                        <View style={{ flex: 3, alignItems: 'center',padding:20, justifyContent: 'center', backgroundColor: design.colors.gray,}}>
                                        <Avatar.Icon icon={icons.uber} style={{backgroundColor:design.colors.white}} /> 
                                        </View>
                                        
                                        
                                        <View style={{ flex: 3, backgroundColor: design.colors.white, padding:20 }}>
                                        <View style={{alignItems:'center'}}>
                                        <Text style={{ padding:10, fontSize: 14, textTransform:'uppercase',fontWeight:'bold'}}>Edit vehicle details</Text>
                                        </View>
                                        
                                        <View style={styles.inputContainer}>
                                        <Text>Vehicle Number</Text>
                                        <TextInput 
                                        name="vehicleNumber" 
                                        value={vehicle.number}
                                        onSubmitEditing={Keyboard.dismiss}
                                        onChangeText={(val) => handleVehicleNoChange(val)}   
                                        style={styles.input} placeholder={"Enter vehicle number"}/>
                                        </View>
                                        
                                        <View style={styles.inputContainer}>
                                        <Text>Vehicle Name</Text>
                                        <TextInput 
                                        name="vehicleName" 
                                        value={vehicle.name}
                                        onSubmitEditing={Keyboard.dismiss}
                                        onChangeText={(val) => handleVehicleNameChange(val)}
                                        style={styles.input} placeholder={"Enter vehicle name"}/>
                                        </View>
                                        
                                        <View>
                                        <TouchableOpacity style={{
                                          flexDirection: 'row', 
                                          marginLeft:10,
                                          marginRight:10,
                                          marginBottom:20,
                                          marginTop:15,
                                          padding:15,
                                          borderRadius:50,
                                          borderRadius:50,
                                          justifyContent: 'center', bottom:0,
                                          backgroundColor:design.colors.primary
                                        }} onPress={ updateVehicle }>
                                        {isLoading ?
                                          <UIActivityIndicator color='white' size={30} /> :
                                          <Text style={{color:design.colors.white, marginLeft:10, textTransform:'uppercase'}}>
                                          Submit  <FontAwesome name={"arrow-right"} size={10}/></Text>
                                        }
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={{flexDirection: 'row', 
                                        borderWidth:1,
                                        marginLeft:10,
                                        marginRight:10,
                                        marginBottom:20,
                                        padding:15,
                                        borderRadius:50,
                                        borderColor:design.colors.primary,
                                        justifyContent: 'center', bottom:0, 
                                        backgroundColor:design.colors.white}} onPress={() => cancelEditVehicle() }>
                                        <Text style={{color:design.colors.dark, marginLeft:10, textTransform:'uppercase'}}>
                                        Cancel<FontAwesome name={"times"} size={10}/></Text>
                                        </TouchableOpacity>
                                        </View>
                                        
                                        </View>
                                        
                                        </ScrollView>
                                        </SafeAreaView>
                                        </BrSheet>
                                        
                                        
                                        <View style={styles.container}>
                                        
                                        
                                        
                                        <View style={{ flex: 1, paddingHorizontal: SIZES.padding, alignItems: "center", justifyContent: "center"}}>
                                        <View style={{flexDirection: 'column' }}>
                                        <Text style={{
                                          color: '#fff',
                                          fontSize: 22,
                                          textAlign: 'center',
                                          fontWeight: "bold",
                                        }}>Wallet Balance</Text>
                                        <Text style={{
                                          color: '#fff',
                                          fontSize: 25,
                                          textAlign: 'center',
                                          fontWeight: "bold",
                                        }}>{currency}. {state.account_balance }</Text>
                                        </View>
                                        </View>
                                        
                                        
                                        <View style={{ flex: 2, backgroundColor:design.colors.white, 
                                          borderTopLeftRadius:25, borderTopRightRadius:25 }}>
                                        
                                        <View style={{ flex:1,  padding:10,  borderColor:design.colors.primary}}>
                                        
                                        <Text style={{fontSize:18, textAlign:'center', fontWeight:'bold',
                                         color: design.colors.parksmart, opacity:0.8}}>Quick Actions</Text>
                                        <View style={{ flexDirection: 'row',  marginTop:30, paddingHorizontal: SIZES.base }}>
                                        
                                        <OptionItem
                                        icon={icons.request}
                                        bgColor={['#fff', '#fff']}
                                        label="Request"
                                        tintColor={'#000'}
                                        borderRadius={5}
                                        tintColor={design.colors.orange}
                                        onPress={() => props.navigation.navigate("Map")}
                                        />
                                        <OptionItem
                                        icon={icons.parking}
                                        bgColor={['#fff', '#fff']}
                                        label="Parkings"
                                        tintColor={'#000'}
                                        tintColor={design.colors.orange}
                                        borderRadius={5}
                                        onPress={() => props.navigation.navigate("ParkingAreas") }
                                        />
                                        
                                        <OptionItem
                                        icon={icons.uber}
                                        bgColor={['#fff', '#fff']}
                                        label="Vehicles"
                                        tintColor={'#000'}
                                        borderRadius={5}
                                        tintColor={design.colors.orange}
                                        onPress={handlePresentModalPress}
                                        />
                                        
                                        
                                        </View>
                                        
                                        <View style={{flexDirection: 'row', marginTop: SIZES.radius, paddingHorizontal: SIZES.base }}>
                                        
                                        <OptionItem
                                        icon={icons.myparkings}
                                        bgColor={['#fff', '#fff']}
                                        label="Favourites"
                                        tintColor={'#000'}
                                        borderRadius={5}
                                        tintColor={design.colors.orange}
                                        onPress={() => favParkingRef.current.snapTo(0)}
                                        />
                                        
                                        <OptionItem
                                        icon={icons.topup}
                                        bgColor={['#fff', '#fff']}
                                        label="Top up"
                                        tintColor={'#000'}
                                        borderRadius={5}
                                        tintColor={design.colors.orange}
                                        onPress={() => props.navigation.navigate("TopUp")}
                                        />
                                        
                                        <OptionItem
                                        icon={icons.statement}
                                        bgColor={['#fff', '#fff']}
                                        label="Statement"
                                        tintColor={'#000'}
                                        borderRadius={5}
                                        tintColor={design.colors.orange}
                                        onPress={() => props.navigation.navigate("PaymentHistory") }
                                        />
                                        
                                        </View>

                                      
                                        
                                        
                                        </View>
                                        </View>


                                        <BottomSheetModalProvider>
                                      
                                      <BottomSheetModal
                                        ref={bottomSheetModalRef}
                                        index={1}
                                        snapPoints={snapPoints}
                                        onChange={handleSheetChanges}
                                      >
                                        <SafeAreaView style={styles.contentContainer}>
                                          <View>
                                           <Text style={{textAlign:'center'}}>List of your vehicles you can park with</Text>
                                           <Divider style={styles.divider}/>
                                          </View>
                                       
                                        
                                        <FlatList
                                        data={vehicles}
                                        renderItem={({item}) => VehicleComponent(item) }
                                        ItemSeparatorComponent = { FlatListItemSeparator }
                                        keyExtractor={(item, index) => { return item.number.toString()}}
                                        />
                                        
                                        <Pressable style={styles.bottomSheetButton} onPress={() => {setIsSheetVisible(true)}}>
                                        <Text style={{fontSize:14, textAlign: 'center', textTransform:'uppercase'}}>
                                           add vehicle
                                        </Text>
                                        <FontAwesome name={"arrow-right"} size={18} style={design.vehicle.icon} color={"#808080"}/>
                                        </Pressable>
                                      

                                        </SafeAreaView>
                                      </BottomSheetModal>
                                  </BottomSheetModalProvider>



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
                                        
                                        panel: {
                                          // padding: 20,
                                          backgroundColor: '#FFFFFF',
                                          // paddingTop: 20,
                                          // height: 600,
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
                                          flex: 1,
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
                                          width: 45,
                                          height: 8,
                                          borderRadius: 4,
                                          backgroundColor: '#00000040',
                                          marginBottom: 10,
                                        },
                                        bottomSheetButton:{
                                          flexDirection: 'row',
                                          borderWidth:1, 
                                          marginTop:15,
                                          marginBottom:60,
                                          padding:12,
                                          borderRadius:30,
                                          borderColor:design.colors.primary,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          backgroundColor:design.colors.white
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
                                        
                                        
                                        
                                        
                                        
                                        
                                      });
                                      
                                      
                                      