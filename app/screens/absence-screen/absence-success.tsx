import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, BackHandler } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Head, Icon, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import I18n from "i18n-js";
import { useStores } from "@models/root-store";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-root-toast';
import {useNetInfo} from "@react-native-community/netinfo";
// import BottomDrawer from 'rn-bottom-drawer';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    base:{
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
    },
    container_success:{
        width: 0.875*deviceWidth,
        // height: 0.22*deviceWidth,
        backgroundColor:'white',
        // marginTop:0.055*deviceWidth,
        // marginLeft:0.0625*deviceWidth,
        // marginRight:0.0625*deviceWidth,
        borderRadius:10,
        elevation:2,
        // paddingLeft:0.055*deviceWidth,
        // paddingRight:0.055*deviceWidth,
        paddingTop:0.27*deviceWidth,
        paddingBottom:0.27*deviceWidth,
        marginBottom:0.083*deviceWidth,
        justifyContent:'center',
        alignItems:'center',
        marginTop:0.055*deviceWidth,
        // marginBottom:0.1*deviceWidth
        // flexDirection:'row'
      },
    back_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.88*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center',
        // position:'absolute', bottom:0.083*deviceWidth
        },
    back_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
        },
    image_checked_confirm:{
        height:0.27*deviceWidth,
        width:0.27*deviceWidth,
        // marginRight:0.055*deviceWidth,
    },
    title_text:{
        fontSize:18,
        color:"#5F5959",
        fontWeight: "bold",
    },
    name_text:{
        fontSize:16,
        color:"#5F5959",
        fontWeight: "bold",
    },
    date_text:{
        fontSize:14,
        color:"#5F5959",
        // fontWeight: "bold",
    },
}

export interface AbsenceSuccessScreenProps extends NavigationScreenProps<{}> {
}

export const AbsenceSuccessScreen: React.FunctionComponent<AbsenceSuccessScreenProps> = observer((props) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Absen Pulang Berhasil!');
    const [name, setName] = useState('Robert Doe - Supervisor Logistik');
    const [date, setDate] = useState('Senin, 30 Maret 2020 - 17:05');

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
		props.navigation,
	])

    // const netInfo = useNetInfo();
    const backAction = () => {
        props.navigation.state.params.onGoBack()
        props.navigation.navigate("home")
        return true;
        };

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, []);

    const back = async (values) => {
        props.navigation.state.params.onGoBack()
        props.navigation.navigate("home")
    }

    useEffect( () => {
        setStatus('Absen '+props.navigation.state.params.data.status+' Berhasil!')
        setName(props.navigation.state.params.data.name)
        var date = new Date(props.navigation.state.params.data.date)
        var jam = '' 
        if(date.getHours()<10){
            jam = '0'+date.getHours()
        }else{
            jam = date.getHours()
        }

        var menit = '' 
        if(date.getMinutes()<10){
            menit = '0'+date.getMinutes()
        }else{
            menit = date.getMinutes()
        }
        // var date_show = Helper.renderDay(date.getDay())+', '+date.getDate()+' '+Helper.getMonth(date.getMonth())+' '+date.getFullYear()+' - '+jam+':'+menit
        var date_show = moment(props.navigation.state.params.data.date).format("DD MMMM YYYY HH:mm")

        setDate(date_show)
    }, []);

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />
            <ScrollView>
                <Head no_back={true} type="detail" title={'Konfirmasi'} navigation={props.navigation} />
                <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                    <View style={{ marginBottom: 80, alignSelf: "center" }}>
                        <View style={{...styles.container_success}}>
                            <View>
                                <Image source={require('@assets/checked_confirm.png')} style={styles.image_checked_confirm} />
                            </View>
                            <View style={{marginTop:0.138*deviceWidth}}>
                                <Text style={{...styles.title_text}}>{status}</Text>
                            </View>
                            <View style={{marginTop:0.055*deviceWidth}}>
                                <Text style={{...styles.name_text}}>{name}</Text>
                            </View>
                            <View style={{marginTop:0.027*deviceWidth}}>
                                <Text style={{...styles.date_text}}>{date}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>{ back() }} style={{...styles.back_button}}>
                            <Text style={{...styles.back_text}}>KEMBALI</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
            </ScrollView>
        </View>
    )
})
