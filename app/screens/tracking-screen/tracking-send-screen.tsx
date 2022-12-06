import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps, NavigationActions, StackActions } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import I18n from "i18n-js";
import { useStores } from "@models/root-store";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-root-toast';
import { useNetInfo } from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
import Reactotron from 'reactotron-react-native';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import WifiManager from "react-native-wifi-reborn";

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    row: {
        flexDirection: "row"
    },
    icon_add: {
        marginRight: 10, color: "#381D5C"
    }
}


export interface TrackingSendScreenProps extends NavigationScreenProps<{}> {
}

export const TrackingSendScreen: React.FunctionComponent<TrackingSendScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [fieldMemo, setFieldMemo] = useState("");
    const [pageType, setPageType] = useState(props.navigation.state.params.type);

    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
        props.navigation,
    ])

    const HomeScreen = () => { 
        const resetAction = StackActions.reset({
          key: null,
          index: 0,
          actions: [NavigationActions.navigate({ 
            routeName: 'primaryStack' 
          })],
        });
        props.navigation.dispatch(resetAction);
      }

    const doSaveGPS = () => {
        console.log('click on save gps')

        BackgroundGeolocation.checkStatus(status => {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

            // you don't need to check status before start (this is just the example)
            if (!status.isRunning || !status.locationServicesEnabled) {
                Toast.show('Pastikan GPS anda nyala dan sudah absen masuk terlebih dahulu')
                return;
            }
        });

        BackgroundGeolocation.getCurrentLocation(async (position) => {
            console.log('current location', position)

            position.timezone = parseInt(moment(position.time).format('ZZ')) / 100;
            position.created_at = moment(position.time).format('YYYY-MM-DD HH:mm:00');
            position.is_manual = true;

            var enabled = await WifiManager.isEnabled();
            console.log("wifi is " + enabled);

            if (enabled) {
                WifiEntry = await WifiManager.loadWifiList();
                // WifiEntry = await WifiManager.reScanAndLoadWifiList();

                // there are nearby wifi available
                var nearby_wifis = [];
                if (WifiEntry) {

                    console.log("got nearby wifis");
                    console.log(WifiEntry);

                    position.wifi = WifiEntry;
                }
            }

            console.log('[ON LOCATION] BackgroundGeolocation:', position);
            console.log("==========================position==================");
            if (fieldMemo != "") {
                Object.assign(position, { note: fieldMemo });
            }
            console.log(position);

            var result = await rootStore.storeGPS(position);
            // console.log(position)

            if (result.kind == "ok" && result.data) {
                Toast.show('Posisi GPS Tersimpan!');

                if (pageType == "home") {
                    props.navigation.state.params.onBack();
                    goBack();
                }
                else {
                    HomeScreen();
                }
            } else {
                Toast.show('Pastikan GPS anda nyala dan sudah absen masuk terlebih dahulu')
            }

            // if(!appInBackground){
            // var position = {
            // 	...position,
            // 	data: JSON.stringify(position)
            // }

            // rootStore.assignData("gps", position)
            // }

            // DEBUG: turn off temporary
            // each position changing also check the wifi
            // var dapatWifi = await checkWifiRadius();
            // checkPositionValid(dapatWifi, position);

        }, err => {

        }, {
            enableHighAccuracy: true
        });
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            <Head type="detail" title={"Kirim Lokasi"} navigation={props.navigation} />

            <ScrollView style={layout.container.content_wtabbar}>
                <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.textarea }}
                            placeholder="Catatan Tambahan"
                            multiline={true}
                            onChangeText={text => setFieldMemo(text)}
                            value={fieldMemo}
                        />
                    </View>

                    <Button
                        onPress={() => doSaveGPS()}
                        style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>KIRIM LOKASI SEKARANG</Text>
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
})
