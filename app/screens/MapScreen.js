import React,{useEffect, useState, useContext, useRef} from 'react';
import { StyleSheet, Text, View,Button,
         ScrollView, FlatList, Dimensions,Platform,
         TouchableOpacity, TouchableWithoutFeedback, 
         PermissionsAndroid, Alert, Image} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as theme from '../../assets/theme';
import design from '../../assets/css/styles';
import Modal from 'react-native-modal';
import Dropdown from 'react-native-modal-dropdown';
import Geolocation from 'react-native-geolocation-service';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { HeaderBackButton} from '@react-navigation/stack'
import ProfileContext from '../context/index';
import { AuthContext } from '../context/context';
import { openDatabase } from 'react-native-sqlite-storage';
import {  icons, mapStyles } from '../../constants';
import Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import {currency} from '@env';
import { UIActivityIndicator } from 'react-native-indicators';
import DateTimePickerModal from "react-native-modal-datetime-picker";
// const { Marker } = MapView;

const {height, width} = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922 //Very high zoom level
const LONGITUDE_DELTA =  LATITUDE_DELTA + (width / height);
const screenWidth = Dimensions.get('window').width;
var db = openDatabase({ name: 'Customers.db' });
Geocoder.init("AIzaSyCBrtM8sRgDkCkfe5eBq-P20qlVghWbYDc");

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const availableHours = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  

