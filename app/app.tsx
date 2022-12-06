// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import React, { useState, useEffect } from "react"
import { AppRegistry, YellowBox, ViewStyle, View, ImageBackground, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl, PermissionsAndroid } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Ads } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { StatefulNavigator, BackButtonHandler, exitRoutes } from "./navigation"
import { StorybookUIRoot } from "../storybook"
import { RootStore, RootStoreProvider, setupRootStore } from "./models/root-store"
import { SafeAreaView } from "react-navigation"
import BackgroundJob from 'react-native-background-job';
import PushNotification from 'react-native-push-notification';
import Reactotron from 'reactotron-react-native';
import { contains } from "ramda"
import RNMockLocationDetector from 'react-native-mock-location-detector';
import { CONFIG } from "@utils/config"
import { Client, Configuration } from 'bugsnag-react-native';
import CodePush from "react-native-code-push";
import WifiManager from "react-native-wifi-reborn";
import Bugsee from 'react-native-bugsee';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkProvider } from 'react-native-offline';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
// import queueFactory from 'react-native-queue';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
YellowBox.ignoreWarnings([
  "componentWillMount is deprecated",
  "componentWillReceiveProps is deprecated",
])

/**
 * Storybook still wants to use ReactNative's AsyncStorage instead of the
 * react-native-community package; this causes a YellowBox warning. This hack
 * points RN's AsyncStorage at the community one, fixing the warning. Here's the
 * Storybook issue about this: https://github.com/storybookjs/storybook/issues/6078
 */
const ReactNative = require("react-native")
Object.defineProperty(ReactNative, "AsyncStorage", {
  get(): any {
    return require("@react-native-community/async-storage").default
  },
})

/**
 * Are we allowed to exit the app?  This is called when the back button
 * is pressed on android.
 *
 * @param routeName The currently active route name.
 */
const canExit = (routeName: string) => contains(routeName, exitRoutes)

// var task_key = "task-002";
// let job_config;
// let x_sec = 0;

// if(job_config){
//   BackgroundJob.register(job_config);
// }

let interval = setInterval(function(){
  if(!CONFIG.DEBUG_MOCK_LOCATION){
    RNMockLocationDetector.checkMockLocationProvider(
          "Mock Location Detected",
          "Please remove any mock location app first to continue using this app.",
          "I Understand"
        ); 
  }
        
      }, 60000);

let intervalGps = ''

