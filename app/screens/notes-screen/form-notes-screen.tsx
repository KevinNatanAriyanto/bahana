import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, Linking } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomDrawerCustom, SectionedMultiSelect } from "@vendor"
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
import Reactotron from 'reactotron-react-native';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';
import reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  back: {
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
    position: "absolute", zIndex: 9, top: 0, left: deviceWidth * 0.055
  },
  header_one: {
    paddingVertical: 40
  },
  header_two: {
    backgroundColor: "#FF0000", marginBottom: 40, paddingVertical: 40, paddingBottom: 20
  },
  header_three: {
    paddingBottom: 0.04 * deviceWidth,
    paddingTop: 0.04 * deviceWidth,
    elevation: 2,
    paddingLeft: 0.055 * deviceWidth,
    marginLeft: -0.01 * deviceWidth,
    borderRadius: 1,
    width: 1.1 * deviceWidth,
    height: 60
  },
  header_no_border: {
    paddingBottom: 0.04 * deviceWidth,
    paddingTop: 0.04 * deviceWidth,
    elevation: 0,
    paddingLeft: 0.055 * deviceWidth,
    marginLeft: -0.01 * deviceWidth,
    borderRadius: 1,
    width: 1.1 * deviceWidth,
    height: 60
  },
  image_back: {
    height: 0.055 * deviceWidth,
    width: 0.055 * deviceWidth
  },
  title_text: {
    fontSize: 16,
    color: "#5F5959",
    textAlignVertical: "center",
    width: 0.8 * deviceWidth
  },
  function_text: {
    fontSize: 14,
    color: "#3B3B3B",
  },
  modal: {
    width: 0.305 * deviceWidth,
    height: 0.16 * deviceWidth,
    position: 'absolute',
    top: 0.125 * deviceWidth,
    right: 0.4 * deviceWidth,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 3,
  },
  opsi: {
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10
  },
  opsi_right: {
    position: "relative", left: -50
  }
}

export interface FormNotesScreenProps extends NavigationScreenProps<{}> {
}

