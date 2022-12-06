import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, RefreshControl, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
    flexDirection: "row", flex: 1
  },
  title_header: {
    marginVertical: 10
  },
  action: {
    wrapper: {
      marginBottom: 40, marginTop: 20
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
  activity_person: {
    fontWeight: "bold", marginRight: 3,
  }
}


export interface NotifDetailScreenProps extends NavigationScreenProps<{}> {
}

export const NotifDetailScreen: React.FunctionComponent<NotifDetailScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [forCompanies, setForCompanies] = useState(null);
    const [forDepartment, setForDepartment] = useState(null);
    const [notif, setNotif] = useState(props.navigation.state.params.notif);
    const [refreshing, setRefreshing] = React.useState(false);
    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    // const netInfo = useNetInfo();

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadNotice();
      // loadImportantNotices();
      setRefreshing(false);

    }, [refreshing]);

    useEffect( () => {
      loadNotice()
    }, []);

    const loadNotice = async () => {

      setLoading(true);
      var param = {
        id: notif.id
      }
      var result = await rootStore.getDetailNotice(param);
      setLoading(false);

      if(result.kind == "ok"){
        setNotif(result.data)

        if(!!result.data.for_sub_company){
          if(Array.isArray(result.data.for_sub_company)){

            var arr = []
            result.data.for_sub_company.map((item,i) => {
              arr.push(item.name)
            })
            arr = arr.join()
            setForCompanies(arr)

          }else{
            setForCompanies(result.data.for_sub_company)
          }
        }

        if(!!result.data.for_department){
          if(Array.isArray(result.data.for_department)){

            var arr = []
            result.data.for_department.map((item,i) => {
              arr.push(item.team_name)
            })
            arr = arr.join()
            setForDepartment(arr)

          }else{
            setForDepartment(result.data.for_department)
          }
        }

      }
    }


    const formatDate = (datenow) => {
        // return moment(datenow).calendar(null, {
        //   sameElse: 'MMMM Do YYYY'
        // })

        return moment(datenow).format("MMM Do YYYY");
    }
    const formatTime = (datenow) => {
        // return moment(datenow).calendar(null, {
        //   sameElse: 'h:mm:ss a'
        // })

        return moment(datenow).format("h:mm:ss a");
    }

    const deleteNotice = async () => {
      _panel.hide();

      var param = {
        id: props.navigation.state.params.id
      }
      
      setLoading(true);
      var result = await rootStore.deleteTicket(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        // Reactotron.log(result.data)
        Toast.show("Komplain berhasil dihapus");
        goBack();
        props.navigation.state.params.onBack();
      }
    }

    const _renderDetail = () => {
      return(
        <View>
          <ScrollView 
            style={layout.container.content_wtabbar}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>

              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Text style={{ ...layout.typography.h3, ...styles.title }}>{notif.heading}</Text>
                <Text style={{ ...layout.typography.body_smaller }}>Oleh {(notif.created_by_user) ? notif.created_by_user.name : ""}</Text>
                <Text style={{ ...layout.typography.body_smaller }}>{formatDate(notif.created_at)}</Text>
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Tentang Pengumuman</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Ditujukan untuk</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{notif.to}</Text>
                </View>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Perusahaan yang dituju</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{forCompanies}</Text>
                </View>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Divisi yang dituju</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{forDepartment}</Text>
                </View>
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Deskripsi Pengumuman</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Text style={layout.typography.body}>{notif.description}</Text>
              </View>

              {(notif.linkFile != null) &&
                <Image
                  source={{  uri: notif.linkFile }}
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />
              }
            </View>

          </ScrollView>
          
        </View>
      )
    }

    // Animation
    let animateRef;
    const [isOptionOpen, setIsOptionOpen] = useState(false)
    handleViewRef = ref => animateRef = ref;

    const togglePopup = () => {
        var toggle = !isOptionOpen;
        var zIndex = (toggle) ? toggle : -1;

        setIsOptionOpen(toggle);
        return animateRef.transitionTo({ opacity: toggle, zIndex: zIndex });
    }

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />
        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_notice != "0" &&
          <Head type="detail" title={'Detail Pengumuman'} navigation={props.navigation} opsi={() => togglePopup() } />
        )}

        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_notice == "0" &&
          <Head type="detail" title={'Detail Pengumuman'} navigation={props.navigation} />
        )}

        <Animatable.View ref={handleViewRef} style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.header_option.container }}>
          <TouchableOpacity onPress={() => navigateTo('form_notif', {type: "edit", onBack: props.navigation.state.params.onBack() })} style={{ ...layout.header_option.wrapper }}>
            <Text style={layout.typography.body}>Edit Pengumuman</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _panel.show()} style={{ ...layout.header_option.wrapper, marginBottom: 0 }}>
            <Text style={layout.typography.body}>Hapus</Text>
          </TouchableOpacity>
        </Animatable.View>

        {_renderDetail()}

        <SlidingUpPanel 
            ref={c => _panel = c}
            containerStyle={{ ...layout.bottom_notif.container }}
            backdropStyle={{ ...layout.bottom_notif.backdrop }}
            allowDragging={false}
            draggableRange={{
                top: 240,
                bottom: 0
            }}
            friction={0.3}
        >
            <View style={{ ...layout.bottom_notif.wrapper }}>
                <Text style={layout.bottom_notif.title}>Hapus Pengumuman</Text>
            </View>
            <View style={{ ...layout.bottom_notif.wrapper, ...layout.bottom_notif.row, marginBottom: 50 }}>
                <Icon name="ios-information-circle-outline" style={{ ...layout.bottom_notif.icon }} size={40} />
                <Text style={layout.bottom_notif.text}>Apakah anda yakin anda akan menghapus pengumuman ini?</Text>
            </View>
            <View style={{ ...layout.bottom_notif.row }}>
                <Button onPress={() => _panel.hide()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                </Button>
                <Button onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                </Button>
            </View>
        </SlidingUpPanel>
      </View>
    )
})
