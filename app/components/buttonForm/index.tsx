import React from "react"
import { View, Text, TouchableNativeFeedback } from "react-native"

const ButtonForm = ({ text, onClick, active=false }) => {
    return (
        <TouchableNativeFeedback onPress={() => onClick(text)} style={{borderRadius:10}}>
            <View style={[{ borderColor:"#bdc3c7", borderWidth:1, paddingHorizontal:20, paddingVertical:8, borderRadius:10, marginRight:5, alignItems:'center', justifyContent:'center' }, active === true && { backgroundColor:"#3e1e57" }]}>
                <Text style={[ { fontWeight:"bold" },active === false ? { color:"#3e1e57" } : { color:"#ffffff" }]}>{text}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

export default ButtonForm

