import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Text,
    // TextInput,
    View,
    Alert,
    TouchableOpacity,
    Platform,
    Dimensions,
    Button,
    Pressable,
} from 'react-native';
    import Icon from 'react-native-vector-icons/FontAwesome5';
    import SearchableDropdown from 'react-native-searchable-dropdown';
    import DateTimePicker from '@react-native-community/datetimepicker';
    import MainService from '../redux/services/main.service';
    import { Menu, Divider  } from 'react-native-paper';
    import design from '../../assets/css/styles';
    import CustomLoader from '../components/CustomActivityIndicator';
    import AwesomeAlert from 'react-native-awesome-alerts';
    import FlashMessage, {showMessage, hideMessage} from "react-native-flash-message";
    import { TextInput } from 'react-native-paper';
    
    
    const initialState = {
        parking_area : '',
        parking_spot: '',
        vehicle_number: 'UAG566',
        mobile_number: '0774014727',
        amount: '',
        client_id: '',
        parking_area_id: null,
        start_time: '',
        end_time : '',
        items: [],
        parking_spots: [],
    }
    
    
    const RequestParkingScreen = () => {
        
        const [selectedParkingArea, setParkingArea] = useState();
        const [selectedParkingSpot, setParkingSpot] = useState();
        
        const [date, setDate] = useState(new Date());
        
        const [mode, setMode] = useState('date');
        const [mode1, setMode1] = useState('date');
        
        const [show, setShow] = useState(false);
        const [show1, setShow1] = useState(false);
        
        
        const [state, setStateData] = useState(initialState);
        const [isSubmiting, setIsSubmiting] = useState(false);
        const [showAlert, setAlert] = useState(false);
        const [isRequestProcessed, setRequestProcessed] = useState(false);

        
       const showPopUp = () => {
           setAlert(true);
          };
        
         const hideAlert = () => {
            setAlert(false);
            setIsSubmiting(false);
          };
        
        const onStartTimeChange = (event, selectedDate) => {
            let start_time = getTime(selectedDate);
            setStateData({
                ...state,
                start_time : start_time,
            });
            setShow(false);
            
        };
        
        const onEndTimeChange = (event, selectedDate) => {
            let end_time = getTime(selectedDate);
            setStateData({
                ...state,
                end_time : end_time,
            });
            setShow1(false);
        };
        
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
        
        const showMode = (currentMode) => {
            setShow(true);
            setMode(currentMode);
        };
        
        const showMode1 = (currentMode) => {
            setShow1(true);
            setMode1(currentMode);
        };
        
        const showTimepicker1 = () => {
            showMode('time');
        };
        
        const showTimepicker2 = () => {
            showMode1('time');
        };
        
        function diff(start, end) {
            start = start.split(":");
            end = end.split(":");
            var startDate = new Date(0, 0, 0, start[0], start[1], 0);
            var endDate = new Date(0, 0, 0, end[0], end[1], 0);
            var diff = endDate.getTime() - startDate.getTime();
            var hours = Math.floor(diff / 1000 / 60 / 60);
            diff -= hours * 1000 * 60 * 60;
            var minutes = Math.floor(diff / 1000 / 60);
            
            // If using time pickers with 24 hours format, add the below line get exact hours
            if (hours < 0){
                hours = hours + 24;
            }
            
            // let diff = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
            const totl_in_minutes = hours*60 + minutes;
            const totl_in_hours = totl_in_minutes/60;
            return totl_in_hours;
        }
       
        const [visible, setVisible] = React.useState(false);
        
        const openMenu = () => setVisible(true);
        
        const closeMenu = () => setVisible(false);
        
        const populateParkingInfo= async(area) => {
            setParkingSpot(area);
            console.log("parking area id is", area.id);
            setStateData({
                ...state,
                parking_area_id: area.id,
            });
        }
        
        const populateParkingSpots = async(client) => {
            console.log("Client details", client);
            setParkingArea(client);
            const client_id = client.id;
            console.log("Client id is", client_id);
            setStateData({
                ...state,
                client_id: client_id,
            });
            await MainService.fetchParkingSpots(client).then(res => {
                console.log("Response for parking areas when requesting for parking spots is", res.data);
              
                setStateData({
                    ...state,
                    parking_spots : res.data,
                });
            }).catch(error => {
                setIsSubmiting(false);
                Alert.alert("Error", "Error in fetching parking spots: " + error);
                });
        }
        
        const getParkingAreas = async() => {
            await MainService.fetchParkingClients().then(res => {
                console.log("Response for parking areas/clients when requetsing for parking is", res.data);
                setStateData({
                    ...state,
                    items : res.data,
                });
            }).catch(error => { 
                setIsSubmiting(false);
                Alert.alert("Error", "Error in fetching parking areas: " + error);
             });
        }

        const submitParkingRequest = async() => {


            const mobile_number = state.mobile_number;
            const vehicle_number = state.vehicle_number;
            const client_id = 5; // state.client_id;
            const parking_area_id = 1; // state.parking_area_id;
            const start_time = state.start_time;
            const end_time = state.end_time;
            const hours = diff(start_time, end_time);
            const vehicle_type_id = 1;

            if(mobile_number && vehicle_number && client_id
                 && parking_area_id && start_time && end_time
                  && hours && vehicle_type_id) { 
                    const reqParams = {
                        telephone_no: mobile_number,
                        vehicle_number: vehicle_number,
                        client_id: client_id, 
                        parking_area_id: parking_area_id,
                        start_time: start_time,
                        end_time: end_time,
                        parking_hours: hours,
                        vehicle_type_id: vehicle_type_id,
                    }
                    
                    console.log("Sending this data to api level 1", reqParams);
                    setIsSubmiting(true);
                    showPopUp(true);
                    
                    await MainService.postParkingRequest(reqParams).then(res => {
                        console.log("Response for submiting parking request", res);
                        console.log("status code", res.statusCode);
                        console.log("Message", res.message);
                        setTimeout(() => setIsSubmiting(false), 2000);
                        // setIsSubmiting(false);
                        showPopUp(false);
                        setRequestProcessed(true);
        
                        if(!isSubmiting) {
                            const statusCode = res.statusCode;
                            const message = res.message;
            
                            if(statusCode == 1){
                                setStateData({
                                    parking_area : '',
                                    parking_spot: '',
                                    vehicle_number: 'UAG566',
                                    mobile_number: '0774014727',
                                    amount: '0',
                                    client_id: '',
                                    parking_area_id: null,
                                    start_time: '',
                                    end_time : '',
                                });
                                Notification("success", message);

                                // const initialState = {
                                //     parking_area : '',
                                //     parking_spot: '',
                                //     vehicle_number: 'UAG566',
                                //     mobile_number: '0774014727',
                                //     amount: '8000',
                                //     client_id: '',
                                //     parking_area_id: null,
                                //     start_time: '',
                                //     end_time : '',
                                //     items: [],
                                //     parking_spots: [],
                                // }

                            }else{
                                Alert.alert("Error", message);
                                // Notification("danger", message);
                            }
                        }
                        
        
                    }).catch(error => { 
                        Alert.alert("Error", "Error in processing request: " + error);
                     });
            }else{
                setIsSubmiting(false);
               Alert.alert("Alert Message", "Please fill in missing information");
            }
        }


        const Notification = (message_type, message) => {
                showMessage({
                    message: message,
                    // description: message,
                    type: message_type,
                  });
        }
        
        useEffect(() => {
            getParkingAreas();
        }, []);
        
        return (
            <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>

                <FlashMessage position="top" duration={7000} floating={true}/>
               
                {
                    isSubmiting ? 
                    <AwesomeAlert
                    show={showAlert}
                    showProgress={true}
                    // title="Submiting..."
                    message="Request processing..."
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={false}
                    progressColor={"grey"}
                    progressSize={30}
                    // customView={<AlertInfo/>}
                    cancelText="Cancel"
                    confirmText="Yes, delete it"
                    confirmButtonColor="#DD6B55"
                    cancelButtonColor="#FF0000"
                    onCancelPressed={() => {
                      hideAlert();
                    }}
                    onConfirmPressed={() => {
                      hideAlert();
                    }}
                  />
                        : null
                }


            <View style={[styles.container, {  marginBottom:60 }]} contentContainerStyle={{marginBottom:60}}>
            <Text style={styles.titleText}>
            SUBMIT PARKING REQUEST
            </Text>
            <Text style={styles.headingText}>
            Parking Area
            </Text>

            
            <SearchableDropdown
            onTextChange={(text) => console.log(text)}
            selectedItems={selectedParkingArea}
            onItemSelect={(area) => populateParkingSpots(area)}
            containerStyle={{padding: 5}}
            textInputStyle={styles.input}
            itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: '#FAF9F8',
                borderColor: '#bbb',
                borderWidth: 1,
            }}
            itemTextStyle={{
                color: '#222',
            }}
            itemsContainerStyle={{
                maxHeight: '60%',
            }}
            items={state.items}
            defaultIndex={2}
            placeholder="Parking area"
            resPtValue={false}
            underlineColorAndroid="transparent"
            />
            <Text style={styles.headingText}>
            Section under parking area
            </Text>
            <SearchableDropdown
            onTextChange={(text) => console.log(text)}
            selectedItems={selectedParkingSpot}
            onItemSelect={(spot) => populateParkingInfo(spot)}
            containerStyle={{padding: 5}}
            textInputStyle={styles.input}
            itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: '#FAF9F8',
                borderColor: '#bbb',
                borderWidth: 1,
            }}
            itemTextStyle={{
                color: '#222',
            }}
            itemsContainerStyle={{
                maxHeight: '50%',
            }}
            items={state.parking_spots}
            defaultIndex={2}
            placeholder="Parking spot"
            resetValue={false}
            underlineColorAndroid="transparent"
            />