export const FormNotesScreen: React.FunctionComponent<FormNotesScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [loading, setLoading] = useState(false);

  const [refScrollView, setRefScrollView] = useState(null);
  const [isFocusedNotes, setIsFocusedNotes] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const [notesID, setNotesID] = useState("");
  const [type, setType] = useState("add");
  const [notesTitle, setNotesTitle] = useState("");
  const [notesDescription, setNotesDescription] = useState("");
  const [fileNotes, setFileNotes] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState([]);
  const [selectedAssigneeName, setSelectedAssigneeName] = useState([]);
  const [fieldDescription, setFieldDescription] = useState("");
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
    props.navigation,
  ])

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    if (props.navigation.state.params.item) {
      await loadExistingData(props.navigation.state.params.item)
    }
  }

  const loadExistingData = (paramItems) => {
    setNotesID(paramItems.id);
    setNotesTitle(paramItems.title);
    setNotesDescription(paramItems.content);
    setSelectedStartDate(paramItems.date);
    setSelectedAssignee(paramItems.cc);

    if(props.navigation.state.params.share_type == "shared"){
      setIsShared(true)
    }

    if (paramItems.files.length > 0) {
      setFileNotes(paramItems.files[0]);
    }

    setType("edit");
  }

  const callBackAssignee = async (sentAssignee, sentNotes, sentNames) => {
    reactotron.log("======================= { sentAssignee, sentNotes }");
    reactotron.log({ sentAssignee, sentNotes });

    setSelectedAssignee(sentAssignee);
    setFieldDescription(sentNotes);
    setSelectedAssigneeName(sentNames);
  }

  const pickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      Reactotron.log('results')
      Reactotron.log(results)
      setFileNotes(results);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  const deleteFileNotes = () => {
    // alert('s')
    setFileNotes(null)
  }

  const giveNotes = async () => {
    if (notesTitle === "") {
      Toast.show("Judul catatan tidak boleh kosong");
      return;
    }
    if (notesDescription === "") {
      Toast.show("Judul catatan tidak boleh kosong");
      return;
    }
    // if (selectedAssignee.length == 0) {
    //   Toast.show("Penerima catatan tidak boleh kosong");
    //   return;
    // }

    var param = new FormData();
    param.append("title", notesTitle);
    param.append("date", selectedStartDate);
    param.append("content", notesDescription);

    for (let i = 0; i < selectedAssignee.length; i++) {
      param.append("cc[" + i + "]", selectedAssignee[i]);
    }

    if (fileNotes != null) {
      param.append("files[0]", {
        uri: fileNotes.uri,
        name: 'photo.jpg',
        type: (fileNotes.type) ? fileNotes.type : "image/jpeg"
      });
    }

    setLoading(true);
    var result = await rootStore.sendNotes(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      Toast.show("Catatan berhasil disimpan");
      props.navigation.state.params.onBack();
      goBack();
    }
  }

  const editNotes = async () => {
    if (notesTitle === "") {
      Toast.show("Judul catatan tidak boleh kosong");
      return;
    }
    if (notesDescription === "") {
      Toast.show("Judul catatan tidak boleh kosong");
      return;
    }

    var param = new FormData();
    param.append("title", notesTitle);
    param.append("date", selectedStartDate);
    param.append("content", notesDescription);

    for (let i = 0; i < selectedAssignee.length; i++) {
      param.append("cc[" + i + "]", selectedAssignee[i]);
    }

    let sendData = {
      id: notesID,
      data: param,
    };

    setLoading(true);
    var result = await rootStore.editNotes(sendData);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      Toast.show("Catatan berhasil disimpan");
      props.navigation.state.params.onBack();
      goBack();
    }
  }

  const deleteNotes = async () => {
    let param = {
      id: notesID,
    };

    setLoading(true);
    var result = await rootStore.deleteNotes(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      Toast.show("Catatan berhasil disimpan");
      props.navigation.state.params.onBack();
      goBack();
    }
  }

  const renderHeaderActions = () => {

    if(!isShared){
      return (
        <View style={{ width: 180, marginRight: 60, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => pickDocument()}>
            <Image
              style={{
                width: 20,
                height: 20,
                resizeMode: "contain",
              }}
              source={require('@assets/ic_clip.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            navigateTo('form_assignee', {
              assignee: { assignees: selectedAssignee, fieldDescription: fieldDescription },
              onBack: callBackAssignee
            });

            reactotron.log("======================= { navigateTo }");
            reactotron.log({ assignees: selectedAssignee, fieldDescription: fieldDescription });
          }}>
            <Image
              style={{
                width: 20,
                height: 20,
                resizeMode: "contain",
              }}
              source={require('@assets/ic_share.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            Alert.alert(
              "Hapus Catatan",
              "Apakah anda yakin anda akan menghapus catatan ini?",
              [
                {
                  text: "Batalkan",
                  // onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Lanjut", onPress: () => {
                    if (type === "add") {
                      goBack();
                    }
                    else {
                      deleteNotes();
                    }
                  }
                }
              ],
              { cancelable: true }
            );
          }}>
            <Image
              style={{
                width: 20,
                height: 20,
                resizeMode: "contain",
              }}
              source={require('@assets/ic_trash.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            if (type === "add") {
              giveNotes();
            }
            else {
              editNotes();
            }
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#381D5C",
            }}>Simpan</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  const handleStartDatePicked = date => {
    var date_str = moment(date).format("YYYY-MM-DD");

    setSelectedStartDate(date_str);
    setStartDateVisible(false);
  };

  return (
    <View style={layout.container.general}>
      <Loading loading={loading} />

      <DateTimePicker
        isVisible={startDateVisible}
        onConfirm={handleStartDatePicked}
        onCancel={() => setStartDateVisible(false)}
        mode={"date"}
        minimumDate={new Date()}
      />

      <View key={"headerdetail"} style={styles.header_three}>
        <View style={{ ...layout.container.general, elevation: 9 }}>
          <View style={{ ...styles.wrapper, alignItems: "center", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={() => goBack()} style={styles.back}>
              <Image source={require('@assets/back.png')} style={styles.image_back} />
            </TouchableOpacity>

            {renderHeaderActions()}
          </View>
        </View>
      </View>

      <ScrollView
        ref={(ref) => {
          setRefScrollView(ref);
        }}
        style={layout.container.content_wtabbar}
      >
        <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

          {(!isShared &&
            <TouchableOpacity onPress={() => setStartDateVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-calendar" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                style={{ ...layout.textbox.input }}
                placeholder="Tanggal Catatan"
                editable={false}
                value={selectedStartDate}
              />
            </TouchableOpacity>
          )}

          <TextInput
            style={{ ...layout.textbox.textarea, height: null, fontSize: 18, fontWeight: "bold" }}
            placeholder="Judul Catatan"
            multiline={true}
            onChangeText={text => setNotesTitle(text)}
            value={notesTitle}
            editable={!isShared}
          />

          <View style={{ backgroundColor: "#CCCCCC", height: 2, marginVertical: 10 }} />

          {(fileNotes) &&
            <View style={{ ...layout.file_field.container_inside, marginBottom: 20, backgroundColor: "white" }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('@assets/doc.png')} style={{ ...layout.file_field.image_doc }} />
                <View style={{ marginLeft: 0.027 * deviceWidth }}>
                  <Text style={{ ...layout.file_field.namefile }}>{(fileNotes.name) ? fileNotes.name : fileNotes.filename}</Text>
                  <Text style={{ ...layout.file_field.sizefile }}>210 kb</Text>
                </View>
              </View>
              <TouchableOpacity style={{ ...layout.file_field.button_group }} onPress={deleteFileNotes}>
                <Image source={require('@assets/ic_delete.png')} style={{ ...layout.file_field.image_ic_delete }} />
              </TouchableOpacity>
            </View>
          }

          {(selectedAssignee != null) && (
            (selectedAssignee.length > 0) &&
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                }}
                source={require('@assets/ic_book.png')}
              />

              <Text style={{
                fontSize: 12,
                color: "#5F5959",
                marginLeft: 5,
              }}>{selectedAssigneeName.toString()}</Text>
            </View>
          )}

          <TextInput
            style={{ ...layout.textbox.textarea, height: null }}
            placeholder="Mulai tulis catatan anda di sini…"
            multiline={true}
            onChangeText={text => setNotesDescription(text)}
            value={notesDescription}
            onFocus={() => {
              setIsFocusedNotes(true);

              setTimeout(() => {
                refScrollView.scrollToEnd({ animated: true })
              }, 500);
            }}
            onBlur={() => setIsFocusedNotes(false)}
            editable={!isShared}
          />
        </View>

        {(isFocusedNotes === true) &&
          <View style={{ height: 200 }} />
        }
      </ScrollView>
    </View >
  )
})
