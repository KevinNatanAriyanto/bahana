import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { useStores } from "@models/root-store"
// import { Icon } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Screen, Button, Checkbox, FormRow, Header, Switch, Wallpaper, TextField, ErrorMessage } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import { translate } from "@i18n"
import Reactotron from 'reactotron-react-native';
const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  layout: {
    elevation: 6, borderRadius: 20, position: "absolute", bottom: 0, backgroundColor: "#fff", paddingBottom: 30, paddingTop: 10, marginBottom: -15, width: deviceWidth
  },
  container: {
    flexDirection: "row", alignSelf: "center"
  },
  wrapper: {
    width: deviceWidth/5, justifyContent: "flex-end", alignItems: "center", height: 50, position: "relative"
  },
  wrapper_element: {
    alignItems: "center"
  },
  img: {
    marginBottom: 5
  },
  txt: {
    fontSize: 10, marginTop: 5
  },
  notif_count: {
    borderRadius: 10, backgroundColor: "red", color: "#fff", position: "absolute", top: -5, right: 0, fontSize: 10, textAlign: "center", padding: 5, paddingVertical: 3, zIndex: 9999, width: 20, height: 20
  }
}

export interface FooterProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function Footer(props: FooterProps) {
  // grab the props
  const { 
    tx, 
    text, 
    style, 
    children, 
    active, 
    type, 
    ...rest 
  } = props
  const textStyle = { }

  const content = children || null;
  const activeMenu = active || "home";

  const rootStore = useStores()
  const [notifications, setNotifications] = React.useState([]);

  const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.replace(routeName), [
    props.navigation,
  ])

  useEffect( () => {
    // loadNotices();
    // Reactotron.log(rootStore.getCurrentUser().modules)
  }, []);

  // const loadNotices = () => {
  //   Reactotron.log();
  // }

  const getImgMenu = (menu) => {
    var img;
    switch(menu){
      case "home":
        img = (activeMenu == menu) ? require('@assets/ico_home.png') : require('@assets/ico_home_light.png')
      break;

      case "premium":
        img = (activeMenu == menu) ? require('@assets/ico_bell.png') : require('@assets/ico_bell_light.png')
      break;

      case "cart":
        img = (activeMenu == menu) ? require('@assets/ico_cart_alt.png') : require('@assets/ico_cart_alt_light.png')
      break;

      case "profile":
        img = (activeMenu == menu) ? require('@assets/ico_profile.png') : require('@assets/ico_profile_light.png')
      break;
    }

    return img;
  }

  const _renderFooter = () => {
    if(!props.type){
      return(
        <View style={styles.layout}>
          <View style={styles.container}>
            <View style={styles.wrapper}>
              <TouchableOpacity onPress={() => navigateTo("home")} style={{ ...styles.wrapper_element }}>
                <Icon name="home" size={25} style={(activeMenu == "home") ? { color: "#000" } : { color: "#adb5bd" }} />
                <Text style={styles.txt} tx="general.home" />
              </TouchableOpacity>
            </View>

            {(rootStore.getCurrentUser().modules && rootStore.getCurrentUser().modules.indexOf('attendance') &&
              <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => navigateTo("absence")} style={{ ...styles.wrapper_element }}>
                  <Icon name="clock-o" size={25} style={(activeMenu == "attendance") ? { color: "#000" } : { color: "#adb5bd" }} />
                  <Text style={styles.txt} tx="general.attendance" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.wrapper}>
              <TouchableOpacity onPress={() => navigateTo("tasks")} style={{ ...styles.wrapper_element }}>
                <Icon name="tasks" size={25} style={(activeMenu == "tasks") ? { color: "#000" } : { color: "#adb5bd" }} />
                <Text style={styles.txt} tx="general.task" />
              </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>
              <TouchableOpacity onPress={() => navigateTo("notif")} style={{ ...styles.wrapper_element }}>

                {(rootStore.getNotifications({read: "no"}).length > 0 &&
                  <Text style={styles.notif_count}>{rootStore.getNotifications({read: "no"}).length}</Text>
                )}

                <Icon name="bell" size={25} style={(activeMenu == "notif") ? { color: "#000" } : { color: "#adb5bd" }} />
                <Text style={styles.txt} tx="general.notification" />
              </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>
              <TouchableOpacity onPress={() => navigateTo("profile")} style={{ ...styles.wrapper_element }}>
                <Icon name="user" size={25} style={(activeMenu == "profile") ? { color: "#000" } : { color: "#adb5bd" }} />
                <Text style={styles.txt} tx="general.profile" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }else{
      return(
        <BottomDrawerCustom
          containerHeight={deviceHeight}
          offset={-(deviceHeight/5)}
          startUp={false}
          {...rest}
        >
          <View style={styles.container}>
            <View style={styles.wrapper}>
              <TouchableOpacity onPress={() => navigateTo("premium")} style={{ ...styles.wrapper_element }}>
                <Image source={getImgMenu("premium")} style={styles.img} />
                <Text style={styles.txt} tx="general.premium" />
              </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>
              <TouchableOpacity onPress={() => navigateTo("home")} style={{ ...styles.wrapper_element }}>
                <Image source={getImgMenu("home")} style={styles.img} />
                <Text style={styles.txt} tx="general.home" />
              </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>
              <TouchableOpacity onPress={() => navigateTo("profile")} style={{ ...styles.wrapper_element }}>
                <Image source={getImgMenu("profile")} style={styles.img} />
                <Text style={styles.txt} tx="general.profile" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            {content}
          </View>
        </BottomDrawerCustom>
      )
    }
  }

  return _renderFooter()
}
