import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
import { Radio } from 'native-base';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    base:{
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
        },
    head:{
        fontSize:14,
        color:"#5F5959",
        // fontWeight: "bold",
    },
    ic_marker:{
        width:0.1*deviceWidth,
        height:0.1*deviceWidth
    },
    sliding_header:{
        fontSize:18,
        color:"#5F5959",
    },
    sliding_desc:{
        marginLeft:0.027*deviceWidth,
        fontSize:14,
        color:"#5F5959",
    },
    ok_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.416*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center',
        marginBottom:0.055*deviceWidth
     },
     batal_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.416*deviceWidth,
        height:0.111*deviceWidth,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#8D8D8D',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:0.055*deviceWidth
     },
    ok_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
        },
    batal_text:{
        fontSize:14,
        color:"#8D8D8D",
        fontWeight: "bold",
        },
    container:{
        width: 0.88*deviceWidth,
        // height: 0.22*deviceWidth,
        backgroundColor:'white',
        // marginTop:0.055*deviceWidth,
        marginLeft:0.0625*deviceWidth,
        marginRight:0.0625*deviceWidth,
        borderRadius:10,
        // elevation:2,
        zIndex:3,
        padding:0.055*deviceWidth,
        // flexDirection:'row'
        flexDirection:'row',
        justifyContent:'space-between', 
        alignItems:'center',
        // position:'absolute',
        // top:0.361*deviceWidth
      },
      image_high_priority:{
        width:0.111*deviceWidth,
        height:0.111*deviceWidth,
        alignSelf:'center'
      },
      image_ic_delete:{
        width:0.033*deviceWidth,
        height:0.033*deviceWidth,
        alignSelf:'center'
      },
      alert_text:{
        fontSize:14,
        color:"#8D8D8D",
      },
      absen_button:{
        flexDirection:'row',
        position: "absolute",
        alignSelf:'center',
        bottom:0.138*deviceWidth,
        paddingRight:0.055*deviceWidth,
        paddingLeft:0.055*deviceWidth,
        paddingTop:0.027*deviceWidth,
        paddingBottom:0.027*deviceWidth,
        backgroundColor:'#381D5C',
        borderRadius:10,
        },
    fingerprint_image:{
        height:0.055*deviceWidth,
        width:0.055*deviceWidth,
        marginRight:0.027*deviceWidth,
        },
    absen_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
        },
}

export interface AbsenceGpsScreenProps extends NavigationScreenProps<{}> {
}

