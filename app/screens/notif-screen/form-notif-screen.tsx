import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/FontAwesome';
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
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import Accordion from 'react-native-collapsible/Accordion';
import reactotron from 'reactotron-react-native';
import ImagePicker from 'react-native-image-crop-picker';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  row: {
    flexDirection: "row"
  },
  icon_add: {
    marginRight: 10, color: "#381D5C"
  },
  section: {
    marginBottom: 20
  }
}


export interface FormNotifScreenProps extends NavigationScreenProps<{}> {
}

export const FormNotifScreen: React.FunctionComponent<FormNotifScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const [pilihan, setPilihan] = useState(1);
  const menuModal = useRef(null);
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const [activeSections, setActiveSections] = React.useState([0]);

  const [refScrollView, setRefScrollView] = useState(null);

  const [teams, setTeams] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [hasCompanyPermission, setHasCompanyPermission] = useState(false);
  const [uploadPic, setUploadPic] = useState(null);

  const [fieldTitle, setFieldTitle] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [fieldCompanyId, setFieldCompanyId] = useState([]);
  const [fieldTeamId, setFieldTeamId] = useState([]);

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
    props.navigation,
  ])

  useEffect(() => {
    loadAll()
  }, []);

  useEffect(() => {
    
    var arr = [];
    fieldCompanyId.map(async (item,i) => {
      var res = await loadTeam(item)
      arr = arr.concat(res)
      
      arr = arr.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.id === value.id
      )))

      setTeams(arr)
    })

  }, [fieldCompanyId]);

  const loadAll = async () => {
    await loadTeam();
    await loadCompany();

    var tt = props.navigation.state.params.data;
    if (tt) {
      setFieldTitle(tt.subject)
      setFieldDescription(tt.description)
    }
  }

  const loadTeam = async (sub_company_id = null) => {
    var param = {
      // sub_company_id: 2
    }

    if(!!sub_company_id){
      param.sub_company_id = sub_company_id
    }

    setLoading(true);
    var result = await rootStore.getDepartments(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      let tempArr = result.data.data;

      tempArr.push({
        id: 0,
        team_name: "Semua Divisi",
      });

      tempArr = tempArr.reverse();

      if(!!sub_company_id){
        reactotron.log("sub_company_id: "+sub_company_id)
        return tempArr
      }else{
        setTeams(tempArr);
      }
    }
  }

  const loadCompany = async () => {
    var param = {
    }

    setLoading(true);
    var result = await rootStore.getSubCompanyList(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      let tempArr = result.data.data;

      tempArr.push({
        id: 0,
        name: "Semua Perusahaan",
      });

      tempArr = tempArr.reverse();

      reactotron.log(tempArr);
      setCompanyList(tempArr);

      // setCompanyList(result.data.data);
      setHasCompanyPermission(true);
      // reactotron.log(result.data);
    }
  }

  const onChangeImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      avoidEmptySpaceAroundImage: false,
      freeStyleCropEnabled: true,
      mediaType: 'photo'
    }).then(response => {
      // console.log(response);
      reactotron.log(response);
      const source = {
        uri: response.path,
        name: response.modificationDate + ".jpg",
        type: (response.mime) ? response.mime : "jpg"
      }
      setUploadPic(source);
    }).catch(e => {
      // console.log(e);
    });
  }

  const doLoopSave = async () => {
    if (fieldCompanyId.length == 0) {
      Toast.show("Perusahaan harus dipilih");
      return;
    }
    if (fieldTitle == "") {
      Toast.show("Judul harus diisi");
      return;
    }
    if (fieldDescription == "") {
      Toast.show("Deskripsi pengumuman harus diisi");
      return;
    }

    let tempCompany = fieldCompanyId;
    var index = tempCompany.indexOf(0);
    if (index !== -1) {
      tempCompany.splice(index, 1);
    }

    setLoading(true);

    let param = new FormData();
    param.append("heading", fieldTitle);
    param.append("description", fieldDescription);
    param.append("to", "employee");
    param.append("sub_company_id", (tempCompany.length == 0) ? "0" : tempCompany.toString());
    param.append("team_id", (fieldTeamId.length == 0) ? "0" : fieldTeamId.toString());

    if (uploadPic != null) {
      param.append("file", uploadPic);
      reactotron.log(uploadPic);
    }

    reactotron.log(param);

    if (props.navigation.state.params.type == "edit") {
    } else {
      reactotron.log("====param");
      reactotron.log(param);

      var result = await rootStore.createNotices(param);

      reactotron.log("========result");
      reactotron.log(result);

      if (result.kind == "ok" && result.data) {
        ImagePicker.clean();
        setLoading(false);

        Toast.show("Anda berhasil menambah pengumuman");
        goBack();
      }
      else if (result.kind == "error" && result.data.status == 500) {
        setLoading(false);
        Toast.show(result.data.message, { duration: Toast.durations.LONG });
        return;
      }

      setLoading(false);
    }
  }

  return (
    <View style={layout.container.general}>
      <Loading loading={loading} />
      <Head type="detail" title={(props.navigation.state.params.type == 'add') ? 'Tambah pengumuman' : 'Ubah pengumuman'} navigation={props.navigation} />

      <ScrollView
        ref={(ref) => {
          setRefScrollView(ref);
        }}
        style={layout.container.content_wtabbar}
      >

        <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="pencil-square-o" style={{ ...layout.textbox.icon }} size={20} />
            <TextInput
              style={{ ...layout.textbox.input }}
              placeholder="Tulis judul pengumuman"
              onChangeText={text => setFieldTitle(text)}
              value={fieldTitle}
            />
          </View>

          {/*
            <View style={{ ...styles.section }}>
              <Text style={layout.typography.h4}>Pengumuman ditujukan untuk:</Text>
            </View>
            <View style={{ ...styles.section }}>
              <TouchableOpacity style={layout.radio.wrapper}>
                  <View style={layout.radio.rounded}>
                      <View style={layout.radio.rounded_active}>
                      </View>
                  </View>
                  <Text style={layout.radio.text}>Karyawan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={layout.radio.wrapper}>
                  <View style={layout.radio.rounded}></View>
                  <Text style={layout.radio.text}>Klien</Text>
              </TouchableOpacity>
            </View>
            */}

          {/* {(hasCompanyPermission === true) && */}
          {/* <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                  selectedValue={fieldCompanyId}
                  onValueChange={(itemValue, itemIndex) => setFieldCompanyId(itemValue)}
                  style={{ ...layout.dropdown.input }}
                >
                  <Picker.Item label="Pilih Perusahaan yang dituju" value="" />
                  {companyList.map((item,i) => {
                    return(
                      <Picker.Item key={"company"+i} label={item.name} value={item.id} />
                    )
                  })}
                </Picker>
              </View> */}
          {/* } */}

          <View style={{ marginBottom: 20, ...layout.textbox.outline, borderRadius: 10 }}>
            <SectionedMultiSelect
              items={companyList}
              uniqueKey="id"
              subKey="children"
              displayKey="name"
              selectText="Pilih Perusahaan yang dituju"
              searchPlaceholderText={"Cari Perusahaan..."}
              showDropDowns={false}
              readOnlyHeadings={false}
              onSelectedItemsChange={(selectedItems) => {
                if (selectedItems.includes(0) == true) {
                  setFieldCompanyId([0]);
                  setFieldTeamId([]);
                }
                else {
                  setFieldCompanyId(selectedItems);
                }
              }}
              selectedItems={fieldCompanyId}
              selectChildren={true}
              single={false}
            />
          </View>

          <View style={{ marginBottom: 20, ...layout.textbox.outline, borderRadius: 10 }}>
            <SectionedMultiSelect
              items={teams}
              uniqueKey="id"
              subKey="children"
              displayKey="team_name"
              selectText="Pilih Divisi yang dituju"
              searchPlaceholderText={"Cari Divisi..."}
              showDropDowns={false}
              readOnlyHeadings={false}
              onSelectedItemsChange={(selectedItems) => {
                if (selectedItems.includes(0) == true) {
                  setFieldTeamId([0]);
                }
                else {
                  setFieldTeamId(selectedItems);
                }
              }}
              selectedItems={fieldTeamId}
              selectChildren={true}
              single={false}
              disabled={(fieldCompanyId.includes(0) == true) ? true : false}
            />
          </View>

          {/* <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={fieldTeamId}
                    onValueChange={(itemValue, itemIndex) => setFieldTeamId(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Pilih Divisi yang dituju" value="" />
                    {teams.map((item,i) => {
                      return(
                        <Picker.Item key={"team"+i} label={item.team_name} value={item.id} />
                      )
                    })}
                </Picker>
            </View> */}

          {(uploadPic != null) && <Image source={uploadPic} style={{
            width: 0.88 * deviceWidth,
            height: 160,
            resizeMode: "cover",
            marginBottom: 20,
            alignSelf: "center",
          }} />}

          <TouchableOpacity
            onPress={onChangeImage}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Image source={require('@assets/ic_add.png')} style={{
              width: 20,
              height: 20,
              resizeMode: "contain",
              marginRight: 10,
              tintColor: "#381D5C",
            }} />

            <Text
              style={{
                fontSize: 14,
                color: "#381D5C",
                fontWeight: "bold",
              }}
              text={"Tambah Gambar Pengumuman"}
            />
          </TouchableOpacity>

          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <TextInput
              style={{ ...layout.textbox.textarea }}
              placeholder="Tulis detail pengumuman"
              multiline={true}
              onChangeText={text => setFieldDescription(text)}
              value={fieldDescription}
              onFocus={() => {
                refScrollView.scrollToEnd({ animated: true })
              }}
            />
          </View>

          <Button onPress={() => doLoopSave()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
            <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Simpan Perubahan</Text>
          </Button>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  )
})
