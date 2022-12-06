import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, Picker, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl, Linking } from "react-native"
import { Text, Screen, Status, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
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
import DocumentPicker from 'react-native-document-picker';
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
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
  icon_add: {
    marginRight: 10, color: "#381D5C"
  },
  floating_btn: {
    position: "absolute", bottom: 50, alignSelf: "center"
  },
  activity_person: {
    fontWeight: "bold", marginRight: 3,
  },
  dot: {
    width: 2, height: 2, borderRadius: 1, backgroundColor: "#5F5959", marginHorizontal: 5, alignSelf: "center"
  }
}


export interface LaporanDetailScreenProps extends NavigationScreenProps<{}> {
}

export const LaporanDetailScreen: React.FunctionComponent<LaporanDetailScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [files, setFiles] = useState([]);
    const [reply, setReply] = useState("");
    const [ticket, setTicket] = useState(props.navigation.state.params.data);
    const [selectedStatus, setSelectedStatus] = useState(ticket.status);
    const [refreshing, setRefreshing] = React.useState(false);

    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      loadTicket()

      setRefreshing(false);

    }, [refreshing]);

    useEffect( () => {
      // Reactotron.log(ticket)
    }, []);

    const loadTicket = async () => {
      var param = {
        id: ticket.id
      }
      
      setLoading(true);
      var result = await rootStore.getDetailTicket(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setTicket(result.data)
      }
    }

    const deleteTicket = async () => {
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

    const formatDate = (datenow) => {
        // return moment(datenow).calendar(null, {
        //   sameElse: 'MMMM Do YYYY'
        // })

        return moment.parseZone(datenow).local().format("MMM Do YYYY");
    }
    const formatTime = (datenow) => {
        // return moment(datenow).calendar(null, {
        //   sameElse: 'h:mm:ss a'
        // })

        return moment.parseZone(datenow).local().format("h:mm:ss a");
    }

    const pickDocument = async () => {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images],
        });

        // var files = taskFiles;
        Reactotron.log(results)

        // for (const res of results) {
        //   Reactotron.log(
        //     res.uri,
        //     res.type, // mime type
        //     res.name,
        //     res.size
        //   );

        //   files.push({
        //     uri: res.uri,
        //     type: res.type,
        //     name: res.name,
        //     size: res.size
        //   })
        // }

        setFiles(results);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }

    const doSave = async () => {
      var validate = true;

      let formData = new FormData();

      formData.append("ticket_id", ticket.id);
      formData.append("message", reply);
      formData.append("status_ticket", selectedStatus);

      files.map((item,i) => {

        if(item.uri && item.uri.indexOf("http") == -1){
          Reactotron.log(item)

          var ind = i+1;
          formData.append("files"+ind, {
            uri: item.uri,
            name: item.name,
            type: (item.type) ? item.type : "jpg"
          });
        }
      })

      // Reactotron.log(formData)

      if(reply == "" || selectedStatus == ""){
        validate = false;

        if(reply == ""){
          Toast.show("Pesan balasan harus diisi");
        }
        else if(selectedStatus == ""){
          Toast.show("Status masalah tidak boleh kosong");
        }
      }

      if(validate){
        setLoading(true);
        var result = await rootStore.ticketReply(formData);
        setLoading(false);

        if(result.kind == "ok" && result.data){
          setReply("");
          setFiles([]);

          Toast.show("Anda berhasil menambahkan balasan");
          onRefresh();
        }
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

              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, paddingTop: 10 }}>
                <View style={layout.container.row}>
                    <Status slug={ticket.status} />
                </View>

                <Text style={{ ...layout.typography.h3, ...styles.title }}>{ticket.subject}</Text>

                <View style={styles.row}>
                  <Text style={{ ...layout.typography.body_smaller }}>{formatDate(ticket.created_at)}</Text>
                  <View style={{ ...styles.dot }} />
                  <Text style={{ ...layout.typography.body_smaller }}>Dibuat oleh {ticket.requester.name}</Text>
                </View>
                <Text style={{ ...layout.typography.body_smaller }}>{ticket.description}</Text>

                <View style={{ ...styles.row, margintop: 10 }}>
                  <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Prioritas:</Text>
                  <Text style={{ ...layout.typography.body_smaller, color: color.important, textTransform: "capitalize" }}>{ticket.priority}</Text>
                </View>
              </View>

              {ticket.reply.map((item,i) => {

                return(
                  <View key={"reply"+i} style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
      
                    {/*
                    <TouchableOpacity style={{ position: "absolute", top: 20, right: 20 }}>
                      <Icon name="ios-trash" size={25} />
                    </TouchableOpacity>
                    */}

                    <View style={layout.list_activity.wrapper}>
                      <Image style={layout.list_activity.avatar} source={{ uri: CONFIG.ASSETS_URL+'/user-uploads/avatar/'+item.user.image }} />
                      <View style={layout.list_activity.info}>
                        <View style={styles.row}>
                          <Text style={{ ...styles.activity_person }}>{item.user.name}</Text>
                        </View>
                        <View style={{ ...styles.row, marginTop: 10 }}>
                          <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>{formatDate(item.created_at)}</Text>
                          <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>{formatTime(item.created_at)}</Text>
                        </View>

                        <Text style={{ ...layout.typography.body, marginVertical: 20 }}>{item.message}</Text>

                        {item.files.map((itemf,i) => {
                          return(
                            <View key={"file"+i} style={{...layout.file_field.container_inside}}>
                                <View style={{flexDirection:'row', width: "70%", flexWrap: "wrap" }}>
                                    <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                                    <View style={{marginLeft:0.027*deviceWidth}}>
                                        <Text style={{...layout.file_field.namefile}}>{itemf.filename}</Text>
                                        <Text style={{...layout.file_field.sizefile}}>{itemf.size}</Text>
                                    </View>
                                </View>
                                {(itemf.file_url &&
                                  <View style={{...layout.file_field.button_group, position: "relative" }}>
                                    <TouchableOpacity onPress={() => Linking.openURL(itemf.file_url)}>
                                      <Image source={require('@assets/ic_download.png')} style={{...layout.file_field.image_ic_download}} />
                                    </TouchableOpacity>
                                  </View>
                                )}
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  </View>
                )
              })}

              {(ticket.status != "resolved" &&
                <View>
                  <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>

                      <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Balas laporan ini</Text>
                      <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.textarea }}
                            placeholder="Tulis balasan laporan di sini"
                            multiline={true}
                            onChangeText={text => setReply(text)}
                            value={reply}
                        />
                      </View>

                      <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Lampirkan Dokumen</Text>
                      {files.map((item,i) => {
                        return(
                          <View key={"file"+i} style={{...layout.file_field.container_inside}}>
                              <View style={{flexDirection:'row'}}>
                                  <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                                  <View style={{marginLeft:0.027*deviceWidth}}>
                                      <Text style={{...layout.file_field.namefile}}>{item.name}</Text>
                                      <Text style={{...layout.file_field.sizefile}}>{item.size}</Text>
                                  </View>
                              </View>
                              <View style={{...layout.file_field.button_group, position: "relative" }}>
                                <TouchableOpacity>
                                  <Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />
                                </TouchableOpacity>

                                  {/*
                                  <Image source={require('@assets/ic_download.png')} style={{...layout.file_field.image_ic_download}} />
                                  */}
                              </View>
                          </View>
                        )
                      })}

                      <TouchableOpacity style={{ ...styles.row, marginBottom: 20 }} onPress={() => pickDocument()}>
                        <Icon name="ios-add-circle-outline" style={{ ...styles.icon_add }} size={20} />
                        <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Tambah Dokumen Lainnya</Text>
                      </TouchableOpacity>

                      <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Pilih status masalah</Text>
                      <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                        <Picker
                            selectedValue={selectedStatus}
                            onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)}
                            style={{ ...layout.dropdown.input }}
                        >
                            <Picker.Item label="Pilih Status" value="" />
                            <Picker.Item label="Masalah dibuka" value="open" />
                            <Picker.Item label="Menunggu jawaban" value="pending" />
                            <Picker.Item label="Masalah terselesaikan" value="resolved" />
                            <Picker.Item label="Masalah ditutup" value="closed" />
                        </Picker>
                    </View>

                  </View>

                  <View style={{ ...layout.grid.wrapper, marginTop: 20 }}>
                    <Button onPress={() => goBack()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.grid.half }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                    </Button>
                    <Button onPress={() => doSave()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.grid.half }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>BALAS</Text>
                    </Button>
                  </View>
                </View>
            )}
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
        
        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_complaint != "0" &&
          <Head type="detail" title={'Detail Laporan'} navigation={props.navigation} opsi={() => togglePopup() } />
        )}

        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_complaint == "0" &&
          <Head type="detail" title={'Detail Laporan'} navigation={props.navigation} />
        )}

        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_complaint != "0" &&
          <Animatable.View ref={handleViewRef} style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.header_option.container }}>
            <TouchableOpacity onPress={() => navigateTo('form_laporan', {type: "edit", id: ticket.id, data: ticket, onBack: props.navigation.state.params.onBack() })} style={{ ...layout.header_option.wrapper }}>
              <Text style={layout.typography.body}>Edit Laporan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => _panel.show()} style={{ ...layout.header_option.wrapper, marginBottom: 0 }}>
              <Text style={layout.typography.body}>Hapus</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

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
                <Text style={layout.bottom_notif.title}>Hapus Tugas</Text>
            </View>
            <View style={{ ...layout.bottom_notif.wrapper, ...layout.bottom_notif.row, marginBottom: 50 }}>
                <Icon name="ios-information-circle-outline" style={{ ...layout.bottom_notif.icon }} size={40} />
                <Text style={layout.bottom_notif.text}>Apakah anda yakin anda akan menghapus laporan ini?</Text>
            </View>
            <View style={{ ...layout.bottom_notif.row }}>
                <Button onPress={() => _panel.hide()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                </Button>
                <Button onPress={() => deleteTicket()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                </Button>
            </View>
        </SlidingUpPanel>
      </View>
    )
})
