import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, DatePickerAndroid } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/FontAwesome';
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
import Accordion from 'react-native-collapsible/Accordion';
import Reactotron from 'reactotron-react-native';
import DocumentPicker from 'react-native-document-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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


export interface AddMeetingScreenProps extends NavigationScreenProps<{}> {
}

export const AddMeetingScreen: React.FunctionComponent<AddMeetingScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    
    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {
      // loadLeaveType()
      // alert(props.navigation.state.params.id)
    }, []);

    const simpan = async () => {
      if(description == ''){
        alert('Mohon lengkapi semua data')
      }else{
        let formData = new FormData();
        formData.append("description", description);
        // formData.append("file", {
        //   uri: file.uri,
        //   name: 'photo.jpg',
        //   type: (file.type) ? file.type : "image/jpeg"
        // });
        // setLoading(true);
        // var result = await rootStore.sekretarisAddAccomodation(formData);
        // setLoading(false);

        // if(result.kind == "ok" && result.data){
        //   alert('Sukses')
        //   props.navigation.goBack(null)
        // }
      }
    }

    const deleteFile = () =>{
      // alert('s')
      setFile(null)
    }

    const pickDocument = async () => {
      try {
        const results = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        setFile(results);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />
        <Head type="detail" title={"Tambah Meeting"} navigation={props.navigation} />

        
        <ScrollView style={layout.container.content_wtabbar}>
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
            
            
            <View>
              
              {/*<View style={{...layout.file_field.container, marginTop: 0, marginBottom: 20 }}>
              {(file) &&
                  <View style={{...layout.file_field.container_inside, marginBottom: 20 }}>
                    <View style={{flexDirection:'row'}}>
                      <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                      <View style={{marginLeft:0.027*deviceWidth}}>
                        <Text style={{...layout.file_field.namefile}}>{(file.name) ? file.name : file.filename}</Text>
                        <Text style={{...layout.file_field.sizefile}}></Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{...layout.file_field.button_group}} onPress={deleteFile}>
                      <Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />
                    </TouchableOpacity>
                </View>
              }
                <TouchableOpacity onPress={() => pickDocument()}>
                  <View style={styles.row}>
                    <Icon name="plus-square-o" style={{ ...styles.icon_add }} size={20} />
                    <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Unggah File</Text>
                  </View>
                  <Text style={{ ...layout.typography.body_smaller, paddingLeft: 30, color: color.placeholder }}>Contoh : file bukti tiket</Text>
                </TouchableOpacity>
              </View>*/}

              <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <TextInput
                      style={{ ...layout.textbox.textarea }}
                      placeholder="Tulis deskripsi anda"
                      multiline={true}
                      onChangeText={text => setDescription(text)}
                      value={description}
                  />
              </View>
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-folder" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Tulis judul tugas"
                  onChangeText={text => setTitle(text)}
                  value={title}
              />
          </View>
            <Button onPress={simpan} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>SIMPAN</Text>
            </Button>
            
          </View>

        </ScrollView>

      </View>
    )
})
