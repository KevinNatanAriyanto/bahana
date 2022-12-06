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
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import Accordion from 'react-native-collapsible/Accordion';

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


export interface FormLaporanScreenProps extends NavigationScreenProps<{}> {
}

export const FormLaporanScreen: React.FunctionComponent<FormLaporanScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticket, setTicket] = useState(props.navigation.state.params.data);
    const [divisions, setDivisions] = useState([]);

    const [fieldName, setFieldName] = useState("");
    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldDivision, setFieldDivision] = useState("");
    const [fieldDescription, setFieldDescription] = useState("");
    const [fieldTypeId, setFieldTypeId] = useState("");
    const [fieldPriority, setFieldPriority] = useState("");

    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const [activeSections, setActiveSections] = React.useState([0]);

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {
      loadAll()
    }, []);

    const loadAll = async () => {
      await loadTicketTypes()
      await loadTicketDivisions()

      var tt = props.navigation.state.params.data;
      if(tt){
        setFieldTitle(tt.subject)
        setFieldDescription(tt.description)
        setFieldPriority(tt.priority)
        setFieldTypeId(tt.type_id)
      }
    }

    const loadTicketTypes = async () => {
      var param = {
        // id: ticket.id
      }
      
      setLoading(true);
      var result = await rootStore.getTicketType(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setTicketTypes(result.data.type)
      }
    }
    const loadTicketDivisions = async () => {
      var param = {
        // id: ticket.id
      }
      
      setLoading(true);
      var result = await rootStore.getTicketDivisions(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setDivisions(result.data.agents);
      }
    }

    const doSave = async () => {
      var validate = true;
      var param = {
        subject: fieldTitle,
        type_id: fieldTypeId,
        agent_id: fieldDivision,
        priority: fieldPriority,
        description: fieldDescription
      }

      if(fieldTitle == ""){
        validate = false;
        Toast.show("Judul harus diisi");

      }else if(fieldDivision == ""){
        validate = false;
        Toast.show("Kolom divisi harus dipilih");

      }else if(fieldTypeId == ""){
        validate = false;
        Toast.show("Kolom tipe masalah harus dipilih");

      }else if(fieldPriority == ""){
        validate = false;
        Toast.show("Kolom prioritas harus dipilih");

      }else if(fieldDescription == ""){
        validate = false;
        Toast.show("Deskripsi masalah harus diisi");

      }

      if(validate){
        if(props.navigation.state.params.type == "edit"){
          param.id = ticket.id;
          param.status = ticket.status;

          setLoading(true);
          var result = await rootStore.editTicket(param);
          setLoading(false);

          if(result.kind == "ok" && result.data){
            Toast.show("Anda berhasil mengubah laporan masalah");
            goBack();
          }
        }else{
          param.status = "open";
          param.user_id = rootStore.getCurrentUser().id;

          setLoading(true);
          var result = await rootStore.createTicket(param);
          setLoading(false);

          if(result.kind == "ok" && result.data){
            Toast.show("Anda berhasil menambah laporan masalah");
            goBack();
          }
        }
      }
    }

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />
        <Head type="detail" title={(props.navigation.state.params.type == 'add') ? 'Tambah Laporan' : 'Ubah Laporan'} navigation={props.navigation} />
        
        <ScrollView style={layout.container.content_wtabbar}>
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

            {/*
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Nama Pemohon"
                  // onChangeText={text => setFieldName(text)}
                  // value={fieldName}
              />
            </View>
            */}

            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Tulis Judul Komplain"
                  onChangeText={text => setFieldTitle(text)}
                  value={fieldTitle}
              />
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={fieldTypeId}
                    onValueChange={(itemValue, itemIndex) => setFieldTypeId(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Pilih Tipe Laporan" value="" />
                    {ticketTypes.map((item,i) => {
                      return(
                        <Picker.Item key={"tipe"+i} label={item.type} value={item.id} />
                      )
                    })}
                </Picker>
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={fieldDivision}
                    onValueChange={(itemValue, itemIndex) => setFieldDivision(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Pilih Divisi" value="" />
                    {Object.entries(divisions).map((item,i) => {
                      return(
                        <Picker.Item key={"tipe"+i} label={item[1]} value={item[0]} />
                      )
                    })}
                </Picker>
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={fieldPriority}
                    onValueChange={(itemValue, itemIndex) => setFieldPriority(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Pilih Prioritas Laporan" value="" />
                    <Picker.Item label="Mendesak" value="urgent" />
                    <Picker.Item label="Tinggi" value="high" />
                    <Picker.Item label="Sedang" value="medium" />
                    <Picker.Item label="Rendah" value="low" />
                </Picker>
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <TextInput
                  style={{ ...layout.textbox.textarea }}
                  placeholder="Tulis detail komplain"
                  multiline={true}
                  onChangeText={text => setFieldDescription(text)}
                  value={fieldDescription}
              />
            </View>

            <Button onPress={() => doSave()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Kirim Laporan Masalah</Text>
            </Button>
            
          </View>

        </ScrollView>

      </View>
    )
})
