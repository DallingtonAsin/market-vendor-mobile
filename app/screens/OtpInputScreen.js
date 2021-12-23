import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { checkVerification } from "../api/verify";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import design from '../../assets/css/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const OtpInputScreen = ({ route, navigation }) => {
 const { phoneNumber } = route.params;
 const [invalidCode, setInvalidCode] = useState(false);
 return (
   <SafeAreaView style={styles.wrapper}>
     <Text style={styles.prompt}>Enter the code we sent you</Text>
     <Text style={styles.message}>
       {`Your phone (${phoneNumber}) will be used to protect your account each time you log in.`}
     </Text>
    
     <OTPInputView
       style={{ width: "80%", height: 200 }}
       pinCount={6}
       autoFocusOnLoad
       codeInputFieldStyle={styles.underlineStyleBase}
       codeInputHighlightStyle={styles.underlineStyleHighLighted}
       onCodeFilled={(code) => {
         checkVerification(phoneNumber, code).then((success) => {
           if (!success) setInvalidCode(true);
           success && navigation.navigate("Register", { phoneNumber: phoneNumber });
         });
       }}
     />
     {invalidCode && <Text style={styles.error}>Incorrect code.</Text>}

     <TouchableOpacity
           style={styles.button}
           onPress={() => {
                navigation.goBack();
          }}
         >
           <FontAwesome name="arrow-left" size={15} color={design.colors.white}/>
           <Text style={styles.buttonText} >Go Back</Text>
       
         </TouchableOpacity>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 wrapper: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
 },

 borderStyleBase: {
   width: 30,
   height: 45,
 },

 borderStyleHighLighted: {
   borderColor: "#03DAC6",
 },

 underlineStyleBase: {
   width: 30,
   height: 45,
   borderWidth: 0,
   borderBottomWidth: 1,
   color: "black",
   fontSize: 20,
 },

 underlineStyleHighLighted: {
   borderColor: "#03DAC6",
 },

 prompt: {
   fontSize: 24,
   paddingHorizontal: 30,
   paddingBottom: 20,
 },

 message: {
   fontSize: 16,
   paddingHorizontal: 30,
 },

 error: {
   color: "red",
   fontSize:16,
 },

 button: {
  marginTop: 20,
  height: 60,
  width: 330,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: design.colors.primary, 
  shadowColor: "rgba(0,0,0,0.4)",
  shadowOffset: {
    width: 1,
    height: 5,
  },
  shadowOpacity: 0.34,
  shadowRadius: 6.27,
  elevation: 20,
  borderRadius:5,
  flexDirection: 'row',
},

buttonText: {
  color: "white",
  fontSize: 16,
  textAlign: 'center',
  left:20,
},
});

export default OtpInputScreen;
