
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View , ActivityIndicator, StatusBar, ScrollView, SafeAreaView, RefreshControl, LogBox, FlatList, Image   } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import WeatherInfo from '../components/weather/WeatherInfo'
import UnitsPicker from '../components/weather/UnitsPicker'
import ReloadIcon from '../components/weather/ReloadIcon'
import WeatherDetails from '../components/weather/WeatherDetails'
import {colors} from '../components/utils/index'
import { config } from '../config/env'
import design from '../../assets/css/styles';
import {WEATHER_API_KEY} from '@env';

const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";
const url =  `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${WEATHER_API_KEY}`;
LogBox.ignoreAllLogs(true);

const WeatherScreen = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [currentWeatherDetails, setCurrentWeatherDetails] = useState(null);
  const [unitsSystem , setUnitsSystem] = useState('metric');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    load();
  }, [unitsSystem]);


  const refreshWeather = async() => {
    setRefreshing(true);
    await load();
    setRefreshing(false);

  }
 
 
 const load = async() => {
    setCurrentWeatherDetails(null)
    setCurrentWeather(null)
    setErrorMessage(null)

    try {
      // let { status } = await Location.requestPermissionsAsync();
      // if (status != "granted") {
      //   setErrorMessage("Access is needed to run the app");
      //   return;
      // }
   
        
      Geolocation.getCurrentPosition(
       async (position) => {
        console.log("On getting Weather", position);
          const latitude =  parseFloat(position.coords.latitude);
          const longitude =  parseFloat(position.coords.longitude);
          const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;
           await fetch(weatherUrl).then(async(response) => {
            const result = await response.json();
            console.log("On getting Weather", result);
            
            if(response.ok){
             setCurrentWeather(result.main.temp)
             setCurrentWeatherDetails(result)
            }
            else {
              setErrorMessage(result.message)
            }

            
          const resp = await fetch( `${url}&lat=${latitude}&lon=${longitude}`);
          const data = await resp.json();
          if(!resp.ok) {
            Alert.alert(`Error retrieving weather data: ${data.message}`); 
          } else {
            setForecast(data);
          }


          setIsLoading(false);

          })
         
          
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

    

    } catch (error) {
      setErrorMessage(error.message)
    }


  }

  if (!forecast || !currentWeatherDetails) {
    return <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large"  color={colors.PRIMARY_COLOR} />
      </SafeAreaView>;
  }


  if(currentWeatherDetails && forecast){

    // const  {main : temp} = currentWeather
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl 
            onRefresh={() => {  refreshWeather() }} 
            refreshing={refreshing}
          />}
      >
        
        <StatusBar
          backgroundColor={design.colors.primary}
        />
        <View style={styles.main}>
        <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem}/>
        <ReloadIcon load={load}/>
        <WeatherInfo currentWeather={currentWeather} currentWeatherDetails={currentWeatherDetails} unitsSystem={unitsSystem}></WeatherInfo>
        </View>

        <WeatherDetails currentWeather={currentWeather} currentWeatherDetails={currentWeatherDetails} unitsSystem={unitsSystem}/>


        <View>
          <Text style={styles.subtitle}>Hourly Forecast</Text>
          <FlatList horizontal
            data={forecast.hourly.slice(0, 24)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(hour) => {
              const weather = hour.item.weather[0];
              var dt = new Date(hour.item.dt * 1000);
              return <View style={styles.hour}>
                <Text>{dt.toLocaleTimeString().replace(/:\d+ /, ' ')}</Text>
                <Text>{Math.round(hour.item.temp)}°C</Text>
                <Image
                  style={styles.smallIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                  }}
                />
                <Text>{weather.description}</Text>
              </View>
            }}
          />
        </View>


        
      </ScrollView>
      </SafeAreaView>
    );
  }
  else if(errorMessage){
    return (
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
        
      </View>
    );
  } 
  else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
        
      </View>
    );
  }
  
}

export default WeatherScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  main : {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 42,
    color: '#e96e50',
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 12,
    marginLeft: 10,
    color: '#e96e50',
  },
 
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
  currentDescription: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 24,
    marginBottom: 24
  },
  hour: {
    padding: 6,
    alignItems: 'center',
  },
  day: {
    flexDirection: 'row',
  },
  dayDetails: {
    justifyContent: 'center',
  },
  dayTemp: {
    marginLeft: 12,
    alignSelf: 'center',
    fontSize: 20
  },
  largeIcon: {
    width: 250,
    height: 200,
  },
  smallIcon: {
    width: 100,
    height: 100,
  }
});