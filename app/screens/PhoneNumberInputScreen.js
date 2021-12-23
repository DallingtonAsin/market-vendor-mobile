import React, { useState, useRef } from "react";
import {
 SafeAreaView,
 StyleSheet,
 View,
 TouchableOpacity,
 Text,Alert
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import PhoneInput from "react-native-phone-number-input";
import { sendSmsVerification } from "../api/verify";
import design from '../../assets/css/styles';


const PhoneNumberInputScreen = ({ navigation }) => {
 const [value, setValue] = useState("");
 const [formattedValue, setFormattedValue] = useState("");
 const [isSending, setIsSending] = useState(false);
 const phoneInput = useRef(null);

 const sendOTP = () => {
   if(formattedValue.length < 13){
    Alert.alert("Error", "Enter a valid phone number");
   }else{
    setIsSending(true);
    sendSmsVerification(formattedValue).then((sent) => {
      setIsSending(false);
      console.log("Response from server on sending sms", sent);
      navigation.navigate("Otp", { phoneNumber: formattedValue });
     });
   }
 
 }

 return (
   <>
     <View style={styles.container}>
       <SafeAreaView style={styles.wrapper}>
         <View style={styles.welcome}>
           <Text>Welcome!</Text>
         </View>
         <PhoneInput
           ref={phoneInput}
           defaultValue={value}
           defaultCode="UG"
           layout="first"
           onChangeText={(text) => {
             setValue(text);
           }}
           onChangeFormattedText={(text) => {
             setFormattedValue(text);
           }}
           countryPickerProps={{ withAlphaFilter: true }}
           withShadow
           autoFocus
         />
         <TouchableOpacity
           style={styles.button}
           onPress={sendOTP}
         >
           <Text style={styles.buttonText}>
           { isSending ? 'Sending OTP...' :  'Sign Up' }
             </Text>
         </TouchableOpacity>
       </SafeAreaView>
     </View>
   </>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: Colors.lighter,
 },

 wrapper: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
 },

 button: {
   marginTop: 20,
   height: 60,
   width: 330,
   justifyContent: "center",
   alignItems: "center",
   backgroundColor: design.colors.primary, // "#7CDB8A",
   shadowColor: "rgba(0,0,0,0.4)",
   shadowOffset: {
     width: 1,
     height: 5,
   },
   shadowOpacity: 0.34,
   shadowRadius: 6.27,
   elevation: 20,
   borderRadius:5,
 },

 buttonText: {
   color: "white",
   fontSize: 16,
 },

 welcome: {
   padding: 20,
 },

 status: {
   padding: 20,
   marginBottom: 20,
   justifyContent: "center",
   alignItems: "flex-start",
   color: "gray",
 },
});

export default PhoneNumberInputScreen;
