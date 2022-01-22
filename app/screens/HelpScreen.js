import React, {useState} from 'react';
import { Text,StyleSheet,FlatList, View, TouchableOpacity} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {callHelpLine, SendEmail, SendSms, inboxFromWhatsapp} from '../components/SharedCommons';
import {companyLine, whatsapLine, companyEmail} from '@env';



const CardComponent = ({info}) => (
  <TouchableOpacity  style={{ backgroundColor:'#ffffff', borderWidth:1, borderColor:'#e2e2e2',margin:5, borderRadius:6 }} onPress={info.method}>
  <View style = { design.helpContainer} >
  <Icon name={info.iconName} style={design.helpIcon} size={20}/>
  <View style={{flexDirection: 'column', marginLeft:15}}>
  <Text style={styles.channel}>{info.name}</Text>
  <Text>{info.text}</Text>
  </View>
  </View>
  </TouchableOpacity>
  );
  
  const Help = ({navigation}) => {
  
    const communicationChannels = [
      {id: 1, iconName: "phone-alt", name:'Phone', text: companyLine, 'method': () => {callHelpLine(companyLine)}},
      {id: 2, iconName: "whatsapp", name:'Whatsap', text: whatsapLine, 'method': () => {inboxFromWhatsapp(whatsapLine)}},
      {id: 3, iconName: "sms", name:'SMS', text: 'Report a problem via sms', 'method': () => {SendSms(companyLine)}},
      {id: 4, iconName: "envelope", name:'Email', text: companyEmail, 'method': () => {SendEmail(companyEmail)}},
    ];

    return(
      <View style={styles.container}>
      <View style={styles.top}>
      <Icon name={'question-circle'} size={75} color={design.colors.white}/>
      </View>
      <View style={styles.body}>
      <Text style={{fontSize: 16, color: '#000', textAlign: 'center', paddingTop:5, paddingBottom:15,
    }}>Kindly contact us for any kind of assistance.</Text>
    <FlatList
     showsVerticalScrollIndicator={false}
     showsHorizontalScrollIndicator={false}
    data={communicationChannels}
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
    },
    
    
    top:{
      flex:1,
      backgroundColor: design.colors.primary,
      justifyContent: 'center', 
      alignItems: 'center',
      padding:20,
      
    },
    
    body:{
      flex:5,
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