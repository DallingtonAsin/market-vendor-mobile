import React, {useState, useEffect, useContext} from 'react';
import { Text,TextInput, TouchableOpacity,ScrollView, View, StyleSheet, SafeAreaView,  Platform, Image,
  PermissionsAndroid, Alert, ImageBackground, Pressable} from 'react-native';
  import design from '../../assets/css/styles';
  import Icon from 'react-native-vector-icons/FontAwesome5';
  import { Avatar, Paragraph, Divider } from 'react-native-paper';
  import Animated from 'react-native-reanimated';
  import { AuthContext } from '../context/context';
  import { UIActivityIndicator } from 'react-native-indicators';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import ProfileContext from '../context/index';
  import ImagePicker from 'react-native-image-crop-picker';
  import Toast from 'react-native-simple-toast';
  import ProfilePicture from 'react-native-profile-picture';
  // import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
  import { BottomSheet } from 'react-native-btr';
  import {APP_NAME} from '@env';

  const initialState = {
    user_id: '',
    first_name: '',
    last_name: '',
    name: '',
    username: '',
    phone_number: '',
    email: '',
    role: APP_NAME + " Customer",
    image: require('../../assets/user-profile9.png'), 
    balance:0,
    
  }
  
  var mime = require('mime-types');

  const EditProfile = () => {
    
    const [state, setData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);
    const [visible, setVisible] = useState(false);
    const {profile, setProfile} = useContext(ProfileContext);
    const { updateProfile, UpdateProfileImage, syncProfileData } = React.useContext(AuthContext);

    const bs = React.useRef(null);
    const fall = new Animated.Value(1);


    const [image, setImage] = useState('https://dallingtonasingwire.com/img/user-profile9.png');

    const toggleBottomNavigationView = () => {
      setVisible(!visible);
    };

    const takePhotoFromCamera = async() => {
       ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.7,
      }).then(async image => {
        console.log("Camera image object",image);
        await SubmitProfileUpdateDetails(image);
      });
    }

    const choosePhotoFromLibrary = async() => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then( async(image) => {
        console.log("Gallery image object",image);
        await SubmitProfileUpdateDetails(image);
      });
    }


    const SubmitProfileUpdateDetails = async(image) => {
      const imagePath = image.path;
      const fileData = image.data;
      const mimeType = image.mime;
      const source = {url: image.path};
      const fileExtension = mime.extension(mimeType);
      setImage(imagePath);
      const ImageData = {
        uri: imagePath,
        type: mimeType,
        size: image.size,
        extension: fileExtension,
        name: 'profile_pic',
      }

      let formData = new FormData();
      formData.append('id', profile.id);
      formData.append('phone_number', profile.phone_number);
      formData.append('extension', fileExtension);
      formData.append('image', ImageData);
      console.log("Form data", formData);
      setIsUpdatingImage(true);
      let result = await UpdateProfileImage(formData);
      const statusCode = result.statusCode;
      const message = result.message;
      if(statusCode == 1){
        const customer = result.data;
        await syncProfileData(customer);
        // await setProfile(customer);
        await updateUserProfile(customer);
        Toast.show(message);
      }else{
          Alert.alert("Message", message);
      }
      setIsUpdatingImage(false);
      setVisible(false);
    }
              
              const handleProfileUpdate = async() =>{
                const user_id = state.user_id;
                const first_name = state.first_name;
                const last_name = state.last_name;
                const phone_number = state.phone_number;
                const email = state.email;

                if(user_id && first_name && last_name && phone_number) {
                  const reqParams = {
                    id: user_id,
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    email: email,
                  }
                  console.log("Update profile data", reqParams);
                  setIsLoading(true);
                  let response = await updateProfile(reqParams);
                  let message = response.message
                  let statusCode = response.statusCode;
                  setIsLoading(false);
                  if(statusCode == 0){
                      Alert.alert("Message", message);
                  }
                  if(statusCode == 1){
                    const user_data = response.data;
                    // await setProfile(user_data);
                    await syncProfileData(user_data);
                    await updateUserProfile(user_data);
                    // await getProfile(user_data);

                    Alert.alert("Message", message);
                  }
                  setIsLoading(false);
                }else{
                  Alert.alert("Profile Update Error", 'Unable to capture data to update profile');
                }
              }

              const getProfile = (user) => {
                
                  const user_id = user.id;
                  const first_name = user.first_name;
                  const last_name = user.last_name;
                  const name = (first_name && last_name) ? first_name + " " + last_name : '';
                  const phone_number = user.phone_number;
                  const email = user.email;
                  const account_balance = user.account_balance;
                  setData({
                    ...state,
                    user_id: user_id,
                    name: name,
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    email: email,
                    balance: account_balance
                  });
              }

              const updateUserProfile = async() => {
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
                      phoneNo: phone_number,
                      email: email,
                      account_balance: balance,
                    });
                  }
                }catch(e){
                  console.log("Error on async storage", e);
                }
              }
              
              useEffect(() => {
                let isMounted = true;
                if(isMounted) {
                  updateUserProfile();
                }
                return () => { isMounted = false };
              }, []);
              
              
              return(
                <>
                
             <SafeAreaView style={styles.container}>


             <BottomSheet
             visible={visible}
          onBackButtonPress={toggleBottomNavigationView}
          onBackdropPress={toggleBottomNavigationView}
        >
           <View style={styles.panel} elevation={5}>
            
            <View style={{alignItems: 'center'}}>
            <Text style={styles.panelTitle}>Upload Profile Photo</Text>
            <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', margin:30, justifyContent: 'space-evenly'}}>

            <View style={styles.uploadOptions}>
            <TouchableOpacity onPress={()=> setVisible(false) } style={[styles.icon, {borderColor:'red', backgroundColor: 'red'}]} >
            <FontAwesome name={"trash"} size={22} color={"#fff"} />
            </TouchableOpacity>
            <Text>Cancel</Text>
            </View>

            <View style={styles.uploadOptions}>
            <TouchableOpacity  style={[styles.icon, {borderColor:'purple', backgroundColor: 'purple'}]}>
            <FontAwesome name={"photo"} size={25}  color={"#fff"}  onPress={() => choosePhotoFromLibrary()}/>
            </TouchableOpacity>
            <Text>Gallery</Text>
            </View>

            <View style={styles.uploadOptions}>
            <TouchableOpacity onPress={() => takePhotoFromCamera()} style={[styles.icon, {borderColor:'green', backgroundColor: 'green'}]}> 
            <FontAwesome name={"camera"} size={25} color={"#fff"}/>
            </TouchableOpacity>
            <Text>Camera</Text>
            </View>

            </View>
              
              </View>
          </BottomSheet>


<View style={styles.header}>
             {
                  !isUpdatingImage ? 
                  profile.image ?
                  <Avatar.Image size={120} style={styles.avatar} 
                  source={{uri: profile.image }} />
                  : <Avatar.Image size={120} style={styles.avatar} 
                  source={{uri: image }} />
                  : 
                    <View style={styles.avatar1}>
                    <UIActivityIndicator color='black' />
                    </View>
                } 
<TouchableOpacity onPress={toggleBottomNavigationView} style={styles.camera}>
<Icon name="camera" color={design.colors.white}  size={18}/>
</TouchableOpacity>    
    </View>

                
              
                 
                
        

           
<View style={styles.body}>

               <View style={styles.form}>
                  <Text style={styles.text}>FIRST NAME</Text>
                  <TextInput value={state.first_name} 
                  placeholder="First Name"
                  style={styles.input} 
                  spellCheck={false}
                  autoCorrect={false}
                  onChangeText={(val) => setData({...state, first_name: val})}
                  />
                  </View>
                  
                  <View style={styles.form}>
                  <Text style={styles.text}>LAST NAME</Text>
                  <TextInput value={state.last_name}
                  placeholder="Last Name"
                  style={styles.input} 
                  spellCheck={false}
                  autoCorrect={false}
                  onChangeText={(val) => setData({...state, last_name: val})}
                  />
                  </View>
                  
                  <View style={styles.form}>
                  <Text style={styles.text}>PHONE NUMBER</Text>
                  <TextInput value={state.phone_number}
                  placeholder="Phone Number"
                  style={styles.input} 
                  spellCheck={false}
                  autoCorrect={false}
                  onChangeText={(val) => setData({...state, phone_number: val})}
                  />
                  </View>
                  
                  <View style={styles.form}>
                  <Text style={styles.text}>Email</Text>
                  <TextInput 
                  value={state.email}
                  placeholder="Email address"
                  style={styles.input}
                  spellCheck={false}
                  autoCorrect={false}
                  onChangeText={(val) => setData({...state, email: val})}
                  />
                  </View>
                  
            </View>

              
           


                <View style={styles.footer}>
                  <TouchableOpacity style={design.btnPrimary} onPress={handleProfileUpdate}>
                  <Text style={{color:'#fff', textTransform:'capitalize', fontSize:15}}>
                  {isLoading ? <UIActivityIndicator color='white' /> : 'Save Profile' } 
                  </Text>
                  </TouchableOpacity>
                  </View>

          </SafeAreaView>
                
                 
                  

                  </>
                  );
                  
                  
                }
                
                
                export default EditProfile
                
                const styles = StyleSheet.create({
                  container: {
                    flex:1,
                    backgroundColor: design.colors.white,
                  },

                  header:{
                    // height:120,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex:1,
                    backgroundColor: design.colors.silver,
                    flexDirection: 'row',
                  },

                  body:{
                    flex:3,
                    padding:15,
                    // height:'100%',
                    // marginTop:35,
                  },

          

         
              

                  text:{
                    color: design.colors.primary, 
                    fontWeight: 'bold',
                    opacity:0.8,
                    textTransform:'capitalize'
                  },
                  avatar: {
                    width: 120,
                    height: 120,
                    borderRadius: 70,
                    borderWidth: 1,
                    borderColor: "#e2e2e2",
                    backgroundColor:'white',
                    color: 'red',
                    marginTop:90,
                    position: 'absolute',
                  },

                 
                


                  avatar1: {
                    width: 120,
                    height: 120,
                    borderRadius: 70,
                    alignSelf:'center',
                    position: 'absolute',
                    marginTop:90, 
                    backgroundColor: design.colors.white,
                    borderWidth: 2,
                    borderColor: "white",
                  },
                  
                  imageStyle: {
                    width: 200,
                    height: 200,
                    margin: 5,
                  },
                  
                  name:{
                    fontSize:20,
                    color: "#696969",
                    fontWeight: "600"
                  },
              
                  
               
                  
                  form: {
                    padding: 12,
                  },
                  
                  divider:{
                    width:'90%',
                    height:1,
                    margin:15,
                    backgroundColor:'#e2e2e2',
                  },
                  
                  input:{
                    borderBottomColor: 'lightblue',
                    borderBottomWidth:1,
                    
                  },
                  green:{
                    color:'green'
                  },
                  
                  red:{
                    color:'red'
                  },
                  
              
                  
                  panel: {
                    padding: 20,
                    backgroundColor: '#FFFFFF',
                    paddingTop: 20,
                    height: 300,
                  },

                  panelTitle: {
                    fontSize: 22,
                    height: 35,
                  },
                  panelSubtitle: {
                    fontSize: 14,
                    color: 'gray',
                    height: 30,
                    marginBottom: 10,
                  },
                  
                  
                  bottomSheetHeader: {
                    backgroundColor: '#FFFFFF',
                    shadowColor: '#333333',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                  
                  panelHeader: {
                    alignItems: 'center',
                  },
                  
                  panelHandle: {
                    width: 40,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#00000040',
                    marginBottom: 10,
                  },
                  
                
                  panelButton: {
                    padding: 13,
                    borderRadius: 150 / 2,
                    backgroundColor: '#FF6347',
                    alignItems: 'center',
                    marginVertical: 7,
                  },
                  
                  panelButtonTitle: {
                    fontSize: 17,
                    fontWeight: 'bold',
                    color: 'white',
                  },
                  
                  action: {
                    flexDirection: 'row',
                    marginTop: 20,
                    marginBottom: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f2f2f2',
                    paddingBottom: 5,
                  },
                  
                  actionError: {
                    flexDirection: 'row',
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#FF0000',
                    paddingBottom: 5,
                  },
                  
                  textInput: {
                    flex: 1,
                    marginTop: Platform.OS === 'ios' ? 0 : -4,
                    paddingLeft: 10,
                    color: 'green',
                    marginLeft: 10,
                    fontSize:15,
                  },
                  icon: {
                    padding: 20,
                    borderWidth: 1,
                    borderRadius: 50,
                  },
                  uploadOptions:{
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    alignItems: 'center'
                  },

                  image: {
                    flex: 1,
                    justifyContent: "center"
                  },

                  camera: {
                    marginLeft:120,
                     backgroundColor: design.colors.success,
                      padding:10, borderRadius:50,
                       borderColor:'#f4f4f4'
                  },

                  footer:{
                    marginBottom: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    
                  },

                 button: {
                    color: '#fff',
                    borderRadius:5,
                    padding:15,
                    backgroundColor: design.colors.primary,
                    borderColor: design.colors.primary,
                    position: 'absolute',
                    bottom: 0,
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  
                  
                })
                
                
                
                
