import React, {useEffect, useState, useMemo, useContext} from 'react';
import { View, ActivityIndicator, TouchableOpacity, Image, RefreshControl,  Text, 
  StyleSheet, SafeAreaView, ScrollView} from 'react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } 
  from 'react-native-paper';
  import { AuthContext } from './app/context/context';
  import MainService from './app/redux/services/main.service';
  import AppRootStack from  './app/components/stacks/AppRootStack';
  import DrawerScreenStack from './app/components/stacks/DrawerScreenStack';
  import loginReducer from './app/redux/reducers/loginReducer';
  import NetInfo from "@react-native-community/netinfo";
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import { ProfileProvider } from './app/context/index';
  import ProfileContext from './app/context/index';
  import {numberWithCommas} from './app/components/SharedCommons';
  import SplashScreen from 'react-native-splash-screen'
  import { images, icons, COLORS, FONTS, SIZES } from './constants';
  import GlobalFont from 'react-native-global-font'
  
  // import OfflineScreen from  './app/screens/OfflineScreen';
  
  const theme = {
    ...PaperDefaultTheme,
    roundness: 2,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
  };
  
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    data: null,
  }
  
  
  
  
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  
  const user = async () =>{
    let userData = null;
    try {
      const payload = await AsyncStorage.getItem('userProfile')
      userData = JSON.parse(payload); 
      return userData;
    } catch (e) {
      console.log(e);
    }
  }


  
  const AppStack = ({token}) => {
    
    }
    
    
    const getUser = async() => {
      try{
        const user = await AsyncStorage.getItem("userProfile");
        const userProfile = JSON.parse(user)
        return userProfile;
      }catch(e){
        throw e;
      }
    }
    
    
    function App() {
      
      
      
      const [profile, setProfile] = useState(null);
      const providerValue = useMemo(() => ({profile, setProfile}), [profile, setProfile]); 
      const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
      const [isConnected, setIsConnected] = React.useState(false);

    
      const OfflineScreen = () => {
        const [refreshing, setRefreshing] = React.useState(false);
        
        const onRefresh = React.useCallback(() => {
          setRefreshing(true);
          wait(2000).then(() =>{
            NetInfo.fetch().then(state => {
              setIsConnected(state.isConnected);
              setRefreshing(false);
            });
            
          });
        });
        
        return (
          <SafeAreaView  style={styles.container}>
          <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
          }
          >
          
          <Image
          source={icons.noInternet}
          resizeMode="contain"
          style={{
            tintColor: '#808080',
            width: 120,
            height: 120,
          }}
          />
          
          <Text style={[styles.title, {
            color: '#fd5e53',
          }]}>No internet connection...</Text>
          <Text style={{fontSize: 16, color: '#808080', padding:15}}>
          Ops...it seems you are not connected on internet. Check your internet connection
          and try again.
          </Text>
          <FontAwesome 
          name={"refresh"}
          color={'#C0C0C0'}
          size={50}
          style={styles.refresh}
          onPress={onRefresh}
          /><Text style={{color: '#808080', fontSize: 14}}>Pull down to refresh</Text>
          </ScrollView>
          
          </SafeAreaView >
          );
        };
        
        const authContext = React.useMemo(() => ({
          signIn: async(userName, password) => {
            let userToken;
            userToken = null;
            return await MainService.login(userName, password).then(async(res) => {
              console.log("Response from login", res);
              console.log("Phone number "+userName+" and Password "+password);
              const statusCode = res.statusCode;
              const message = res.message;
              if(statusCode == 1){
                const respData = res.data;
                try{
                  
                  userToken = respData.access_token;
                  setProfile(respData);
                  await AsyncStorage.setItem("userToken", userToken);
                  await AsyncStorage.setItem("userProfile", JSON.stringify(respData));
                  dispatch({ type: 'LOGIN', id: userName, userToken: userToken})
                  return {"message": message, "statusCode": statusCode, "userName": userName, "userToken": userToken};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
            
          },
          signOut: async() => {
            try{
              // setProfile(null);
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userProfile");
            }catch(e){
              console.log("Error on async storage", e);
            }
            dispatch({ type: 'LOGOUT' });
          },
          
          
          signUp: async(data) => {
            let userToken;
            userToken = null;
            return await MainService.register(data).then(async(res) => {
              // console.log("Registration response", res);
              const statusCode = res.statusCode;
              const message = res.message;
              if(statusCode == 1){
                const respData = res.data;
                try{
                  userToken = respData.access_token;
                  let userName = respData.phone_number;
                  setProfile(respData);
                  await AsyncStorage.setItem("userToken", userToken);
                  await AsyncStorage.setItem("userProfile", JSON.stringify(respData));
                  dispatch({ type: 'LOGIN', id: userName, userToken: userToken});
                  return {"message": message, "statusCode": statusCode, "userName": userName};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
          },

          UpdateProfileImage: async(data) => {
            return await MainService.uploadProfilePicture(data)
            .then( async(res) => {
              // console.log("Change Profile Image response", res);
              const statusCode = res.statusCode;
              const message = res.message;

              if(statusCode == 1){
                try{
                  const respData = res.data;
                  return {"message": message, "statusCode": statusCode, "data": respData};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
          },
          
          updateProfile: async(data) => {
            let userToken;
            userToken = null;
            return await MainService.updateProfile(data).then(async(res) => {
              // console.log("Profile update response", res);
              const statusCode = res.statusCode;
              const message = res.message;
              if(statusCode == 1){
                const respData = res.data;
                try{
                  await AsyncStorage.setItem("userProfile", JSON.stringify(respData));
                  return {"message": message, "statusCode": statusCode, "data": respData};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
          },
          
          asyncCustomerProfile: async(id) => {
            return await MainService.getCustomerData(id).then(async(res) => {
              const statusCode = res.statusCode;
              const message = res.message;
              if(statusCode == 1){
                const result = res.data;
                try{
                  let userName = result.phone_number;
                  await AsyncStorage.setItem("userProfile", JSON.stringify(result));
                  return {"message": message, "statusCode": statusCode, "userName": userName};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
          },
          
          getCustomerNotifications: async(id) => {
            return await MainService.getNotifications(id).then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },
          
          getCustomerTransactions: async(id) => {
            return await MainService.getTransactionHistory(id).then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },
          
          getParkingAreas: async() => {
            return await MainService.fetchParkingAreas().then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },

          getVendors: async() => {
            return await MainService.fetchVendors().then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },
          
          getVehicleCategories: async() => {
            return await MainService.getCarTypes().then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },
          
          
          
          updatePassword: async(data) => {
            return await MainService.changePassword(data).then(async(res) => {
              const statusCode = res.statusCode;
              const message = res.message;
              if(statusCode == 1){
                try{
                  return {"message": message, "statusCode": statusCode};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
          },
          
          
          postSuggestion: async(data) => {
            const result = await MainService.postSuggestion(data);
            return result;
          },
          
          submitParkingRequest: async(data) => {
            return await MainService.postParkingRequest(data).then(async(res) => {
              const statusCode = res.statusCode;
              const message = res.message;
              if(statusCode == 1){
                try{
                  return {"message": message, "statusCode": statusCode};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
            
            
          },
          
          syncProfileData: async(data) => {
            try{
              await AsyncStorage.setItem("userProfile", JSON.stringify(data));
              return {"message": 'done', "statusCode": 1};
            }catch(e){
              return {"message": e.message, "statusCode": 0};
            }
          },
          
          fetchMyParkingRequests: async(id) => {
            return await MainService.getMyParkingRequests(id).then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },
          
          fetchOrderInfo: async(order_no, customer_id) => {
            return await MainService.getOrderDetails(order_no, customer_id).then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },

          fetchVendorInfo: async(vendor_id) => {
            return await MainService.fetchVendorDetails(vendor_id).then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },

          getMyOrders: async(customer_id) => {
            return await MainService.fetchMyOrders(customer_id).then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },

          getOrderInfo: async(order_no) => {
            return await MainService.fetchOrderDetails(order_no).then(async(res) => {
              const statusCode = res.statusCode;
              let data;
              if(statusCode == 1){
                data = res.data;
              }else{
                data = [];
              }
              return data;
            });
          },
          
          submitShoppingOrder: async(data) => {
            return await MainService.postShoppingOrder(data).then(async(res) => {
              const statusCode = res.statusCode;
              const message = res.message;
              if(statusCode == 1){
                try{
                  return {"message": message, "statusCode": statusCode};
                }catch(e){
                  return {"message": e.message, "statusCode": 0};
                }
              }else{
                return {"message": message, "statusCode": statusCode};
              }
            });
        
          }
          
          
          
          
        }), []);
        
        
        
        useEffect(() => {
          
          // await AsyncStorage.removeItem("userToken");
          // await AsyncStorage.removeItem("userProfile");
          
          let isMounted = true;
          NetInfo.fetch().then(state => {
            if(isMounted){
              setIsConnected(state.isConnected);
            }
          });
          
          const unsubscribe = NetInfo.addEventListener(state => {
            if(isMounted){
              setIsConnected(state.isConnected);
            }
          });
          unsubscribe();
          
          let fontName = 'Roboto'
          GlobalFont.applyGlobal(fontName);
          
          
          
          setTimeout(async() => {
            let user, userToken;
            userToken = null;
            user = null;
            try{
              userToken = await AsyncStorage.getItem("userToken");
              if(userToken){
                user = await AsyncStorage.getItem("userProfile");
                user = JSON.parse(user);
                setProfile(user);
              }
            }catch(e){
              console.log("Error on async storage", e);
            }
            dispatch({ type: 'REGISTER', userToken: userToken});
          }, 1000);
          
          SplashScreen.hide();
          return () => { isMounted = false };
          // if(isMounted) {
          // }
        }, []);
        
        if(loginState.isLoading) {
          return (
            <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
            <ActivityIndicator size="large"/>
            </View>
            )
          }
          
          return (
            isConnected ? 
            <AuthContext.Provider value={authContext }>
            <PaperProvider theme={theme}>
            <NavigationContainer>
             {
              loginState.userToken
               ?  <ProfileProvider value={providerValue}>
                  <DrawerScreenStack/>
                  </ProfileProvider>
               : <AppRootStack/>
              } 
            </NavigationContainer>
            </PaperProvider>
            </AuthContext.Provider>
            : <OfflineScreen/>
            );
          }
          
          
          
          export default App;
          
          const styles = StyleSheet.create({
            container: {
              flex: 1, 
            },
            scrollView: {
              flex: 1, 
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              padding:20,
            },
            
            refresh: {
              padding:15,
            },
            title: {
              color: '#05375a',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            },
          });