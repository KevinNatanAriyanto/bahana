import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Icon, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import Reactotron from 'reactotron-react-native';
// import BottomDrawer from 'rn-bottom-drawer';
import Spinner from 'react-native-spinkit';
import { useStores } from "@models/root-store"
import Toast from 'react-native-root-toast';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */

const styles = {
  back: {
    marginRight: 40, marginTop: 5
  },
  back_alt: {
    position: "absolute", right: 0
  },
  menu: {
    position: "absolute",
    top: 30,
    left: 30  
  },
  wrapper: {
    flexDirection: "row",
  },
  filter: {
    position: "absolute", right: 0, top: 5, paddingLeft: 50
  },
  no_head: {
    position: "absolute", zIndex: 9, top: 0, left: deviceWidth*0.1
  },
  header_one: {
    paddingVertical: 40
  },
  header_two: {
    backgroundColor: "#FF0000", marginBottom: 40, paddingVertical: 40, paddingBottom: 20
  }
}

export const Header: React.FunctionComponent<HeaderProps> = props => {
  const {
    type,
    title,
    style,
    alt,
    filter,
    filterHandle,
    no_head
  } = props
  // const headerType = type || (headerTx && translate(headerTx)) || ""

  const rootStore = useStores()
  const [loading, setLoading] = useState(props.loading);

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
    props.navigation,
  ])

  const _headerHome = () => {
    return(

      <View>

        {(rootStore.getCurrentUser().email_verified == "0" &&
          <View style={{ backgroundColor: "red", padding: 15, flexDirection: "row" }}>
            <Text style={{ color: "#fff", fontSize: 12 }} tx="account.email_not_verified" />

            <TouchableOpacity onPress={() => doResendEmailVerif()}>
              <Text style={{ marginLeft: 5, color: "#fff", fontSize: 12, textDecorationLine: "underline" }} tx="account.resend_email_verif" />
            </TouchableOpacity>
          </View>
        )}
        <View key={"headerhome"} style={{ ...layout.container.wrapper, marginLeft: -70 }}>
          <TouchableOpacity onPress={() => navigateTo("menu")} style={styles.menu}>
            {/*<Image source={require('@assets/ico_menu.png')} />*/}
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _headerDetail = () => {

    var useStyle;
    if(props.header_style == "style2"){
      useStyle = styles.header_two;
    }else{
      useStyle = styles.header_one;
    }

    return(
      <View key={"headerdetail"} style={(props.no_head) ? { ...useStyle, ...styles.no_head } : { ...useStyle } }>
        {(props.header_style == "style3" && 
          <View style={layout.page.header_round}></View>
        )}
        {(props.header_style == "style4" && 
          <View style={layout.container.bg} navigation={props.navigation} />
        )}
        <View style={{ ...layout.container.wrapper }}>
          <View style={{ ...styles.wrapper }}>
            <TouchableOpacity onPress={goBack} style={styles.back}>
              <Image source={(props.alt) ? require('@assets/arrow-left-alt.png') : require('@assets/arrow-left.png')} />
            </TouchableOpacity>
            <Text preset="header_title" style={(props.alt) ? {color: "#fff"} : {color: "#2E384D"}} text={props.title} />

            {(props.filter &&
              <TouchableOpacity onPress={props.filterHandle} style={styles.filter}>
                <Image source={(props.alt) ? require('@assets/ico_filter.png') : require('@assets/ico_filter_dark.png')} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    )
  }

  const _headerMenu = () => {
    return(
      <View key={"headermenu"} style={{ ...layout.container.wrapper, marginTop: 40, marginBottom: 40 }}>
        <View style={{ ...styles.wrapper }}>
          <TouchableOpacity onPress={goBack} style={styles.back_alt}>
            <Image source={require('@assets/arrow-right-alt.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const doResendEmailVerif = async () => {
    var param = {
      email: rootStore.getCurrentUser().email
    };

    setLoading(true);
    var result = await rootStore.sendEmailVerif(param);
    setLoading(false);

    if(result.kind == "ok" && result.data){
      Toast.show(result.data);
    }
    
  }

  const _renderTypes = () => {
    var arr = [];

    if(loading){
      arr.push(
        <View key="loading" style={{ ...layout.loading.wrapper }}>
          <Spinner style={{ ...layout.loading.loader }} size={100} type={"ThreeBounce"} color={"#ececec"}/>
        </View>
      )
    }

    if(props.type == "home"){
      arr.push(_headerHome());
    }else if(props.type == "detail"){
      arr.push(_headerDetail());
    }else if(props.type == "menu"){
      arr.push(_headerMenu());
    }

    return arr;
  }

  return _renderTypes()

  /*
  return (
    <View style={{ ...ROOT, ...style }}>
      {leftIcon ? (
        <Button preset="link" onPress={onLeftPress}>
          <Icon icon={leftIcon} />
        </Button>
      ) : (
        <View style={LEFT} />
      )}
      <View style={TITLE_MIDDLE}>
        <Text style={{ ...TITLE, ...titleStyle }} text={header} />
      </View>
      {rightIcon ? (
        <Button preset="link" onPress={onRightPress}>
          <Icon icon={rightIcon} />
        </Button>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
  */
}
