import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity, Image, View, Text, StyleSheet, Pressable} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants';
import design from '../../assets/css/styles';
const OptionItem = ({ bgColor, icon, label, tintColor, borderRadius, onPress, labelColor }) => {
    return (
        
        <TouchableOpacity
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        onPress={onPress}
        activeOpacity={0.9}
        >
        <View style={[styles.shadow, { width: 90, height: 80, borderColor:'#000' }]}>
        <LinearGradient
        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius ? borderRadius : 10, backgroundColor: 'red' }]}
        colors={bgColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        >
        <Image
        source={icon}
        resizeMode="cover"
        style={{
            tintColor: tintColor ? tintColor : '#fff',
            width: 45,
            height: 45,
        }}
        />
        </LinearGradient>
        </View>
        <Text style={{ marginTop: SIZES.base, color: labelColor ? labelColor : design.colors.primary, ...FONTS.body3, fontWeight:'bold', fontSize:16 }}>{label}</Text>
        </TouchableOpacity>
        )
    }
export default OptionItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        
        elevation: 8,
    }
});

