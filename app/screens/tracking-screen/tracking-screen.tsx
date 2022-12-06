import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, DatePickerAndroid, RefreshControl, Picker } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, AnimatedRegion, Animated, Circle } from 'react-native-maps';
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
import Modal from 'react-native-modalbox';
import { WebView } from "react-native-webview";
import { Radio } from 'native-base';
import Reactotron from 'reactotron-react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import * as Animatable from 'react-native-animatable';
import { CONFIG } from "@utils/config"

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  title: {
    marginBottom: 10
  },
  sublabel: {
    color: "#BABABA", marginRight: 5
  },
  row: {
    flexDirection: "row"
  },
  action: {
    wrapper: {
      marginBottom: 10, marginTop: 20
    },
    btn: {
      marginLeft: 10
    },
    textbox: {
      flex: 1
    }
  },
  floating_btn: {
    position: "absolute", bottom: 50, alignSelf: "center"
  }
}


export interface TrackingScreenProps extends NavigationScreenProps<{}> {
}

export const TrackingScreen: React.FunctionComponent<TrackingScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(false);
    
    const [dateStartPickerVisible, setDateStartPickerVisible] = useState(false);
    const [dateEndPickerVisible, setDateEndPickerVisible] = useState(false);
    const [startDateVal, setStartDateVal] = useState("");
    const [endDateVal, setEndDateVal] = useState("");

    const [employeeId, setEmployeeId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [initLat, setInitLat] = useState(0);
    const [initLong, setInitLong] = useState(0);
    const [positions, setPositions] = useState([]);

    const [loadFinished, setLoadFinished] = useState(false);

    const menuModal = useRef(null);
    const menuModalLocation = useRef(null);
    // const [isEnabled, setIsEnabled] = useState({});
    const [showingInfo, setShowingInfo] = useState({});
    const userAgentAndroid =
        "Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  	const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params ), [
        props.navigation,
    ])

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      resetPositions()
      setRefreshing(false);
      
    }, [refreshing]);

    useEffect( () => {
      resetPositions();

    }, []);

    const resetPositions = () => {
      BackgroundGeolocation.getValidLocations((locations) => {
        // console.log(locations)

        setPositions(locations)
        if(locations.length > 0){
          setInitLat(locations[locations.length - 1].latitude);
          setInitLong(locations[locations.length - 1].longitude);
        }

        setLoadFinished(true)
      });
    }

    const sync = async() => {
      var arr = [ ...positions ]

      arr.map((item) => {
        item.timezone = parseInt(moment(item.time).format('ZZ'))/100;
        item.created_at = moment(item.time).format('YYYY-MM-DD HH:mm:00');

      })

      var param = {
        'bulk_sync': arr
      }

      setLoading(true);
      var result = await rootStore.storeGPS(param);
      setLoading(false);

      if(result.kind == "ok" && result.data && result.data.tracker.length > 0){
        // console.log(result)

        Toast.show('Data GPS anda berhasil tersinkronisasi!')

        setPositions([])

        arr.map((item) => {
          BackgroundGeolocation.deleteLocation(item.id);
        });
      }
      
    }

    const handleDatePicker = (date, type) =>{

      if(type == "start_date"){
        setStartDateVal(date)
        setDateStartPickerVisible(false)

      }else if(type == "end_date"){
        setEndDateVal(date)
        setDateEndPickerVisible(false)
      }
    }

    const renderPin = () => {
      var arr = [];
      positions.map((item) => {
        // console.log(item);
        
        arr.push(
          <Marker
            key={item.time}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
              // onDragEnd={(e) => gantiMaps( e.nativeEvent.coordinate )}
          />
        )
      })

      arr = arr.reverse();

      return arr;
    }

    const renderHistory = () => {
      var arr = [];

      positions.map((item) => {
        // console.log(item);
        
        arr.push(
          <View key={item.id} style={{ marginTop: 10 }}>
            <Text>{moment(item.time).format('MMMM Do YYYY, h:mm:ss a')}</Text>
            <Text style={{ color: "#c0c0c0", fontSize: 10 }}>{item.latitude} , {item.longitude}</Text>
          </View>
        )
      })

      arr = arr.reverse();

      return arr;
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            <DateTimePickerModal
              isVisible={dateStartPickerVisible}
              mode="datetime"
              onConfirm={(date) => handleDatePicker(date, "start_date")}
              onCancel={()=>{setDateStartPickerVisible(false)}}
            />
            <DateTimePickerModal
              isVisible={dateEndPickerVisible}
              mode="datetime"
              onConfirm={(date) => handleDatePicker(date, "end_date")}
              onCancel={()=>{setDateEndPickerVisible(false)}}
            />
    			
          <Head type="detail" title={'Sejarah Tracking Anda'} navigation={props.navigation} noBorder={false} />    
          <View style={{ height: deviceHeight-80}}>

            {(initLat == 0 && initLong == 0 && !loadFinished &&
              <Text style={{ margin: 20 }}>Loading....</Text>
            )}

            {(initLat != 0 && initLong != 0 &&
              <MapView
                  style={{width:deviceWidth, height:0.3*deviceHeight, }}
                  showsUserLocation={true}
                  followsUserLocation={true}
                  initialRegion={{
                    latitude: initLat,
                    longitude: initLong,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}>

                  {renderPin()}

              </MapView>
            )}

            {( positions.length == 0 && loadFinished &&
              <Text style={{ margin: 20 }}>Semua data telah tersinkronisasi!</Text>
            )}

            <View style={{ flex: 1, height: deviceHeight, padding: 20 }}>
              <ScrollView
                style={{ flexGrow: 1 }}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
                {renderHistory()}
              </ScrollView>
            </View>

            {(initLat != 0 && initLong != 0 && positions.length > 0 &&
              <Button 
                onPress={() => sync()} 
                style={{ ...layout.button.primary, ...layout.button.wrapper, ...styles.absen_button, margin: 20, marginTop: 30 }}
              >
                  <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>SINKRONISASI KE SERVER</Text>
              </Button>
            )}
          </View>
        </View>
    )
})