const ParkingMap = (props) => {
 
    const initialState = {
        hours:{},
        selectedVehicle: '',
        startTime: '',
        endTime: '',

        start_time: null,
        end_time: null,
        diff_hours : 0,
        total_amount: 0,
    }

    const mapInitialState =
    {
        location: null,
        currentPosition: {  
          latitude:0.353550,
          longitude:32.618591,
          latitudeDelta:0.0122,
          longitudeDelta:0.0121 
        },
        markerCoords: {
          latitude: 0,   
          longitude: 0, 
        },
        destination: {  
          latitude: 0,   
          longitude: 0,  
        },
        active:null,
        activeModal:null,
    }

    const [state, setState] = useState(initialState);
    const [region, setRegion] = useState(mapInitialState);
    const {profile, setProfile} = useContext(ProfileContext);
    const [vehicles, setVehicleState] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingParkings, setIsLoadingParkings] = useState(true);
    const [isReqProcessing, setIsReqProcessing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('Kampala, Uganda');
    const [nearByParkings, setNearByParkings] = useState([]);
    const [carType, setCarType] = useState();
    const [carTypes, setCarTypes] = useState();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const [mydate, setDate] = useState(new Date());
    const [displaymode, setMode] = useState('time');
    const [isDisplayDate, setShow] = useState(false);
    const changeSelectedDate = (event, selectedDate) => {
       const currentDate = selectedDate || mydate;
       setDate(currentDate);
    };
    const showMode = (currentMode) => {
       setShow(true);
       setMode(currentMode);
    };
    const displayTimepicker = () => {
       showMode('time');
    };
   

    const {getParkingAreas, getVehicleCategories, submitParkingRequest} = React.useContext(AuthContext);

    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

    const getTime = (selectedDate) => {
        let currentDate = selectedDate || date;
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes(); // + ":" + currentDate.getSeconds();
        hours  = hours > 9 ? hours : '0'+hours; 
        minutes  = minutes > 9 ? minutes : '0'+minutes; 
        var ampm = hours >= 12 ? 'PM' : 'AM';
        let time = hours + ":" + minutes;
        let timex = hours + ":" + minutes + " " + ampm;
        return time; 
    }

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };


  const handleConfirmStartTime = (selectedStartTime) => {
    let start_time = getTime(selectedStartTime);
     if(endTime){
       if(start_time < endTime){
        setStartTime(start_time);
        setState({ 
            ...state,
            start_time: selectedStartTime,
        });
        if(state.end_time){
            calculateAmount(selectedStartTime, state.end_time);
         }
       }else{
           Alert.alert("Message", "Start time must be less than end time");
       }
      }else{
        setStartTime(start_time);
        setState({ 
            ...state,
            start_time: selectedStartTime,
        });  
        if(state.end_time){
            calculateAmount(selectedStartTime, state.end_time);
         }
      }
    hideStartTimePicker();
  };


  const handleConfirmEndTime = (selectedEndTime) => {
    let end_time = getTime(selectedEndTime);
      if(startTime){
        if(end_time > startTime){
            setEndTime(end_time);
            setState({ 
                ...state,
                end_time: selectedEndTime,
            });
            if(state.start_time){
                calculateAmount(state.start_time, selectedEndTime);
               }
        }else{
            Alert.alert("Message", "End time must be greater than start time");
        }
       }else{
        setEndTime(end_time);
        setState({ 
            ...state,
            end_time: selectedEndTime,
        });  

        if(state.start_time){
            calculateAmount(state.start_time, selectedEndTime);
           }
       }
       
    console.warn("End time has been picked: ", end_time);
    hideEndTimePicker();
  };


  const diff_hours = (dt2, dt1) => {
    dt1 = new Date(dt1);
    dt2 = new Date(dt2);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
 }
 

  const calculateAmount = (startTime, endTime) => {
          const { activeModal } = state;
          let res = diff_hours(endTime, startTime);
          let total = res*activeModal.fees[`${carType}`];
          setState({
              ...state,
              diff_hours: res,
              total_amount: total,
          });
          console.log("Diff in hours", res);
          activeModal.fees[`${carType}`] = total;
      }

  const ResetAmount = () =>{
      const {activeModal, diff_hours} = state;
      activeModal.fees[`${carType}`] = diff_hours*activeModal.fees[`${carType}`];
  }

  

   const requestLocationPermission = async () => {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Allow permissions to access your current location",
        message:
        "Enable location",
        buttonNeutral: "Not Right Now!",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      } );
      
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {

            // console.log("Got position: ", position);
  
            let lat = parseFloat(position.coords.latitude);
            let long = parseFloat(position.coords.longitude);

            Geocoder.from(position.coords.latitude, position.coords.longitude)
                    .then(json => {
                    //  console.log("Response from Geocoder", json);
                      var addressComponent = json.results[0].address_components;
                      setCurrentAddress(addressComponent);
                        // console.log("Your current location", addressComponent);
                    })
                    .catch(error => console.warn(error));
     
            
            setRegion({
              ...region,
              latitude: lat,
              longitude: long,

              currentPosition: {  
                latitude: lat,   
                longitude: long,  
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
  
              markerCoords:{
                latitude: lat,
                longitude: long,
              },
  
  
             destination: {  
                latitude: lat-0.3,   
                longitude: long-0.3,  
              },
  
  
            });
            // console.log("Marker region", region.markerCoords);
          },
          (error) => {
            // console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        // }
        
      }

      

  
      const submitRequest = async() => {
        const {activeModal} = state;
          const parking_area_id = activeModal.id;
          const customer_id = profile.id;
          const telephone_no = profile.phone_number;
          const vehicle_details = state.selectedVehicle;
          let account_balance = profile.account_balance.replace(/,/g, '');
          let balance =  parseFloat(account_balance);
          const total_amount =parseFloat(state.total_amount);
          console.log("Balance: " + account_balance);
          console.log("Total amount: " + total_amount);
  
          if (!parking_area_id) {
            alert('Please select parking');
            return;
          }
      
          if (!telephone_no) {
            alert('Unable to capture your phone number');
            return;
          }
        
          if (!vehicle_details) {
            alert('Please select your vehicle details');
            return;
          }

          if (!carType) {
            alert('Please select your vehicle type');
            return;
          }

          if (!startTime) {
            alert('Please select your booking period (start time)');
            return;
          }

          if (!endTime) {
            alert('Please select your booking period (end time)');
            return;
          }

          if (startTime > endTime) {
            alert('Start time cannot be greater than end time');
            return;
          }

          if (!customer_id) {
            alert('Unable to get your id');
            return;
          }

          if(balance < total_amount){
            Alert.alert('Message', 'You have insufficient account balance to submit parking order.');
            return;
          }
      

          if(customer_id && parking_area_id && telephone_no && vehicle_details
             && carType && startTime && endTime) {
                let reqParams = {
                    customer_id: customer_id,
                    parking_area_id: parking_area_id,
                    telephone_no: telephone_no,
                    vehicle_details: vehicle_details,
                    vehicle_category: carType,
                    start_time: startTime,
                    end_time: endTime
                   }
               console.log("Request data", reqParams);
               setIsReqProcessing(true);
               let resp = await submitParkingRequest(reqParams);
               console.log("Resp", resp);
               if(resp.statusCode == 1){
                    setStartTime('');
                    setEndTime('');
                    Alert.alert("Success", resp.message);
               }else{
                Alert.alert("Error", resp.message);
               }
               setIsReqProcessing(false);
          }else{
            Alert.alert("Error", "Please supply all the information");

          }


      }

      const GetCurrentLocation = async () => {
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //   Alert.alert(
        //     'Permission not granted',
        //     'Allow the app to use location service.',
        //     [{ text: 'OK' }],
        //     { cancelable: false }
        //   );
        // }
      
        await Location.getCurrentPositionAsync({ enableHighAccuracy: false, maximumAge: 15000 }).then( async coords =>{
            console.log("Got cordinates", coords);
            if (coords) {
                const { latitude, longitude } = coords;
                let response = await Location.reverseGeocodeAsync({
                  latitude,
                  longitude
                });
            
                for (let item of response) {
                  let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
                  setCurrentAddress(address);
                }
                console.log("Your address", address);
              }
        });
        
      };
      

  const fetchNearByParkings = async() => {
    const near_parking_places = await getParkingAreas();
    // console.log("Your nearby parkings are", near_parking_places);
    if(near_parking_places.length > 0) {
        setNearByParkings(near_parking_places);
    }
    setIsLoadingParkings(false);
}

const fetchVehicleCategories = async() => {
    const vehicle_categories = await getVehicleCategories();
    console.log("Response", vehicle_categories);
    let types = [];
    for(let i = 0; i < vehicle_categories.length; i++) {
        let name = vehicle_categories[i]['name'];
        types.push(name);
    }

    if(types.length > 0){
        setCarType(types[0]);
    }
    // console.log("Vehicle Types", JSON.stringify(types));
    if(types.length > 0) {
        setCarTypes(types);
    }
}

    useEffect(() => {
        populateHours();
        populateVehicles();
        fetchVehicleCategories();
        fetchNearByParkings();
        requestLocationPermission();
       
    }, []);

  

    const handleStartTime = (value) => {
        let start_time;
        (value < 9) ? start_time = `0` + value + ":00" : value + ":00";
        console.log("Start time", start_time);
        
        setState({
            ...state,
             startTime: start_time
         });
      }

      const handleEndTime = (value) => {
        let end_time;
        end_time = (value < 9) ?  `0`+value+":00" : value + ":00";
        console.log("End time", end_time);
        setState({
            ...state,
             endTime: end_time
         });
      }


    const  renderHeader = () => {
        return(
            <View style={styles.header}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                <HeaderBackButton tintColor={theme.COLORS.black} onPress={() => props.navigation.goBack(null)} />
                {/* <Text style={styles.headerTitle}>Scroll down to view more nearby parking areas</Text> */}
                </View>
                <View style={{flex:1, justifyContent:'center', alignItems:"flex-end"}}>
                    <Text style={styles.headerTitle}>Your Current Location</Text>
                    <Text style={styles.headerLocation}>{currentAddress}
                    
                    </Text>
                </View>
            </View>
        )
    }

    const getDirections = () => {
        Alert.alert("Message", "Coming soon...");
    }

    const renderParking = (item) => {
        const { hours }  = state;
        const totalPrice = item.fees[`${carType}`] * availableHours[1];
    
        return (
          <TouchableWithoutFeedback key={`parking-${item.id}`} 
          onPress={() => { 
              setState({...state, active: item.id });
              setIsModalVisible(true);
              
              }} >
            <View style={[styles.parking, styles.shadow]}>
                
              <View style={styles.hours}>
                <Text style={styles.hoursTitle}>x {item.spots} {item.name}</Text>
                <View >
                    
                <TouchableOpacity style={styles.directionsBtn} onPress={() => getDirections()}>
                            <Image
                            source={icons.geo}
                            resizeMode="cover"
                            style={{
                                tintColor: '#ffa500',
                                width: 25,
                                height: 25,
                            }}
                            />
                                <Text style={styles.directionsText}>
                                    Directions
                                </Text>
                                <FontAwesome name='angle-right' size={theme.SIZES.icon*1.75} color={'#ffa500'} />
                            </TouchableOpacity>
                </View>
              </View>
              <View style={styles.parkingInfoContainer}>
                <View style={styles.parkingInfo}>
                  <View style={styles.parkingIcon}>
                    <FontAwesome name='tag' size={theme.SIZES.icon} color={theme.COLORS.gray}  />
                    <Text style={{ marginLeft: theme.SIZES.base }}> 
                     {item.fees[`${carType}`]}
                     </Text>
                  </View>
                  <View style={styles.parkingIcon}>
                    <FontAwesome name='star' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                    <Text style={{ marginLeft: theme.SIZES.base }}> {item.rating}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.buy} onPress={() => {
                    setState({...state, activeModal: item });
                    setIsModalVisible(true);
                    }}>
                  <View style={styles.buyTotal}>

                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{color: theme.COLORS.white, fontSize: 11}}>{currency}</Text>
                      <Text style={[styles.buyTotalPrice, {fontSize: 15}]}>{totalPrice}</Text>
                      </View>
                  
                    </View>

                    <View style={styles.buyBtn}>
                    <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
                  </View>

                    <View style={{flex:1, justifyContent: 'flex-start'}}>
                    <Text style={{ color: theme.COLORS.white, fontSize: 11}}>
                      {item.fees[`${carType}`]}x{availableHours[1]}
                    </Text>
                    </View>
                  </View>

                </TouchableOpacity>
              </View>
              
            </View>
          </TouchableWithoutFeedback>
        )
      }
    
     const renderParkings = () => {
        return ( 
          <FlatList
            horizontal={true} 
            vertical={false}
            pagingEnabled
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            snapToAlignment="center"
            style={styles.parkings}
            data={nearByParkings}
            extraData={state}
            keyExtractor={(item, index) => `${item.id}`}
            renderItem={({ item }) => renderParking(item)}
          />
        )
      }

      const populateHours = () =>{
        setState({
            ...state,
            hours: availableHours
        });
    }

   
      const populateVehicles = () =>{
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM vehicles',
            [],
            (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i){
                temp.push(results.rows.item(i));
              }

              myvehicles = [];
              for (let i = 0; i < temp.length; ++i){
                myvehicles.push(`${temp[i]['name']} - ${temp[i]['number']}`); // : ${temp[i]['name']}
              }
              if(myvehicles.length > 0){
                  setState({
                      ...state,
                      selectedVehicle: myvehicles[0],
                  });
              }
              setVehicleState(myvehicles);
            //   console.log("My vehicles", myvehicles);


              
            }
          );
        });
      }

    const renderVehicles = () => {
        return (

            <Dropdown
            defaultIndex={0}
            options={vehicles}
            style={styles.vehiclesDropdown}
            defaultValue={vehicles[0]}
            onSelect={(index, value) => handleVehicle(value)}
            renderRow={(option) => (
            <Text style={styles.hoursDropdownOption}>{option}</Text>
            )}
        />
        )
    }

    const openOrderInfoModal = (item) =>{
        setState({...state, activeModal: item });
        setIsModalVisible(true);
    }

    const handleVehicle = (selectedItem) => {
        setState({
            ...state,
            selectedVehicle: selectedItem,
         });
      }

      const renderCarTypes = () => {
        return (

            <Dropdown
            defaultIndex={0}
            options={carTypes}
            style={styles.carsDropdown}
            defaultValue={carTypes[0]}
            onSelect={(index, value) => onChangeCarType(value)}
            renderRow={(option) => (
            <Text style={styles.hoursDropdownOption}>{option}</Text>
            )}
        />
        )
    }

      const onChangeCarType = (selectedCarType) => 
      {
        ResetAmount();
        setCarType(selectedCarType);
      }



    const renderModal = () => {
        const {activeModal, hours} = state;

        if (!activeModal) return null;
        return(
            <Modal 
                backdropColor={theme.COLORS.overlay}
                style={styles.modalContainer}
                isVisible={isModalVisible}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                useNativeDriver
                onBackButtonPress={()=>setState({...state, activeModal:null})}
                onBackdropPress={()=>setState({...state, activeModal:null})} 
                swipeDirection="down"
                propagateSwipe
                onSwipeComplete={()=>
                    {
                        setIsModalVisible(false);
                        setState({...state, activeModal:null});
                 }}
              
                // style={{paddingHorizontal:0}}   
            >
                <ScrollView style={styles.modal}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        <Text style={{fontSize: theme.SIZES.font *1.4}}>
                            {activeModal.name}
                        </Text>
                    </View>
                    <View>
                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <FontAwesome name='times' size={30} color={theme.COLORS.gray}/>
                    </TouchableOpacity>
                    </View>
                    </View>

                    {/* <View style={{ marginTop:15, marginBottom:15 }}>
                        <Text style={{fontSize: 15, color:'#000', fontWeight:'bold'}}>PARKING AREA INFORMATION</Text>
                    </View> */}

                    <View style={{paddingVertical:theme.SIZES.base}}>
                        <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>
                            {activeModal.description}
                        </Text>
                    </View>

                    <View style={styles.modalInfo1}>
                        <View style={[styles.parkingIcon, {justifyContent: 'center'} ]}>
                            <FontAwesome name='clock-o' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                             {
                            activeModal.is_open
                             ? <Text style={{fontSize:theme.SIZES.icon*1.05, color: 'green', opacity:0.6}}> Open</Text>
                             :  <Text style={{fontSize:theme.SIZES.icon*1.05, color: 'red', opacity:0.6}}> Closed</Text>
                            
                            }
                        </View> 
                        <View style={[styles.parkingIcon, {justifyContent: 'flex-start'} ]}>
                            <FontAwesome name='star' size={theme.SIZES.icon*1.5} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                            <Text style={{fontSize:theme.SIZES.icon*1.15}}> {activeModal.rating}</Text>
                        </View>
                        <View style={[styles.parkingIcon, {justifyContent: 'flex-start'} ]}>
                            <FontAwesome name='road' size={theme.SIZES.icon*1.5} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                            <Text style={{fontSize:theme.SIZES.icon*1.15}}> {activeModal.distance}km</Text>
                        </View>
                        <View style={[styles.parkingIcon, {justifyContent: 'flex-start'} ]}>
                            <FontAwesome name='car' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                            <Text style={{fontSize:theme.SIZES.icon*1.15}}> {activeModal.free}/{activeModal.spots}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop:15, marginBottom:15  }}>
                        <Text style={{fontSize: 15, fontWeight:'bold', opacity:0.7}}>ORDER REQUEST INFORMATION</Text>
                    </View>

                    <View>
                        {/* <View style={styles.orderInfo}>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Names</Text>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>{profile.first_name} {profile.last_name}</Text>
                        </View>

                        <View style={styles.orderInfo}>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Telephone</Text>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>{profile.phone_number}</Text>
                        </View> */}

                
                        <View style={styles.orderInfo}>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Vehicle</Text>
                            <View style={styles.modalVehiclesDropdown}>
                                {renderVehicles()}
                                <Text style={{color:theme.COLORS.gray}}></Text>
                            </View>
                        </View>

                        <View style={styles.orderInfo}>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Car Type</Text>
                            <View style={styles.modalVehiclesDropdown}>
                                {renderCarTypes()}
                                <Text style={{color:theme.COLORS.gray}}></Text>
                            </View>
                        </View>


                         <View style={{flexDirection: 'column'}}>


                          <View style={[styles.orderInfo, {flexDirection: 'row'}]}>
                         <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Start Time</Text>
                         <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1, fontWeight:'bold'}}>{startTime}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={styles.modalVehiclesDropdown}>
                               <View  style={{width:110}}>
                               <Button title="Start time" onPress={showStartTimePicker} />
                               </View>
                                <DateTimePickerModal
                                    isVisible={isStartTimePickerVisible}
                                    mode="time"
                                    onConfirm={handleConfirmStartTime}
                                    onCancel={hideStartTimePicker}
                                />
                            </View>

                            </View>
                        </View>


                        <View style={[styles.orderInfo, {flexDirection: 'row'}]}>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>End Time</Text>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1, fontWeight:'bold'}}>{endTime}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={[styles.modalVehiclesDropdown, {marginLeft:10 }]}>
                               <View  style={{width:110}}>
                               <Button title="End time" onPress={showEndTimePicker} />
                               </View>
                                <DateTimePickerModal
                                    isVisible={isEndTimePickerVisible}
                                    mode="time"
                                    onConfirm={handleConfirmEndTime}
                                    onCancel={hideEndTimePicker}
                                />
                            </View>

                            </View>
                        </View>

                        </View>

                        <View style={styles.orderInfo}>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Amount</Text>
                            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.icon*1.15}}>
                                 {currency}.{activeModal.fees[`${carType}`]}
                             </Text>
                        </View>


                    </View>

                      
                             <TouchableOpacity style={[styles.payBtn,
                                 activeModal.is_open ? {backgroundColor: theme.COLORS.primary}: {backgroundColor: 'gray'}]} 
                                 disabled={activeModal.is_open ? false : true}
                                 onPress={submitRequest}
                                 >  
                                <Text style={styles.payText}> 
                                    {isReqProcessing ? <UIActivityIndicator color='#fff' /> : 'Submit Request' }
                                </Text>
                                <FontAwesome name='angle-right' size={theme.SIZES.icon*1.75} color={theme.COLORS.white} />
                            </TouchableOpacity> 

                            {/* <Button title="Submit Request" 
                            disabled={activeModal.is_open ? false : true}
                             onPress={() => submitRequest()}/> */}




                    </ScrollView>
            </Modal>
        )
    }
        // const {currentPosition, parkings} = props;
            return(
                <View style={styles.container}>
                    {renderHeader()}
                    <MapView 
                        initialRegion={region.currentPosition}
                        style={styles.map}
                        customMapStyle={mapStyles.brownStyle}
                    >

                           {/* <Marker 
                                key={`current-location-marker`}
                                coordinate={region.markerCoords}
                                title={'Current Location'}
                                description={`Your current location`}
                            >
                               <FontAwesome name='map-marker' size={theme.SIZES.icon*2.5} color={theme.COLORS.orange}/> 
                               <FontAwesome name='car' size={theme.SIZES.icon*1.8} color={theme.COLORS.orange}/> 

                            </Marker> */}
                        
                        {
                        nearByParkings.length > 0 ?
                          nearByParkings.map(parking =>(
                            <Marker 
                                key={`marker-${parking.id}`}
                                coordinate={parking.coordinate}
                                title={parking.name}
                                description={parking.description}
                                onPress={()=> openOrderInfoModal(parking)}
                            >
                                <TouchableOpacity onPress={()=> openOrderInfoModal(parking)} >
                                    <View style={[
                                        styles.marker,
                                        styles.shadow, 
                                        state.active === parking.id ? styles.active: null
                                    ]}>
                                        <Text style={[styles.markerStatus, {fontSize:9}]}>{currency} </Text>
                                        <Text style={styles.markerPrice}>{parking.fees[`${carType}`]}</Text>
                                        <Text style={[styles.markerStatus, {fontSize:11}]}>({parking.free}/{parking.spots})</Text>
                                    </View>
                                </TouchableOpacity>
                            </Marker>
                        ))
                        : null
                    }
                    </MapView>
                    

                    {
                        !isLoadingParkings? 
                           renderParkings()
                           :  <View style={[styles.parking, styles.shadow, {flexDirection: 'column',
                                        justifyContent:'center', alignItems: 'center',padding: 30}]}>
                               <UIActivityIndicator color='#FFA500' size={30} />
                                <Text style={{fontSize:18, color: '#C0C0C0', margin:15}}>Searching...</Text>
                               </View>
                    }


                    {renderModal()}
                </View>
            )
    
          }
