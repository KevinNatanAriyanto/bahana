import React from "react"
import { View, Text, TouchableNativeFeedback } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';

const ListFormContent = ({ title, showDeleteBtn=false, deleteAction, totalFormData, formData=[], onClick, idForm }) => {
    return (
        <View style={{ marginVertical:20 }}>
            <View>
                <Text style={{ fontWeight:'bold' }}>{title+` (${totalFormData})`}</Text>
            </View>
            <View style={{ marginTop:10 }}>
                {
                    formData.length !== 0 &&
                        formData.map((listForm, i) => {
                            return (
                                <TouchableNativeFeedback onPress={() => onClick(listForm.link, listForm.status, listForm, idForm)} key={i}>
                                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                                        <View style={{ borderColor:"#bdc3c7", borderWidth:1, paddingVertical:10, paddingHorizontal:20, borderRadius:10, flexDirection:'row', alignItems:'center', marginVertical:5, flex:1 }}>
                                            <View style={{ width:20, marginRight:20 }}>
                                                <Icon name="list-alt" size={20}/>
                                            </View>
                                            <View style={{ flex:1 }}>
                                                
                                                {
                                                    showDeleteBtn === true &&
                                                    <View style={{ flexDirection:'row', flex:1 }}>
                                                        <View style={{ flex:1 }}>
                                                            <Text style={{ color: "#bdc3c7", fontSize:10 }}>
                                                                {listForm.number}
                                                            </Text>
                                                        </View>
                                                        <View style={{ justifyContent:'flex-end' }}>
                                                            <Text style={{ color: "#bdc3c7", fontSize:10 }}>
                                                                {listForm.date}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                }

                                                <View>
                                                    <Text>
                                                        {listForm.text}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {
                                            showDeleteBtn === true &&
                                            <TouchableNativeFeedback onPress={() => deleteAction(listForm.id)}>
                                                <View style={{ width:20, marginLeft:10 }}>
                                                    <Icon name="trash-o" size={20}/>
                                                </View>
                                            </TouchableNativeFeedback>
                                        }

                                    </View>
                                </TouchableNativeFeedback>
                            )
                        })
                }
            </View>
        </View>
    )
}

export default ListFormContent