<View style={styles.fieldView}>
{/* <Text style={{marginBottom:10}}> Mobile number</Text> */}
<TextInput
  mode="flat"
  label="Mobile number"
  style={styles.input}
  placeholder={state.mobile_number}
  editable={false} 
  selectTextOnFocus={false}/>         
</View>

<View style={styles.fieldView}>
{/* <Text style={{marginBottom:10}}>Vehicle number</Text> */}
<TextInput 
 mode="flat"
 label="Vehicle number"
 style={styles.input}
 placeholder={state.vehicle_number}/>          
</View>

<View style={styles.fieldView}>
{/* <Text style={{marginBottom:10}}> Amount</Text> */}
<TextInput
 mode="flat"
 label="Amount"
 style={styles.input}
 placeholder="0"
 editable={false}
 selectTextOnFocus={false}
  value={state.amount}/>     
</View>

 {show ?
            <DateTimePicker
            testID="startTimePicker"
            value={date}
            mode={mode}
            is24Hour={false}
            display="default"
            onChange={onStartTimeChange}
            /> : null
        }
        
        {show1 ? (
            <DateTimePicker
            testID="endTimePicker"
            value={date}
            mode={mode1}
            is24Hour={false}
            display="default"
            onChange={onEndTimeChange}
            />
            ): null}
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', margin:20}}>
            <View style={{width:140, height:80}}>
            <Text style={{fontSize:16}}>Start time: {state.start_time}</Text>
            <TouchableOpacity onPress={ showTimepicker1} style={styles.setTimeBtn}>
            <Text style={{color:'#fff'}}>SET</Text>
            </TouchableOpacity>
            </View>
            <View style={{width:140, height:80}}>
            <Text style={{fontSize:16}}>End time: {state.end_time}</Text>
            <TouchableOpacity onPress={ showTimepicker2} style={styles.setTimeBtn}>
            <Text style={{color:'#fff'}}>SET</Text>
            </TouchableOpacity>
            </View>
            </View>
            
            <TouchableOpacity style={styles.signIn} onPress={submitParkingRequest}>
            <Text style={{ color:'#fff' }}>Submit Request</Text>
            </TouchableOpacity>
            
            
        
         

           </View>
           </View>
            </SafeAreaView>
            );
        };
        
        export default RequestParkingScreen;
        
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
                padding: 10,
                borderWidth:1,
                borderColor: '#e2e2e2',
                borderRadius:10,
                // marginBottom:40
            },
            titleText: {
                padding: 8,
                fontSize: 16,
                textAlign: 'center',
                fontWeight: 'bold',
            },
            headingText: {
                padding: 8,
            },
            fieldView: {
                maxHeight: '50%',
                marginTop: 10,
            },
            setTimeBtn: {
                backgroundColor: design.colors.success,
                alignItems: 'center',
                padding:10,
                borderRadius:40,
                // margin:5,
                
            },
            titleText: {
                padding: 8,
                fontSize: 16,
                textAlign: 'center',
                fontWeight: 'bold',
                textTransform: 'uppercase',
            },
            signIn: {
                width: '100%',
                padding: 15,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 30,
                backgroundColor: design.colors.primary,
            },
            input: {
                borderWidth: 1,
                borderRadius:5,
                borderColor: 'lightblue',
                backgroundColor: '#fff', // '#FAF7F6',
                color: '#000',
                // ...Platform.select({
                //     android: {
                //         height:40,
                //     }
                // })
            },
        });