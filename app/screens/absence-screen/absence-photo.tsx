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
import { RNCamera } from 'react-native-camera';
import Geolocation from '@react-native-community/geolocation';
// import BottomDrawer from 'rn-bottom-drawer';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import WifiManager from "react-native-wifi-reborn";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    button_camera:{
        width:0.16*deviceWidth,
        height:0.16*deviceWidth,
        alignSelf:'center'
    },
    absolute_cam:{
        position:'absolute', 
        alignItems:'center', 
        bottom: 0.138*deviceWidth,
        justifyContent:'center',
        flexDirection:'row',
        // position: "absolute",
        alignSelf:'center',
    }
}

export interface AbsencePhotoScreenProps extends NavigationScreenProps<{}> {
}

export const AbsencePhotoScreen: React.FunctionComponent<AbsencePhotoScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [camera, setCamera] = useState(false);
    const [loadCamera, setLoadCamera] = useState(false);
    const [wifiAccess, setWifiAccess] = useState([]);
    const [isGpsOn, setIsGpsOn] = useState(true);

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
		props.navigation,
	])

    // const netInfo = useNetInfo();
    const takePicture = async () => {
      try{
      if(isGpsOn || rootStore.settings.offline_mode){
        if (camera) {
        // alert('s')
        const options = { quality: 0.5, base64: true, width:1280 };
        const data = await camera.takePictureAsync(options);
        var params = {
          ...props.navigation.state.params.params,
          photo:data
          }
        // Reactotron.log('params foto');
        // Reactotron.log(params);      
        storeAttendance(params)
        // props.navigation.navigate("absence_success",{params});

        // Reactotron.log(data.uri);
        // navigateTo("absence_success");
          }
        }else{
          alert('Anda harus menyalakan dan memberi akses GPS, silahkan kembali setelah menyalakan GPS')
          props.navigation.goBack(null)
        }
      }catch(e){
        setLoading(false);
        Reactotron.log(e);
      }
    }
    
    const getPosition = async () => {
        
        // get location storage and update the map
        var location = rootStore.getData('gps');
        var location_data = (location.data) ? JSON.parse(location.data) : null;

        if((location_data && location_data != "" && !rootStore.settings.offline_mode) || rootStore.settings.offline_mode){
            setLatitude(location.latitude)
            setLongitude(location.longitude)
        }else{
            Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
        }
    }

    const syncLocations = async () => {
      BackgroundGeolocation.getValidLocations(async (locations) => {
        var arr = [ ...locations ]

        arr.map((item) => {
          item.timezone = parseInt(moment(item.time).format('ZZ'))/100;
          item.created_at = moment(item.time).format('YYYY-MM-DD HH:mm:00');

        })

        var param = {
          'bulk_sync': arr
        }

        // console.log(param)

        setLoading(true);
        var result = await rootStore.storeGPS(param);
        setLoading(false);

        // console.log(result)

        if(result.kind == "ok" && result.data && result.data.tracker.length > 0){
          // console.log(result)

          Toast.show('Data GPS anda berhasil tersinkronisasi!')

          arr.map((item) => {
            BackgroundGeolocation.deleteLocation(item.id);
          });
        }
      });
    }

    const storeAttendance = async (params) => {
        
        setLoading(true);

        try{
          /*
          Geolocation.getCurrentPosition(
            (position) => {
             // gps_status = true
             // alert(position)
             
             lat = position.coords.latitude
             long = position.coords.longitude

             Reactotron.log('position')
             Reactotron.log(lat)
             Reactotron.log(long)

             storeAttendanceApi(params, lat, long)
            },
            (error) => {
              // alert(error)
              // gps_status = false            
              Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
            },
            {
              enableHighAccuracy: true
            }
          );
          */

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

            console.log('[ON LOCATION] BackgroundGeolocation:', position);
            console.log("==========================position==================");
            console.log(position);

            // var location = rootStore.getData('gps');
            // var location_data = (location.data) ? JSON.parse(location.data) : null;

            if((!rootStore.settings.offline_mode) || rootStore.settings.offline_mode){
                // setLatitude(location.latitude)
                // setLongitude(location.longitude)

                await syncLocations();
                storeAttendanceApi(params, position.latitude, position.longitude)
            }else{
                Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
                setLoading(false)
            }
        }, err => {

        }, {
            enableHighAccuracy: true
        });
        }catch(e){
          setLoading(false);
          Reactotron.log(e);
        } 
    }

    const checkWifiRadius = () => {
    WifiManager.loadWifiList().then(
      (WifiEntry) => {
        console.log("Listed successfully!");
        Reactotron.log(WifiEntry);
        var array = []

        Toast.show("Silahkan tunggu masih mencari jaringan WiFi...")
        JSON.parse(WifiEntry).map((item,i) => {
          Reactotron.log(item.BSSID)
          var data = item.BSSID
          // if(wifiAccess.includes(item.BSSID)){
          //   Toast.show("Anda berada pada radius kantor");
          // }
          array.push(data)
        });
        Reactotron.log(array)
        setWifiAccess(array)

        Toast.show("Jaringan Wifi ditemukan!")
      },
      (error) => {
        // console.log("Listed failed!");
        Reactotron.log(error);

        switch(error.code){
          case "locationServicesOff":
            setIsGpsOn(false)
            Toast.show("Anda belum menyalakan GPS");
          break;
          case "locationPermissionMissing":
            setIsGpsOn(false)
            Toast.show("Anda belum mengijinkan pemakaian GPS");
          break;
        }
      }
    );

    }

    const storeAttendanceApi = async(params, lat, long) =>{
      var date = new Date()
        // var skrg = Helper.renderDateNum(date.getDate(), date.getMonth(), date.getFullYear(), true)
      var skrg = moment().format("DD-MM-YYYY")
      var jam = Helper.renderTimeAmPm(date)
      var gps_status = false
      var lat = lat
      var long = long
      // Reactotron.log('params.absen_datang')
        // Reactotron.log(params.absen_datang)
        let formData = new FormData();
        // Reactotron.log(params)
        if(params.absen_datang){
          formData.append("clock_in_time", jam );
          
          // todo
          // formData.append("clock_in_timezone", jam );

          formData.append("clock_in_ip", '::1');
          formData.append("date", skrg);
          formData.append("working_from", (params.office_name) ? params.office_name : 'WFH');

          // formData.append("your_body_temperature", (params.suhu) ? params.suhu : null);
          // formData.append("is_pcr_test",(params.question1!=null) ? params.question1 : null );
          // formData.append("is_wash_your_hands_before_work", (params.question2!=null) ? params.question2 : null);
          var pertanyaan = []
          
          if(params.pertanyaan){
            var array_pertanyaan = JSON.parse(params.pertanyaan)
            array_pertanyaan.map((item,i)=>{
              var data = item.id
              pertanyaan.push(data)
            })
          }
          formData.append("pertanyaan", (params.pertanyaan) ? JSON.stringify(pertanyaan): null);
          formData.append("jawaban", (params.jawaban) ? params.jawaban : null);
          // formData.append("pertanyaan", (params.pertanyaan) ? [1,2]: null);
          // formData.append("jawaban", (params.jawaban) ? ['1','2'] : null);
          formData.append("clock_in_latitude", lat);
          formData.append("clock_in_longitude", long);
          formData.append("clock_in_image", {
              uri: params.photo.uri,
              name: 'photo.jpg',
              type: (params.photo.type) ? params.photo.type : "image/jpeg"
            });
          var array = []
          wifiAccess.map((item,i) => {
            array.push(item)
          })

          formData.append("bssid", JSON.stringify(array));
          // formData.append("user_id", JSON.stringify(array));
        }else{
          formData.append("clock_out_ip", '::1' );
          formData.append("date", skrg );
          formData.append("clock_out_time", jam );

          // todo
          // formData.append("clock_out_timezone", jam );

          formData.append("clock_out_latitude", lat );
          formData.append("clock_out_longitude", long );
          formData.append("clock_out_from", (params.office_name) ? params.office_name : 'WFH');
          formData.append("clock_out_image", {
              uri: params.photo.uri,
              name: 'photo.jpg',
              type: (params.photo.type) ? params.photo.type : "image/jpeg"
            });
          var array = []
          wifiAccess.map((item,i) => {
            array.push(item)
          })
          formData.append("bssid", JSON.stringify(array));
        }
        
        // Reactotron.log('formData 3')
        // Reactotron.log(formData)
        
        setLoading(true);
        var result = await rootStore.storeAttendanceUsed(formData);

        // save to storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            setLoading(false);
            
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
            object.working_from = (params.office_name) ? params.office_name : 'WFH';
            object.id = rand_id;
            rootStore.pushData('attendances', object, false, 0)

            // save to queue
            rootStore.pushData('my_queues', {
                related_id: rand_id,
                type: 'attendance-qrcode',
                action: 'storeAttendanceUsed',
                will_update: "attendances",
                description: "Absensi pada "+object.working_from,
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

        // Reactotron.log('result.data storeAttendanceUsed 2')
        // Reactotron.log(result)
        if(result.kind == "ok" && result.data.data){
          // Reactotron.log('result.data')
          // Reactotron.log(result.data.data)
          if(result.data.data.message != 'Attendance success'){
            // Reactotron.log('kosong')
            alert(result.data.data.message)
          }else{
            // Reactotron.log('isi')
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
            // mengisi storage office berisi jam istirahat, jam pulang, lat long office, radius
            /*
            if(status == 'Datang'){
              if(params.office_name){
                storageOfficeData(result.data.data.data.office)
              }else{
                var data_wfh = {
                  wfh:true,
                  latitude:result.data.data.data.employee.latitude,
                  longitude:result.data.data.data.employee.longitude,
                  name:'WFH'
                }
                storageOfficeData(data_wfh)
              }
            }else if(status == 'Pulang'){
              await storageOfficeData('')
            }
            */

            // setTimeout(async () => {
              await syncLocations();
              props.navigation.navigate("absence_success",{data, onGoBack: () => props.navigation.state.params.onGoBack()});
            // }, 5000);
          }
          
        }
    }
    const storageOfficeData = async (value) => {
      try {
        if(value != ''){
          // const jsonOffice = JSON.stringify(value)
          // await AsyncStorage.setItem('office', jsonOffice)  

          var json = {
            ...value,
            data: JSON.stringify(value)
          }
          rootStore.assignData('office', json)
        }else{
          rootStore.removeData('office');
          // await AsyncStorage.removeItem('office');
        }
      } catch (e) {
        // saving error
      }
    }
    useEffect( () => {
      setTimeout(function(){
        setLoadCamera(true)
      },2000);
      checkWifiRadius();
    }, []);


    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            {(loadCamera &&
              <RNCamera
                ref={(ref) => {
                  setCamera(ref);
                }}
                captureAudio={false}
                style={{width:deviceWidth, height:deviceHeight, flex: 1, alignSelf: "stretch" }}
                type={RNCamera.Constants.Type.front}
                // flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                // androidRecordAudioPermissionOptions={{
                //   title: 'Permission to use audio recording',
                //   message: 'We need your permission to use your audio',
                //   buttonPositive: 'Ok',
                //   buttonNegative: 'Cancel',
                // }}
                // onGoogleVisionBarcodesDetected={({ barcodes }) => {
                //   console.log(barcodes);
                // }}
              />
            )}
            <TouchableOpacity style={{ ...styles.absolute_cam }} onPress={()=>{takePicture()}}>
                <Image source={require('@assets/button_camera.png')} style={styles.button_camera} />
            </TouchableOpacity>
        </View>
    )
})
