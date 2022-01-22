import React, {useState, useContext} from 'react';
import { Text,Alert,ScrollView, SafeAreaView, TouchableOpacity, View,Image, StyleSheet, LogBox, Dimensions} from 'react-native';
import PasswordInputText from 'react-native-hide-show-password-input';
import styles from '../../assets/css/styles';
import { AuthContext } from '../context/context';
import { UIActivityIndicator } from 'react-native-indicators';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfileContext from '../context/index';

const initialState = {
  old_password: '',
  new_password: '',
  confirm_password: '',
}

const Password = () => {
  
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = React.useContext(AuthContext);
  const {profile, setProfile} = useContext(ProfileContext);
  
  React.useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  const oldPasswordInputChange = (val) => {
    setState({
      ...state,
      old_password: val,
    });
  }
  
  const newPasswordInputChange = (val) => {
    setState({
      ...state,
      new_password: val,
    });
  }
  
  const confirmPasswordInputChange = (val) => {
    setState({
      ...state,
      confirm_password: val,
    });
  }
  
  
  const confirmPasswordChange = async() => {
    const oldPassword = state.old_password;
    const newPassword = state.new_password;
    const confirmPassword = state.confirm_password;

    if(!oldPassword){
      alert("Enter your current passowrd");
      return;
    }

    if(!newPassword){
      alert("Enter your new passowrd");
      return;
    }

    if(!confirmPassword){
      alert("Confirm your new passowrd");
      return;
    }

    if(newPassword != confirmPassword){
      alert("Enter your matching passowrd");
      return;
    }

    if(oldPassword  && newPassword && confirmPassword){
        if(profile.id){
          const data = {
            id: profile.id,
            current_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }
          setIsLoading(true);
          let result =  await updatePassword(data);
          console.log("Async response on updating password", result);
          const statusCode = result.statusCode;
          const message = result.message;
          console.log("message password", message);
          if(statusCode == 1){
            setState({
              old_password: '',
              new_password: '',
              confirm_password: '',
            });
            Alert.alert("Message", message);
          }else{
            Alert.alert("Message", message);
          }
          setIsLoading(false);
        }else{
          Alert.alert("Message", "Unable to fetch user details");
        }

    }
  }
  
  
  return(

<>
    <SafeAreaView style={innerStyles.container}>


    <View style={innerStyles.top}>
    <View style={innerStyles.imageSection}>
    <Image 
        source={require('../../assets/icons/forgot-password.png')}
        style={innerStyles.image}
        />
         {/* <FontAwesome name={'lock'} size={25} color={styles.colors.white}/> */}
    </View>
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize:16, padding:16, fontWeight:'bold',opacity:0.8,
       color: styles.colors.white, textTransform:'capitalize'}}>Reset your password</Text>
  </View>
    </View>


  <ScrollView contentContainerStyle={innerStyles.body}>

  <Text style={{fontWeight: 'bold', fontSize:20, }}>Change Password</Text>

 <View style={{top:20}}>
 
 <Text style={innerStyles.text}>Current password</Text>
    <PasswordInputText
    value={state.old_password}
    onChangeText= { (val) => oldPasswordInputChange(val) }
    label={"Current password"}
    />
 
    
    
  
    <Text style={innerStyles.text}>New password</Text>
    <PasswordInputText
    value={state.new_password}
    onChangeText= { (val) => newPasswordInputChange(val)}
    label={"New password"}
    />
 
    

    <Text style={innerStyles.text}>Confirm password</Text>
    <PasswordInputText
    value={state.confirm_password}
    onChangeText={ (val) => confirmPasswordInputChange(val) }
    label={"Confirm password"}
    />


  </View>

   

  </ScrollView>

  <View style={innerStyles.footer}>
  <TouchableOpacity
  style = {styles.btnPrimary}
  onPress={confirmPasswordChange} >
  <Text style = {innerStyles.btnText}>
  {isLoading ? <UIActivityIndicator color='white' size={25} /> : 'Submit' }
    </Text>
  </TouchableOpacity>
  </View>

 
  
  </SafeAreaView>
  
</>
    );
    
  }
  
  
  
  export default Password
  
  const innerStyles = StyleSheet.create({

    container:{
      flex:1,
      backgroundColor: styles.colors.primary,
    },

    top:{
     flex:1,
     backgroundColor: styles.colors.primary,
     justifyContent: 'center', 
     alignItems: 'center',
    },

    body:{
      flexGrow:5,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      padding:30,
      backgroundColor: styles.colors.white,
     },


    footer:{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      // position: 'absolute',
      // zIndex:100,
      // bottom: 0,
    },

    submit: {
      color: '#fff',
      borderRadius:5,
      padding:15,
      backgroundColor: styles.colors.primary,
      borderColor: styles.colors.primary,
      position: 'absolute',
      bottom: 0,
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      marginBottom: 30,
    },

    btnText: {
      textTransform: 'uppercase',
      color: styles.colors.white,
      fontSize:15, 
      fontWeight: 'bold',
    },

    textArea: {
      backgroundColor: '#fff',
      borderRadius: 20,

    },

    title: {
      fontSize:15,
      fontWeight: 'bold',
      opacity:0.7,
    },

    input:{
      backgroundColor: '#fff',
      borderRadius:20,
    },


    imageSection: {
      borderWidth:1,
      borderColor: '#fff',
      padding:20,
      borderRadius:80,
    },

    image:{
        height:40, 
        width:40,
        tintColor: '#fff',
    },



    
    
    
  });