ParkingMap.defaultProps={
    currentPosition:{
        latitude:0.353550,
        longitude:32.618591,
        latitudeDelta:0.0122,
        longitudeDelta:0.0121
    },
}

export default ParkingMap;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: theme.SIZES.base * 2,
        paddingTop: theme.SIZES.base * 1.0,
        paddingBottom: theme.SIZES.base * 1.5,
        height: Dimensions.get('screen').height*0.08,
    },
    headerTitle: {
        color: theme.COLORS.gray,
    },
    headerLocation: {
        fontSize: theme.SIZES.font,
        fontWeight: '500',
        paddingVertical: theme.SIZES.base / 3,
    },
    map: {
        flex: 3,
    },
    parkings: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        paddingBottom: theme.SIZES.base * 2,
    },
    parking: {
        flexDirection: 'row',
        backgroundColor: theme.COLORS.white,
        borderRadius: 6,
        padding: theme.SIZES.base,
        marginHorizontal: theme.SIZES.base * 2,
        width: width - (24 * 2),
    },
    buy: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: theme.SIZES.base * 1.5,
        paddingVertical: theme.SIZES.base,
        backgroundColor: theme.COLORS.primary,
        borderRadius: 6,
    },
    buyTotal: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    buyTotalPrice: {
        color: theme.COLORS.white,
        fontSize: theme.SIZES.base * 2,
        fontWeight: '600',
        paddingLeft: theme.SIZES.base / 4,
    },
    buyBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    marker: {
        flexDirection: 'row',
        backgroundColor: theme.COLORS.white,
        borderRadius: theme.SIZES.base * 2,
        paddingVertical: 12,
        paddingHorizontal: theme.SIZES.base * 2,
        borderWidth: 1,
        borderColor: theme.COLORS.white,
    },
    markerPrice: { color: theme.COLORS.red, fontWeight: 'bold', },
    markerStatus: { color: theme.COLORS.gray },
    shadow: {
    shadowColor: theme.COLORS.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    active: {
        borderColor: theme.COLORS.red,
    },
    hours: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: theme.SIZES.base / 2,
        justifyContent: 'space-evenly',
    },
    hoursTitle: {
        fontSize: theme.SIZES.text,
        fontWeight: '500',
    },
    hoursDropdown: {
        borderRadius: theme.SIZES.base / 2,
        borderColor: theme.COLORS.overlay,
        borderWidth: 1,
        padding: theme.SIZES.base,
        marginRight: theme.SIZES.base / 2,
    },
    vehiclesDropdown: {
        borderRadius: theme.SIZES.base / 2,
        borderColor: theme.COLORS.overlay,
        borderWidth: 1,
        padding: theme.SIZES.base,
        width:150,
    },
    carsDropdown: {
        borderRadius: theme.SIZES.base / 2,
        borderColor: theme.COLORS.overlay,
        borderWidth: 1,
        padding: theme.SIZES.base,
        width:150,
    },
    hoursDropdownOption: {
        padding: 5,
        fontSize: theme.SIZES.font * 0.8,
    },
    hoursDropdownStyle: {
        marginLeft: -theme.SIZES.base,
        paddingHorizontal: theme.SIZES.base / 2,
        marginVertical: -(theme.SIZES.base + 1),
    },
    parkingInfoContainer: { flex: 1.5, flexDirection: 'row' },
    parkingInfo: {
        justifyContent: 'space-evenly',
        marginHorizontal: theme.SIZES.base * 1.5,
    },
    parkingIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalContainer: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modal: {
        flexDirection: 'column',
        height: height * 0.85,
        padding: theme.SIZES.base * 2,
        backgroundColor: theme.COLORS.white,
        borderTopLeftRadius: theme.SIZES.base,
        borderTopRightRadius: theme.SIZES.base,
    },

   


    modalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: theme.SIZES.base,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: theme.COLORS.overlay,
        borderBottomColor: theme.COLORS.overlay,
    },

    modalInfo1: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: theme.SIZES.base,
    },


    orderInfo:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.SIZES.base* 1.5,
        borderTopWidth: 0.7,



    },
    modalHours: {
        paddingVertical: height * 0.11,
    
    },
    modalHoursDropdown: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.SIZES.base,
    },
    modalVehiclesDropdown: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingVertical: theme.SIZES.base,
    },
    payBtn: {
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: theme.SIZES.base * 1.1,
        fontWeight:'bold',
        // marginBottom: 30,
    },
    payText: {
        fontWeight: '600',
        fontSize: theme.SIZES.base * 1.5,
        color: theme.COLORS.white,
        textAlign: 'center',
    },
    directionsText: {
        fontWeight: '200',
        fontSize: theme.SIZES.base * 1.15,
        color: '#000', // theme.COLORS.white,
        fontWeight: 'bold',
        opacity:0.7,
    },
    directionsBtn: {
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#fff', // theme.COLORS.primary,
        fontWeight:'bold',
        borderColor: '#ffa500',
        borderWidth:1,
        // marginBottom: 30,
    },
    dropdown1BtnStyle: {
        width: "80%",
        height: 50,
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#444",
      },
      dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
      dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
      dropdown1RowStyle: {
        backgroundColor: "#EFEFEF",
        borderBottomColor: "#C5C5C5",
      },
      setTimeBtn: {
        backgroundColor: design.colors.success,
        alignItems: 'center',
        padding:10,
        borderRadius:40, 
    },
      dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
    
});
