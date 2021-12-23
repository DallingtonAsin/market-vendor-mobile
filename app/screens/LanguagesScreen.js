import React, {useState, useEffect} from 'react';
import { Text,Image, Button, View, FlatList,ScrollView, TouchableOpacity} from 'react-native';
import RadioButtonsRN from 'radio-buttons-react-native';
import design from '../../assets/css/styles';

const initialState = {
    language: 'Swiss',
    data: [
        {
            label: 'English'
        },
        {
            label:  'German',
        },
        {
            label:  'French',
        },
        {
            label: 'Chinese',
        },
        {
            label: 'Runyankore', 
        },
        {
            label:  'Luganda'
        },
    ],
}

const LanguageScreen = () => {
    
    const [state, setData] = useState(initialState);
    
    const GetSelectedLanguage = (e) =>{
        setData({
            ...state,
            language: 'Chinese',
        })
    }
    
    const ChangeLanguage = () => {
        alert("You have selected", state.language);
    }
    
    
    return(
        <ScrollView elevation={15} style={{ margin:15, padding:30, backgroundColor:'#FAFAFA' }}>
        <Text style={{ fontSize:16, opacity:0.5 }}>Choose language of your preference</Text>
        <RadioButtonsRN  activeColor={design.colors.primary} style={{ margin:20 }} circleSize={16}
        box={true} data={state.data} initial={1}
        selectedBtn={ (e) => {GetSelectedLanguage(e)}}/>
        
        <View style={{  flex: 1, justifyContent:'flex-end', marginTop:30, alignSelf:'center', marginBottom: 36 }}>
        <TouchableOpacity
        style = {[{ backgroundColor:'#273746' }, design.btn]}
        onPress={() => {ChangeLanguage() }} >
        <Text style = {design.btnText}>CHANGE LANGUAGE</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        );
        
    }
    
    export default LanguageScreen