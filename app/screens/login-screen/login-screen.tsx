import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, Alert, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, PermissionsAndroid, RefreshControl } from "react-native"
import { Text, Screen, Loading, Button, Checkbox, FormRow, Header, Switch, Wallpaper, TextField, ErrorMessage } from "@components"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { ChefSkills, ChefSpecialists, ChefSubroles } from "@utils/data"
import { NavigationScreenProps, NavigationActions, StackActions } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import OneSignal from 'react-native-onesignal';
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-root-toast';
import FBSDK, { LoginManager,LoginButton, AccessToken,GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { onSnapshot, onAction, onPatch, applySnapshot, applyAction, applyPatch, getSnapshot } from "mobx-state-tree"
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from 'react-native-google-signin';
import { CONFIG } from "@utils/config"
const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-community/async-storage';

import { translate } from "@i18n"

export interface LoginScreenProps extends NavigationScreenProps<{}> {

}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const WRAPPER: ViewStyle = {
	...layout.container.wrapper, 
	...layout.container.wrapperCenter,
	justifyContent: "center",
	alignItems: "center",
}

const ROW_VIEW: ViewStyle = {
	flexDirection: "row", alignSelf: "center"
}

export const LoginScreen: React.FunctionComponent<LoginScreenProps> = observer((props) => {
  const rootStore = useStores()
  const { navigationStore } = useStores()
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const [refreshing, setRefreshing] = React.useState(false);

  // const nextScreen = React.useMemo(() => () => props.navigation.replace("home"), [
  //   props.navigation,
  // ])

  const onStop = () => {
    // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
    if (ReactNativeForegroundService.is_task_running('GPSTasks')) {
      ReactNativeForegroundService.remove_task('GPSTasks');
    }
    if (ReactNativeForegroundService.is_task_running('generalTasks')) {
      ReactNativeForegroundService.remove_task('generalTasks');
    }
    if (ReactNativeForegroundService.is_task_running('permissionTasks')) {
      ReactNativeForegroundService.remove_task('permissionTasks');
    }
    if (ReactNativeForegroundService.is_task_running('reminderTasks')) {
      ReactNativeForegroundService.remove_task('reminderTasks');
    }

    // Stoping Foreground service.
    return ReactNativeForegroundService.stop();
  };

  useEffect(() => {
    BackgroundGeolocation.stop()
    onStop();

    // PushNotification.cancelLocalNotifications({id: '1'});
    // PushNotification.localNotificationSchedule({
    //         id : '1',
    //         // userInfo: {id: '1'},
    //         title: 'a', 
    //         message: 'b', 
    //         repeatType: "time",
    //         repeatTime: 10000,
    //         date: new Date(Date.now() + 10000)
    // })
    // const value = AsyncStorage.getItem('office')
    // console.log('AsyncStorage office')
    // console.log(value)
  	OneSignal.init(CONFIG.ONESIGNAL_KEY, {kOSSettingsKeyAutoPrompt : true});
  	OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);

    // loadAdditionalDatas();

    if(rootStore.getCurrentUser().id){
      // await requestCameraPermission()
      HomeScreen();
    }
  }, []);

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

  const onReceived = (notification) => {
  	console.log("Notification received: ", notification);
  }

  const onOpened = (openResult) => {
  	// console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  const onIds = (device) => {
  	console.log('Device info: ', device);

    if(device.userId){
      rootStore.setCurrentUser("device_token", device.userId);
      setToken(device.userId);
    }
  }

  const nextScreen = () => { 
   	const resetAction = StackActions.reset({
  	  key: null,
  	  index: 0,
  	  actions: [NavigationActions.navigate({ 
  	  	routeName: 'primaryStack' 
  	  })],
  	});
  	props.navigation.dispatch(resetAction);
  }

  const registerScreen = React.useMemo(() => () => props.navigation.navigate("questionlanding"), [
    props.navigation,
  ])

  const forgotScreen = React.useMemo(() => () => props.navigation.navigate("forgot"), [
    props.navigation,
  ])

  const goRegister = () => {
    rootStore.removeCurrentUser();
    registerScreen();
  }

  const SignInSchema = Yup.object().shape({
	  email: Yup.string().required('Email is required'),
	  password: Yup.string().required('Password is required'),
  });

  const requestGpsPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Cool Photo App Camera Permission",
            message:
              "Cool Photo App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.log(err);
      }
    };

  const removeAllStorage = () => {
    console.log('clearing last storage data');
    setStorage('notifications','');
    setStorage('attendances','');
    setStorage('currentUser','');
    setStorage('settings','');
    setStorage('gps','');
    setStorage('employee','');
    setStorage('cluster','');
    setStorage('office','');
    setStorage('my_attendance','');
    setStorage('my_designation','');
    setStorage('my_permission','');
    setStorage('my_leaves','');
    setStorage('task_reminders','');
    setStorage('timelogs','');
    setStorage('tasks','');
    setStorage('projects','');
    setStorage('ship','');
    setStorage('ship_schedules','');
    setStorage('questions','');
    setStorage('notifications','');
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    removeAllStorage()

    Toast.show("All storage has been cleared!")

    setRefreshing(false);
    
  }, [refreshing]);

  const doLogin = async (values) => {

  	Keyboard.dismiss();

    removeAllStorage();

  	var user = values;
  	user.player_id = token;
  	user.device_type = Platform.OS;
  	user.app_version = CONFIG.VERSION;

    // console.log(user);

  	setLoading(true);
  	var result = await rootStore.doLogin(user);
  	setLoading(false);
    
  	if(result.kind == "ok"){
      console.log('rootStore.doLogin(user) 2')
      console.log(result.user.office)
      if(result.user.cluster){
        console.log('rootStore.doLogin(user) masuk if cluster')
        console.log(result.user.cluster)
        setStorage('cluster',result.user.cluster)
      }
      if(result.user.office){
        console.log('rootStore.doLogin(user) masuk if')
        setStorage('office',result.user.office)
      }else if((result.user.attendance)&&(result.user.attendance.clock_in_time)&&(!result.user.attendance.clock_out_time)&&(result.user.attendance.working_from == 'WFH')){
        //wfh
        console.log('rootStore.doLogin(user) masuk if wfh')
        var data_wfh = {
          wfh:true,
          latitude:result.user.employee.latitude,
          longitude:result.user.employee.longitude,
          name:'WFH'
        }
        setStorage('office',data_wfh)
      }else{
        console.log('rootStore.doLogin(user) masuk else')
        setStorage('office','')
      }
      // await requestGpsPermission()
  		nextScreen();
  	}
  }

  const setStorage = (item, val) => {
    try {
      if(val && val != ''){
        console.log('storage '+item+' have value!')

        const jsonVal = JSON.stringify(val)
        val = {
          ...val,
          data: JSON.stringify(val)
        }
        rootStore.assignData(item, val);

      }else{
        console.log('removing '+item+'!')

        rootStore.removeData(item)
      }
    } catch (e) {
      // saving error
      console.error(e)
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Loading loading={loading} />

      <Image style={layout.img_header} source={require("@assets/home-header.png")} />
      <View style={{ ...layout.container.wrapperCenter, ...layout.box.wrapper, ...layout.box.shadow, paddingVertical: 40, paddingHorizontal: 20, marginTop: (deviceHeight*0.10) }}>

        	<Image source={require('@assets/logo.png')} style={{ marginBottom: 40, height: 50, resizeMode: "contain" }} />

        	<Formik
  		    initialValues={{ 
            email: "",
            password: ""
  		    	// email: "user@gmail.com",
  		    	// password: "123123"

            // email: "admin@example.com",
            // password: "123456"
  		    }}
  		    validationSchema={SignInSchema}
  		    onSubmit={values => doLogin(values)}>
  		    {props => (

  		    	<View style={{ width: deviceWidth*0.8 }}>

  		    		<ErrorMessage errors={props.errors} />

  			      	<View style={layout.form.field}>
                  <Icon name="ios-mail" style={{ ...layout.form.icon_input }} size={20} />
  				      	<TextInput
  				          onChangeText={props.handleChange('email')}
  				          onBlur={props.handleBlur('email')}
  				          value={props.values.email}
  				          // keyboardType={"email-address"}
  				          style={{ ...layout.form.cinput_icon }}
  				          placeholder={translate("general.email")}
  				          placeholderTextColor={color.placeholder}
  				      	/>
  			      	</View>

					     <View style={{...layout.form.field }}>
                  <Icon name="ios-lock" style={{ ...layout.form.icon_input }} size={20} />
  				      	<TextInput
  				          onChangeText={props.handleChange('password')}
  				          onBlur={props.handleBlur('password')}
  				          value={props.values.password}
  				          secureTextEntry={showPassword}
  				          style={{ ...layout.form.cinput_icon }}
  				          placeholder={translate("general.password")}
  				          placeholderTextColor={color.placeholder}
  				      	/>
                  <TouchableOpacity style={{...layout.form.icon_show_hide}} onPress={()=>{setShowPassword(!showPassword)}}>
                    {(showPassword) ?
                      <Image source={require('@assets/icon-invisible.png')} style={{ height: 0.06*deviceWidth, resizeMode: "contain" }}/>  
                      :
                      <Image source={require('@assets/icon-visible.png')} style={{ height: 0.06*deviceWidth, resizeMode: "contain" }}/>  
                    }
                    
                    
                  </TouchableOpacity>
  			      	</View>
  			      	<Button onPress={props.handleSubmit} tx="general.submit" style={layout.form.submit} />
  		      	</View>
  		    )}
  		    </Formik>

          {/*
      		<View style={{ ...ROW_VIEW, marginVertical: 30 }}>
      			<Text tx="login.dont_have_account" />

      			<TouchableOpacity style={{ marginLeft: 5 }} onPress={goRegister}>
      				<Text preset="important" tx="login.register_now" />
      			</TouchableOpacity>
      		</View>

      		<View style={{ ...ROW_VIEW, marginBottom: 20}}>
      			<TouchableOpacity onPress={() => _fbAuth()}>
      				<Image source={require('@assets/fb.png')} />
      			</TouchableOpacity>
      			<TouchableOpacity onPress={() => _signIn()}>
      				<Image source={require('@assets/google.png')} />
      			</TouchableOpacity>
      		</View>
          */}

          <TouchableOpacity style={{ marginVertical: 15 }} onPress={forgotScreen}>
            <Text tx="general.forgot_password?" style={{ textAlign: "center", textDecorationLine: "underline" }} />
          </TouchableOpacity>

      </View>

      <Text text={CONFIG.APP_VERSION} style={{ marginTop: 20, fontSize: 10, textAlign: "center" }} />

    </ScrollView>
  )
})
