import React, {useCallback, useState, useEffect} from 'react';
import { Text,Image, Button, Linking, View, FlatList, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Card, Title} from 'react-native-paper';
import OptionItem from '../components/OptionItem';
import {icons, SIZES } from '../../constants';
import { SocialIcon } from 'react-native-elements'
import {APP_NAME} from '@env';

const AboutScreen = (props) => {
    
    return(
        
        <View style={{padding: 10, flex: 1, backgroundColor:'#e2e2e2'}}>
        
        <ScrollView contentContainerStyle={{ height:'auto', paddingBottom: 60 }} style={{flex: 1}}>
        <Text style={{ textTransform:'uppercase',fontSize:12,
        color:'#808080', textAlign:'center', top:10,marginBottom:10 }}>
        This information can guide you 
        </Text>
        
        <Card style={styles.card}>
        <Card.Content>
        <Title>Services</Title>
        <Text style={{  opacity:0.5, }}>
        As {APP_NAME}, We aim to provide you easy access to 
        better and affordable parking area without any sweat. Just recharge your account and get yourself
        afforable parking area in less than a minute. </Text>  
        </Card.Content>
        </Card>
        
        <Card style={styles.card}>
        <Card.Content>
        <Title>Usage</Title>
        <Text style={{  opacity:0.5, }}>
        To get started, search parking area and see one that is affordable for you.
        Ensure your {APP_NAME}'s  account has enough money to pay for parking else you can recharge or top up your account
        using this app.</Text>  
        </Card.Content>
        </Card>
        
        
        <Card style={styles.card}>
        <Card.Content>
        <View style={{ flex: 1, justifyContent: 'center' }}>
        <Title>Website & Social Media</Title>
        
        <View style={{ flexDirection: 'row', marginTop: SIZES.padding, paddingHorizontal: SIZES.base }}>

        
        
        <OptionItem
        icon={icons.web}
        bgColor={['#FFA500', '#FFA500']}
        label="Website"
        onPress={() => Linking.openURL("http://www.parkpro.com")}
        />
        <OptionItem
        icon={icons.twitter}
        bgColor={['#1DA1F2', '#1DA1F2']}
        label="Twitter"
        onPress={() =>  Linking.openURL("https://www.twitter.com") }
        />
        <OptionItem
        icon={icons.facebook}
        bgColor={['#43609C', '#43609C']}
        label="Facebook"
        onPress={() =>  Linking.openURL("http://www.facebook.com") }
        />
        </View>
        </View>
        </Card.Content>
        </Card>
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