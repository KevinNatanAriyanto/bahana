import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ImageBackground, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, Screen, Button, Checkbox, FormRow, Header, Head, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Ads } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import OneSignal from 'react-native-onesignal';
import PushNotification from 'react-native-push-notification';

// import BottomDrawer from 'rn-bottom-drawer';
import { Client } from 'bugsnag-react-native';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import { translate } from "@i18n"
import { CONFIG } from "@utils/config"
import moment from "moment";

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface ComplaintScreenProps extends NavigationScreenProps<{}> {
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const styles = {
    base:{
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
    },
    image_calendar:{
        height:0.041*deviceWidth,
        width:0.041*deviceWidth,
        marginRight:0.055*deviceWidth,
    },
    container:{
    	// height: 0.22*deviceWidth,
        backgroundColor:'white',
        borderRadius:10,
        elevation:2,
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
        paddingTop:0.027*deviceWidth,
        paddingBottom:0.027*deviceWidth
        // flexDirection:'row'
    },
    separator_line_grey:{
        borderBottomColor: "#CCCCCC", 
        borderBottomWidth: 1,
        marginTop:0.027*deviceWidth,
        marginBottom:0.027*deviceWidth
        // alignSelf: "center"
    },
    date_text:{
        fontSize:14,
        color:"#CCCCCC",
        textAlignVertical: "center"
    },
    center:{
        alignItems: 'center', justifyContent: 'center'
    },
    akhir_tgl:{
        flexDirection:'row', 
        // marginTop:0.055*deviceWidth
    },
    absence_list:{
        // width: 0.875*deviceWidth,
        borderRadius:10,
        elevation:1,
        padding:0.055*deviceWidth,
        marginBottom:0.027*deviceWidth
        // paddingRight:0.055*deviceWidth,
        // paddingTop:0.055*deviceWidth,
        // paddingBottom:0.055*deviceWidth
    },
    status_list_in:{
        fontSize:12,
        color:"#E96925",
    },
    status_list_out:{
        fontSize:12,
        color:"#8333E9",
    },
    status_box_in:{
        borderRadius:10,
        // elevation:1,
        width:0.3*deviceWidth,
        paddingBottom:0.013*deviceWidth,
        paddingTop:0.013*deviceWidth,
        paddingLeft:0.027*deviceWidth,
        paddingRight:0.027*deviceWidth,
        backgroundColor:'#FFE6D8',
        marginBottom:0.02*deviceWidth
        // marginBottom:0.027*deviceWidth
    },
    status_box_out:{
        borderRadius:10,
        // elevation:1,
        width:0.3*deviceWidth,
        paddingBottom:0.013*deviceWidth,
        paddingTop:0.013*deviceWidth,
        paddingLeft:0.027*deviceWidth,
        paddingRight:0.027*deviceWidth,
        backgroundColor:'#E9D8FF',
        marginBottom:0.02*deviceWidth
        // marginBottom:0.027*deviceWidth
    },
    date_list:{
        fontSize:16,
        color:"#5F5959",
        fontWeight: "bold",
        marginBottom:0.01*deviceWidth
    },
    absen_list:{
        fontSize:12,
        color:"#5F5959",
    },
    absen_button:{
        flexDirection:'row',
        position: "absolute",
        alignSelf:'center',
        bottom:0.138*deviceWidth,
        paddingRight:0.055*deviceWidth,
        paddingLeft:0.055*deviceWidth,
        paddingTop:0.027*deviceWidth,
        paddingBottom:0.027*deviceWidth,
        backgroundColor:'#381D5C',
        borderRadius:10,
    },
    fingerprint_image:{
        height:0.055*deviceWidth,
        width:0.055*deviceWidth,
        marginRight:0.027*deviceWidth,
    },
    absen_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
    },
    modal:{
        width: deviceWidth*0.8, 
        padding: 0, 
        elevation: 999, 
        zIndex: 999, 
        borderRadius: 10, 
        height: deviceWidth*0.65, 
        position: "relative"
     },
     ok_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.32*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center'
     },
     cancel_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.32*deviceWidth,
        height:0.111*deviceWidth,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#8D8D8D',
        justifyContent:'center',
        alignItems:'center'
    },
    ok_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
    },
    cancel_text:{
        fontSize:14,
        color:"#8D8D8D",
        fontWeight: "bold",
    },
    modal_header:{
        fontSize:18,
        color:"#5F5959",
        fontWeight: "bold",
    },
    pil_text:{
        fontSize: 14,
        textAlignVertical: "center",
        marginLeft:0.055*deviceWidth
    }
}

export const ComplaintScreen: React.FunctionComponent<ComplaintScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  	const rootStore = useStores()
  	const [loading, setLoading] = useState(false);
  	const [current_user_role, setCurrentUserRole] = useState(null);
  	const [refreshing, setRefreshing] = React.useState(false);
  	const [tasks, setTasks] = React.useState([]);
  	const [currentCompany, setCurrentCompany] = React.useState([]);
  	const [companyLogo, setCompanyLogo] = React.useState(require('@assets/logo.png'));
  	const [notifications, setNotifications] = React.useState([]);

	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      	props.navigation,
  	])

  	return (
	    <View style={layout.container.general}>
			<ScrollView>

				
	        </ScrollView>

	    </View>
  	)
})
