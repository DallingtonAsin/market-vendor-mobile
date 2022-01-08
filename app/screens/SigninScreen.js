import React, {useState, useRef} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme, Checkbox  } from 'react-native-paper';
import { AuthContext } from '../context/context';
import design from '../../assets/css/styles';
import { UIActivityIndicator } from 'react-native-indicators';
import PhoneInput from "react-native-phone-number-input";

const initialState =  {
    phone_number: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidPhoneNumber: null,
    isValidPassword: null,
    isValidUser: null,
    isValidForm: null,
    formMessage: null,
    cca2: '',
    countryCode: '',
    phoneNumber: '',
}

const SigninScreen = ({ navigation }) => {
    
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    let countryPicker = React.createRef(null);
    let phone = React.createRef(null);

    const phoneInput = useRef(null);
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    
    const [data, setData] = useState(initialState);
    const [checked, setChecked] = useState(true);

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
      }

    const { signIn } = React.useContext(AuthContext);
    const minPhoneChars = 13;
    const minPasswordLength = 8;

    const selectCountry = (country) => {
        phone.selectCountry(country.cca2.toLowerCase())
        setData({
            ...data,
            cca2: country.cca2
          });
    }

    const onPressFlag = () => {
        countryPicker.openModal()
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const validateStr = (str, length) => {
        if(str.length >= length){
          return true;
         }  else{
         return false;
         }
    }

    const onPhoneInputChange = (val) => {

        if(validateStr(val.trim(), minPhoneChars)) {
            setData({
                ...data,
                phone_number: val,
                isValidPhoneNumber: true
            });
        } else {
            setData({
                ...data,
                phone_number: val,
                isValidPhoneNumber: false
            });
        }

     
    }

    const handlePasswordInput = (val) => {
        if(validateStr(val.trim(), minPasswordLength)) {
            setData({
                ...data,
                password:val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const loginHandler = () => {
        let isMounted = true;
        const userPhoneNo = data.phone_number.trim();
        const userPassword = data.password.trim();
        if(userPhoneNo && userPassword) {
            if(validateStr(userPhoneNo, minPhoneChars)){
                if(validateStr(userPassword, minPasswordLength)) {
                      setIsLoading(true);
                      signIn(userPhoneNo, userPassword).then((response) => {
                        let message = response.message
                        let statusCode = response.statusCode;
                        setIsLoading(false);
                        if(statusCode == 0){
                            Alert.alert("Message", message);
                        }
                    });
                    return () => { isMounted = false };
                    
                }else{
                    Alert.alert("Message", "Please check length of your password");
                }
            }else{
                Alert.alert("Message", "Please check length of your phone number");
            }
        }else{
            Alert.alert("Message", "Please enter login details");
        }
    }
    


    return (
        
        <>
        
        <View style={styles.container}>
        <StatusBar backgroundColor='#273746' barStyle="light-content"/>
        <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
        </View>

    


        <Animatable.View 
        animation="fadeInUpBig"
        style={[styles.footer, {
            backgroundColor: colors.background
        }]}
        >



        <Text style={[styles.text_footer, {
            color: colors.text
        }]}>Phone Number</Text>
        <View style={styles.action2}>


<PhoneInput
           ref={phoneInput}
           defaultValue={value}
           defaultCode="UG"
           layout="first"
           onChangeText={(text) => {
             setValue(text);
           }}
           onChangeFormattedText={(text) => {
            onPhoneInputChange(text);
           }}
           countryPickerProps={{ withAlphaFilter: true }}
           withShadow
           autoFocus
         />


        {data.check_textInputChange ? 
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
            
            
            
            { data.isValidPhoneNumber === false ? 
                <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Phone number must be at least {minPhoneChars} characters long.</Text>
                </Animatable.View>
                : null
            }
            
            
            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 10
            }]}>Password</Text>
            <View style={styles.action}>
            <Feather 
            name="lock"
            color={colors.text}
            size={20}
            />
            <TextInput 
            placeholder="Password"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[styles.textInput, {
                color: colors.text
            }]}
            value={data.password}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordInput(val)}
            />
            <TouchableOpacity
            onPress={updateSecureTextEntry}
            >
            {data.secureTextEntry ? 
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
            { data.isValidPassword === false ?  
                <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Password must be {minPasswordLength} characters long.</Text>
                </Animatable.View>
                : null
            }

                <View style={[styles.action, {justifyContent:'space-between'}]}>

                    <View style={{flexDirection: 'row'}}>
                   <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    color={design.colors.primary}
                    testID={"Stay signed in"}
                    onPress={() => {
                        setChecked(!checked);
                    }}
                    /><Text style={{marginTop:8}}>Remember me</Text>
                    </View>

                        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                        <Text style={{color: '#009387', marginTop:10}}>Forgot password?</Text>
                        </TouchableOpacity>
                </View>
                
            
          
            
            { data.isValidUser === false ? 
                <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Incorrect login credentials.</Text>
                </Animatable.View>
                : null
            }
            
            { data.isValidForm === false ? 
                <Animatable.View animation="fadeInLeft" duration={500}>
                { data.formMessage ?   <Text style={styles.errorMsg}>{data.formMessage}</Text>  : null }
                </Animatable.View>
                : null
            }
            
            
            <View style={styles.button}>
            <TouchableOpacity 
                            style={styles.signIn}
            //  onPress={() => navigation.navigate('Home')}
            onPress={loginHandler}
            >
            <LinearGradient
            colors={['#273746', '#01ab9d']}
            style={styles.signIn}
            >
            <Text style={[styles.textSign, {
                color:'#fff',
                textTransform: 'uppercase',
            }]}>
               {isLoading ? <UIActivityIndicator color='white' /> : 'Login' } 
                </Text>
            </LinearGradient>
            </TouchableOpacity>

            
            
            <TouchableOpacity
            
            onPress={() => navigation.navigate('PhoneNumber')}
            style={[styles.signIn, {
                borderColor: '#273746',
                borderWidth: 1,
                marginTop: 15
            }]}
            >
            <Text style={[styles.textSign, {
                color: '#273746',
                textTransform: 'uppercase',
            }]}>Register</Text>
            </TouchableOpacity>
            </View>
            </Animatable.View>
            
            </View>
    
            </>
            );
}
        
        export default SigninScreen

        const styles = StyleSheet.create({
            container: {
                flex: 1, 
                backgroundColor: '#273746'
            },
            header: {
                flex: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: 20,
                paddingBottom: 50
            },
            footer: {
                flex: 3,
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
                fontSize: 16,
                fontWeight: 'bold',
                opacity:0.7,
            },
            action: {
                flexDirection: 'row',
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#f2f2f2',
                paddingBottom: 5
            },
            action2: {
                // flexDirection: 'space-between',
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#f2f2f2',
                paddingBottom: 5
            },
            actionError: {
                flexDirection: 'row',
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#FF0000',
                paddingBottom: 5
            },
            textInput: {
                flex: 1,
                marginTop: Platform.OS === 'ios' ? 0 : -12,
                paddingLeft: 10,
                color: '#05375a',
                fontSize: 16,
            },
            errorMsg: {
                color: '#FF0000',
                fontSize: 14,
            },
            button: {
                alignItems: 'center',
                marginTop: 40
            },
            signIn: {
                width: '100%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
            },
            textSign: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        });
        
        // console.log(Users);
        // Users.filter( item => {
        //   let bool = userName.trim() == item.username && password.trim() == item.password;
        //   if(bool){
        //     console.log('authenticated');
        //   }else{
        //     console.log('not authenticated'+userName.trim()+" and "+item.username);
        //   }
        // });
