import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Image, ImageStyle, TextStyle, Dimensions } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Icon, Switch, Wallpaper } from "@components"
import { color, layout } from "@theme"
import { NavigationScreenProps, NavigationActions, StackActions } from "react-navigation"
import firebase from 'react-native-firebase';
import { useStores } from "@models/root-store"
import { Client } from 'bugsnag-react-native';
import codePush from "react-native-code-push";
import Reactotron from 'reactotron-react-native';
import { CONFIG } from "@utils/config"

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface LandingpageScreenProps extends NavigationScreenProps<{}> {
}

const styles = {
  img: {
    position: "absolute", top: 0, left: 0, width: deviceWidth, height: deviceHeight
  },
  layout: {

  },
  wrapper: {
    position: "absolute", bottom: 50,
  }
}

const WRAPPER: ViewStyle = {
	...layout.container.wrapper, 
	...layout.container.wrapperCenter,
}

export const LandingpageScreen: React.FunctionComponent<LandingpageScreenProps> = observer((props) => {
  const rootStore = useStores()
  const { navigationStore } = useStores()

  const nextScreen = React.useMemo(() => () => props.navigation.navigate("login"), [
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

  /*
  init = () => {
    firebase.initializeApp({
      appId: "1:166978453556:android:3213c4875419e5eda04a61",
      apiKey: "AIzaSyCZyGAGAVhz44T72XxLqY2jdbSkZXFhD20",
      authDomain: "the-chef-f26d3.firebaseapp.com",
      databaseURL: "https://the-chef-f26d3.firebaseio.com",
      projectId: "the-chef-f26d3",
      storageBucket: "the-chef-f26d3.appspot.com",
      messagingSenderId: "166978453556"
    });
  }
  */

  useEffect(() => {
    // Reactotron.log(rootStore.getCurrentUser());

    if(rootStore.getCurrentUser().id){
      HomeScreen();
    }
  }, []);

  return (
    <Screen style={{ height: null, flex: 1 }} preset="scroll">
      <Image style={styles.img} source={require('@assets/landing_img.jpg')} />
      <View style={WRAPPER}>

      	<View style={styles.wrapper}>
	      	<Text style={{ textAlign: "center", marginVertical: 40, color: "#fff" }} tx="landing.welcome" />
	      	<Button
    				tx={"landing.getting_started"}
    				onPress={nextScreen}
	      	/>
          <Text style={{ textAlign: "center", marginTop: 10, color: "#fff", fontSize: 10 }}>{CONFIG.APP_VERSION}</Text>
      	</View>
      </View>
    </Screen>
  )
})
