import React, {useState, useContext} from 'react';
import { Text,Image,
   TouchableOpacity,
     View, 
     SafeAreaView,
      StyleSheet,
      ScrollView,
    Alert } from 'react-native';
import styles from '../../assets/css/styles';
import ProfileContext from '../context/index';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';
import { UIActivityIndicator } from 'react-native-indicators';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-paper';


  
  const SuggestionsScreen = () => {
    const {profile, setProfile} = useContext(ProfileContext);
    const initialState = {
      email: profile.email,
      subject: '',
      description: '',
    }
    const [state, setState] = React.useState(initialState);
    const {postSuggestion} = React.useContext(AuthContext);
    const [isLoading, setIsLoading] = React.useState(false);

    const sendSuggestion = async() => {

      const id = profile.id;
      const email = state.email;
      const subject = state.subject;
      const description = state.description;
      if(id && email && subject && description){
        const data = {
          id: id,
          email: email,
          subject: subject,
          description: description,
        }
        setIsLoading(true);
        let result = await postSuggestion(data);
        const statusCode = result.statusCode;
        const message = result.message;
        if(statusCode == 1){
          setState({...initialState});
          Toast.show(message);
        }else{
            Alert.alert("Message", message);
        }
      }else{
        Alert.alert("Message", "Please enter all information");
      }
      setIsLoading(false);

    }



    return(
      
      <SafeAreaView style={css.container}>


        <View style={css.top}>
          <Text style={{color: '#fff', fontSize:22, fontWeight:'bold'}}>How do you feel?</Text>
          <View style={{flexDirection: 'row', padding:10}}>
          <FontAwesome5 name="grin-beam" size={35} color={'#FDDA0D'}  style={{padding:10}} />
          <FontAwesome5 name="frown-open" size={35} color={'#F9F6EE'} style={{padding:10}} />
          <FontAwesome5 name="dizzy" size={35} color={'#F9F6EE'} style={{padding:10}}/>
          </View>
        </View>


      <ScrollView contentContainerStyle={css.body}>
    
      <Text style={{fontWeight: 'bold', fontSize:20, }}>Give us feedback</Text>

     <View style={{top:20}}>
      <TextInput mode="outlined" label="Email" placeholder="Email (required)" value={state.email}
      onChangeText={(text) => {setState({...state, email: text}) }}
      style={css.input}
      />
    
      <TextInput mode="outlined" label="Subject" placeholder="Enter your subject"
      value={state.subject} style={css.input}
      onChangeText={(text) => {setState({...state, subject: text}) }}
      />
      
      <Text style={css.title}>Description</Text>
      <TextInput
      style={css.textArea}
      underlineColorAndroid="transparent"
      placeholder="Write your feedback here"
      placeholderTextColor="grey"
      numberOfLines={8}
      multiline={true}
      value={state.description}
      mode="outlined"
      onChangeText={(text) => {setState({...state, description: text}) }}
      />

      </View>

       
  
      </ScrollView>

      <View style={css.footer}>
      <TouchableOpacity
      style = {styles.btnPrimary}
      onPress={sendSuggestion} >
      <Text style = {css.btnText}>
      {isLoading ? <UIActivityIndicator color='white' /> : 'Send' }
        </Text>
      </TouchableOpacity>
      </View>

     
      
      </SafeAreaView>
      
      );
    }

    export default SuggestionsScreen

    const css = StyleSheet.create({
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



    });