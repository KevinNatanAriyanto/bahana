import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, RefreshControl, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
import { getDistance } from 'geolib';
// import BottomDrawer from 'rn-bottom-drawer';
import AsyncStorage from '@react-native-community/async-storage';
import { Radio } from 'native-base';
import MapView, { Marker, AnimatedRegion, Animated, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    absen_button:{
        flexDirection:'row',
        position: "absolute",
        alignSelf:'center',
        bottom:50,
        paddingRight:0.055*deviceWidth,
        paddingLeft:0.055*deviceWidth,
        paddingTop:0.027*deviceWidth,
        paddingBottom:0.027*deviceWidth,
        backgroundColor:'#381D5C',
        borderRadius:10,
    },
}

export interface AbsenceCheckGpsScreenProps extends NavigationScreenProps<{}> {
}

let periodeChecking;
let location_latitude = 0;
let location_longitude = 0;

export const AbsenceCheckGpsScreen: React.FunctionComponent<AbsenceCheckGpsScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [radius, setRadius] = useState(35);
    const [accuracy, setAccuracy] = useState(9999);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [currentLocation, setCurrentLocation] = useState(null);

    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
        props.navigation,
    ])
    
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getPinPosition();
        getPosition();
        setRefreshing(false);
        
    }, [refreshing]);

    useEffect(() => {
        getPinPosition();

        clearInterval(periodeChecking);
        periodeChecking = setInterval(function(){
            getPosition();
        },3000);

    }, []);

    // unmount
    useEffect( () => () => {
        clearInterval(periodeChecking);
    }, [] );

    const getPinPosition = async () => {
        var working_mode = props.navigation.state.params.workingFrom;
        if(working_mode == "WFH"){
            getPinPositionWFH();
            // setRadius(35);
        }
    }

    const getPosition = async () => {
        
        // get location storage and update the map
        var location = rootStore.getData('gps');
        var location_data = (location.data) ? JSON.parse(location.data) : null;
        // Reactotron.log(location);

        if(location_data && location_data != ""){
            var user_location = location;

            // get distance user with location
            var dist = getDistance({
                latitude: user_location.latitude,
                longitude: user_location.longitude
            },{
                latitude: location_latitude,
                longitude: location_longitude
            });

            setAccuracy(user_location.accuracy);

            if(dist <= radius){
                setCurrentLocation(true);
            }
        }
    }

    const getPinPositionWFH = async () => {
        setLoading(true);
        var result = await rootStore.getEmployeePermission();
        setLoading(false);

        if(result.kind == "ok" && result.data){
            var info = result.data;

            if(info.employee.latitude && info.employee.longitude){
                location_latitude = parseFloat(info.employee.latitude);
                location_longitude = parseFloat(info.employee.longitude);

                setLatitude(location_latitude);
                setLongitude(location_longitude);
            }else{
                Alert.alert("Peringatan", "Lokasi rumah gagal didapat. Silahkan atur pada menu profile.")
            }
        }
    }

    const doContinue = () => {
        clearInterval(periodeChecking);

        var nextScreen = props.navigation.state.params.nextRoute;
        var params = props.navigation.state.params.curParam;

        props.navigation.navigate(nextScreen,{params,onGoBack: () => props.navigation.state.params.onGoBack()});
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />
            <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Head type="detail" title={'Cek Posisi GPS Anda'} navigation={props.navigation} />

                <View>
                    <Text style={{ ...layout.typography.body, margin: 20 }}>Pastikan posisi anda berada pada sedekat mungkin di dalam lingkaran sebelum melanjutkan.</Text>

                    {(latitude != 0 && longitude != 0 &&
                        <View>
                            <MapView
                                style={{width:deviceWidth, height:0.7*deviceHeight, }}
                                showsUserLocation={true}
                                followsUserLocation={true}
                                initialRegion={{
                                  latitude: latitude,
                                  longitude: longitude,
                                  latitudeDelta: 0.01,
                                  longitudeDelta: 0.01,
                                }}>

                                <Circle 
                                    center={{latitude:latitude, longitude:longitude}}
                                    radius={radius}
                                    strokeWidth={0}
                                    fillColor={"rgba(252, 82, 3,0.5)"}
                                />

                                <Marker
                                    coordinate={{latitude:latitude, longitude:longitude}}
                                    // onDragEnd={(e) => gantiMaps( e.nativeEvent.coordinate )}
                                />
                            </MapView>

                            <View style={{ padding: 10, backgroundColor: "#fff", position: "absolute", top: 20, left: 20, opacity: 0.8 }}>
                                <Text style={{ fontSize: 12 }}>Akurat hingga: {parseFloat(accuracy).toFixed(2)}m</Text>
                            </View>

                            {(currentLocation &&
                                <Button onPress={() => doContinue()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...styles.absen_button }}>
                                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>LANJUT ABSENSI</Text>
                                </Button>
                            )}
                        </View>
                    )}

                </View>
            </ScrollView>
        </View>
    )
})
