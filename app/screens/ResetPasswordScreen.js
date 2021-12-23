import React, {useState, useEffect} from 'react';
import { 
    View, 
    Text, 
    Alert,
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { customerActions } from '../redux/actions/customer.actions';
import { connect } from 'react-redux';
import {FlutterwaveButton} from 'flutterwave-react-native'
import design from '../../assets/css/styles';

// import Service from '../actions/index';


const initialProfileState = {
    userId: '',
    name: '',
    firstname: '',
    lastname: '',
    username: '',
    phoneNo: '',
    email: '',
  }

const ResetPasswordScreen = (props) => {
    
    const initialState = {
        first_name: '',
        last_name:'',
        phone_number:'',
        password: '',
        
        confirm_password: '',
        registrationResponse: '',
        check_firstNameChange: false,
        check_lastNameInputChange:false,
        check_phoneNoInputChange: false,
        isValidPhone: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidForm: null,
        formMessage: null,
        
    }
    
    const [state, setData] = useState(initialState);
    const [profile, setProfile] = useState(initialProfileState);



    useEffect(() => {
        let isMounted = true;
        if(isMounted) {
          getProfile(profile);
        }
        return () => { isMounted = false };
      }, []);

      const getProfile = async() => {
        try{
            const user_id = profile.user_id;
            const first_name = profile.first_name;
            const last_name = profile.last_name;
            const name = (first_name && last_name) ? first_name + " " + last_name : '';
            const phone_number = profile.phone_number;
            const email = profile.email;
            
            setProfile({
              ...state,
              userId: user_id,
              name: name,
              firstname: first_name,
              lastname: last_name,
              phoneNo: phone_number,
              email: email,
            });
          }catch(e){
            console.log("Error on async storage", e);
          }
      }
    
    
    const handleFirstNameInputChange = (val) => {
        if( val.length >= 3 ) {
            setData({
                ...state,
                first_name: val,
                check_firstNameChange: true
            });
        } else {
            setData({
                ...state,
                first_name: val,
                check_firstNameChange: false
            });
        }
    }
    
    const handleLastNameInputChange = (val) => {
        if( val.length >= 3 ) {
            setData({
                ...state,
                last_name: val,
                check_lastNameInputChange: true
            });
        } else {
            setData({
                ...state,
                last_name: val,
                check_lastNameInputChange: false
            });
        }
    }
    
    const handlePhoneNumberInputChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...state,
                phone_number: val,
                check_phoneNoInputChange: true
            });
        } else {
            setData({
                ...state,
                phone_number: val,
                check_phoneNoInputChange: false
            });
        }
    }
    
    const handleValidPhone = (phoneNo) =>{
        if(phoneNo.trim() >= 10){
            setData({
                ...state,
                isValidPhone: true,
                check_phoneNoInputChange: true
            });
        }else{
            setData({
                ...state,
                isValidPhone: false,
                check_phoneNoInputChange: false
            });
        }
    }
    
    
    const handlePasswordChange = (val) => {
        setData({
            ...state,
            password: val
        });
    }
    
    const handleConfirmPasswordChange = (val) => {
        setData({
            ...state,
            confirm_password: val
        });
    }
    
    const updateSecureTextEntry = () => {
        setData({
            ...state,
            secureTextEntry: !state.secureTextEntry
        });
    }
    
    const updateConfirmSecureTextEntry = () => {
        setData({
            ...state,
            confirm_secureTextEntry: !state.confirm_secureTextEntry
        });
    }
    
    const handleCustomerRegistration = async() =>{
        let first_name = state.first_name;
        let last_name = state.last_name;
        let phone_number = state.phone_number;
        let password = state.password;
        if(first_name && last_name && phone_number && password){
            let body = {
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
                password: password
            }

           props.register(body).then(res => {
              console.log("Results for signup are", res);
            }).catch(error => { console.log("Error in catch while registering user", error) });


            // await Service.registerCustomer(body).then(resp => {
            //     let statusCode = resp.statusCode;
            //     let message = resp.message;
            //     console.log("StatusCode is", statusCode);
            //     console.log("Message is", message);
            //     if(statusCode == 1){
            //         let respData = resp.data;
            //         console.log("Data is", respData);
            //         setData(initialState);
            //         props.navigation.navigate('Signin');    
            //         Alert.alert("Signup Success", message);
            //     }else{
            //         setData({
            //             ...state,
            //             isValidUser: false,
            //             formMessage: message,
            //         });
            //         Alert.alert("Signup Error", message);
            //     }
            // }).catch(error => { console.log("Error in signin catch is " + error) });

            
        }else{
            Alert.alert("Signup Error", 'Fill in all form fields to sign up');
        }
    }
    
    return (
        <View style={styles.container}>

        <StatusBar backgroundColor='#273746' barStyle="light-content"/>

        <View style={styles.header}>
        <Text style={styles.text_header}>Reset Password</Text>
        </View>


        <Animatable.View 
        animation="fadeInUpBig"
        style={styles.footer}
        >
        
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
        <FontAwesome 
        name="envelope"
        color="#05375a"
        size={20}
        />
        <TextInput 
        placeholder="Enter your email address"
        style={styles.textInput}
        autoCapitalize="none"
        value={state.first_name}
        onChangeText={(val) => handleFirstNameInputChange(val)}
        />
        
        {state.check_firstNameChange ? 
            <Animatable.View
            animation="bounceIn"
            >
            <Feather 
            name="check-circle"
            color="green"
            size={20}
            />
            </Animatable.View>
            : null}
            </View>
            
                <View style={styles.button}>
                <TouchableOpacity
                style={styles.signIn}
                onPress={handleCustomerRegistration}
                >
                <LinearGradient
                colors={['#273746', '#01ab9d']}
                style={styles.signIn}
                >
                <Text style={[styles.textSign, {
                    color:'#fff'
                }]}>Submit</Text>
                </LinearGradient>
                </TouchableOpacity>
                
                </View>

                <TouchableOpacity
            
            onPress={() => props.navigation.goBack()}
            style={[styles.signIn, {
                borderColor: '#273746',
                borderWidth: 1,
                marginTop: 15,
                
            }]}
            >
         <Text style={[styles.textSign, {
                    color: '#273746',
                    textTransform: 'uppercase',
                }]}>
            <FontAwesome 
        name="arrow-left"
        color="#05375a"
        size={20}
        /> Back</Text>
            </TouchableOpacity>

            
                </Animatable.View>
                </View>
                );
                
            };
            
            const mapStateToProps = state => {
                const {customer} = state;
                return {customer};
            };
            
            const mapDispatchToProps = {
                register: customerActions.register,
                logout: customerActions.logout
            };
            
    
        export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordScreen)
            
            const styles = StyleSheet.create({
                container: {
                    flex: 1, 
                    backgroundColor: design.colors.primary
                },
                header: {
                    flex: 1,
                    justifyContent: 'flex-end',
                    paddingHorizontal: 20,
                    paddingBottom: 50,
                    backgroundColor: design.colors.primary
                },
                footer: {
                    flex: Platform.OS === 'ios' ? 3 : 5,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingHorizontal: 20,
                    paddingVertical: 30
                },
                text_header: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 30
                },
                text_footer: {
                    color: '#05375a',
                    fontSize: 16
                },
                action: {
                    flexDirection: 'row',
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f2f2f2',
                    paddingBottom: 5
                },
                textInput: {
                    flex: 1,
                    marginTop: Platform.OS === 'ios' ? 0 : -12,
                    paddingLeft: 10,
                    color: '#05375a',
                    fontSize: 16,
                },
                button: {
                    alignItems: 'center',
                    marginTop:50,
                },
                signIn: {
                    width: '100%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    margin:5,
                    
                },
                textSign: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                textPrivate: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 20
                },
                color_textPrivate: {
                    color: 'grey'
                },
                errorMsg: {
                    color: '#FF0000',
                    fontSize: 16,
                },
            });