export const AbsenceGpsScreen: React.FunctionComponent<AbsenceGpsScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
        props.navigation,
    ])
    
    useEffect( () => {
        getPosition()
        // _panel.show();
    }, []);

    const getPosition = async () => {
        
        // get location storage and update the map
        var location = rootStore.getData('gps');
        var location_data = (location.data) ? JSON.parse(location.data) : null;

        if(location_data && location_data != ""){
            setLatitude(location.latitude)
            setLongitude(location.longitude)
        }else{
            Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
        }
    }

    const cek_gps = () => {
        var lat = null
        var long = null
        Geolocation.getCurrentPosition(
          (position) => {
           //do stuff with location
            // alert('a')
            // _panel.show()
            Reactotron.log('position')
            Reactotron.log(position)
            lat = position.coords.latitude
            long = position.coords.longitude
            setLatitude(lat)
            setLongitude(long)
          },
          (error) => {
            Reactotron.log('error position')
            Reactotron.log(error)
            Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
            // _panel.show()
            // this.setState({locationEnabled: false}),
          },
          {
            enableHighAccuracy: true
          }
        );
    }

    const batal = () => {
        // _panel.hide()
    }
    const ok = () => {
        // _panel.hide()
        // navigateTo("absence_success");
    }

    const cekRealTime = (params) =>{
        Reactotron.log('setUserLocation 8')
        lat = params.coordinate.latitude
        long = params.coordinate.longitude
        setLatitude(lat)
        setLongitude(long)
    }

    const absenFunction = async () => {
        var params = {
        ...props.navigation.state.params.params,
        // photo:data
        }

        var date = new Date()
        var skrg = Helper.renderDateNum(date.getDate(), date.getMonth(), date.getFullYear(), true)
        var jam = Helper.renderTimeAmPm(date)
        // var gps_status = false
        var lat = latitude
        var long = longitude
        let formData = new FormData();
        
        // Reactotron.log(lat)
        // Reactotron.log(long)

        if((lat != 0 && long != 0) || rootStore.settings.offline_mode){
            setLoading(true);

            if(params.absen_datang){
                //absen datang
              formData.append("clock_in_time", jam );
              formData.append("clock_in_ip", '::1');
              formData.append("date", skrg);
              formData.append("working_from", 'LACAKGPS');
              formData.append("your_body_temperature", 1);
              formData.append("is_pcr_test", 1);
              formData.append("is_wash_your_hands_before_work", 1);
              formData.append("clock_in_latitude", lat.toString());
              formData.append("clock_in_longitude", long.toString());
            }else{
              //absen pulang
              formData.append("clock_out_ip", '::1' );
              formData.append("date", skrg );
              formData.append("clock_out_time", jam );
              formData.append("clock_out_latitude", lat.toString() );
              formData.append("clock_out_longitude", long.toString() );
            }
            
            // Reactotron.log('formData')
            // Reactotron.log(formData);
            
            var result = await rootStore.storeAttendanceUsed(formData);
            setLoading(false);

            // save to storage when offline
            var isOffline = false;
            if(result.kind != "ok"){
                isOffline = true;

                var object = {};
                formData._parts.forEach((value, key) => {
                    object[value[0]] = value[1]
                });

                if(params.absen_datang){
                    object.clock_in_time = moment().format();
                }else{
                    object.clock_out_time = moment().format();
                }

                var rand_id = new Date().getTime();
                object.clock_in_date = moment().format("YYYY-MM-DD");
                object.working_from = 'LACAKGPS';
                object.id = rand_id;
                rootStore.pushData('attendances', object, false, 0)

                // save to queue
                rootStore.pushData('my_queues', {
                    related_id: rand_id,
                    type: 'attendance-gps',
                    action: 'storeAttendanceUsed',
                    will_update: "attendances",
                    description: "Absensi menggunakan GPS",
                    data: JSON.stringify(formData)
                });

                // parsing for next page display
                var status = ''
                var data = {}
                  if(!object.clock_out_time){
                    status = 'Datang'
                    data = {
                      status : status,
                      name: rootStore.currentUser.name,
                      date: moment(object.clock_in_time, "HH:mm A").format("YYYY-MM-DD HH:mm")
                    }
                  }else{
                    status = 'Pulang'
                    data = {
                      status : status,
                      name: rootStore.currentUser.name,
                      date: moment(object.clock_out_time, "HH:mm A").format("YYYY-MM-DD HH:mm")
                    }
                }

                props.navigation.navigate("absence_success",{data,onGoBack: () => props.navigation.state.params.onGoBack()});
            }

            if(result.kind == "ok" && result.data.data){
              Reactotron.log('result.data')
              Reactotron.log(result.data.data)
              if(result.data.data.message != 'Attendance success'){
                Reactotron.log('kosong')
                alert(result.data.data.message)
              }else{
                var status = ''
                var data = {}
                  if(!result.data.data.data.attendance.clock_out_time){
                    status = 'Datang'
                    data = {
                      status : status,
                      name:result.data.data.data.user.name,
                      date:result.data.data.data.attendance.clock_in_time
                    }
                  }else{
                    status = 'Pulang'
                    data = {
                      status : status,
                      name:result.data.data.data.user.name,
                      date:result.data.data.data.attendance.clock_out_time
                    }
                }
                  
                props.navigation.navigate("absence_success",{data,onGoBack: () => props.navigation.state.params.onGoBack()});  
              }
              
              
            }
        }else{
            Toast.show('Gagal Absen! Pastikan GPS anda menyala dan tunggu beberapa saat')
        }
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />
            <ScrollView>
                <Head type="detail" title={'Absen dengan GPS'} navigation={props.navigation} />
                <View>
                    <Text style={{ ...layout.typography.body, margin: 20 }}>Absensi dengan GPS hanya ditujukan bagi karyawan tertentu/khusus saja.</Text>
                </View>
                {( (latitude != 0 && longitude != 0) &&
                    <View>
                        <MapView
                            style={{width:deviceWidth, height:0.7*deviceHeight}}
                            showsUserLocation={true}
                            followsUserLocation={true}
                            onUserLocationChange={e => {'onUserLocation', cekRealTime(e.nativeEvent)}}
                            initialRegion={{
                              latitude: latitude,
                              longitude: longitude,
                              latitudeDelta: 0.01,
                              longitudeDelta: 0.01,
                            }}
                        >
                        {/*<MapView.Marker
                            coordinate={{latitude: latitude,
                            longitude: longitude}}
                            title={"title"}
                            description={"description"}
                         />*/}
                        </MapView>
                    
                        <TouchableOpacity onPress={()=>{ absenFunction() }} style={{...styles.absen_button}}>
                            <Image source={require('@assets/fingerprint_white.png')} style={styles.fingerprint_image} />
                            <View><Text style={{...styles.absen_text}}>ABSEN</Text></View>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
            {/*
            <SlidingUpPanel 
                ref={c => _panel = c}
                containerStyle={{ backgroundColor: "#fff", borderRadius: 20, elevation: 7 }}
                allowDragging={false}
                friction={0.3}
                draggableRange={{
                    top: 0.4*deviceHeight,
                    bottom: 0
                }}>
                <View style={{...layout.filter.container, padding:0.055*deviceWidth}}>
                    <View style={{marginBottom:0.1*deviceWidth}}>
                        <Text style={{...styles.sliding_header}}>Aktifkan GPS</Text>
                    </View>
                    <View style={{marginBottom:0.1*deviceWidth, flexDirection:'row'}}>
                        <Image source={require('@assets/ic_marker.png')} style={styles.ic_marker}/>
                        <Text style={{...styles.sliding_desc, marginRight: 40}}>Aktifkan GPS anda untuk dapat melakukan absensi!</Text>
                    </View>
                    <View style={{marginBottom:0.1*deviceWidth}}>
                        <View style={{flexDirection:'row',justifyContent: "space-between", width:0.88*deviceWidth}}>
                            <TouchableOpacity onPress={()=>{ batal() }} style={{...styles.batal_button}}>
                                <Text style={{...styles.batal_text}}>BATAL</Text>
                            </TouchableOpacity> 
                            <TouchableOpacity onPress={()=>{ ok() }} style={{...styles.ok_button}}>
                                <Text style={{...styles.ok_text}}>OK</Text>
                            </TouchableOpacity>    
                        </View>
                    </View>
                </View>
            </SlidingUpPanel>
            */}
        </View>
    )
})
