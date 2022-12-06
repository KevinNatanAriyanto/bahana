import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, ImageBackground } from "react-native"
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
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    qr_box:{
        width:deviceWidth,
        height:deviceHeight
    },
    qr_top_left:{
        width:0.055*deviceWidth,
        height:0.055*deviceWidth,
        position:'absolute',
        top:0.57*deviceWidth,
        left:0.18*deviceWidth
    },
    qr_top_right:{
        width:0.055*deviceWidth,
        height:0.055*deviceWidth,
        position:'absolute',
        top:0.57*deviceWidth,
        right:0.18*deviceWidth
    },
    qr_bottom_left:{
        width:0.055*deviceWidth,
        height:0.055*deviceWidth,
        position:'absolute',
        top:1.14*deviceWidth,
        left:0.18*deviceWidth
    },
    qr_bottom_right:{
        width:0.055*deviceWidth,
        height:0.055*deviceWidth,
        position:'absolute',
        top:1.14*deviceWidth,
        right:0.18*deviceWidth
    },
}

export interface AbsenceScanScreenProps extends NavigationScreenProps<{}> {
}

export const AbsenceScanScreen: React.FunctionComponent<AbsenceScanScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
   

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
		props.navigation,
	])

    const replace = React.useMemo((routeName, params) => (routeName, params) => props.navigation.replace(routeName, params), [
      props.navigation,
    ])

    // const netInfo = useNetInfo();
    const onSuccess = (e) => {
        // Reactotron.log(e.data)
        // var params = {
        // ...props.navigation.state.params.params,

        // }

        console.log(e)

        getOffice(e.data)
        // props.navigation.navigate("absence_photo",{params});
        // navigateTo("absence_photo");
    };

    const getOffice = async (code) => {
        var data ={
            code : code
        };
        setLoading(true);
        var result = await rootStore.getOffice(data);
        
        // get from storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            result.data = {};
            result.kind = "ok"
            isOffline = true;

            result.data.data = {}

            if(code == rootStore.ship.code){
                if(rootStore.employee.is_abk){
                    result.data.data.office = rootStore.getData("ship");
                }else{
                    result.data.data.office = rootStore.getData("office");
                }
            }else{
                Alert.alert(
                    'Absen Gagal',
                    'Kode kapal yang anda tumpangi tidak sesuai dengan yang ditugaskan pada anda ('+rootStore.ship.name+'). Konsultasikan masalah pada atasan anda.'
                )
            }
        }

        if(result.kind == "ok" && result.data){
            setLoading(false);
            
            // Reactotron.log(result.data.message)
            if(result.data.message == 'An office found' || rootStore.settings.offline_mode){
                var params = {
                    ...props.navigation.state.params.params,
                    office_name:result.data.data.office.name,
                    latitude:result.data.data.office.latitude,
                    longitude:result.data.data.office.longitude,
                    }
                // props.navigation.navigate("absence_photo",{params});
                props.navigation.replace("absence_photo",{params, onGoBack: () => props.navigation.state.params.onGoBack()});

            }else if(result.data.message == 'Office not found'){
                alert('Kantor tidak ditemukan')
            }
        }
    }

    useEffect( () => {

    }, []);


    return (
        <View style={layout.container.general}>
        <Loading loading={loading} />
            <QRCodeScanner
                onRead={onSuccess}
                // flashMode={RNCamera.Constants.FlashMode.torch}
                // topContent={
                //   <Text style={styles.centerText}>
                //     Go to{' '}
                //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
                //     your computer and scan the QR code.
                //   </Text>
                // }
                // bottomContent={
                //   <TouchableOpacity style={{padding: 16}}>
                //     <Text style={styles.buttonText}>OK. Got it!</Text>
                //   </TouchableOpacity>
                // }
              />
              <View style={{position:'absolute'}}>
                <ImageBackground source={require('@assets/qr_box.png')} style={styles.qr_box}>
                    <View style={{ justifyContent:'center', flexDirection:'row'}}>
                        <Image source={require('@assets/qr_top_left.png')} style={styles.qr_top_left}/>
                        <Image source={require('@assets/qr_top_right.png')} style={styles.qr_top_right}/>
                    </View>
                    <View style={{ justifyContent:'center', flexDirection:'row'}}>
                        <Image source={require('@assets/qr_bottom_left.png')} style={styles.qr_bottom_left}/>
                        <Image source={require('@assets/qr_bottom_right.png')} style={styles.qr_bottom_right}/>
                    </View>
                </ImageBackground>
              </View>
        </View>
    )
})
