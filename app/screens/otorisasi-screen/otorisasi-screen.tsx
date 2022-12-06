import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, DatePickerAndroid, RefreshControl, Picker } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
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
import {useNetInfo} from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
import { WebView } from "react-native-webview";
import { Radio } from 'native-base';
import Reactotron from 'reactotron-react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from 'react-native-animatable';
import { CONFIG } from "@utils/config"

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  title: {
    marginBottom: 10
  },
  sublabel: {
    color: "#BABABA", marginRight: 5
  },
  row: {
    flexDirection: "row"
  },
  action: {
    wrapper: {
      marginBottom: 10, marginTop: 20
    },
    btn: {
      marginLeft: 10
    },
    textbox: {
      flex: 1
    }
  },
  floating_btn: {
    position: "absolute", bottom: 50, alignSelf: "center"
  },
  icon_request: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
}


export interface OtorisasiScreenProps extends NavigationScreenProps<{}> {
}

export const OtorisasiScreen: React.FunctionComponent<OtorisasiScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [dateStartPickerVisible, setDateStartPickerVisible] = useState(false);
    const [dateEndPickerVisible, setDateEndPickerVisible] = useState(false);
    const [startDateVal, setStartDateVal] = useState("");
    const [endDateVal, setEndDateVal] = useState("");

    const [employeeId, setEmployeeId] = useState(null);
    const [startDate, setStartDate] = useState(null);

    const menuModal = useRef(null);
    const menuModalLocation = useRef(null);
    // const [isEnabled, setIsEnabled] = useState({});
    const [showingInfo, setShowingInfo] = useState({});
    const userAgentAndroid =
        "Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  	const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params ), [
        props.navigation,
    ])

    const cur_user = rootStore.getCurrentUser();

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadMembers()
      setRefreshing(false);
      
    }, [refreshing]);

    useEffect( () => {
        loadMembers()
    }, []);

    const loadMembers = async () => {

      var results = [];

      setLoading(true);
      var result = await rootStore.getAssignee();
      setLoading(false);

      if(result.kind == "ok" && result.data && result.data.assignee){
        results = [
          {
            id: cur_user.id,
            name: cur_user.name
          },
          ...result.data.assignee
        ];
        setMembers(results)
      
        var showing = {};
        // var isEnabled = {};

        result.data.assignee.map((item,i) => {

          eval("var tmp = { member"+item.id+": false }")
          // eval("var tmp_enabled = { member"+item.id+": item.notif_setting.no_notification }")

          showing = {
            ...showing,
            ...tmp
          }

          // isEnabled = {
          //   ...isEnabled,
          //   ...tmp_enabled
          // }

        })

        setShowingInfo(showing);
        // setIsEnabled(isEnabled);
      }
    }

    /*
    const doEdit = async (item, toggle) => {

      var notif_setting = item.notif_setting;
      var new_no_notification = !notif_setting.no_notification;

      var params = {
        bawahan_user_id: item.id
      }

      if(startDateVal){
        params = {
          ...params,
          no_notification_start_date: moment(startDateVal).format("DD-MM-YYYY"),
          no_notification_start_time: moment(startDateVal).format("hh:mm a"),
        }
      }

      if(endDateVal){
        params = {
          ...params,
          no_notification_end_date: moment(endDateVal).format("DD-MM-YYYY"),
          no_notification_end_time: moment(endDateVal).format("hh:mm a"),
        }
      }

      if(toggle){
        params = {
          ...params,
          no_notification: (new_no_notification) ? 1 : 0,
        }
      }else{
        params = {
          ...params,
          no_notification: 1,
        }
      }

      setLoading(true);
      var result = await rootStore.editNotifSettings(params);
      setLoading(false);

      if(result.kind == "ok" && result.data){

        // reset selectedItem
        setSelectedItem(null);

        // reload all data
        await loadMembers();

        closeModal();
      }
    }
    */

    /*
    const onToggle = async (item) => {

      var notif_setting = item.notif_setting;

      if(notif_setting && notif_setting.no_notification_start && notif_setting.no_notification_start != "" && notif_setting.no_notification_end && notif_setting.no_notification_end != ""){

        doEdit(item, "toggle");

      }else{
        openModal(item);
      }
    }
    */

    const showInfo = (id) => {
      
      if(!showingInfo[`member${id}`]){
        this[`member${id}`].animate(
          { 
            0: { opacity: 0, marginTop: -125, zIndex: 0 }, 
            1: { opacity: 1, marginTop: -25, zIndex: 1 } 
          }
        );
      }else{
        this[`member${id}`].animate(
          { 
            0: { opacity: 1, marginTop: -25, zIndex: 1 }, 
            1: { opacity: 0, marginTop: -125, zIndex: 0 } 
          }
        );
      }

      var tmp = { ...showingInfo }
      tmp[`member${id}`] = !tmp[`member${id}`];
      setShowingInfo(tmp)
    }

    const _renderLastAbsence = (item) => {
      if(item.last_attendance && item.last_attendance.clock_out_time){
        return (
          <Text style={{ ...layout.typography.body_smaller }}>
            {moment(item.last_attendance.clock_out_time).format("DD MMM YYYY @ HH:mm")}
          </Text>
        )
      }else if(item.last_attendance && item.last_attendance.clock_in_time){
        return (
          <Text style={{ ...layout.typography.body_smaller }}>
            {moment(item.last_attendance.clock_in_time).format("DD MMM YYYY @ HH:mm")}
          </Text>
        )
      }else{
        return (
          <Text style={{ ...layout.typography.body_smaller }}>Tidak ada</Text>
        )
      }
    }

    /*
    const openModal = (item) => {
      // Reactotron.log(item)

      if(item.notif_setting){
        if(item.notif_setting.no_notification_start){
          setStartDateVal(item.notif_setting.no_notification_start)
        }

        if(item.notif_setting.no_notification_end){
          setEndDateVal(item.notif_setting.no_notification_end)
        }
      }

      setSelectedItem(item);

      setTimeout(function(){
        menuModal.current.open()
      }, 500);
    }

    const closeModal = () => {
      menuModal.current.close()
    }
    */

    const openTracking = (eid, startd) => {

      if((!!eid && !!startd && !!startd.clock_in_time) || eid == cur_user.id){
        var sd;

        if(eid == cur_user.id){
          sd = moment().format("DD-MM-YYYY")
        }else{
          sd = moment(startd.clock_in_time).format("DD-MM-YYYY")
        }

        setEmployeeId(eid)
        setStartDate(sd)

        Reactotron.log(CONFIG.WEB_URL + "/report-tracker/findIframe?employee_id="+eid+"&startDate="+sd)

        menuModalLocation.current.open();
      }
    }

    const handleDatePicker = (date, type) =>{

      if(type == "start_date"){
        setStartDateVal(date)
        setDateStartPickerVisible(false)

      }else if(type == "end_date"){
        setEndDateVal(date)
        setDateEndPickerVisible(false)
      }
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            <DateTimePickerModal
              isVisible={dateStartPickerVisible}
              mode="datetime"
              onConfirm={(date) => handleDatePicker(date, "start_date")}
              onCancel={()=>{setDateStartPickerVisible(false)}}
            />
            <DateTimePickerModal
              isVisible={dateEndPickerVisible}
              mode="datetime"
              onConfirm={(date) => handleDatePicker(date, "end_date")}
              onCancel={()=>{setDateEndPickerVisible(false)}}
            />

		        <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
    			
                <Head type="detail" title={'Otorisasi Tim Anda'} navigation={props.navigation} noBorder={false} />    
                <View style={{...layout.container.wrapper, ...layout.container.bodyView}}>

                    {/*
                    <View style={{ ...styles.action.wrapper, ...styles.row }}>
                      <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
                        <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
                        <TextInput
                            style={{ ...layout.textbox.input }}
                            placeholder="Cari Tugas..."
                            // onChangeText={props.handleChange('search')}
                            // onBlur={props.handleBlur('search')}
                            // value={props.values.search}
                            // onSubmitEditing={()=>{
                            //   loadTasks(props.values.search, filterData)
                            // }}

                        />
                      </View>
                      <TouchableOpacity 
                        // onPress={() => {
                        //   loadTasks(props.values.search, filterData)
                        // }} 
                        style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn }}
                      >
                          <Icon name="ios-search" size={20} style={{ color: "#fff", marginRight: 10 }} />
                          <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Cari</Text>
                      </TouchableOpacity>
                    </View>
                    */}

                    {members.map((item,i) => {

                      var notif_date = "-";
                      if(!!item.notif_setting && !!item.notif_setting.no_notification_start && !!item.notif_setting.no_notification){
                        var no_notification_start_str = moment(item.notif_setting.no_notification_start).format("DD MMM YYYY | HH:mm")
                        var no_notification_end_str = moment(item.notif_setting.no_notification_end).format("DD MMM YYYY | HH:mm")

                        notif_date = no_notification_start_str+" - "+no_notification_end_str;
                      }

                      return(
                        <View key={i} style={{ overflow: "visible" }}>
                          <View 
                            // onPress={() => showInfo(item.id)} 
                            style={{...layout.list.absence_list, flexDirection: "row", elevation: 2, zIndex: 9, marginTop: 20 }}>
                            <TouchableOpacity onPress={() => openTracking(item.id, item.last_attendance)} style={{ width: "95%", flexDirection: "row", justifyContent: "space-between" }}>
                              <View>
                                <Text style={{ ...layout.typography.h3, ...styles.title }}>{item.name}</Text>

                                {(item.last_attendance &&
                                  <View style={styles.row}>
                                    <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Absensi Terakhir:</Text>
                                    {_renderLastAbsence(item)}
                                  </View>
                                )}
                              </View>

                              {(item.id != cur_user.id &&
                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigateTo("otorisasi_request", { id: item.id, onBack: onRefresh })}>
                                  <Image style={styles.icon_request} source={require("@assets/ico_request.png")} />
                                </TouchableOpacity>
                              )}
                            </TouchableOpacity>

                            {/*
                            {(!showingInfo[`member${item.id}`] &&
                              <Icon name="ios-arrow-down" size={20} style={{ color: "#000" }} />
                            )}
                            {(showingInfo[`member${item.id}`] &&
                              <Icon name="ios-arrow-up" size={20} style={{ color: "#000" }} />
                            )}
                            */}
                          </View>

                          {/*
                          <Animatable.View 
                            ref={(ref) => ( this[`member${item.id}`] = ref)}
                            duration={500}
                            style={{...layout.list.absence_list, marginTop: -125, elevation: 1, paddingVertical: 30, flexDirection: "row", opacity: 0, marginBottom: 20 }}>

                            <View style={{ width: "80%" }}>
                              <Text style={{ ...layout.typography.body, ...styles.title }}>Notifikasi keluar radius</Text>
                              
                              <TouchableOpacity onPress={() => openModal(item)}>

                                {(notif_date != "-" &&
                                  <Text style={{ ...layout.typography.body_smaller, color: "#c0c0c0" }}>{notif_date}</Text>
                                )}

                                {(notif_date != "-" &&
                                  <Text style={{ ...layout.typography.body_smaller, color: "#381D5C", fontSize: 12, textDecorationLine: "underline", fontWeight: "bold", marginTop: 10 }}>Ubah waktu</Text>
                                )}
                              </TouchableOpacity>
                            </View>
                            <Switch
                              onToggle={() => onToggle(item)}
                              value={!item.notif_setting.no_notification}
                            />

                          </Animatable.View>
                          */}

                        </View>
                      )
                    })}

                </View>
            
          </ScrollView>

          <Modal
            style={{ ...layout.modalbox.modal}}
            ref={menuModalLocation}
            backdropPressToClose={false}
            swipeToClose={false}>
            <View style={{ ...layout.modal.body, height: deviceHeight-100 }}>
              <Text style={{...layout.modalbox.modal_header, marginBottom: 20 }} text="Lacak karyawan" />
              <WebView
                startInLoadingState
                style={{ flex: 1, height: deviceHeight/2 }}
                source={{ uri: CONFIG.WEB_URL + "/report-tracker/findIframe?employee_id="+employeeId+"&startDate="+startDate }}
                userAgent={userAgentAndroid}
                scalesPageToFit
              />
              <View style={{...layout.modalbox.button_modal, marginTop: 20 }}>
                  <TouchableOpacity onPress={()=>{ menuModalLocation.current.close() }} style={{...layout.modalbox.batal_button, flex: 1 }}>
                      <Text style={{...layout.modalbox.batal_text}}>TUTUP</Text>
                  </TouchableOpacity> 
              </View>
            </View>
          </Modal>

          {/*
            <Modal
              style={{ ...layout.modalbox.modal}}
              ref={menuModal}
              backdropPressToClose={true}
              swipeToClose={true}>
              <View style={{ ...layout.modal.body }}>
                <Text style={{...layout.modalbox.modal_header}} text="Matikan Notifikasi" />
                <TouchableOpacity onPress={() => setDateStartPickerVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginTop:20 }}>
                    <TextInput
                      style={{ ...layout.textbox.input }}
                      placeholder="Tanggal & Jam Mulai"
                      editable={false}
                      value={(startDateVal) ? moment(startDateVal).format("DD MMM YYYY @ HH:mm") : ""}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDateEndPickerVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginBottom:40 }}>
                    <TextInput
                      style={{ ...layout.textbox.input }}
                      placeholder="Tanggal & Jam Selesai"
                      editable={false}
                      value={(endDateVal) ? moment(endDateVal).format("DD MMM YYYY @ HH:mm") : ""}
                    />
                </TouchableOpacity>
                <View style={{...layout.modalbox.button_modal}}>
                    <TouchableOpacity onPress={()=>{ closeModal() }} style={{...layout.modalbox.batal_button}}>
                        <Text style={{...layout.modalbox.batal_text}}>BATAL</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={()=>{ doEdit(selectedItem) }} style={{...layout.modalbox.ok_button}}>
                        <Text style={{...layout.modalbox.ok_text}}>OK</Text>
                    </TouchableOpacity>    
                </View>
              </View>
            </Modal>
          */}

        </View>
    )
})
