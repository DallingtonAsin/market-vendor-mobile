import React, {useCallback, useState, useEffect} from 'react';
import { Text,Image, Button, Linking, View, FlatList, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Card, Title} from 'react-native-paper';
import OptionItem from '../components/OptionItem';
import {icons, SIZES } from '../../constants';
import { SocialIcon } from 'react-native-elements'
import {APP_NAME, currency} from '@env';
const AboutScreen = (props) => {
    
    return(
        
        <View style={{padding: 10, flex: 1, backgroundColor:'#e2e2e3'}}>
        
        <ScrollView contentContainerStyle={{ height:'auto', paddingBottom: 60 }} style={{flex: 1}}>
        {/* <Text style={{ textTransform:'uppercase',fontSize:12,
        color:'#808080', textAlign:'center', top:10,marginBottom:10 }}>
        This information can guide you 
    </Text> */}
    
    <Card style={styles.card}>
    <Card.Content>
    <Title>Services</Title>
    <Text style={{  opacity:0.5, fontSize:17 }}>
    {APP_NAME} provides easy access to better and affordable parking areas without a hustle. Just recharge your account 
    and get affordable parking in less than a minute!
    
    </Text>  
    </Card.Content>
    </Card>
    
    <Card style={styles.card}>
    <Card.Content>
    <Title>Usage</Title>
    <Text style={{  opacity:0.5, fontSize:17 }}>
    To get started, search for a parking area and pick one that you prefer (depending on distance, price or spaciousness).
    Ensure your <Text style={{textTransform:'lowercase'}}>{APP_NAME}</Text> wallet has enough money to pay for parking. Else, you can recharge your account
    using the "Top Up" option in the app.</Text>  
    </Card.Content>
    </Card>
    
    
    <Card style={styles.card}>
    <Card.Content>
    <View style={{ flex: 1, justifyContent: 'center' }}>
    <Title>Online Community</Title>
    
    <View style={{ flexDirection: 'row', marginTop: SIZES.padding, paddingHorizontal: SIZES.base }}>
    
    
    
    {/* <OptionItem
    icon={"globe"}
    bgColor={['#FFA500', '#FFA500']}
    label="Website"
    iconWidth={35} 
    iconHeight={35}
    XWidth={60} 
    YHeight={60}
    isSocialMedia={true}
    onPress={() => Linking.openURL("http://www.parkpro.com")}
    /> */}

<OptionItem
    icon={"facebook"}
    bgColor={['#43609C', '#43609C']}
    label="Facebook"
    iconWidth={35} 
    iconHeight={35}
    XWidth={60} 
    YHeight={60}
    isSocialMedia={true}
    onPress={() =>  Linking.openURL("http://www.facebook.com") }
    />

<OptionItem
    icon={"instagram"}
    bgColor={['#8a3ab9', '#8a3ab9']}
    label="Instagram"
    iconWidth={35} 
    iconHeight={35}
    XWidth={60} 
    YHeight={60}
    isSocialMedia={true}
    onPress={() =>  Linking.openURL("http://www.instagram.com") }
    />

    <OptionItem
    icon={"twitter"}
    bgColor={['#1DA1F2', '#1DA1F2']}
    label="Twitter"
    iconWidth={35} 
    iconHeight={35}
    XWidth={60} 
    YHeight={60}
    isSocialMedia={true}
    onPress={() =>  Linking.openURL("https://www.twitter.com") }
    />
  
    
   
    
    <OptionItem
    icon={"linkedin"}
    bgColor={['#0e76a8', '#0e76a8']}
    label="Linkedin"
    iconWidth={35} 
    iconHeight={35}
    XWidth={60} 
    YHeight={60}
    isSocialMedia={true}
    onPress={() =>  Linking.openURL("http://www.linkedin.com") }
    />
    
    
    
    
    </View>

    </View>
    </Card.Content>
    </Card>

    <View style={{justifyContent: 'center', alignItems: 'center', marginTop:20}}>
    <TouchableOpacity  onPress={() => Linking.openURL("http://www.parkpro.com")}>
        <Text style={{fontSize:19, color:design.colors.orange, fontWeight: 'bold', textShadowColor: '#ffa500', fontFamily: 'RobotoCondensed-Light'}}>Visit our website</Text>
    </TouchableOpacity>
    </View>


    </ScrollView>
    </View>
    
    );
    
    
}


export default AboutScreen

const styles = StyleSheet.create({
    card: {
        margin:10,
        borderRadius: 5,
    },
    mediaGroup:{
        flex:1,
        borderRadius:10,
        justifyContent: 'center',
        margin:10,
        
    }
});