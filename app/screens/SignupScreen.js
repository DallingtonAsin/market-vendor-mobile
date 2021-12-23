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
import { AuthContext } from '../context/context';
import { UIActivityIndicator } from 'react-native-indicators';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
// import Service from '../actions/index';

const SignupScreen = (props) => {

    const phoneRef = React.useRef();
    const minPhoneChars = 10;
    const minPasswordLength = 8;

    let countryPicker = React.createRef(null);
    let phone = React.createRef(null);
    
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
        isValidPassword: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidForm: null,
        formMessage: null,
        cca2: null,
        
    }
    
    const [state, setData] = useState(initialState);
    const { signUp } = React.useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    
    
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
        if(phoneNo.trim() >= minPhoneChars){
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

    const onPressFlag = () => {
        countryPicker.openModal()
    }

    const validateStr = (str, length) => {
        if(str.length >= length){
          return true;
         }  else{
         return false;
         }
    }

    const onPhoneInputChange = (val, iso2) => {

        if(validateStr(val.trim(), minPhoneChars)) {
            setData({
                ...state,
                phone_number: val,
                isValidPhone: true
            });
        } else {
            setData({
                ...state,
                phone_number: val,
                isValidPhone: false
            });
        }

        if (iso2) {
            setData({
                ...state,
                countryCode: iso2?.toUpperCase(),
            });
        }
    }

    const handlePasswordInput = (val) => {
        if(validateStr(val.trim(), minPasswordLength)) {
            setData({
                ...state,
                password:val,
                isValidPassword: true
            });
        } else {
            setData({
                ...state,
                password: val,
                isValidPassword: false
            });
        }
    }

    const selectCountry = (country) => {
        phone.selectCountry(country.cca2.toLowerCase())
        setData({
            ...state,
            cca2: country.cca2
          });
    }
    
    const handleCustomerRegistration = async() =>{
        const first_name = state.first_name;
        const last_name = state.last_name;
        const phone_number = state.phone_number;
        const password = state.password;
        const confirm_password = state.confirm_password;
        if(first_name && last_name && phone_number && password && confirm_password) {
            if(password == confirm_password){
                const reqParams = {
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    password: password,
                    confirm_password: confirm_password,
                }
                setIsLoading(true);
                
                let response = await signUp(reqParams);
                let message = response.message
                let statusCode = response.statusCode;
                setIsLoading(false);
                if(statusCode == 0){
                    Alert.alert("Message", "Registration failed! "+message+"");
                }
            }else{
            Alert.alert("Message", 'Enter matching passwords to register');
            }
        
        }else{
            Alert.alert("Registration Error", 'Fill in all form fields to register');
        }
    }
    
    return (
        <View style={styles.container}>
        <StatusBar backgroundColor='#273746' barStyle="light-content"/>
        <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
        animation="fadeInUpBig"
        style={styles.footer}
        >
        <ScrollView>
        

        
        <Text style={styles.text_footer}>First Name</Text>
        <View style={styles.action}>
        <FontAwesome 
        name="user-o"
        color="#05375a"
        size={20}
        />
        <TextInput 
        placeholder="First Name"
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
            
            <Text style={[styles.text_footer, {marginTop: 15}]}>Last Name</Text>
            <View style={styles.action}>
            <FontAwesome 
            name="user-o"
            color="#05375a"
            size={20}
            />
            <TextInput 
            placeholder="Last Name"
            style={styles.textInput}
            autoCapitalize="none"
            value={state.last_name}
            onChangeText={(val) => handleLastNameInputChange(val)}
            />
            
            {state.check_lastNameInputChange ? 
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
                
                <Text style={[styles.text_footer, {marginTop: 15}]}>Phone Number</Text>

                <PhoneInput
                ref={node => { phone = node; }}
                onPressFlag={onPressFlag}
                initialCountry={'ug'}
                // initialValue="13178675309"
                onChangePhoneNumber={(val) => onPhoneInputChange(val)}
                textProps={{
                    placeholder: 'Enter phone number...'
                }}
            />

             <CountryPicker
                ref={node => { countryPicker = node; }}
                onChange={(value)=> selectCountry(value)}
                translation='eng'
                cca2={state.cca2}
            >
                <View></View>
            </CountryPicker>



                {/* <PhoneInput ref={phoneRef}/> */}

                {/* <View style={styles.action}>
                <FontAwesome 
                name="phone"
                color="#05375a"
                size={20}
                />
                <TextInput 
                placeholder="Phone Number"
                style={styles.textInput}
                autoCapitalize="none"
                value={state.phone_number}
                keyboardType='numeric'
                 maxLength={10}
                onChangeText={(val) => handlePhoneNumberInputChange(val)}
                />
                
                {state.isValidPhone ? 
                    <Animatable.View
                    animation="bounceIn"
                    >
                    <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                    />
                    </Animatable.View>
                    : null
                }
                </View> */}
                
                
                
                <Text style={[styles.text_footer, {
                    marginTop: 15
                }]}>Password</Text>
                
                <View style={styles.action}>
                <Feather 
                name="lock"
                color="#05375a"
                size={20}
                />
                <TextInput 
                placeholder="Password"
                secureTextEntry={state.secureTextEntry}
                style={styles.textInput}
                autoCapitalize="none"
                value={state.password}
                onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                onPress={updateSecureTextEntry}
                >
                {state.secureTextEntry ? 
                    <Feather 
                    name="eye-off"
                    color="grey"
                    size={20}
                    />
                    :
                    <Feather 
                    name="eye"
                    color="grey"
                    size={20}
                    />
                }
                </TouchableOpacity>
                </View>
                
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Confirm Password</Text>
                    <View style={styles.action}>
                    <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                    />
                    <TextInput 
                    placeholder="Confirm Your Password"
                    secureTextEntry={state.confirm_secureTextEntry}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                    />
                    <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                    >
                    {state.confirm_secureTextEntry ? 
                        <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                        />
                        :
                        <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                        />
                    }
                    </TouchableOpacity>
                </View>
                
                <View>
                { state.isValidForm === false ? 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    { state.formMessage ?   <Text style={styles.errorMsg}>{state.formMessage}</Text>  : null }
                    </Animatable.View>
                    : null
                }
                {state.registrationResponse != null ?
                    <Text style={{color:'green'}}>{state.registrationResponse}</Text>
                    : null
                }
                </View>
                <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                By signing up you agree to our
                </Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
                <Text style={styles.color_textPrivate}>{" "}and</Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
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
                    color:'#fff',
                    textTransform: 'uppercase',
                }]}>
                    {isLoading ? <UIActivityIndicator color='white' /> : 'Register' } 
                </Text>
                </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                style={[styles.signIn, {
                    borderColor: '#273746',
                    borderWidth: 1,
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
                </View>
                </ScrollView>
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
            
            //  export default SignupScreen;
            
            export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
            
            
            
            const styles = StyleSheet.create({
                container: {
                    flex: 1, 
                    backgroundColor: '#273746'
                },
                header: {
                    flex: 1,
                    justifyContent: 'flex-end',
                    paddingHorizontal: 20,
                    paddingBottom: 30
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
                    fontSize: 15,
                },
                button: {
                    alignItems: 'center',
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