export const App: React.FunctionComponent<{}> = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  const [latest, setLatest] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [bugReportAvailable, setBugReportAvailable] = useState(false);

  useEffect(() => {
    // BackgroundJob.cancelAll()
    // .then(() => Reactotron.log("Success cancelAll"))
    // .catch(err => Reactotron.log(err));
    setupRootStore().then(setRootStore)

    SafeAreaView.setStatusBarHeight(0);

    CodePush.sync({
        deploymentKey: CONFIG.CODEPUSH_KEY,
        updateDialog: false,
        installMode: CodePush.InstallMode.IMMEDIATE
    },(SyncStatus) => codePushStatusDidChange(SyncStatus));

    // if(CONFIG.ENVIRONMENT == "PRODUCTION"){
      // launchBugsee();
    // }
    stopBugsee();

    // launchQueue();

  }, []);

  Bugsee.setLifecycleEventHandler((eventType) => {
    if(eventType == 2){
      Toast.show("Bug Report closed")
      setBugReportAvailable(false)
    }else if(eventType == 0 || eventType == 1){
      setBugReportAvailable(true)
    }else if(eventType == 9){
      Toast.show("Pelaporan masalah anda berhasil dikirim")
      Bugsee.stop();
    }
  });

  const stopReport = () => {
    
    Alert.alert(
      "Anda ingin mengirimkan laporan masalah?",
      "Pastikan pokok masalah dan langkah-langkah telah anda isi dengan benar dan sesuai. Jika tidak maka laporan anda tidak akan diproses!",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => Bugsee.showReportDialog() }
      ],
      { cancelable: false }
    );
  }

  const launchQueue = async () => {
    /*
    myqueue = await queueFactory();
    myqueue.addWorker('my-queue', async (id, payload) => {
      console.log('EXECUTING "example-job" with id: ' + id);
      console.log(payload, 'payload');
      
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log('"example-job" has completed!');
          resolve();
        }, 5000);
      });

    });
    */
  }

  const stopBugsee = () => {
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

    // await Bugsee.launch(appToken, bugseeOptions);

    // set in app version
    Bugsee.setAttribute("app_version", CONFIG.APP_VERSION);
  }

  const codePushStatusDidChange = (SyncStatus) => {
    // console.log('codepush state change');
    // console.log(CodePush.SyncStatus);
    // console.log(SyncStatus);

    switch(SyncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log("Checking for update.");
        setProgress(false);
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log("Downloading package.");
        setProgress(true);
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        console.log("Awaiting user action.");
        setProgress(false);
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        stopBugsee();
        console.log("Installing update.");
        setProgress(true);
        setIsUpdate(true);
        // removeAllStorage();
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        console.log("App up to date.");
        setProgress(false);
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        console.log("Update cancelled by user.");
        setProgress(false);
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        console.log("Update installed and will be applied on restart.");
        setProgress(false);
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        setProgress(false);
        break;
    }
  }

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

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  //
  // This step should be completely covered over by the splash screen though.
  //
  // You're welcome to swap in your own component to render if your boot up
  // sequence is too slow though.
  if (!rootStore) {
    return null
  }

  const normalRender = () => {
    return(
      <NetworkProvider>
        <RootStoreProvider value={rootStore}>
          <BackButtonHandler canExit={canExit}>
            <StatefulNavigator />
          </BackButtonHandler>
          <FlashMessage
            ref={ref => dropDownAlertRef = ref}
            position="bottom"
          />

          {(bugReportAvailable &&
            <TouchableOpacity onPress={() => stopReport()} style={{ backgroundColor: "red", borderRadius: 20, width: 40, height: 40, alignItems: "center", justifyContent: "center", position: "absolute", right: 20, bottom: 20 }}>
              <Icon name="ios-bug" size={30} style={{ color: "#fff" }} />
            </TouchableOpacity>
          )}
        </RootStoreProvider>
      </NetworkProvider>
    )
  }

  const updateRender = () => {
    return(
      <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ alignSelf: "center", marginTop: 80 }}>
            <Image source={require('@assets/logo.png')} style={{ marginBottom: 40, height: 80, resizeMode: "contain", alignSelf: "center" }} />
            <Text style={{ textAlign: "center" }}>Installing Update... Do not close the app!</Text>
            <Text style={{ marginTop: 40, fontSize: 10, textAlign: "center" }}>Current Version: {CONFIG.APP_VERSION}</Text>
            {/*<Text style={{ fontSize: 10, textAlign: "center" }}>Latest Version: {(latest) ? latest : "-"}</Text>*/}
          </View>
      </View>
    )
  }

  const setupRender = () => {
    if(!progress){
      return normalRender()
    }else{
      return updateRender()
    }
  }

  // otherwise, we're ready to render the app
  return setupRender()
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "bahanalinegroup"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App

const configuration = new Configuration();
configuration.apiKey = CONFIG.BUGSNAG_KEY;
configuration.codeBundleId = CONFIG.APP_VERSION;

const bugsnag = new Client(configuration);
// bugsnag.notify(new Error("Test error on new version"));

let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

ReactNativeForegroundService.register();

AppRegistry.registerHeadlessTask('RNLocationHeadlessService', () => this.locationHeadlessService);

locationHeadlessService = async (location) => {
  console.log("headless", location);
  return Promise.resolve();
};

AppRegistry.registerComponent(APP_NAME, () => CodePush(codePushOptions)(RootComponent))
