import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
import Reactotron from 'reactotron-react-native';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  row: {
    flexDirection: "row"
  },
  icon_add: {
    marginRight: 10, color: "#381D5C"
  }
}


export interface ReportMeetingScreenProps extends NavigationScreenProps<{}> {
}

export const ReportMeetingScreen: React.FunctionComponent<ReportMeetingScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [task, setTask] = useState(props.navigation.state.params.task);
    const [projects, setProjects] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [projectTeams, setProjectTeams] = useState([]);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [startDateVisible, setStartDateVisible] = useState(false);
    const [endDateVisible, setEndDateVisible] = useState(false);
    let isGPSOn = false;
    let GPSWrapper;
    const [isGetGPS, setIsGetGPS] = useState(false);
    
    // data to pass
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [selectedAssignee, setSelectedAssignee] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [taskRelated, setTaskRelated] = useState(false);
    const [taskInterval, setTaskInterval] = useState(false);
    const [taskGPS, setTaskGPS] = useState(false);
    const [taskCamera, setTaskCamera] = useState(false);
    const [taskRepeat, setTaskRepeat] = useState(false);
    const [taskFiles, setTaskFiles] = useState([]);

    const [fieldMemo, setFieldMemo] = useState("");
    const [fieldMarkDone, setFieldMarkDone] = useState(false);
    const [fieldMarkCustomDate, setFieldMarkCustomDate] = useState(false);

    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const [activeSections, setActiveSections] = React.useState([0]);

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {
      // loadAll();

      if(task.is_requires_gps == 1){
        GPSWrapper = setInterval(function(){
          cek_gps();
        }, 5000);
      }
    }, []);

    /*
    const doSave = () => {
      var validate = false;

      let formData = new FormData();

      formData.append("heading", taskTitle);
      formData.append("description", taskDescription);
      formData.append("start_date", selectedStartDate);
      formData.append("due_date", selectedEndDate);
      formData.append("project_id", selectedProject);
      formData.append("is_requires_gps", taskGPS);
      formData.append("is_requires_camera", taskCamera);
      formData.append("interval_report_check", taskInterval);
      formData.append("interval_report", "");
      formData.append("user_id", selectedAssignee);

      taskFiles.map((item,i) => {

        if(item.uri.indexOf("http") == -1){
          Reactotron.log(item)

          var ind = i+1;
          formData.append("files"+ind, {
            uri: item.uri,
            name: item.name,
            type: (item.type) ? item.type : "jpg"
          });
        }
      })

      Reactotron.log(formData)

      if(selectedAssignee == "" || taskTitle == "" || taskDescription == "" || selectedStartDate == "" || selectedEndDate == ""){
        validate = false;

        if(selectedAssignee == ""){
          Toast.show("Anda harus memilih penerima meeting");
        }
        else if(taskTitle == ""){
          Toast.show("Anda harus mengisi judul meeting");
        }
        else if(taskDescription == ""){
          Toast.show("Anda harus mengisi deskripsi meeting");
        }
        else if(selectedStartDate == ""){
          Toast.show("Anda harus memilih tanggal mulai meeting");
        }
        else if(selectedEndDate == ""){
          Toast.show("Anda harus memilih tanggal selesai meeting");
        }
        
      }else{
        validate = true;
      }

      if(validate){
        if(props.navigation.state.params.type == "edit"){
          // param.task_id = props.navigation.state.params.task.id;
          formData.append("task_id", props.navigation.state.params.task.id);
          doEdit(formData);

        }else{
          doAdd(formData);
        }
      }
    }
    */

    const stopWorking = async () => {
      var validate = true;

      let formData = new FormData();

      formData.append("task_id", task.id);
      formData.append("task_done", fieldMarkDone);
      formData.append("memo", fieldMemo);
      formData.append("start_time", selectedStartDate);
      formData.append("end_time", selectedEndDate);
      formData.append("is_meeting", 1);

      if(!rootStore.settings.offline_mode){
        if(task.is_requires_gps == 1){
          if(latitude && longitude){
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
          }else{
            Toast.show("Posisi anda belum tertangkap. Silahkan coba beberapa saat lagi.")
            validate = false;
          }
        }

        if(task.is_requires_camera == 1){
          if(taskFiles.length > 0){
            taskFiles.map((item,i)=>{
              formData.append("files"+i, {
                uri: item.uri,
                name: item.name,
                type: (item.type) ? item.type : "jpg"
              });
            });
          }else{
            Toast.show("Anda belum memasukkan foto")
            validate = false;
          }
        }
      }
      
      if(validate){
        setLoading(true);
        var result = await rootStore.stopTask(formData);
        setLoading(false);

        // something from storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            result.data = {};
            result.kind = "ok"
            isOffline = true;

            // update existing record
            var ntask = rootStore.findTaskById(task.id);
            ntask = (ntask.length > 0) ? ntask[0] : null;
            if(ntask){
              ntask.stopWorking()
            }

            // update latest timelog
            var ntimelog = rootStore.findTimelogByTaskId(task.id);
            if(ntimelog.length > 0){
              var latest_timelog = ntimelog[ntimelog.length-1];
              rootStore.updateTimelogById(latest_timelog.id, {
                end_time: moment().format()
              })
            }

            // add action to queue
            var rand_id = new Date().getTime();
            rootStore.pushData('my_queues', {
              related_id: rand_id,
              type: 'stop-task',
              action: 'stopTask',
              will_update: "tasks",
              description: "Selesai bekerja pada meeting",
              data: JSON.stringify(formData)
            }, false);
        }

        if(result.kind == "ok" && result.data){
          // Reactotron.log(result.data)
          Toast.show("Anda berhenti bekerja pada meeting ini");
          navigateTo("tasks");
          // goBack();
          props.navigation.state.params.onBack();
        }
      }
    }

    const cek_gps = async () => {
        /*
        var lat = null
        var long = null
        Geolocation.getCurrentPosition(
          (position) => {
           //do stuff with location
            // alert('a')
            // _panel.show()
            Reactotron.log('position')
            Reactotron.log(position)
            lat = position.coords.latitude
            long = position.coords.longitude
            setLatitude(lat)
            setLongitude(long)
            setIsGetGPS(true)

            clearInterval(GPSWrapper);
          },
          (error) => {
            Reactotron.log('error position')
            Reactotron.log(error)
            Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
            
            if(error.PERMISSION_DENIED){
              Alert.alert("Terjadi masalah", "Anda harus menyalakan GPS");
            }

            // this.setState({locationEnabled: false}),
          },
          {
            enableHighAccuracy: true
          }
        );
        */

        // var location = await AsyncStorage.getItem('gps');
        var location = rootStore.getData('gps');
        var location_data = (location.data) ? JSON.parse(location.data) : null;

        if(location_data && location_data != ""){
            setLatitude(location.latitude)
            setLongitude(location.longitude)
            setIsGetGPS(true)
        }else{
            Toast.show("Gagal mendapatkan posisi. Silahkan coba beberapa saat lagi.")
        }
    }

    /*
    const pickDocument = async () => {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images],
        });

        setTaskFiles(results);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }
    */

    const deletePhoto = (ind) => {
      var files = [...taskFiles];
      var removed = files.splice(ind,1);
      setTaskFiles(files);

      Reactotron.log(files)
    }

    const addPhotos = () => {

      ImagePicker.openCamera({
        cropping: false,
        avoidEmptySpaceAroundImage: false,
        freeStyleCropEnabled: true,
        compressImageMaxWidth: 1024,
        compressImageMaxHeight: 1024,
        compressImageQuality: 0.8
      }).then(response => {
        // Reactotron.log(response);

        var new_name = response.modificationDate;
        var new_type = response.mime.split("/");
        if(new_type.length > 0){
          new_name += new_name+"."+new_type[1];
        }else{
          new_name += new_name+".jpg";
        }

        var param = {
          uri: response.path,
          type: response.mime,
          name: new_name,
          size: response.size
        };

        var eresult = [
          ...taskFiles,
          param
        ];

        setTaskFiles(eresult);

      }).catch(e => {
        console.log(e);
        // Reactotron.log(e)
      });
    }

    const formatDate = (datenow) => {
        return moment(datenow).format("MMM Do YYYY");
    }
    const formatTime = (datenow) => {
        return moment(datenow).format("h:mm:ss a");
    }

    const handleStartDatePicked = date => {
      var date_str = moment(date).format("YYYY-MM-DD HH:mm:ss");

      setSelectedStartDate(date_str);
      setStartDateVisible(false);
    };

    const handleEndDatePicked = date => {
      var date_str = moment(date).format("YYYY-MM-DD HH:mm:ss");

      setSelectedEndDate(date_str);
      setEndDateVisible(false);
    };

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />

        <DateTimePicker
          isVisible={startDateVisible}
          onConfirm={handleStartDatePicked}
          onCancel={() => setStartDateVisible(false)}
          mode={"datetime"}
        />
        <DateTimePicker
          isVisible={endDateVisible}
          onConfirm={handleEndDatePicked}
          onCancel={() => setEndDateVisible(false)}
          mode={"datetime"}
        />

        <Head type="detail" title={"Konfirmasi Berhenti Bekerja"} navigation={props.navigation} />
        
        <ScrollView style={layout.container.content_wtabbar}>
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

            {(task.is_requires_gps == 1 && !rootStore.settings.offline_mode &&
              <View style={{ ...layout.alert.wrapper, ...layout.alert.info_alt }}>
                  <Text style={{ ...layout.alert.text, ...layout.alert.text_info_alt }}>Meeting ini mengharuskan anda untuk mengaktifkan GPS. </Text>
              </View>
            )}
            {(task.is_requires_camera == 1 && !rootStore.settings.offline_mode &&
              <View style={{ ...layout.alert.wrapper, ...layout.alert.info_alt }}>
                  <Text style={{ ...layout.alert.text, ...layout.alert.text_info_alt }}>Meeting ini mengharuskan anda untuk mengambil foto untuk pelaporan. </Text>
              </View>
            )}

            {(task.is_requires_gps == 1 && isGetGPS &&
              <View style={{...layout.location_picker.container}}>
                <View style={{...layout.location_picker.map_view}}>
                  <MapView
                      style={{...layout.location_picker.image_map}}
                      region={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                  >
                    <Marker
                      coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                      }}
                      // title={"Posisi sekarang"}
                      // description={marker.description}
                    />
                  </MapView>
                </View>
              </View>
            )}

            {(task.is_requires_camera == 1 && !rootStore.settings.offline_mode &&
              <View style={{...layout.file_field.container, marginTop: 0 }}>
                {taskFiles.map((item,i) => {

                  return(
                    <View key={"files"+i} style={{...layout.file_field.container_inside}}>
                        {/*
                        <View style={{flexDirection:'row'}}>
                            <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                            <View style={{marginLeft:0.027*deviceWidth}}>
                                <Text style={{...layout.file_field.namefile}}>{item.name}</Text>
                            </View>
                        </View>
                        */}
                        <Image source={{ uri: item.uri }} style={{ width: "80%", height: 100, resizeMode: "contain" }} />
                        <TouchableOpacity onPress={() => deletePhoto(i)} style={{...layout.file_field.button_group}}>
                            <Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />
                        </TouchableOpacity>
                    </View>
                  )

                })}

                
                  <TouchableOpacity 
                    style={styles.row} 
                    onPress={() => addPhotos()}
                  >
                    <Icon name="ios-add-circle-outline" style={{ ...styles.icon_add }} size={20} />
                    <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Tambah Foto</Text>
                  </TouchableOpacity>
              </View>
            )}

            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <TextInput
                    style={{ ...layout.textbox.textarea }}
                    placeholder="Catatan Tambahan"
                    multiline={true}
                    onChangeText={text => setFieldMemo(text)}
                    value={fieldMemo}
                />
            </View>

            <TouchableOpacity onPress={() => setFieldMarkCustomDate(!fieldMarkCustomDate)} style={layout.checkbox.wrapper}>
              <View style={layout.checkbox.rounded}>
                {(fieldMarkCustomDate &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
            
              <Text style={layout.checkbox.text}>Laporkan waktu secara manual</Text>
            </TouchableOpacity>

            {(fieldMarkCustomDate &&
              <TouchableOpacity onPress={() => setStartDateVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="ios-calendar" style={{ ...layout.textbox.icon }} size={20} />
                <TextInput
                    style={{ ...layout.textbox.input }}
                    placeholder="Waktu Mulai"
                    editable={false}
                    value={selectedStartDate}
                />
              </TouchableOpacity>
            )}

            {(fieldMarkCustomDate &&
              <TouchableOpacity onPress={() => setEndDateVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="ios-calendar" style={{ ...layout.textbox.icon }} size={20} />
                <TextInput
                    style={{ ...layout.textbox.input }}
                    placeholder="Waktu Selesai"
                    editable={false}
                    value={selectedEndDate}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setFieldMarkDone(!fieldMarkDone)} style={layout.checkbox.wrapper}>
              <View style={layout.checkbox.rounded}>
                {(fieldMarkDone &&
                  <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                )}
              </View>
            
              <Text style={layout.checkbox.text}>Tandai pekerjaan sudah selesai</Text>
            </TouchableOpacity>

            <Button 
              onPress={() => stopWorking()} 
              style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>KIRIM LAPORAN KERJA</Text>
            </Button>
            
          </View>

        </ScrollView>

      </View>
    )
})
