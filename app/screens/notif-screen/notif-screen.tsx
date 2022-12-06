import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl } from "react-native"
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
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
import OneSignal from 'react-native-onesignal';
import reactotron from 'reactotron-react-native';

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
      marginBottom: 40
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
  }
}


export interface NotifScreenProps extends NavigationScreenProps<{}> {
}

export const NotifScreen: React.FunctionComponent<NotifScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [notices, setNotices] = useState([]);
    const [notif, setNotif] = useState(null);
    const [notifTab, setNotifTab] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [unread_notices, setUnreadNotices] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    // const netInfo = useNetInfo();

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadNotices();
      loadNotif();
      loadImportantNotices();
      setRefreshing(false);

    }, [refreshing]);

    useEffect( () => {
      OneSignal.clearOneSignalNotifications();

      loadNotices()
      loadNotif()
      loadImportantNotices()
      markNoticesRead()
    }, []);

    const loadNotices = async () => {

      setLoading(true);
      var param = {
        
      }
      var result = await rootStore.getNotices(param);
      setLoading(false);

      reactotron.log("========================result");
      reactotron.log(result);

      if(result.kind == "ok"){
        // setNotices(result.data)
        setNotices(result.data.notices)
      }
    }

    const loadNotif = async () => {

      setLoading(true);
      var param = {
        
      }
      var result = await rootStore.getNotificationsDB(param);
      setLoading(false);
      
      readNotif();
      if(result.data.length > 0){
        let tempArr = [];
        result.data.forEach(e => {
          tempArr.push(e);
        });
        // tempArr = tempArr.reverse();
        Reactotron.log("-=-=tempArr");
        Reactotron.log(tempArr);
        setNotifications(tempArr);
      }
    }

    const readNotif = async () => {
      setLoading(true);
      var param = {
        
      }
      var result = await rootStore.readNotificationsDB(param);
      setLoading(false);
    }

    const loadImportantNotices = async () => {

      setLoading(true);
      var param = {
        
      }
      var result = await rootStore.getCustomNotif(param);
      setLoading(false);

      if(result.kind == "ok"){
        Reactotron.log(result.data)
        setNotif(result.data.notif)
      }
    }
    const markNoticesRead = async () => {

      // setLoading(true);
      var param = {
        
      }
      var result = await rootStore.markNoticesRead(param);
      // setLoading(false);
    }

    const formatDate = (datenow) => {
      return moment.parseZone(datenow).local().calendar(null, {
        sameElse: 'MMMM Do YYYY, h:mm:ss a'
      })
    }
    const formatTime = (datenow) => {
        // return moment(datenow).calendar(null, {
        //   sameElse: 'h:mm:ss a'
        // })

        return moment.parseZone(datenow).local().format("h:mm:ss a");
    }

    //Modal
    const openModal = () => {
        menuModal.current.open()
        }

    const closeModal = () => {
        menuModal.current.close()
        }

    const openModalOpsi = () => {
        opsiModal.current.open()
        }

    const closeModalOpsi = () => {
        opsiModal.current.close()
        }

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'important', title: 'Belum dibaca' },
        { key: 'all', title: 'Pengumuman' },
    ]);

    const ImportantRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderImportant()}
      </View>
    );

    const AllRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderNotices()}
      </View>
    );
    const renderScene = SceneMap({
        important: ImportantRoute,
        all: AllRoute
    });

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{ ...layout.tabs.indicator }}
        style={{ ...layout.tabs.container }}
        labelStyle={{ ...layout.tabs.title }}
        activeColor={"#381D5C"}
        inactiveColor={"#BABABA"}
      />
    );

    const _renderImportant = () => {
      return(
        <View>
          <ScrollView 
            style={layout.container.content_wtabbar}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View
              style={{
                width: deviceWidth,
                height: 40,
                backgroundColor: "white",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => setNotifTab(1)}
                style={[
                  {
                    flex: 0.3,
                    alignItems: "center",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                  },
                  (notifTab == 1) && {borderBottomColor: "#381D5C"},
                ]}
              >
                <Text
                  style={[
                    {
                      color: "black",
                      fontSize: 14,
                    },
                    (notifTab == 1) && {color: "#381D5C", fontWeight: "bold"},
                  ]}
                >Leave</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNotifTab(2)}
                style={[
                  {
                    flex: 0.4,
                    alignItems: "center",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                  },
                  (notifTab == 2) && {borderBottomColor: "#381D5C"},
                ]}
              >
                <Text
                  style={[
                    {
                      color: "black",
                      fontSize: 14,
                    },
                    (notifTab == 2) && {color: "#381D5C", fontWeight: "bold"},
                  ]}
                >Informasi Pekerjaan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNotifTab(3)}
                style={[
                  {
                    flex: 0.3,
                    alignItems: "center",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                  },
                  (notifTab == 3) && {borderBottomColor: "#381D5C"},
                ]}
              >
                <Text
                  style={[
                    {
                      color: "black",
                      fontSize: 14,
                    },
                    (notifTab == 3) && {color: "#381D5C", fontWeight: "bold"},
                  ]}
                >Tugas</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

              {(notif.absen.show &&
                <TouchableOpacity 
                  onPress={() => navigateTo("absence_history")} 
                  style={{...layout.list.absence_list}}>
                    <Text style={{ ...layout.typography.h3, ...styles.title }}>{notif.absen.message}</Text>
                    <Text style={{...layout.list.date_text }}>Klik di sini untuk absen sekarang</Text>
                </TouchableOpacity>
              )}

              {(notif.tugas_berjalan.show &&
                <TouchableOpacity 
                  onPress={() => navigateTo("tasks")} 
                  style={{...layout.list.absence_list}}>
                    <Text style={{ ...layout.typography.h3, ...styles.title }}>{notif.tugas_berjalan.message}</Text>
                    <Text style={{...layout.list.date_text }}>Klik di sini untuk melihat tugas yang sedang berjalan</Text>
                </TouchableOpacity>
              )}

              {(notif.laporan_menunggu_konfirmasi.show &&
                <TouchableOpacity 
                  onPress={() => navigateTo("work_report_list")} 
                  style={{...layout.list.absence_list}}>
                    <Text style={{ ...layout.typography.h3, ...styles.title }}>{notif.laporan_menunggu_konfirmasi.message}</Text>
                    <Text style={{...layout.list.date_text }}>Segera konfirmasi laporan pekerjaan di sini</Text>
                </TouchableOpacity>
              )}

              {(notifications.map((item,i) => {
                let type1 = ["KARYAWAN_KELUAR_KANTOR", "Leave", "LOGOUT", "NOTIF-ATASAN"];
                let type2 = ["CC_MEETING", "TASK"];
                let type3 = ["TIMELOG"];

                return(
                  (
                    (notifTab == 1 && type1.includes(item.type)) ||
                    (notifTab == 2 && type2.includes(item.type)) ||
                    (notifTab == 3 && type3.includes(item.type))
                  ) &&
                  <TouchableOpacity 
                    key={"notification"+i} 
                    onPress={() => {
                      let notifID = item.id;
                      if(notifID == ""){
                        notifID = item.task_id;
                      }

                      switch(item.type.toUpperCase()){
                        case "TASK":
                          navigateTo("task_detail", {id: notifID, onBack: onRefresh})
                        break;
                        case "TIMELOG":
                          navigateTo("work_report_detail", {id: notifID, onBack: onRefresh})
                        break;
                        case "LEAVE":
                          navigateTo("pengajuan_detail", {data: { id: notifID }, onBack: onRefresh})
                        break;
                      }
                    }}
                    style={{...layout.list.absence_list}}
                  >
                    <Text style={{ ...layout.typography.h3, ...styles.title }}>
                      {item.heading}

                      {(item.read_at == "") &&
                        <View style={{
                          width: 15,
                          height: 10,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <View style={{
                            backgroundColor: "red",
                            width: 8,
                            height: 8,
                            borderRadius: 100,
                          }} />
                        </View>
                      }
                    </Text>
                    <Text style={{ ...layout.typography.body_smaller }}>{item.description}</Text>
                    <Text style={{ ...layout.typography.body_smaller }}>{formatDate(item.created_at)}</Text>
                  </TouchableOpacity>
                )
              }))}

            </View>

          </ScrollView>
          
        </View>
      )
    }

    const _renderNotices = () => {
      return(
        <View>
          <ScrollView 
            style={layout.container.content_wtabbar}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

              <View style={{...layout.list.container, marginBottom: 40 }}>
                  <TouchableOpacity style={{ flexDirection:'row' }}>
                      <View style={{...layout.list.center}}>
                          <Image source={require('@assets/ic_calendar.png')} style={layout.list.image_calendar} />
                      </View>
                      <Text style={{...layout.list.date_text}}>Pilih batas awal periode</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                      <View style={{...layout.list.separator_line_grey}}/>
                  </View>
                  <TouchableOpacity style={{ ...layout.list.akhir_tgl }}>
                      <View style={{...layout.list.center}}>
                          <Image source={require('@assets/ic_calendar.png')} style={layout.list.image_calendar} />
                      </View>
                      <Text style={{...layout.list.date_text}}>Pilih batas akhir periode</Text>
                  </TouchableOpacity>
              </View>

              {(notices.map((item,i) => {
                return(
                  <TouchableOpacity 
                    key={"notice"+i} 
                    onPress={() => navigateTo("notif_detail", { id: item.id, notif: item, onBack: onRefresh })} 
                    style={{...layout.list.absence_list}}
                  >
                      <Text style={{ ...layout.typography.h3, ...styles.title }}>{item.heading}</Text>
                      <Text style={{ ...layout.typography.body_smaller }}>{formatDate(item.created_at)}</Text>
                  </TouchableOpacity>
                )
              }))}

            </View>

          </ScrollView>
          
        </View>
      )
    }

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />

        <Head type="detail" title={'Semua Pemberitahuan'} navigation={props.navigation} noBorder={true} />

        {(notif &&
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={renderTabBar}
          />
        )}

        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_notice != "0" &&
          <TouchableOpacity onPress={() => navigateTo('form_notif', {type: "add", onBack: onRefresh})} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.floating_btn }}>
              <Image source={require('@assets/ico-megaphone-white.png')} style={layout.button.icon} />
              <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Tambah Pengumuman</Text>
          </TouchableOpacity>
        )}
      </View>
    )
})
