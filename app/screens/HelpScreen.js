import React, {useState} from 'react';
import { Text,StyleSheet,FlatList, View, ScrollView, TouchableOpacity} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {callHelpLine, SendEmail, SendSms, inboxFromWhatsapp} from '../components/SharedCommons';
import {Card, Paragraph} from 'react-native-paper';
import { config } from '../config/env';


const Help = ({navigation}) => {

  const communicationChannels = [
    {id: 1, iconName: "phone", name:'Phone', text: config.companyLine, 'method': () => {callHelpLine()}},
    {id: 2, iconName: "whatsapp", name:'Whatsap', text: config.whatsapLine, 'method': () => {inboxFromWhatsapp()}},
    {id: 3, iconName: "sms", name:'SMS', text: 'Report a problem via sms', 'method': () => {SendSms()}},
    {id: 4, iconName: "envelope", name:'Email', text: config.companyEmail, 'method': () => {SendEmail()}},
    {id: 5, iconName: "comments", name:'Suggestion', text: 'Suggest something to us', 'method': () => navigation.navigate('Suggestions')},

  ];
  
  const [media, setMedia] = useState(communicationChannels);
  
  const CardComponent = ({info}) => (
    <TouchableOpacity  style={{ backgroundColor:'#ffffff', borderWidth:1, borderColor:'#e2e2e2',margin:5, borderRadius:6 }} onPress={info.method}>
    <View style = { design.helpContainer} >
    <Icon name={info.iconName} style={design.helpIcon}/>
    <View style={{flexDirection: 'column', marginLeft:15}}>
    <Text style={styles.channel}>{info.name}</Text>
    <Text>{info.text}</Text>
    </View>
  
    </View>
    </TouchableOpacity>
    );
    
    return(
    
       <View style={styles.container}>

         <View style={styles.top}>
         {/* <Text style={{
            textTransform: 'uppercase', 
            fontWeight:'bold',opacity:0.6,
            fontSize: 16, color: '#fff', 
            textAlign: 'center',margin:10, 
        }}> We would like to hear from you.</Text> */}

           <Icon name={'question-circle'} size={75} color={design.colors.white}/>
         
         </View>

         <View style={styles.body}>

         <Text style={{fontSize: 16, color: '#000', textAlign: 'center', paddingTop:5, paddingBottom:15,
        }}>Kindly contact us for any kind of assistance.</Text>
      <FlatList
      data={media}
      renderItem={({item}) => <CardComponent info={item} />}
      />

         </View>

       
      
      </View>
      
      );
      
      
    }
    
    export default Help
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: design.colors.primary,

        // padding: 10,
      },


      top:{
        flex:1,
        backgroundColor: design.colors.primary,
        justifyContent: 'center', 
        alignItems: 'center',
       },

      body:{
        flex:3,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding:30,
        backgroundColor: design.colors.white,
       },



      card: {
        margin:15,
        color:'#fff'

      },
      mediaGroup:{
        padding:10,
        borderRadius:10,
        justifyContent: 'center',
        margin:10,
        
      },

      channel:{
        fontWeight: 'bold',
        fontSize: 16, 
      }
    });