import React, {useState, useEffect} from 'react';
import { Text, StyleSheet } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";

 const CustomLoader = () =>  {

 const [visible, setVisible] = useState(true);


 useEffect(() => {
    setInterval(() => {
        setVisible(!visible);
      }, 3000);
 })
  
    return (
      <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.75)"
        source={require("../../assets/json/9379-loader.json")}
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text>Loading...</Text>
      </AnimatedLoader>
    );
  }

export default CustomLoader;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});