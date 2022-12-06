import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { onSnapshot, onAction, onPatch, applySnapshot, applyAction, applyPatch, getSnapshot } from "mobx-state-tree"
import { ViewStyle, View, ImageBackground, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl, PermissionsAndroid, AppState, BackHandler, DeviceEventEmitter, NativeAppEventEmitter, NativeModules } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Ads } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import OneSignal from 'react-native-onesignal';
import PushNotification from 'react-native-push-notification';
import { getDistance } from 'geolib';
// import BottomDrawer from 'rn-bottom-drawer';
// import { Client } from 'bugsnag-react-native';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import MapView, { Marker, AnimatedRegion, Animated, Circle } from 'react-native-maps';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import { translate } from "@i18n"
import { CONFIG } from "@utils/config"
import moment from "moment";
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import BackgroundJob from 'react-native-background-job';
import BackgroundTimer from 'react-native-background-timer';
import RNMockLocationDetector from 'react-native-mock-location-detector';
const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import WifiManager from "react-native-wifi-reborn";
import Bugsee from 'react-native-bugsee';
import { checkInternetConnection, offlineActionCreators } from 'react-native-offline';
import { showMessage, hideMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from 'react-native-device-info';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import reactotron from 'reactotron-react-native';

// import BackgroundGeolocation, {
//   State,
//   Config,
//   Location,
//   LocationError,
//   Geofence,
//   GeofenceEvent,
//   GeofencesChangeEvent,
//   HeartbeatEvent,
//   HttpEvent,
//   MotionActivityEvent,
//   MotionChangeEvent,
//   ProviderChangeEvent,
//   ConnectivityChangeEvent
// } from "react-native-background-geolocation";

export interface HomeScreenProps extends NavigationScreenProps<{}> {
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const styles = {
	img_header: {
		position: "absolute", top: 0, left: 0, width: deviceWidth
	},
	header_action: {
		position: "absolute", top: 0, right: 0, flexDirection: "row"
	},
	header_wrapper: {
		height: 140
	},
	welcome_txt: {
		fontSize: 16, marginBottom: 15, color: "#fff"
	},
	welcome_name: {
		fontSize: 24, fontWeight: "bold", marginBottom: 5, color: "#fff"
	},
	welcome_title: {
		fontSize: 12, color: "#fff"
	},
	icon: {
		width: 30, height: 30, resizeMode: "contain"
	},
	icoWrapper: {
		flex: 1, alignContent: "center", justifyContent: "center", height: null
	}
}

// -------------
// Interval settings
// -------------
let general_counter = 0;
let check_general_interval = 60; // each 60s
let check_leave_current = 0;
let check_leave_interval = 3; // each 3 minutes (in tens)
let check_task_current = 0;
let check_task_interval = 5; // each 5 minutes (in tens)
let notif_atasan_current = 0; 
let notif_atasan_interval = 5; // each 5 minutes (in tens)
let stop_bugsee_current = 0; // each 5 minutes (in tens)
let stop_bugsee_interval = 3; // each 3 minutes (in tens)

let jamKantor = false
let jamIstirahat = false
let blockScreen = false

const SharedStorage = NativeModules.SharedStorage;

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  	const rootStore = useStores()
  	const [loading, setLoading] = useState(false);
  	const [current_user_role, setCurrentUserRole] = useState(null);
  	const [refreshing, setRefreshing] = React.useState(false);
  	const [tasks, setTasks] = React.useState([]);
  	const [unreadNotif, setUnreadNotif] = React.useState(0);
  	const [currentCompany, setCurrentCompany] = React.useState([]);
  	const [companyLogo, setCompanyLogo] = React.useState(require('@assets/logo.png'));
  	const [notifications, setNotifications] = React.useState([]);
  	const [menuReport, setMenuReport] = React.useState(false);
  	const [menuProject, setMenuProject] = React.useState(false);
  	const [refreshOffice, setRefreshOffice] = useState(false);
  	const [watchPositionId, setWatchPositionId] = useState('');
  	const [karyawanKhusus, setKaryawanKhusus] = useState(false);
  	const [officeData, setOfficeData] = useState(null);
  	const [notifAtasan, setNotifAtasan] = useState(false);
  	const [isUpdated, setIsUpdated] = useState(false);
  	const [getPermission, setGetPermission] = useState(false);
  	const [lastClockin, setLastClockin] = useState(null);
  	const [appInBackground, setAppInBackground] = useState(true);
  	const [appState, setAppState] = useState(AppState.currentState);
	const [checkNewNotif, setCheckNewNotif] = useState(false);
	const [checkTrustee, setCheckTrustee] = useState(false);
	const [trusteeCompanies, setTrusteeCompanies] = useState(false);

  	const EventEmitter = Platform.select({
	  ios: () => NativeAppEventEmitter,
	  android: () => DeviceEventEmitter,
	})();

	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params ), [
      	props.navigation,
  	])

  	const onRefresh = React.useCallback(() => {
	    // setRefreshing(true);
	    console.log('on refresh')
	    var promises = [];

	    setLoading(true);
		countUnreadNotif();

	    promises[0] = loadUnreadNotices();
	    promises[1] = loadProfile();
		
		// get all permissions & office locations
		// getEmployeePermission();
		// getMyLeave();
		promises[2] = getLastClockin();
		// checkLatestUpdate();

		rootStore.settings.resetOfflineMode();
		// checkInternet();
		// var checkWifi = checkWifiRadius();

		// get all core data
		promises[3] = runBackgroundInit();

		// DISABLE! DEBUG PURPOSE ONLY
		// doSync();
		// console.log('see storage my_queues')
		// console.log(rootStore.my_queues)
		// rootStore.removeData('my_queues')
		// console.log('after remove storage my_queues')
		// console.log(rootStore.my_queues)
		// console.log(rootStore.ship_schedules);

		// stop bugsee reporting
		stopReport()

		Promise.all(promises).then((values) => {
			console.log('refresh completed')

			setLoading(false)
			setRefreshing(false);
		});

	}, [refreshing]);

	useEffect( () => {
		// loadProfile();
		countUnreadNotif();

		if(typeof rootStore.getCurrentUser().name === "undefined"){
			doLogout();
		}

		// get current user
		var cur_user = rootStore.getCurrentUser();
		
		// Bugsee.log(JSON.stringify(cur_user), Bugsee.LogLevel.Info);
		// Bugsee.showFeedbackUI();
		Bugsee.setAttribute("current_user", JSON.stringify({
			"id": cur_user.id,
			"name": cur_user.name,
			"email": cur_user.email
		}));
		Bugsee.setEmail(cur_user.email);

		// loading core data
		loadAll();

		// var checkWifi = checkWifiRadius();

		// loadUnreadNotices();

		OneSignal.init(CONFIG.ONESIGNAL_KEY, {kOSSettingsKeyAutoPrompt : true});
	  	OneSignal.addEventListener('received', onReceived);
	    OneSignal.addEventListener('opened', onOpened);
	    OneSignal.addEventListener('ids', onIds);

	    // AppState.addEventListener('change', _handleAppStateChange);

	    runBackgroundProcess()
	    runBackgroundGPS()

	    // BackgroundGeolocation.stop();

	    // stop running bugsee reporting
	    stopReport()

	    getTaskReminders();
	    rootStore.getAllUserInfo()

	    rootStore.removeData('gps');

	    // startGps();

	    AppState.addEventListener("change", _handleAppStateChange);

	    // BackHandler.addEventListener('hardwareBackPress', handleBackButton);

	    checkPermission();

	    return () => {
	    	// BackgroundGeolocation.removeListeners();
	    	AppState.removeEventListener("change", _handleAppStateChange);
	    	// BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
	    	ReactNativeForegroundService.stop();

	    	clearInterval(blockScreen);
	    }

	}, []);

	const syncTime = async() => {
	    var result = await rootStore.getServerTime();

	    if(result.kind == "ok" && result.data){
		    var time = result.data.dateTime;

		    var current = moment().format("DD-MM-YYYY HH:mm");
		    var server = moment(time).format("DD-MM-YYYY HH:mm");

		    // check time late (max 5 minutes late)
		    var diff_time = moment.duration(moment().diff(moment(time))).as('minutes');

		    console.log('current: '+current)
		    console.log('server: '+server)

		    // if(moment().unix() != moment(time).unix()){
		    // if(current != server){
		    if(diff_time > 5){
		    	Toast.show("Waktu tidak sama! Silahkan sesuaikan jam device anda. Current: "+current+"; Server: "+server);

		    	setTimeout(function(){
		    		BackHandler.exitApp();
		    	}, 5000);
		    }

	    	return time;
	    }
	}

	const storageAll = async () => {

		setLoading(true)

		var promises = [];

		// save all assignees
		promises[0] = rootStore.getAllAssignees()

		// save all projects
		promises[1] = rootStore.getAllProjects()

		// save all questions
		promises[2] = rootStore.getAllQuestions()

		// save all attendances
		promises[3] = rootStore.getAllAttendances()

		// save all tasks
		promises[4] = rootStore.getAllTasks()

		// save all timelogs
		promises[5] = rootStore.getAllTimelogs()

		// save all user profile data
		promises[6] = rootStore.getAllUserInfo()

		Promise.all(promises).then((values) => {
	  		Toast.show("Download data untuk mode offline selesai")
			setLoading(false)
		});

	}

	const doSync = () => {

		if(!rootStore.settings.offline_mode){
			// Toast.show("Melakukan sinkronisasi data...")

			console.log('running pending queues')
			console.log(rootStore.my_queues)

			rootStore.startQueue();
		}

	}

	// get all downloadable content for offline usage
	const doDownload = () => {
		console.log('storage attendances')
		console.log(rootStore.attendances)
		console.log('storage tasks')
		console.log(rootStore.tasks)
		console.log('storage projects')
		console.log(rootStore.projects)
		console.log('storage timelogs')
		console.log(rootStore.timelogs)

		Alert.alert(
	      "Perhatian",
	      "Anda akan mendownload semua data untuk mode offline, proses ini membutuhkan waktu yang agak lama. Apakah anda yakin? Hanya lakukan ini apabila ada instruksi dari atasan",
	      [
	        {
	          text: "Cancel",
	          // onPress: () => console.log("Cancel Pressed"),
	          style: "cancel"
	        },
	        { text: "OK", onPress: () => storageAll() }
	      ],
	      { cancelable: false }
	    );
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
			// navigateTo("tracking_request", { onBack: onRefresh });
	      }
		  else{
			navigateTo("tracking_send", { type: "home", onBack: onRefresh });
		  }

	      // if(!status.locationServicesEnabled){
				// Toast.show("10000: Tidak bisa mendapatkan GPS. Pastikan mengikuti cara yang benar.")
		  // }

		  // if(!status.isRunning){
			// Toast.show("10001: Tidak bisa mendapatkan GPS. Pastikan mengikuti cara yang benar.")
		  // }

		  // if(!status.authorization){
			// Toast.show("10002: Tidak bisa mendapatkan GPS. Pastikan mengikuti cara yang benar.")
		  // }
	    });

  		// BackgroundGeolocation.getCurrentLocation( async (position) => {
  		// 	console.log('current location', position)

	    // 	position.timezone = parseInt(moment(position.time).format('ZZ'))/100;
	    // 	position.created_at = moment(position.time).format('YYYY-MM-DD HH:mm:00');

	    // 	var enabled = await WifiManager.isEnabled();
		// 	console.log("wifi is "+enabled);

		// 	if(enabled){
		// 		WifiEntry = await WifiManager.loadWifiList();
		// 		// WifiEntry = await WifiManager.reScanAndLoadWifiList();

		// 		// there are nearby wifi available
		// 		var nearby_wifis = [];
		// 		if(WifiEntry){

		// 			console.log("got nearby wifis");
		// 			console.log(WifiEntry);

		// 			position.wifi = WifiEntry;
		// 		}
		// 	}

	    // 	console.log('[ON LOCATION] BackgroundGeolocation:', position);

	    // 	var result = await rootStore.storeGPS(position);
	    // 	// console.log(position)

	    // 	if(result.kind == "ok" && result.data){
	    // 		Toast.show('Posisi GPS Tersimpan!')
	    // 	}else{
	    // 		Toast.show('Pastikan GPS anda nyala dan sudah absen masuk terlebih dahulu')
	    // 	}

	    // 	// if(!appInBackground){
		//     	// var position = {
		//     	// 	...position,
		//     	// 	data: JSON.stringify(position)
		//     	// }

		//     	// rootStore.assignData("gps", position)
		//     // }
	    	
	    // 	// DEBUG: turn off temporary
	    // 	// each position changing also check the wifi
	    // 	// var dapatWifi = await checkWifiRadius();
    	// 	// checkPositionValid(dapatWifi, position);

	    // }, err => {

	    // }, {
	    // 	enableHighAccuracy: true
	    // });
  	}

  	const checkPermission = () => {
  		let permissionGranted = false;
  		let locationEnabled = false;

  		global.blockScreen = setInterval(async () => {

  			// check for new OS
  			var permission_always = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);

            // check for old OS
            var permission_inuse = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

            if(permission_always == RESULTS.GRANTED){
                permissionGranted = true;
            }else{
                // if(permission_always == RESULTS.UNAVAILABLE && permission_inuse == RESULTS.GRANTED){
                //     permissionGranted = true;
                // }else{
                //     permissionGranted = false;
                // }
                permissionGranted = false
            }
  			
  			// check if GPS is on
  			BackgroundGeolocation.checkStatus(status => {		      
		      if (status.locationServicesEnabled && status.authorization && status.isRunning) {
		        locationEnabled = true;
		      }else{
		      	locationEnabled = false;
		      }

		      // console.log('location permission granted? ', permissionGranted)
		      // console.log('location service enabled? ', locationEnabled)

		      if(!locationEnabled || !permissionGranted){
  				navigateTo("tracking_request", { onBack: onRefresh });
  			  }
		    });

  		}, 3000);
  	}

  	const runBackgroundGPS = () => {
  		console.log('---run background gps---')

  		BackgroundGeolocation.stop()

  		var settings = rootStore.getData('settings')
  		var radius = (settings.radius_tracking) ? parseInt(settings.radius_tracking) : 30;
  		console.log('get radius: '+radius);
  		// console.log(settings)
  		
  		// var is_tracked = parseInt(settings.jangan_lacak_saya)
  		var is_tracked = true
  		// if(is_tracked){

	  		BackgroundGeolocation.configure({
		      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
		      notificationTitle: 'Bahana Line Group',
		      notificationText: 'Ketuk untuk membuka aplikasi',
		      debug: false,
		      startOnBoot: true,
		      stopOnTerminate: false,
		      startForeground: false,
		      saveBatteryOnBackground: false,
		      stopOnStillActivity: false,

		      // url: CONFIG.API_URL+'/employee/storeGps',
		      // syncUrl: CONFIG.API_URL+'/employee/storeGpsFail',
		      // httpHeaders: {
		      //   'Authorization': "Bearer "+rootStore.getCurrentUser().access_token
		      // },
		      postTemplate: null,

		      // locationProvider: BackgroundGeolocation.RAW_PROVIDER,
		      
		      // locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
		      // stationaryRadius: 10,
		      // distanceFilter: radius,
		      // interval: 10000,
		      // fastestInterval: 5000,
		      // activitiesInterval: 10000,

		      // interval: 90000,
		      // fastestInterval: 60000,
		      // activitiesInterval: 90000,

		      // interval: 120000,
		      // fastestInterval: 60000,
		      // activitiesInterval: 120000,

		      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
		      // interval: 10000,
		      // fastestInterval: 5000,
		      // activitiesInterval: 10000,

		      // in 15 minutes interval
		      interval: 600000,
		      fastestInterval: 420000,
		      activitiesInterval: 600000,

		      // in 30 minutes interval
		      // interval: 1800000,
		      // fastestInterval: 1200000,
		      // activitiesInterval: 1800000,
		    });

	  		/*
		    BackgroundGeolocation.headlessTask(async (event) => {
		    	console.log('event headless')
		    	console.log(event)

			    if (event.name === 'location' ||
			      event.name === 'stationary') {
			        console.log('event.params')
			        console.log(event.params)
			    }

			    // rootStore.storeGPS(event.params);
			});
			*/
			
		    BackgroundGeolocation.on('location', async (position) => {
		    	position.timezone = parseInt(moment(position.time).format('ZZ'))/100;
		    	position.created_at = moment(position.time).format('YYYY-MM-DD HH:mm:00');

		    	var enabled = await WifiManager.isEnabled();
				console.log("wifi is "+enabled);

				if(enabled){
					WifiEntry = await WifiManager.loadWifiList();
					// WifiEntry = await WifiManager.reScanAndLoadWifiList();

					// there are nearby wifi available
					var nearby_wifis = [];
					if(WifiEntry){

						console.log("got nearby wifis");
						console.log(WifiEntry);

						position.wifi = WifiEntry;
					}
				}

		    	console.log('[ON LOCATION] BackgroundGeolocation:', position);

		    	if(!!is_tracked){
		    		var result = await rootStore.storeGPS(position);
			    	if(result.kind == "ok" && result.data && result.data.length > 0){
			    		BackgroundGeolocation.deleteLocation(position.id);
			    	}

			    	var position = {
			    		...position,
			    		data: JSON.stringify(position)
			    	}

			    	rootStore.assignData("gps", position)
			    }
		    	
		    	// DEBUG: turn off temporary
		    	// each position changing also check the wifi
		    	// var dapatWifi = await checkWifiRadius();
	    		// checkPositionValid(dapatWifi, position);
		    });

		    BackgroundGeolocation.on('stationary', async (position) => {
		    	position.timezone = parseInt(moment(position.time).format('ZZ'))/100;
		    	position.created_at = moment(position.time).format('YYYY-MM-DD HH:mm:00');

		    	var enabled = await WifiManager.isEnabled();
				console.log("wifi is "+enabled);

				if(enabled){
					WifiEntry = await WifiManager.loadWifiList();
					// WifiEntry = await WifiManager.reScanAndLoadWifiList();

					// there are nearby wifi available
					var nearby_wifis = [];
					if(WifiEntry){

						console.log("got nearby wifis");
						console.log(WifiEntry);

						position.wifi = WifiEntry;
					}
				}

				// handle stationary locations here
				// Actions.sendLocation(stationaryLocation);
				console.log('[STATIONARY] BackgroundGeolocation stationary:', position);

				if(!!is_tracked){
					var result = await rootStore.storeGPS(position);
			    	if(result.kind == "ok" && result.data && result.data.length > 0){
			    		BackgroundGeolocation.deleteLocation(position.id);
			    	}

			    	var position = {
			    		...position,
			    		data: JSON.stringify(position)
			    	}

			      	rootStore.assignData("gps", position)
		      	}

		      	// DEBUG: turn off temporary
		      	// each position changing also check the wifi
	    		// var dapatWifi = await checkWifiRadius();
	    		// checkPositionValid(dapatWifi, position);

		    });
		 
		    BackgroundGeolocation.on('error', (error) => {
		      console.log('[ERROR] BackgroundGeolocation error:', error);
		    });
		 
		    BackgroundGeolocation.on('start', () => {
		      console.log('[INFO] BackgroundGeolocation service has been started');
		    });
		 
		    BackgroundGeolocation.on('stop', () => {
		      console.log('[INFO] BackgroundGeolocation service has been stopped');
		      // AsyncStorage.removeItem('gps');
		    });
		 
		    BackgroundGeolocation.on('authorization', (status) => {
		      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
		      if (status !== BackgroundGeolocation.AUTHORIZED) {
		        // we need to set delay or otherwise alert may not be shown
		        setTimeout(() =>
		          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
		            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
		            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
		          ]), 1000);
		      }
		    });
		 
		    BackgroundGeolocation.on('background', () => {
		      console.log('[INFO] App is in background');
		      // setAppInBackground(true)
		    });
		 
		    BackgroundGeolocation.on('foreground', () => {
		      console.log('[INFO] App is in foreground');
		      // setAppInBackground(false)
		    });
		 
		    BackgroundGeolocation.on('abort_requested', () => {
		      console.log('[INFO] Server responded with 285 Updates Not Required');
		 
		      // Here we can decide whether we want stop the updates or not.
		      // If you've configured the server to return 285, then it means the server does not require further update.
		      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
		      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
		    });
		 
		    BackgroundGeolocation.on('http_authorization', () => {
		      console.log('[INFO] App needs to authorize the http requests');
		    });
		    
		 
		    BackgroundGeolocation.checkStatus(status => {
		      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
		      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
		      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
		 
		      // you don't need to check status before start (this is just the example)
		      if (!status.isRunning) {
		        BackgroundGeolocation.start(); //triggers start on start event
		      }

		      // if(!status.locationServicesEnabled){
  				// Toast.show("10000: Tidak bisa mendapatkan GPS. Pastikan mengikuti cara yang benar.")
			 //  }

			 //  if(!status.isRunning){
				// Toast.show("10001: Tidak bisa mendapatkan GPS. Pastikan mengikuti cara yang benar.")
			 //  }

			 //  if(!status.authorization){
				// Toast.show("10002: Tidak bisa mendapatkan GPS. Pastikan mengikuti cara yang benar.")
			 //  }
		    });
	    // }
	    
		// BackgroundGeolocation.start();
  	}
  	

  	const checkInternet = async() => {
  		var netinfo = await NetInfo.fetch();
		console.log("internet connected? "+netinfo.isConnected);

		var settings = rootStore.getData('settings')

		if(netinfo.isConnected){
			rootStore.assignData("settings", { offline_mode: false })
			hideMessage();

			// start the queue
			// myqueue.start()
		}else{
			rootStore.assignData("settings", { offline_mode: true })

			// set updated and get permission
			setGetPermission(true);
			setIsUpdated(true);

			// only displaying the message once
			if(!settings.offline_mode){
				Helper.offlineMsg(true);
			}
		}
  	}

  	/*
  	const startGps = async () => {
  		// This handler fires whenever bgGeo receives a location update.
	    BackgroundGeolocation.onLocation((location) => {
	    	console.log('[location] -', location);
	    }, (error) => {
	    	console.log('[location] ERROR -', error);
	    });

	    // This handler fires when movement states changes (stationary->moving; moving->stationary)
	    BackgroundGeolocation.onMotionChange((event) => {
	    	console.log('[motionchange] -', event.isMoving, event.location);
	  	});

	    // This event fires when a change in motion activity is detected
	    BackgroundGeolocation.onActivityChange((event) => {
		    console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'
	  	});

	    // This event fires when the user toggles location-services authorization
	    BackgroundGeolocation.onProviderChange((provider) => {
	    	console.log('[providerchange] -', provider.enabled, provider.status);
	  	});

	    ////
	    // 2.  Execute #ready method (required)
	    //

	    BackgroundGeolocation.ready({
	      // Geolocation Config
	      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
	      distanceFilter: 0,
	      locationUpdateInterval: 10,
	      fastestLocationUpdateInterval: 5,

	      // Activity Recognition
	      stopTimeout: 1,
	      // Application config
	      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
	      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
	      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
	      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.

	      // HTTP / SQLite config
	      // batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
	      // autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
	      // url: CONFIG.API_URL+'/employee/storeGps',
	      // headers: {
	      //   'Authorization': "Bearer "+rootStore.getCurrentUser().access_token,
	      //   'Accept': 'application/json',
	      //   'Content-Type': 'application/json'
	      // },
	      // params: {
	      //   'Authorization': "Bearer "+rootStore.getCurrentUser().access_token,
	      //   'Accept': 'application/json',
	      //   'Content-Type': 'application/json'
	      // },

	    }, (state) => {
	      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

	      if (!state.enabled) {
	        ////
	        // 3. Start tracking!
	        //
	        BackgroundGeolocation.start(function() {
	          console.log("- Start success");
	        });
	      }
	    });
  	}
  	*/

  	/*
  	const saveGPSPosition = async () => {

  		RNLocation.configure({
		  	distanceFilter: 0,
		  	desiredAccuracy: {
			  ios: "best",
			  android: "highAccuracy"
			},
			// Android only
			stopOnTerminate: false,
			androidProvider: "auto",
			interval: 600000, // Milliseconds
			fastestInterval: 300000, // Milliseconds
			maxWaitTime: 600000, // Milliseconds

			// interval: 5000, // Milliseconds
			// fastestInterval: 3000, // Milliseconds
			// maxWaitTime: 5000, // Milliseconds
		})
		 
		RNLocation.requestPermission({
		  ios: "always",
		  android: {
		    detail: "fine"
		  }
		}).then(granted => {
		    if (granted) {

		      var locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {

		      	var position = locations[0];
		      	console.log(position)

		      	// update to server
		      	rootStore.storeGPS(position);

		      	// save to local storage
				var position = {
					...position,
					data: JSON.stringify(position)
				}
				rootStore.assignData("gps", position)
		      })
		      

		   //    RNLocation.getLatestLocation({ timeout: 60000 })
			  // .then(latestLocation => {
			  // 	console.log(latestLocation)
			  // })

		    }
		  })
  	}
  	*/



  	const runBackgroundInit = async () => {

  		try{
	  		getMyLeave();
			await getEmployeePermission();
			// runBackgroundGPS();
			
			// saveGPSPosition();
			// startGps();

			checkInternet();
			syncTime();
	  		// checkLatestUpdate();

			var dapatWifi = await checkWifiRadius();

			/*
			RNLocation.requestPermission({
			  ios: "always",
			  android: {
			    detail: "fine"
			  }
			}).then(granted => {
			    if (granted) {
			    	var dapatGps = rootStore.getData('gps');
			    }else{
			    	rootStore.removeData('gps');
			    }

			    checkPositionValid(dapatWifi, dapatGps);
			});
			*/

			BackgroundGeolocation.checkStatus(async (status) => {
	      		console.log('[INFO] BackgroundGeolocation service is running: '+status.isRunning);
	      		console.log('[INFO] BackgroundGeolocation services enabled: '+status.locationServicesEnabled);

	      		var dapatGps = null;

	      		if(status.locationServicesEnabled && status.authorization){
	      			// get storage if gps is enabled
	      			dapatGps = rootStore.getData('gps');
	  			}else{
	  				// remove storage on gps disabled
	  				rootStore.removeData('gps');
	  			}

	  			checkPositionValid(dapatWifi, dapatGps);
	  		});
	  		

  		}catch(e){
			console.log('error')
			console.log(e)

			if(e.code){
				switch(e.code){
			    	case "locationServicesOff":
			    		Toast.show("Anda belum menyalakan GPS");
			    		showNotif(2, "gpserror", "Segera menyalakan GPS anda", "Tidak bisa mendapatkan lokasi");

			    	break;
			    	case "locationPermissionMissing":
			    		Toast.show("Anda belum mengijinkan pemakaian GPS");
			    	break;
			    }
		    }
		}
  	}

  	// depreciated
  	const bgProcessFunc = async () => {
  		general_counter++;

    	var array = []
		// Reactotron.log('jalanBackgroundTimer 2')
		var WifiEntry;

		try{
			console.log('init background process')
			// saveGPSPosition();
			// startGps();

			// ---------------------
			// syncing pending queues
			// ---------------------
			doSync();

			// ---------------------
			// stopping bug reporting
			// depreciated
			// ---------------------
			/*
			stop_bugsee_current++;
			if(stop_bugsee_current == stop_bugsee_interval){

				stopReport();

				stop_bugsee_current = 0;
			}
			*/

			// ---------------------
			// checking internet connection
			// ---------------------
			checkInternet();

			// ---------------------
			// reminder interval activity report
			// ---------------------
			check_task_current++;
			if(check_task_current == check_task_interval){

				// refresh new task reminder
				getTaskReminders();

				// reset the counter
				check_task_current = 0;
			}

			doRemindTasks();
			

			// ---------------------
			// check application version & server time
			// ---------------------
			checkLatestUpdate();

			// ---------------------
			// check leave status
			// IMPORTANT: CANNOT UPDATE LAYERS WHEN ON BACKGROUND / APP KILL
			// ---------------------
      		check_leave_current++;
	    	if(check_leave_current == check_leave_interval){

	    		// if(!appInBackground){

	    			// temporary relocation
		    		// console.log('check leave status')
		    		// await getMyLeave();
		    		// await getEmployeePermission();

		    	// }

	    		// reset the counter
	    		check_leave_current = 0;
	    	}

	    	// every 60s
	    	if(general_counter % 6 == 0){

	    		console.log('check leave status')
	    		syncTime();
	    		await getMyLeave();
	    		await getEmployeePermission();

	    		console.log('check wifi status')

				// ---------------------
				// cek wifi
				// ---------------------
				var dapatWifi = await checkWifiRadius();

				// ---------------------
				// cek gps
				// ---------------------
				// saveGPSPosition();
				BackgroundGeolocation.checkStatus(async (status) => {
		      		console.log('[INFO] BackgroundGeolocation service is running: '+status.isRunning);
		      		console.log('[INFO] BackgroundGeolocation services enabled: '+status.locationServicesEnabled);

		      		var dapatGps = null;

		      		if(status.locationServicesEnabled){
		      			// get storage if gps is enabled
		      			dapatGps = rootStore.getData('gps');
	      			}else{
	      				// remove storage on gps disabled
	      				rootStore.removeData('gps');
	      			}

	    			checkPositionValid(dapatWifi, dapatGps);
	      		});
	      		
			}

		}catch(e){
			console.log('error')
			console.log(e)

			if(e.code){
				switch(e.code){
			    	case "locationServicesOff":
			    		Toast.show("Anda belum menyalakan GPS");
			    		showNotif(2, "gpserror", "Segera menyalakan GPS anda", "Tidak bisa mendapatkan lokasi");

			    	break;
			    	case "locationPermissionMissing":
			    		Toast.show("Anda belum mengijinkan pemakaian GPS");
			    	break;
			    }
		    }
		}
  	}

  	const runBackgroundProcess = async () => {

  		// run init process
  		runBackgroundInit();
  		// runBackgroundGPS();
  		syncTime();

  		ReactNativeForegroundService.stop();

  		// temporary disabled ~ try another service
  		// start GPS service after 5 seconds
  		// ReactNativeForegroundService.add_task(saveGPSPosition, {
		//   delay: 5000,
		//   onLoop: false,
		//   taskId: 'GPSTasks',
		//   onError: (e) => console.log(`Error logging GPS:`, e),
		// });

		ReactNativeForegroundService.add_task(async () => {
			SharedStorage.set(
				JSON.stringify({text: 'Connected'})
			);
		}, {
		  delay: 10000,
		  onLoop: true,
		  taskId: 'widgetTasks',
		  onError: (e) => console.log(`Error logging Widget:`, e),
		});

  		// run general tasks every 1 minutes
		ReactNativeForegroundService.add_task(async () => {
			// ---------------------
			// syncing pending queues
			// ---------------------
			doSync();

			// ---------------------
			// checking internet connection
			// ---------------------
			checkInternet();

			// ---------------------
			// cek wifi
			// ---------------------
			console.log('check wifi status')
			var dapatWifi = await checkWifiRadius();
			var dapatGps = rootStore.getData('gps');
      		
      		if(dapatGps && dapatWifi){
  				checkPositionValid(dapatWifi, dapatGps);
			}

			// ---------------------
			// check application version & server time
			// ---------------------
			checkLatestUpdate();

		}, {
		  delay: 120000,
		  onLoop: true,
		  taskId: 'generalTasks',
		  onError: (e) => console.log(`Error logging General:`, e),
		});

		// run permissions tasks every 5 minutes
		ReactNativeForegroundService.add_task(async () => {
			
			// ---------------------
			// cek latest status
			// ---------------------
			console.log('check leave status')
    		syncTime();
    		await getMyLeave();
    		await getEmployeePermission();

		}, {
		  delay: 300000,
		  onLoop: true,
		  taskId: 'permissionTasks',
		  onError: (e) => console.log(`Error logging Permission:`, e),
		});

		// run reminder tasks every 60s
		ReactNativeForegroundService.add_task(() => {
			// ---------------------
			// reminder interval activity report
			// ---------------------
			// refresh new task reminder
			getTaskReminders();
			doRemindTasks();

		}, {
		  delay: 120000,
		  onLoop: true,
		  taskId: 'reminderTasks',
		  onError: (e) => console.log(`Error logging Reminder:`, e),
		});

		// start all background tasks
		setTimeout(function(){
			ReactNativeForegroundService.start({
			  id: 2525,
			  title: 'Bahana Line EBIS',
			  message: 'Aplikasi terhubung',
			});
		}, 5000);

	  	// BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.

	  	// new method
	  	// BackgroundTimer.start(check_general_interval*1000);
	  	// EventEmitter.addListener('backgroundTimer', bgProcessFunc);

	  	// old method
	    // BackgroundTimer.runBackgroundTimer(bgProcessFunc, (check_general_interval*1000))
	}

	const checkLatestUpdate = async () => {
		console.log('checking latest application update')
		var is_apps_latest = true;

		// always set flag as updated for development environment
		// if(CONFIG.ENVIRONMENT == "production"){
			// var settings = await AsyncStorage.getItem('settings');
			var settings = rootStore.getData("settings");
			// var settings_data = (settings.data) ? JSON.parse(settings.data) : null;

			var config_notif = {
				duration: (check_general_interval*1000),
				position: -100,
				hideOnPress: false
			}

			if(settings.update_version && settings.application_version){
				if(settings.update_version != CONFIG.APP_VERSION){
					is_apps_latest = false;
					Toast.show("Aplikasi belum terupdate. Restart aplikasi untuk mendapatkan update terbaru ("+settings.update_version+")", config_notif)
				}else if(settings.application_version != DeviceInfo.getVersion()){
					is_apps_latest = false;
					Toast.show("Anda masih menggunakan aplikasi versi lama. Hubungi admin untuk mendapatkan versi baru ("+settings.application_version+")", config_notif)
				}
				setIsUpdated(is_apps_latest)
			}
		// }else{
		// 	setIsUpdated(is_apps_latest)
		// }
	}

	const checkPositionValid = async (wifiAccess, gpsAccess) => {
		var valid = false;
		var error_type = 0;
		const my_attendance = rootStore.getData('my_attendance')

		// ---------------------
	    // cek apakah user tidak perlu absensi atau tidak
	    // ---------------------
	    const valueDesignation = rootStore.getData('my_designation')

	    // if(valueDesignation != null && valueDesignation.id && !valueDesignation.check_late || !rootStore.my_permission.is_required_absence){
	    if(rootStore.my_permission.is_required_absence == "0"){
	    	console.log("user tidak perlu absen");
	    	valid = true;
	    }
		
	    // ---------------------
	    // cek cluster kantor untuk menentukan jam kantor atau tidak
	    // ---------------------
	    const valueCluster = rootStore.getData('cluster')

	    if(!valid && valueCluster !== null && valueCluster.name) {
			var storage = valueCluster

			// check if user is on shift mode or clustered office
			if(storage.start_hour && storage.end_hour && storage.start_hour != 'null' && storage.end_hour != 'null' && !!storage.start_hour && !!storage.end_hour && storage.start_hour !== null && storage.end_hour !== null){

				console.log('run shift mode')

				// run shift mode
				var office_start = moment(storage.start_hour, "HH:mm A").format("YYYY-MM-DD HH:mm");
	            var office_end = moment(storage.end_hour, "HH:mm A").format("YYYY-MM-DD HH:mm");
	            var break_start = moment(storage.istirahat_awal, "HH:mm A").format("YYYY-MM-DD HH:mm");
	            var break_end = moment(storage.istirahat_akhir, "HH:mm A").format("YYYY-MM-DD HH:mm");
	            
	            console.log("jam kantor shift: "+office_start+" - "+office_end)

	            jamKantor = false;
	            if(moment().isBetween(office_start, office_end)){
	            	console.log("berada pada jam kantor shift")
	                jamKantor = true;
	            }

	            if(!!storage.istirahat_awal && !!storage.istirahat_akhir){

		            jamIstirahat = false;
		            if(moment().isBetween(break_start, break_end)){
		            	console.log("berada pada jam istirahat")
		                jamIstirahat = true;
		            }
	            }
            }else{

            	// run clustered
            	// var jadwal_today = JSON.parse(storage.jadwal_today);

            	if(!!storage.jadwal_today){
            		console.log('run clustered mode')
            		console.log(storage.jadwal_today)

	            	var jadwal_today = storage.jadwal_today;

	            	var office_start = moment(jadwal_today.jam_masuk, "HH:mm A").format("YYYY-MM-DD HH:mm");
		            var office_end = moment(jadwal_today.jam_pulang, "HH:mm A").format("YYYY-MM-DD HH:mm");
		            var break_start = moment(jadwal_today.istirahat_awal, "HH:mm A").format("YYYY-MM-DD HH:mm");
		            var break_end = moment(jadwal_today.istirahat_akhir, "HH:mm A").format("YYYY-MM-DD HH:mm");

		            console.log("jam kantor cluster: "+office_start+" - "+office_end)

		            jamKantor = false;
		            if(moment().isBetween(office_start, office_end)){
		            	console.log("berada pada jam kantor cluster")
		                jamKantor = true;
		            }

		            if(!!jadwal_today.istirahat_awal && !!jadwal_today.istirahat_akhir){

			            jamIstirahat = false;
			            if(moment().isBetween(break_start, break_end)){
			            	console.log("berada pada jam istirahat")
			                jamIstirahat = true;
			            }
		            }
		        }
            }
		}
		// console.log('pada jam kantor? '+jamKantor);

		// check whether wifi is available nearby
		if(!valid && wifiAccess && typeof wifiAccess == 'boolean'){
    		console.log('wifi is available nearby');
    		valid = true;
    	}

		const valueOffice = rootStore.getData('office')
    	console.log('storage office')
    	console.log(valueOffice)

    	// console.log('gps access')
    	// console.log(gpsAccess)

    	// checking if user doing WFH or office qrcode
    	if(!valid && valueOffice != null && valueOffice.name && gpsAccess) {
    		console.log('user is doing WFH or office qrcode')

    		// get data from user office storage
			storage = valueOffice
			var data = {
	    		office : storage.name,
	    		accuracy: 0
	    	}

	    	// step 2. start checking gps when wifi nearby not detected or wifi nearby not valid
	    	if(!valid){
		    	if(gpsAccess && gpsAccess.longitude && gpsAccess.latitude){

		    		// if(typeof gpsAccess == 'string'){
		    		// 	gpsAccess = JSON.parse(gpsAccess);
	    			// }

		    		console.log('get gps access');
		    		console.log(gpsAccess);

					var office_distance = getDistance(
					    { latitude: gpsAccess.latitude, longitude: gpsAccess.longitude },
					    { latitude: (storage.latitude) ? storage.latitude : 0, longitude: (storage.longitude) ? storage.longitude : 0 }
					);

					data.accuracy = parseFloat(gpsAccess.accuracy).toFixed(2);
					var jarak_ke_kantor = (storage.wfh) ? 35 : (storage.radius) ? storage.radius : null;
					
					console.log('office_distance: '+ office_distance)
					console.log('jarak_ke_kantor: '+ jarak_ke_kantor)

					if(!!office_distance && !!jarak_ke_kantor && (office_distance > jarak_ke_kantor)){

						// pada jam kantor dan diluar kantor
						if(jamKantor){
							console.log("user diluar kantor pada jam kantor")

							if(storage.wfh){
								console.log("user melakukan WFH")
							}

							error_type = 1;
							data.distance_diff = parseInt(office_distance) - parseInt(jarak_ke_kantor);
							data.office_distance = office_distance;
							data.jarak_ke_kantor = jarak_ke_kantor;

						}else{
							console.log("user didalam kantor diluar jam kantor")

							// pada jam kantor dan didalam kantor
							valid = true;
						}
					}else if(!office_distance || !jarak_ke_kantor){
						console.log('tidak ada jarak ke kantor');
					}else{
						console.log("user didalam kantor")
						valid = true;
					}
				}
			}
		}

		// user doing karyawan khusus (only need enable gps)
		else if(!valid && valueOffice != null && !valueOffice.name && gpsAccess){
			console.log('user as karyawan khusus and has gps access')
			valid = true;
		}

		if(jamKantor){
			// console.log('user berada pada lokasi: '+valid);
			console.log("pada jam kantor")
			console.log(my_attendance)

			if(my_attendance && my_attendance.clock_in_time){
				console.log("sudah absen masuk")
				// valid = true
			}else{
				console.log("belum absen masuk")
				error_type = 3;
				valid = false;
			}

			if(my_attendance && my_attendance.clock_out_time){
				console.log("sudah absen keluar")
				error_type = 2;
				valid = false;
			}

		}else{
			console.log('diluar jam kantor')
			valid = true;
		}

		// pengecualian untuk jam istirahat
		if(jamIstirahat){
			valid = true;
		}

		// 3. start checking for leave allow status
		var leaves = rootStore.getData('my_leaves');

		if(!valid){
			if(leaves && leaves != "" && leaves.length > 0){
				var have_leave = false;
				console.log("melihat semua ijin user");

				var date_now = moment().format();

				leaves.map((item,i) => {
					if(item.id){
						var start_date = moment(item.leave_date.toString()).format("YYYY-MM-DD");
						// var item_child = JSON.parse(item.child);
						var item_child = item.child;

						if(item_child && item_child.start_hour){
							start_date += " "+item_child.start_hour;
						}else{
							start_date += " 00:00:00";
						}
						start_date = moment(start_date);

						var end_date = moment(item.leave_date_end.toString()).format("YYYY-MM-DD");
						if(item_child && item_child.end_hour){
							end_date += " "+item_child.end_hour;
						}else{
							end_date += " 23:59:59";
						}
						end_date = moment(end_date);

						var is_between = moment().isBetween(start_date, end_date);

						if(is_between){
							valid = true;
							have_leave = true;
						}
					}
				});

				console.log('saat ini user punya ijin: '+have_leave);
			}else{
				console.log("user tidak mempunyai ijin")
			}
		}

		// 4. checking if user have extra access for none notification
		// NOT USED DUE TO POLICY CHANGED
		/*
		console.log('checking user permission from supervisor')
		var employee = rootStore.getData('employee');

		if(!!employee){
			var employee_data = JSON.parse(employee.data);

			if(!valid && employee_data && employee_data != ""){
				if(employee.no_notification){

					// check the date allowed
					if(employee.no_notification_start && employee.no_notification_end){
						var start_date = moment(employee.no_notification_start);
						var end_date = moment(employee.no_notification_end);

						var is_between = moment().isBetween(start_date, end_date);

						if(is_between){
							console.log("user punya ijin khusus dari atasan")
							valid = true;
						}
					}else{
						console.log("user tidak punya ijin khusus dari atasan")
					}

				}else{
					console.log("user tidak punya ijin khusus dari atasan")
				}
			}
		}
		*/

		// disable ALL checking when no internet connection available
		var settings = rootStore.getData('settings');
		if(settings.offline_mode){
			valid = true;
		}

		if(!valid && jamKantor){
			console.log('error type: '+error_type);

			switch(error_type){
				case 0:
					var title = "Tidak bisa mendapatkan lokasi";
					var str = "Cek koneksi GPS & Wifi Anda dan tunggu beberapa saat";
					console.log(title+". "+str)

					showNotif(0, "locationoff", title, str);
				break;

				case 1:
					var office_title = (data.office) ? data.office : "(Unknown)"
					var title = "Segera kembali ke "+office_title;
					var str = "Anda sudah keluar "+data.office_distance+"m dari radius kantor "+data.jarak_ke_kantor+"m. Ketepatan GPS dalam "+data.accuracy+" m";
					console.log(title+". "+str)

					if(data.accuracy < 50){
						showNotif(1, "outsideradius", title, str)

						console.log("notif atasan setiap/setelah 5 menit masih keluar radius");
						if(notif_atasan_current >= notif_atasan_interval){
							notifAtasanApi()
							notif_atasan_current = 0;
						}else{
							notif_atasan_current++;
						}
					}
				break;

				case 2:
					var title = "Pemberitahuan pulang lebih awal";
					var str = "Anda masih berada pada jam kantor dan sudah absen pulang. Silahkan lakukan absen masuk kembali.";
					console.log(title+". "+str)

					showNotif(2, "checkoutinofficehour", title, str);
				break;

				case 3:
					var title = "Segera Absen";
					var str = "Anda masih berada di dalam periode jam kantor";
					console.log(title+". "+str)

					showNotif(3, "inofficehour", title, str);
				break;

				default:
					// showNotif(0, "locationoff", "Tidak bisa mendapatkan lokasi", "Nyalakan GPS & Wifi Anda");
				break;
			}
		}
	}

	const showNotif = (id, tag, title, message) => {
		PushNotification.localNotification({
        	id: id.toString(),
			// bigText: "Anda keluar dari radius "+params.office+", jarak anda dengan "+params.office+" adalah "+params.office_distance+" m", // (optional) default: "message" prop
			// bigText: "Tidak bisa mendapatkan lokasi", // (optional) default: "message" prop
			// subText: "Segera menyalakan GPS anda", // (optional) default: none
			tag: tag, // (optional) add tag to message
			group: tag, // (optional) add group to message
			ongoing: false, // (optional) set whether this is an "ongoing" notification
			priority: "high", // (optional) set notification priority, default: high
			visibility: "private", // (optional) set notification visibility, default: private
			importance: "high", // (optional) set notification importance, default: high
			// allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
			ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
			title: title, // (optional)
			message: message, // (required)
			playSound: false, // (optional) default: true
			vibrate: false,
			vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
			// repeatType: "time",
			// repeatTime: 10000,
			// date: new Date(Date.now())
    	})
	}

	const countUnreadNotif = async () => {
		setLoading(true);
		var result = await rootStore.checkUnreadNotifDB();
		setLoading(false);

		Reactotron.log(result);

		if(result.kind == "ok" && result.data){
			setCheckNewNotif(result.data.data.new_message);
		}
  	}

  	const loadProfile = async () => {
	  	// get new data of user profile
		// setLoading(true);
	    var result = await rootStore.getCurrentProfile();
	    // setLoading(false);

	    // Reactotron.log(result.data);

	    if(result.kind == "ok" && result.data){
	    	rootStore.assignCurrentUser(result.data);
	    }
	}

	const notifAtasanApi = async(params) => {
	    var result = await rootStore.notifyAtasanKeluarRadius();

	    if(result.kind == "ok"){
	      
	    }
	}	

	const loadAll = () => {
		setLoading(true);

		var promises = []

		promises[0] = getEmployeePermission();
		promises[1] = getMyLeave();
		promises[2] = getLastClockin();
		promises[3] = loadUnreadNotices();

		// check internet connection
	    rootStore.settings.resetOfflineMode();
	    promises[4] = checkInternet();

	    // promises[5] = checkLatestUpdate();

		Promise.all(promises).then((values) => {
			console.log('initial loading completed')
			setLoading(false);
		});
	}

	const _handleAppStateChange = (nextAppState) => {
		console.log(nextAppState)

		if(!CONFIG.DEBUG_MOCK_LOCATION){
		    RNMockLocationDetector.checkMockLocationProvider(
		        "Mock Location Detected",
		        "Please remove any mock location app first to continue using this app.",
		        "I Understand"
		        ); 
			}
	    if (nextAppState === 'active') {
	      Reactotron.log('App has come to the foreground!')
	      runBackgroundProcess();

	    // }else if (nextAppState === 'background') {
	    	// do something in background

	    }else{
	    	// ReactNativeForegroundService.remove_task('GPSTasks');
	    	ReactNativeForegroundService.remove_task('generalTasks');
	    	ReactNativeForegroundService.remove_task('permissionTasks');
	    	ReactNativeForegroundService.remove_task('reminderTasks');
	    	// ReactNativeForegroundService.stop();
	    }

	    // this.setState({appState: nextAppState});
  	}

	// useEffect( () => {
		// BackgroundJob.cancelAll()
		//   .then(() => Reactotron.log("Success cancelAll"))
		//   .catch(err => Reactotron.log(err));

		// setOfficeStorage(officeData)

		// setStorage("office",officeData)
	// }, [officeData]);

	const checkWifiRadius = async () => {
		var check_result = false;

		console.log("check wifi radius");

		// only check wifi when the user already logged in
	    const valueOffice = rootStore.getData('office')
	    var storage = valueOffice

	    console.log("getting office storage:");
	    console.log(storage);

		if(valueOffice != null && valueOffice.name) {

			try{
				const enabled = await WifiManager.isEnabled();
				console.log("wifi is "+enabled);

				if(enabled){
					WifiEntry = await WifiManager.loadWifiList();
					// WifiEntry = await WifiManager.reScanAndLoadWifiList();

					// there are nearby wifi available
					var nearby_wifis = [];
					if(WifiEntry){

						console.log("got nearby wifis");
						console.log(WifiEntry);

						// get all nearby wifi bssid
						JSON.parse(WifiEntry).map((item,i) => {
							nearby_wifis.push(item.BSSID);
						});

						// check registered office wifi with nearby
						if(!!storage.wifi && storage.wifi.length && storage.wifi.length > 0){
							console.log('stored wifi list')
							console.log(storage.wifi);

							storage.wifi.map((item,i) => {
								if(nearby_wifis.includes(item.bssid)){
									check_result = true;
								}
							});
						}
				    }
			    }

			    console.log("user is within wifi radius: "+check_result);

			    return check_result;

		    }catch(error){
			    console.log("wifi error");
			    console.log(error);

			    switch(error.code){
			    	case "locationServicesOff":
			    		Toast.show("Anda belum menyalakan GPS");
			    		showNotif(2, "gpserror", "Segera menyalakan GPS anda", "Tidak bisa mendapatkan lokasi");
			    	break;
			    	case "locationPermissionMissing":
			    		Toast.show("Anda belum mengijinkan pemakaian GPS");
			    	break;
			    }
			  }
		}
	}
	const setStorage = (item, val) => {
	    try {
	      if(val && val != ''){
	        console.log('storage '+item+' have value!')

	        if(Array.isArray(val)){
	        	rootStore.pushData(item, val);
	        }else{
		        const jsonVal = JSON.stringify(val)
		        val = {
		        	...val,
		        	data: JSON.stringify(val)
		        }

		        rootStore.assignData(item, val);
		    }

	      }else{
	        console.log('removing '+item+'!')

	        rootStore.removeData(item)
	      }
	    } catch (e) {
	      // saving error
	      console.error(e)
	    }
  	}

  	const resetStorages = () => {
  		console.log('resetting storages')
  		
  		// reset all existing storages
    	setStorage('settings', '')
    	setStorage('my_attendance', '')
    	setStorage('my_designation', '')
    	setStorage('employee', '')
    	setStorage('cluster', '')
    	setStorage('office', '')
    	setStorage('ship', '')
    	setStorage('ship_schedules', '')
  	}

	const getEmployeePermission = async () => {

		// setLoading(true);
        var result = await rootStore.getEmployeePermission();
        // setLoading(false);

        if(result.kind == "ok" && result.data){
			if(result.data.list_atasan_orang_kepercayaan.length > 0){
				setCheckTrustee(true);

				var companies = [];
				result.data.list_atasan_orang_kepercayaan.map((item, i) => {

					item.sub_company_orang_kepercayaan.map((sub, o) => {
						companies.push(sub.name)
					})
				})
				companies = companies.join("\n")

				setTrusteeCompanies(companies)
			}

        	// reset all existing storages
        	resetStorages();

        	// save settings to storage
        	if(result.data.setting){
        		var res = {
        			application_version: result.data.setting.general_setting.application_version,
        			update_version: result.data.setting.general_setting.update_version,
        			radius_tracking: result.data.setting.general_setting.radius_tracking,
        			bypass_store_gps_cluster: result.data.setting.general_setting.bypass_store_gps_cluster,
        			jangan_lacak_saya: result.data.permission.jangan_lacak_saya
        		}

        		setStorage('settings', res);

        		await checkLatestUpdate();
    		}

    		// save employee info to storage
        	if(result.data.attendance){
        		var att = [];
        		att.push(result.data.attendance)
        		var arr = rootStore.saveAttendanceFormat(att)
        		setStorage('my_attendance', arr[0]);
        	}
        	if(result.data.designation){
        		setStorage('my_designation', result.data.designation);
        	}
        	if(result.data.permission){
        		setStorage('my_permission', result.data.permission);
        	}
        	if(result.data.employee){
        		setStorage('employee', result.data.employee);
    		}
    		if(result.data.kapal_assigned){
        		setStorage('ship', result.data.kapal_assigned);
    		}

    		if(result.data.schedule_kapal){
        		setStorage('ship_schedules', result.data.schedule_kapal);
    		}

        	setGetPermission(true);

            var menuProject = (result.data.permission.list_proyek == 1) ? true : false
            setMenuProject(menuProject)
            var menuReport = (result.data.permission.report_task == 1) ? true : false
            setMenuReport(menuReport)
            var karyawanKhusus = (result.data.permission.karyawan_khusus == 1) ? true : false
            setKaryawanKhusus(karyawanKhusus)
            if(result.data.cluster){
		        var cluster = result.data.cluster
            	setStorage("cluster", cluster)
		      }

		    // if(!result.data.office){
		    // 	setStorage('office', '')
		    // }

		    // if user checkin using qrcode
            if(result.data.office){
            	var office = result.data.office
            	// setOfficeData(office)
            	setStorage('office', office)
            }

            // if user doing WFH
            else if((result.data.attendance)&&(result.data.attendance.clock_in_time)&&(!result.data.attendance.clock_out_time)&&(result.data.attendance.working_from == 'WFH')){
            	var data_wfh = {
                  wfh:true,
                  latitude:result.data.employee.latitude,
                  longitude:result.data.employee.longitude,
                  name:'WFH'
                }
                // setOfficeData(data_wfh)
                setStorage('office', data_wfh)
            }
            
            rootStore.setCurrentUser("permissions", JSON.stringify(result.data.permission));
        }
    }

    const doRemindTasks = async () => {

    	var tasks = await AsyncStorage.getItem('task_reminders');
    	tasks = JSON.parse(tasks);

		if(tasks && tasks != "" && tasks.length > 0){
			tasks.map((item,i) => {

				if(item.interval_report != 0 && (general_counter % (item.interval_report / check_general_interval) == 0)){
					var title = "Waktunya melaporkan tugas '"+item.heading+"'";
					var description = "Sertakan bukti pelaporan sesuai instruksi pada aplikasi";

					showNotif(item.id, "remindtasks", title, description)
				}

			});
		}
    }

    const getTaskReminders = async () => {
        
    	var params = {
    		interval: true,
    		board_column_id: 5,
    		assignee_user_id: 'diri_sendiri'
    	};

        setLoading(true);
        var result = await rootStore.getTasks(params);
        setLoading(false);

        if(result.kind == "ok" && result.data && result.data.task){

        	var jsonValue = [];

        	result.data.task.map((item,i) => {
	        	jsonValue.push({
	        		id: item.id,
	        		heading: item.heading,
	        		start_date: item.start_date,
	        		due_date: item.due_date,
	        		status: item.status,
	        		board_column_id: item.board_column_id,
	        		interval_report: item.interval_report
	        	});
        	});

        	if(jsonValue.length > 0){
        		jsonValue = JSON.stringify(jsonValue);
	        	await AsyncStorage.setItem('task_reminders', jsonValue);
	        }
        }
    }

    const getMyLeave = async () => {

    	// reset all leave
    	rootStore.removeData('my_leaves');

    	var param = {
    		date: moment().format('YYYY-MM-DD')
    	}
        
        // setLoading(true);
        var result = await rootStore.getCheckMyLeave(param);
        // setLoading(false);

        if(result.kind == "ok" && result.data && result.data.leave){
        	// Reactotron.log(result);

        	var data = result.data.leave;
        	// data[0].child = JSON.stringify(data[0].child)

        	// var data = {
        	// 	...result.data.leave,
        	// 	data: result.data.leave
        	// }
        	// setStorage('my_leaves', data)

        	setStorage('my_leaves', data)
        	// await AsyncStorage.setItem('my_leaves', JSON.stringify(result.data.leave));
        }
    }

    const getLastClockin = async () => {
    	var params = {

    	};
        
        // setLoading(true);
        var result = await rootStore.getAbsenceHistory(params);
        // setLoading(false);

        if(result.kind == "ok" && result.data){

        	if(result.data.attendance.length > 0 && !result.data.attendance[0].clock_out_time){
	        	setLastClockin(result.data.attendance[0]);
	        }else{
	        	setLastClockin(null);
	        }
        }
    }

	const loadUnreadNotices = async () => {

		// setLoading(true);
		var param = {
			
		}
		var result = await rootStore.getUnreadNotice(param);
		// setLoading(false);

		if(result.kind == "ok" && result.data.count_notif > 0){
			setUnreadNotif(result.data.count_notif)
		}
	}

	const doLogout = () => {
		rootStore.removeCurrentUser();
		navigateTo("login");
	}

	const onReceived = (notification) => {
	  	Reactotron.log("Notification received: ", notification);

		let check_payload = false;
		let check_additionalData = false;
		let check_actionID = false;

		if(notification.payload){
			if(notification.payload.title){
				if(notification.payload.body){
					check_payload = true;
				}
			}

			if(notification.payload.additionalData){
				if(notification.payload.additionalData.id){
					if(notification.payload.additionalData.type){
						check_additionalData = true;
					}
				}
			}
		}
		if(notification.action){
			if(notification.action.actionID){
				check_actionID = true;
			}
		}

		if(check_payload !== true || check_additionalData !== true || check_actionID !== true){
			return;
		}

	  	var payload = notification.payload;
	    var data = notification.payload.additionalData;

		var param = {
			id: data.id,
			type: data.type,
			heading: payload.title,
			description: payload.body,
			created_at: new Date().toString(),
		};

		doSaveNotif(param);
		countUnreadNotif();

		if(notification.action.actionID != "cancel"){
			switch(data.type){
				case "TRACKING":
					navigateTo("tracking_hrd", { title: payload.title, body: payload.body, onBack: onRefresh });
				break;
			}	
		}
	}

	const doSaveNotif = async (param) => {
		setLoading(true);
		var result = await rootStore.setNotification(param);
		setLoading(false);
	}

	const onOpened = (openResult) => {
	  	// console.log('Message: ', openResult.notification.payload.body);
	    // console.log('Data: ', openResult.notification.payload.additionalData);
	    // console.log('isActive: ', openResult.notification.isAppInFocus);
	    Reactotron.log('openResult: ', openResult);

		let check_payload = false;
		let check_additionalData = false;
		let check_actionID = false;

		if(openResult.notification){
			if(openResult.notification.payload){
				if(openResult.notification.payload.title){
					if(openResult.notification.payload.body){
						check_payload = true;
					}
				}

				if(openResult.notification.payload.additionalData){
					if(openResult.notification.payload.additionalData.type){
						if(openResult.notification.payload.additionalData.id){
							check_additionalData = true;
						}
					}
				}
			}
		}
		if(openResult.action){
			if(openResult.action.actionID){
				check_actionID = true;
			}
		}

		if(check_payload !== true || check_additionalData !== true || check_actionID !== true){
			return;
		}

	    var payload = openResult.notification.payload;
	    var data = openResult.notification.payload.additionalData;

		if(openResult.action.actionID != "cancel"){
			switch(data.type){
				case "TASK":
					navigateTo("task_detail", {id: data.id, onBack: onRefresh})
				break;
				case "TIMELOG":
					navigateTo("work_report_detail", {id: data.id, onBack: onRefresh})
				break;
				case "TRACKING":
					navigateTo("tracking_hrd", { title: payload.title, body: payload.body, onBack: onRefresh });
				break;
			}	
		}

	    // if(!data.reff_type){
	    // 	Reactotron.log("general broadcast");
	    // 	Reactotron.log(payload);

	    // 	setTimeout(function(){
	    // 		// Alert.alert(payload.title, payload.body);
	    // 		navigateTo("notif", {data: data});
    	// 	}, 1000);
	    // }
	}

	const onIds = (device) => {
	  	console.log('Device info: ', device);

		if(device.pushToken){
			rootStore.setCurrentUser("device_token", device.pushToken);
		}
	}

	const formatDate = (datenow) => {
	    return moment(datenow).calendar(null, {
	      sameElse: 'MMMM Do YYYY, h:mm:ss a'
	    })
  	}

  	const absencePage = () => {
		props.navigation.navigate("absence_history",{onGoBack: () => refreshingOffice()});
	}

	const workReportPage = () => {
		navigateTo("work_report_list",{onGoBack: () => refreshingOffice()});
	}

	const refreshingOffice = () => {
		loadAll();

		// setRefreshOffice(!refreshOffice)
	}

	const doReport = async () => {
		await launchBugsee();
		Toast.show("Anda sekarang dapat melaporkan masalah. Tekan tombol di sebelah kanan jika ingin menyudahi pelaporan masalah.", {
			duration: Toast.durations.LONG
		})

		// Bugsee.showReportDialog();
	}

	const stopReport = () => {
		Bugsee.stop();
	}

	const launchBugsee = async () => {
	    let appToken;
	    var bugseeOptions;

	    if (Platform.OS === 'ios') {
	        appToken = '';
	        bugseeOptions = new Bugsee.AndroidLaunchOptions();
	        
	    } else {
	        appToken = CONFIG.BUGSEE_KEY;
	        bugseeOptions = new Bugsee.AndroidLaunchOptions();
	        bugseeOptions.notificationBarTrigger = false;
	        bugseeOptions.shakeToTrigger = false;
	    }

	    bugseeOptions.maxRecordingTime = 320;

	    await Bugsee.launch(appToken, bugseeOptions);

	    // set in app version
	    Bugsee.setAttribute("app_version", CONFIG.APP_VERSION);
  	}

	// useEffect( () => {
		
	// } , [refreshOffice])

  	return (
	    <View style={layout.container.general}>
			<Loading loading={loading} />
		
			<ScrollView
				refreshControl={
		          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
		        }
			>
				<Image style={styles.img_header} source={require("@assets/home-header.png")} />
				
				<View style={{ ...layout.container.wrapper, ...layout.container.bodyView, marginTop: 40, minHeight: deviceHeight*0.65, marginBottom: 0 }}>
					<View style={styles.header_wrapper}>
						<View>
							<Text style={styles.welcome_txt}>Selamat Datang,</Text>

							<View style={{flexDirection: "row", alignItems: "center"}}>
								<Text style={styles.welcome_name}>{rootStore.getCurrentUser().name}</Text>

								{(checkTrustee === true) &&
									<TouchableOpacity onPress={() => {
										Alert.alert('Delegasi pada:', trusteeCompanies)
									}}>
										<Image
											source={require("@assets/ic_star.png")}
											style={{
												width: 20,
												height: 20,
												marginLeft: 10,
												resizeMode: "contain",
											}}
										/>
									</TouchableOpacity>
								}
							</View>
							{/*<Text style={styles.welcome_title}>Supervisor Logistik</Text>*/}

							{(rootStore.employee.is_abk && rootStore.ship && rootStore.ship.name && rootStore.ship_schedules.length > 0 &&
								<View style={{ marginBottom: 10 }}>
									<Text style={{ ...layout.typography.body, color: "#fff", fontSize: 12 }}>Anda ditugaskan pada kapal {rootStore.ship.name}</Text>
									<Text style={{ ...layout.typography.body, color: "#fff", fontSize: 12, marginBottom: 10 }}>Pada: {moment(rootStore.ship_schedules[0].date_start).format('DD/MM/YYYY')} - {moment(rootStore.ship_schedules[0].date_end).format('DD/MM/YYYY')}</Text>
								</View>
							)}

							{(rootStore.employee.is_abk && rootStore.ship && !rootStore.ship.name &&
								<Text style={{ ...layout.typography.body, color: "#fff", fontSize: 12, marginBottom: 10 }}>Anda belum ditugaskan ke kapal, silahkan hubungi HRD kapal & PC.</Text>
							)}

							{(lastClockin &&
								<View style={{ marginBottom: 20 }}>
									<Text style={{ ...layout.typography.body, color: "#fff", fontSize: 12 }}>Terakhir absen masuk pada: {moment(lastClockin.clock_in_time.toString()).format("DD MMM YYYY LTS")}</Text>

									<TouchableOpacity onPress={absencePage} style={{ flexDirection: "row" }}>
										<Text style={{ ...layout.typography.body, fontSize: 12, color: "#fff", textDecorationLine: "underline"}}>Ingin absen pulang?</Text>
									</TouchableOpacity>
								</View>
							)}
							
						</View>

						<View style={styles.header_action}>
							{/*
							<TouchableOpacity onPress={() => doSync()} style={{ marginRight: 10 }}>
								<Icon name="ios-sync" size={30} style={{ color: "#fff" }} />
							</TouchableOpacity>
							*/}

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity onPress={() => doDownload()} style={{ marginRight: 10 }}>
									<Image source={require("@assets/internet.png")} style={{ ...styles.icon }} />
								</TouchableOpacity>
							)}
							{(isUpdated && !rootStore.getData("settings").offline_mode) &&
								<TouchableOpacity onPress={() => navigateTo("notif")}>
									<Image source={(checkNewNotif) ? require("@assets/ico-bell-white-unread.png") : require("@assets/ico-bell-white.png")} style={{ ...styles.icon }} />
								</TouchableOpacity>
							}
							<TouchableOpacity onPress={() => navigateTo("profile", { jamKantor: jamKantor, jamIstirahat: jamIstirahat })} style={{ marginLeft: 10 }}>
								<Image source={require("@assets/ico-gear-white.png")} style={{ ...styles.icon }} />
							</TouchableOpacity>
						</View>
					</View>

					{(unreadNotif > 0 && isUpdated &&
						<TouchableOpacity onPress={() => navigateTo("notif")} style={{ ...layout.alert.wrapper, ...layout.alert.info, marginBottom: 20 }}>
							<Text style={layout.alert.text}>Anda mempunyai {unreadNotif} pemberitahuan penting. Lihat di sini.</Text>

							{/*
							<TouchableOpacity style={layout.alert.close}>
								<Icon name="ios-close" style={{ color: "#535353" }} size={20} />
							</TouchableOpacity>
							*/}
						</TouchableOpacity>
					)}

					{( (!getPermission || !isUpdated) &&
						<Text style={{ marginTop: 120, fontSize: 10, textAlign: "center" }}>Gagal mendapatkan data dari server.{"\n"}Silahkan refresh halaman</Text>
					)}
					{( (getPermission && isUpdated) &&
						<View style={{ ...layout.menu.wrapper, ...layout.menu.grid, width: "100%", marginLeft: -10 }}>
							{(rootStore.my_permission.list_proyek) && !rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("projects")}>
									<Image style={layout.menu.img} source={require("@assets/ico-project.png")} />
									<Text style={layout.menu.txt}>Set-up Proyek</Text>
								</TouchableOpacity>
							}

							<TouchableOpacity style={layout.menu.box} onPress={absencePage}>
								<Image style={layout.menu.img} source={require("@assets/ico-attendance.png")} />
								<Text style={layout.menu.txt}>Absensi</Text>
							</TouchableOpacity>

							<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("tasks", {title: 'Tugas', type: 'task'})}>
								<Image style={layout.menu.img} source={require("@assets/ico-task.png")} />
								<Text style={layout.menu.txt}>Tugas</Text>
							</TouchableOpacity>

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("form_pengajuan")}>
									<Image style={layout.menu.img} source={require("@assets/ico-approve.png")} />
									<Text style={layout.menu.txt}>Pengajuan Ijin</Text>
								</TouchableOpacity>
							)}

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("pengajuan")}>
									<Image style={layout.menu.img} source={require("@assets/ico-status.png")} />
									<Text style={layout.menu.txt}>Check Status</Text>
								</TouchableOpacity>
							)}

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("tasks", {title: 'Briefing', type: 'briefing'})}>
									<Image style={layout.menu.img} source={require("@assets/ico-status.png")} />
									<Text style={layout.menu.txt}>Briefing</Text>
								</TouchableOpacity>
							)}

							{
								(!rootStore.settings.offline_mode &&
									<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("notes")}>
										<Image style={layout.menu.img} source={require("@assets/ic_notes.png")} />
										<Text style={layout.menu.txt}>Catatan</Text>
									</TouchableOpacity>
								)
							}

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("otorisasi")}>
									<Image style={layout.menu.img} source={require("@assets/ico-meeting.png")} />
									<Text style={layout.menu.txt}>Tracking</Text>
								</TouchableOpacity>
							)}

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("tracking")}>
									<View style={{ ...styles.icoWrapper }}>
										<Icon name="map-marker" size={25} style={{ color: "#381D5C", alignSelf: "center" }} />
									</View>
									<Text style={layout.menu.txt}>GPS</Text>
								</TouchableOpacity>
							)}

							{(rootStore.my_permission.report_task) &&
								<TouchableOpacity style={layout.menu.box} onPress={workReportPage}>
									<Image style={layout.menu.img} source={require("@assets/ico-report.png")} />
									<Text style={layout.menu.txt}>Laporan Pekerjaan</Text>
								</TouchableOpacity>
							}

							{/* {(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} 
									onPress={() => navigateTo("profile")}
									// onPress={() => doReport()}
								>
									<Image style={layout.menu.img} source={require("@assets/ico-complaint.png")} />
									<Text style={layout.menu.txt}>Laporan Masalah</Text>
								</TouchableOpacity>
							)} */}

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("tasks")}>
									<Image style={layout.menu.img} source={require("@assets/ico-asset.png")} />
									<Text style={layout.menu.txt}>Asset</Text>
								</TouchableOpacity>
							)}

							{(!rootStore.settings.offline_mode &&
								<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("forms")}>
									<Image style={layout.menu.img} source={require("@assets/ico-form.png")} />
									<Text style={layout.menu.txt}>Form</Text>
								</TouchableOpacity>
							)}

							{/*
							<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("projects")}>
								<Image style={layout.menu.img} source={require("@assets/ico-project.png")} />
								<Text style={layout.menu.txt}>Proyek</Text>
							</TouchableOpacity>
							*/}
							
							{/*<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("laporan")}>*/}

							{/*
							<TouchableOpacity style={layout.menu.box} onPress={() => navigateTo("bootstrap")}>
								<Image style={layout.menu.img} source={require("@assets/ico-complaint.png")} />
								<Text style={layout.menu.txt}>Bootstrap</Text>
							</TouchableOpacity>
							*/}
						</View>
					)}
				</View>

				<Button onPress={() => doSaveGPS()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40, marginHorizontal: 20 }}>
	                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>LACAK POSISI SAYA</Text>
	            </Button>

				<Text text={CONFIG.APP_VERSION} style={{ marginVertical: 20, fontSize: 10, textAlign: "center" }} />

	        </ScrollView>

	    </View>
  	)
})
