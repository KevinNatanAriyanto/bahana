import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, BackHandler } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps, withNavigationFocus } from "react-navigation"
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
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    row: {
        flexDirection: "row"
    },
    icon_add: {
        marginRight: 10, color: "#381D5C"
    },
    image: {
        width: '80%',
        height: deviceWidth * 0.5,
        alignSelf: "center",
    },
    header: {
        fontSize: 24, marginTop: 15, marginBottom: 15, color: "black", fontWeight: "bold", alignSelf: "center", textAlign: "center"
    },
    detail: {
        fontSize: 16, marginBottom: 5, color: "black"
    },
}


export interface TrackingHRDScreenProps extends NavigationScreenProps<{}> {
}

let allowScreen;

export const TrackingHRDScreen: React.FunctionComponent<TrackingHRDScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [showButton, setShowButton] = useState(false);

    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
        props.navigation,
    ])

    useEffect(() => {
        // disable back button
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            clearInterval(allowScreen)
        }
    }, []);

    const handleBackButton = () => {
        return true;
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            <Head type="detail" title={"Akses Lokasi"} navigation={props.navigation} no_back={true} />

            <ScrollView style={layout.container.content_wtabbar}>
                <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                    <Image style={styles.image} source={require("@assets/route_vector.jpg")} />

                    <View>
                        <Text style={styles.header}>{props.navigation.state.params.title}</Text>
                        <Text style={styles.detail}>{props.navigation.state.params.body}</Text>

                        <Button
                            onPress={() => navigateTo("tracking_send", { type: "request" })}
                            style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                            <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>{"LAPORKAN POSISI SEKARANG"}</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
})
