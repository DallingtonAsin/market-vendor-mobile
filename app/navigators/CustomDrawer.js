import React, {useState, useEffect, useContext} from 'react';
import {View, Text,ScrollView,Share, TouchableOpacity, Linking} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../../assets/css/styles';
import { Avatar } from 'react-native-paper';
import { SendEmail } from '../components/SharedCommons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_NAME} from '@env';
import ProfileContext from '../context/index';
import Rate, { AndroidMarket } from 'react-native-rate';
import {  AirbnbRating } from 'react-native-elements';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

const initialState = {
  user_id: '',
  name: '',
  firstname: '',
  lastname: '',
  phone_number: '',
  email: '',
  account_balance: '',
  image: '',
}

const CustomDrawer = (props) => {
  
  
  
  const [state, setData] = useState(initialState);
  const { signOut } = React.useContext(AuthContext);
  const {profile, setProfile} = useContext(ProfileContext);
  const [isVisible, setIsVisible] = useState(false);

  const items = [
    {
      navOptionThumb: 'home',
      navOptionName: 'Home',
      screenToNavigate:'Home',
      
    },
    
    {
      navOptionThumb: 'user-circle',
      navOptionName: 'My Profile',
      screenToNavigate:'Profile',
      
    },
    
    {
      navOptionThumb: 'parking',
      navOptionName: 'Nearby parkings',
      screenToNavigate:'Map',
    },

    {
      navOptionThumb: 'cloud-rain',
      navOptionName: 'Weather info',
      screenToNavigate:'Weather',
    },
    
    
  ];


  const getProfile = async() => {
    try{
        const profile = JSON.parse(await AsyncStorage.getItem("userProfile"));
      if(profile){
        const user_id = profile.user_id;
        const first_name = profile.first_name;
        const last_name = profile.last_name;
        const name = (first_name && last_name) ? first_name + " " + last_name : '';
        const phone_number = profile.phone_number;
        const email = profile.email;
        const balance = profile.account_balance;
        console.log("Balance: " + balance);
        
        setData({
          ...state,
          user_id: user_id,
          name: name,
          firstname: first_name,
          lastname: last_name,
          phone_number: phone_number,
          email: email,
          account_balance: balance,
        });
      }
    }catch(e){
      console.log("Error on async storage", e);
    }
  }

const logout = async() => {
  await setProfile({});
  await signOut();
}
  
  useEffect(() => {
       getProfile();
  }, []);
  
  const LoadPage = (page) => {
    props.navigation.navigate(page);
  };
  

  const SendFeedback = () => {
    SendEmail();
  };
  
  const ShareApp = () => {
    Share.share({
      message:  "Share "+APP_NAME+" with Friends",
      title:'Find parking for your vehicle with ease',
      url:'http://parkproug.com',
      
    },{
      dialogTitle: "Share "+APP_NAME+" with Friends",
    });
  }

  const navigateToTerms = () => {
    Linking.openURL("https://www.parkproug.com");
  }

  const RateUs = () => {
    const options = {
      AppleAppID:"2193813192",
      GooglePackageName:"com.mywebsite.myapp",
      AmazonPackageName:"com.mywebsite.myapp",
      OtherAndroidURL:"http://www.randomappstore.com/app/47172391",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp:false,
      openAppStoreIfInAppFails:true,
      fallbackPlatformURL:"http://www.mywebsite.com/myapp.html",
    }
    Rate.rate(options, (success, errorMessage)=>{
      if (success) {
      }
      if (errorMessage) {
        console.error(`Example page Rate.rate() error: ${errorMessage}`)
      }
    });
  }


  return (
    
    <ScrollView>
    
    {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
    <FontAwesome name={"times"} size={25} style={{color:'#666362'}} />
  </TouchableOpacity> */}

<View style={styles.container}>
<Dialog
  visible={isVisible}
  width={0.8}
  height={0.2}
  footer={
    <DialogFooter>
      <DialogButton
        text="Later"
        onPress={() => {setIsVisible(false)}}
      />
      <DialogButton
        text="OK"
        onPress={() => RateUs()}
      />
    </DialogFooter>
  }
>
  <DialogContent>
    <Text style={{ textAlign: 'center', fontSize:16}}>Please take a moment to rate us</Text>
    <AirbnbRating
        showRating={false}
        size={30}
        readonly
        count={5}
        defaultRating={5}
        />
  </DialogContent>
</Dialog>
</View>
  
  <View style={styles.sideMenuContainer}>
  {/* <Image source={ require("../../assets/default-user.png")} style={ styles.sideMenuProfileIcon} /> */}
  
  {
    state.image ?
   <Avatar.Image size={120} style={{backgroundColor: styles.colors.white}} 
  source={{uri: state.image }} />
    : <Avatar.Image size={120} style={{backgroundColor: styles.colors.white}} 
    source={require('../../assets/default-user.png')} />
  }
  
  
  <Text style={{ marginTop:5, color:'#000', fontSize:16  }}>{ state.firstname }</Text>
  <Text style={{ marginBottom:15, color:'#000', fontSize:16 }}>{ state.phone_number}</Text>
  
  <View style={styles.divider}></View>
  <View style={{ width: '100%' }}>
  {items.map((item, key) => {
    return(
      <TouchableOpacity key={key} style={[{
        backgroundColor: global.currentScreenIndex === key ? '#F7F5F5' : '#fff'
      }, styles.sideMenuItems]} onPress={ () => {
        global.currentScreenIndex = key;
        props.navigation.navigate(item.screenToNavigate);
      }}>
      <View>
      <FontAwesome name={item.navOptionThumb} style={styles.navOptionThumb}/>
      </View>
      <Text
      style={[{ color: global.currentScreenIndex === key ? '#FFB020' : '#000000' }, styles.sideMenuText]}
      >
      {item.navOptionName}
      </Text>
      </TouchableOpacity>
      )
    })}
    
    </View>
    
    
    
    <View style={styles.divider}></View>
    <View  style={{ width: '100%' }}>
    
    {/* <TouchableOpacity style={styles.sideMenuItems} onPress={SendFeedback}>
    <Icon name="comments" style={styles.navOptionThumb}/>
    <Text style={styles.sideMenuText}>Send Feedback</Text>
    </TouchableOpacity> */}
    
    <TouchableOpacity style={styles.sideMenuItems} onPress={() => ShareApp}>
    <Icon name="share-alt" style={styles.navOptionThumb}/>
    <Text style={styles.sideMenuText}>Share</Text>
    </TouchableOpacity>
    
    {/* <TouchableOpacity style={styles.sideMenuItems} onPress={ () => {
      LoadPage('Map'); }}>
      <Icon name="map-marker-alt" style={styles.navOptionThumb}/>
      <Text style={styles.sideMenuText} >Map</Text>
      </TouchableOpacity> */}

    

      <TouchableOpacity style={styles.sideMenuItems} 
        onPress={() => LoadPage("About")}>
        <FontAwesome name="info-circle" style={styles.navOptionThumb}/>
        <Text style={styles.sideMenuText}>About Us</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.sideMenuItems} 
        onPress={() => setIsVisible(true) }>
        <Icon name="thumbs-up" style={styles.navOptionThumb}/>
        <Text style={styles.sideMenuText}>Rate Us</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.sideMenuItems}
         onPress={() => navigateToTerms()}>
          <FontAwesome name="file-contract" style={styles.navOptionThumb}/>
          <Text style={styles.sideMenuText} 
          >Terms & Conditions</Text>
          </TouchableOpacity>
      
    
        
       
        
        <View style={styles.divider}></View>

        <TouchableOpacity style={styles.sideMenuItems} onPress={ () => {
        LoadPage('Settings'); }}>
        <Icon name="cog" style={styles.navOptionThumb}/>
        <Text style={styles.sideMenuText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sideMenuItems}
         onPress={logout}>
          <Icon name="power-off" style={styles.navOptionThumb}/>
          <Text style={styles.sideMenuText} 
          >Log out</Text>
          </TouchableOpacity>
          
          
          </View>
          </View>
          </ScrollView>
          
          )
          
        }
export default CustomDrawer;
        
        
        
        
