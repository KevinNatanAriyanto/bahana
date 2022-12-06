import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, RefreshControl, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Head, Loading, Wallpaper, TextField, ErrorMessage, Footer, Gallery } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import { CONFIG } from "@utils/config"
import Toast from 'react-native-root-toast';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface EditLokasiRumahScreenProps extends NavigationScreenProps<{}> {
}

const DEFAULT_HTML_STYLE = {
  baseFontStyle: {
    ...layout.info.description
  },
  ...layout.html
}

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

export const EditLokasiRumahScreen: React.FunctionComponent<EditLokasiRumahScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
  ])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    getPosition();

    setRefreshing(false);
    
  }, [refreshing]);

	useEffect(() => {
		getPosition();
	}, []);

  const getPosition = () => {
    BackgroundGeolocation.getCurrentLocation(
      (position) => {
        lat = position.latitude
        long = position.longitude
        setLatitude(lat)
        setLongitude(long)
      },
      (error) => {
        Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
      },
      {
        enableHighAccuracy: true
      }
    );
  }

	const gantiMaps = (value) => {
		// Reactotron.log(value)
		setLatitude(value.latitude)
		setLongitude(value.longitude)
	}

	const simpan = () => {
		// Reactotron.log(value)
		// setLatitude(value.latitude)
		// setLongitude(value.longitude)
		var lat = latitude.toFixed(7)
		var long = longitude.toFixed(7)
		props.navigation.state.params.simpanGPS(lat, long)
		props.navigation.goBack(null)
	}
  	return (
	    <View style={layout.container.general}>
			<Loading loading={loading} />

			<ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
				<Head type="detail" title={'Edit Lokasi Rumah'} navigation={props.navigation} />
				
				<View>
          <Text style={{ ...layout.typography.body, margin: 20 }}>Pastikan Pin berada pada lokasi rumah anda dan tekan tombol simpan apabila sudah benar</Text>

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
		              <Marker draggable
					    coordinate={{latitude:latitude, longitude:longitude}}
					    onDragEnd={(e) => gantiMaps( e.nativeEvent.coordinate )}
					  />
                  </MapView>
                    {(latitude != 0 && longitude != 0 &&
                  	  <Button onPress={simpan} style={{ ...layout.button.primary, ...layout.button.wrapper, ...styles.absen_button }}>
	                     <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>SIMPAN POSISI</Text>
                      </Button>
                    )}
				</View>
	        </ScrollView>
	    </View>
  	)
})
