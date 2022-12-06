import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, Picker, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, BackHandler } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Icon, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import Reactotron from 'reactotron-react-native';
// import BottomDrawer from 'rn-bottom-drawer';
import Spinner from 'react-native-spinkit';
import { useStores } from "@models/root-store"
import Toast from 'react-native-root-toast';
import Modal from 'react-native-modalbox';
import { showMessage, hideMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

let dropDownAlertRef;
/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */

const styles = {
  back: {
    marginRight: 0.02*deviceWidth,
    marginTop: 0.01*deviceWidth
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
  filterButton: {
    position: "absolute", right: 50
  },
  no_head: {
    position: "absolute", zIndex: 9, top: 0, left: deviceWidth*0.055
  },
  header_one: {
    paddingVertical: 40
  },
  header_two: {
    backgroundColor: "#FF0000", marginBottom: 40, paddingVertical: 40, paddingBottom: 20
  },
  header_three:{
    paddingBottom: 0.04*deviceWidth,
    paddingTop: 0.04*deviceWidth,
    elevation:2,
    paddingLeft: 0.055*deviceWidth,
    marginLeft:-0.01*deviceWidth,
    borderRadius:1,
    width:1.1*deviceWidth,
    height: 60
  },
  header_no_border:{
    paddingBottom: 0.04*deviceWidth,
    paddingTop: 0.04*deviceWidth,
    elevation:0,
    paddingLeft: 0.055*deviceWidth,
    marginLeft:-0.01*deviceWidth,
    borderRadius:1,
    width:1.1*deviceWidth,
    height: 60
  },
  image_back:{
    height:0.055*deviceWidth,
    width:0.055*deviceWidth
  },
  title_text:{
    fontSize:16,
    color:"#5F5959",
    textAlignVertical: "center",
    width:0.8*deviceWidth
  },
  function_text:{
    fontSize:14,
    color:"#3B3B3B",
  },
  modal:{
    width:0.305*deviceWidth, 
    height:0.16*deviceWidth, 
    position:'absolute', 
    top:0.125*deviceWidth, 
    right:0.4*deviceWidth, 
    borderRadius:10,
    borderWidth:1,
    zIndex:3,
  },
  opsi: {
    justifyContent:'center', alignItems:'center', paddingHorizontal: 10
  },
  opsi_right: {
    position: "relative", left: -50
  }
}

export const Head: React.FunctionComponent<HeaderProps> = props => {
  const {
    type,
    title,
    style,
    alt,
    filter,
    filterHandle,
    no_head,
    no_back
  } = props
  // const headerType = type || (headerTx && translate(headerTx)) || ""

  const rootStore = useStores()
  const [loading, setLoading] = useState(props.loading);
  const menuModal = useRef(null);

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
    props.navigation,
  ])

  /*
  const unsubscribe = NetInfo.addEventListener(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);

    if(state.isConnected){
      hideMessage();
    }else{
      Helper.offlineMsg();
    }
  });

  unsubscribe();
  */

  const openModal = () => {
    menuModal.current.open()
  }

  const closeModal = () => {
      menuModal.current.close()
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", doBack);
    return () => BackHandler.removeEventListener("hardwareBackPress", doBack);
  }, []);

  const doBack = () => {
    goBack();

    try{
      props.navigation.state.params.onGoBack()
    }catch(e){
      
    }

    return true;
  }

  const _headerDetail = () => {


    return(
      <View>
      <View key={"headerdetail"} style={ (props.noBorder) ? styles.header_no_border : styles.header_three }>
        <View style={{ ...layout.container.general, elevation:9 }}>
          <View style={{ ...styles.wrapper}}>

            {(!props.no_back &&
              <TouchableOpacity onPress={doBack} style={styles.back}>
                <Image source={require('@assets/back.png')} style={styles.image_back} />
              </TouchableOpacity>
            )}
            
              {/*<Picker
                  // selectedValue={selectedValue}
                  // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                  style={{ position:'absolute', right:0.1*deviceWidth, width:100, bottom:0, elevation:9 }}>
                  <Picker.Item label="Edit" value="java" style={{color:'transparent'}}/>
                  <Picker.Item label="Delete" value="js" style={{color:'transparent'}}/>
              </Picker>*/}
            <Text preset="header_title" style={styles.title_text} text={props.title} />
            
            {(props.filter &&
              <TouchableOpacity onPress={props.filterHandle} style={styles.filter}>
                <Image source={(props.alt) ? require('@assets/ico_filter.png') : require('@assets/ico_filter_dark.png')} />
              </TouchableOpacity>
            )}

            {(props.right_content && props.right_action) &&
              <TouchableOpacity style={{ ...styles.opsi_right }} onPress={props.right_action}>
                {props.right_content}
              </TouchableOpacity>
            }
            
            {(props.opsi) &&
              <TouchableOpacity style={{ ...styles.opsi }} onPress={props.opsi}>
                <Image source={require('@assets/ico_filter_dark.png')} />
              </TouchableOpacity>
            }
            
            {(props.filterButton) &&
              <TouchableOpacity style={styles.filterButton} onPress={props.filterButtonAction}>
                <Image style={{width: 70, height: 30, resizeMode: "contain"}} source={require('@assets/ico_button_filter.png')} />
              </TouchableOpacity>
            }
          </View>
        </View>
        
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

    if(props.type == "detail"){
      arr.push(_headerDetail());
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
