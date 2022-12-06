import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, RefreshControl, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, BackHandler, TouchableNativeFeedback } from "react-native"
import { Text, Status, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
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
import { useNetInfo } from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { WebView } from "react-native-webview";
import { CONFIG } from "@utils/config"
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    webView: {
        flex: 1,
    },
}


export interface FormApproveProps extends NavigationScreenProps<{}> { }

export const FormApproveScreen: React.FunctionComponent<FormApproveProps> = observer((props) => {    
    const rootStore = useStores();
    const [loading, setLoading] = useState(false);
    const [link, setLink] = useState("")
    const menuModalApprove = useRef(null);

    const goBack = React.useMemo(() => () => props.navigation.goBack(), [
        props.navigation,
    ])

    const showModals = () => {
        menuModalApprove.current.open()
    }

    const hideModals = () => {
        menuModalApprove.current.close()
    }
    

    const userAgentAndroid =
        "Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";

    const _onNavigationStateChange = (status) => {
        const { url } = status;

        if (
            url.indexOf(CONFIG.WEB_URL) === 0 &&
            url.indexOf("success") !== -1
        ) {
            Toast.show("Form berhasil ditambahkan");
            goBack();
            props.navigation.state.params.onGoBack();
        }
    };

    const backAction = () => {
        props.navigation.state.params.onGoBack();
        goBack();
        return true;
    };

    useEffect(() => {
        setLink(props.navigation.state.params.link)
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [props.navigation.state.params.link]);


    const approve = async () => {
        const getData = JSON.parse(await AsyncStorage.getItem("form_data"))
        for(const i in getData) {
            if(getData[i].id === props.navigation.state.params.formId) {
                for(const l in getData[i].formData) {
                    if(getData[i].formData[l].id === props.navigation.state.params.data.id) {
                        getData[i].formData.splice(l, 1)
                    }
                }
            }
        }

        props.navigation.state.params.data['status'] = "approved"
        getData[2]['formData'].push(props.navigation.state.params.data)

        let countData = 1
        for(const l in getData[2]['formData']) {
            getData[2]['formData'][l].id = countData
            countData++
        }

        await AsyncStorage.setItem("form_data", JSON.stringify(getData))
        goBack()
    }

    const reject = () => {
        goBack()
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            <Head type="detail" title={'Approve form'} navigation={props.navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={{ height: 500 }}>
                        <WebView
                            startInLoadingState
                            style={styles.webView}
                            source={{ uri: link }}
                            userAgent={userAgentAndroid}
                            onNavigationStateChange={(status) =>
                                _onNavigationStateChange(status)
                            }
                            scalesPageToFit
                        />
                    </View>
                    <View style={{ flexDirection:'row', marginHorizontal:20, flex:1, marginBottom:20}}>
                        <View style={{ marginHorizontal:5, flex:1, justifyContent:'center', alignItems:'center' }}>
                            <TouchableNativeFeedback onPress={() => reject()}>
                                <View style={{ borderWidth:1, borderColor:"#3e1e57", borderRadius:7, paddingHorizontal:20, paddingVertical:10, justifyContent:'center', alignItems:'center', width:150 }}>
                                    <Text style={{ color:"#3e1e57", fontSize:12 }}>
                                        TOLAK
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{ marginHorizontal:5, flex:1, justifyContent:'center', alignItems:'center' }}>
                            <TouchableNativeFeedback onPress={() => approve()}>
                                <View style={{ borderWidth:1, borderColor:"#3e1e57", borderRadius:7, paddingHorizontal:20, paddingVertical:10, backgroundColor:"#3e1e57", justifyContent:'center', alignItems:'center', width:150 }}>
                                    <Text style={{ color:"#ffffff", fontSize:12 }}>
                                        TERIMA
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Modal
                style={{
                    width: deviceWidth*0.88, 
                    padding: 0, 
                    elevation: 999, 
                    zIndex: 999, 
                    borderRadius: 10, 
                    height: deviceWidth*0.8, 
                    position: "relative"
                }}
                ref={menuModalApprove}
                backdropPressToClose={true}
                swipeToClose={true}>
                <View style={{ width:"100%", padding:20, backgroundColor:"#ffffff", borderRadius:10 }}>
                    <View>
                        <Text style={{ fontWeight:"bold" }}>Tolak Pengajuan Form ?</Text>
                    </View>
                    <View style={{ marginVertical:10 }}>
                        <TextInput style={{ width:"100%", borderWidth:1, borderColor:"#bdc3c7", height:100, borderRadius:10 }} placeholder="Komentar" placeholderTextColor="#bdc3c7"/>
                    </View>
                    <View style={{ flexDirection:'row' }}>
                        <View style={{ marginRight:"2" }}>
                            <TouchableNativeFeedback onPress={() => hideModals()}>
                                <View  style={{ borderWidth:1, borderColor:"#3e1e57", borderRadius:7, paddingHorizontal:20, paddingVertical:10, justifyContent:'center', alignItems:'center', width:"100%" }}>
                                    <Text style={{ color:"#3e1e57" }}>Batal</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{ marginLeft:"2" }}>
                            <TouchableNativeFeedback onPress={() => reject()}>
                                <View style={{ borderWidth:1, borderColor:"#3e1e57", borderRadius:7, paddingHorizontal:20, paddingVertical:10, backgroundColor:"#3e1e57", justifyContent:'center', alignItems:'center', width:"100%" }}>
                                    <Text style={{ color:"#ffffff" }}>OK</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
})
