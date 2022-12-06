import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl } from "react-native"
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
import Reactotron from 'reactotron-react-native';
import DateTimePicker from "react-native-modal-datetime-picker";

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


export interface FormProjectsScreenProps extends NavigationScreenProps<{}> {
}

export const FormProjectsScreen: React.FunctionComponent<FormProjectsScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [project, setProject] = useState(null);
    const [fieldName, setFieldName] = useState("");
    const [fieldStart, setFieldStart] = useState("");
    const [fieldCatId, setFieldCatId] = useState("");
    const [fieldSummary, setFieldSummary] = useState("");
    const [catName, setCatName] = useState("");
    const [startDateVisible, setStartDateVisible] = useState(false);

    const [categories, setCategories] = useState([]);
    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const [activeSections, setActiveSections] = React.useState([0]);
    const [refreshing, setRefreshing] = React.useState(false);

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadProjectCategories();
      setRefreshing(false);

    }, [refreshing]);

    useEffect( () => {
      loadAll()

    }, []);

    const loadAll = async () => {
      await loadProjectCategories()

      var tt = props.navigation.state.params.project;
      // Reactotron.log(tt)

      if(tt){
        setProject(tt)
        setFieldName(tt.project_name)
        setFieldSummary(tt.project_summary)
        setFieldCatId(tt.category_id)
        setFieldStart(moment(tt.start_date).format("YYYY-MM-DD"))
      }
    }

    const loadProjectCategories = async () => {
      var param = {
        
      }

      setLoading(true);
      var result = await rootStore.getProjectCategories(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setCategories(result.data)
      }
    }
    const addCategory = async () => {
      var param = {
        category_name: catName
      }

      setLoading(true);
      var result = await rootStore.addCategory(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setCatName("")
        loadAll()

        closeModal()
        Toast.show("Kategori berhasil ditambahkan")
      }
    }
    const saveProject = async () => {
      var validate = true;

      if(fieldName == ""){
        Toast.show("Nama harus diisi");
        validate = false;

      }else if(fieldCatId == ""){
        Toast.show("Kategori harus dipilih");
        validate = false;

      }else if(fieldStart == ""){
        Toast.show("Tanggal harus dipilih");
        validate = false;

      }else if(fieldSummary == ""){
        Toast.show("Deskripsi harus diisi");
        validate = false;

      }

      var param = {
        project_name: fieldName,
        category_id: fieldCatId,
        start_date: fieldStart,
        status: "in progress",
        project_summary: fieldSummary,
        project_admin: rootStore.getCurrentUser().id
      }

      if(validate){
        if(props.navigation.state.params.type == "edit"){
          param.id = project.id;

          setLoading(true);
          var result = await rootStore.editProject(param);
          setLoading(false);

          if(result.kind == "ok" && result.data){
            Toast.show("Anda berhasil mengubah proyek");
            goBack();
            props.navigation.state.params.onBack();
          }
        }else if(props.navigation.state.params.type == "add"){
          setLoading(true);
          var result = await rootStore.addProject(param);
          setLoading(false);

          if(result.kind == "ok" && result.data){
            Toast.show("Anda berhasil menambahkan proyek");
            goBack();
            props.navigation.state.params.onBack();
          }
        }
      }
    }

    //Modal
    const openModal = () => {
      menuModal.current.open()
    }

    const closeModal = () => {
      menuModal.current.close()
    }

    // Accordion
    const SECTIONS = [
        {
            title: 'Isi detail proyek',
            slug: "detail-proyek"
        },
        // {
        //     title: 'Unggah dokumen pendukung',
        //     slug: "unggah-dokumen"
        // },
    ];

    const _renderSectionTitle = section => {
        return (
          <View style={styles.content}>
            
          </View>
        );
    };

    const _renderHeader = section => {
        return (
          <View style={{ ...layout.accordion.header.wrapper }}>
            <Text style={{ ...layout.typography.h4, ...layout.accordion.header.title }}>{section.title}</Text>
            <Icon name="ios-arrow-down" style={{ ...layout.accordion.header.icon }} size={20} />
          </View>
        );
    };

    const _renderContent = section => {
        return (
          <View style={{ ...layout.accordion.content.wrapper }}>
            {(section.slug == 'detail-proyek' &&
              _renderDetail()
            )}
            {(section.slug == 'unggah-dokumen' &&
              _renderDokumen()
            )}
          </View>
        );
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    const _renderDetail = () => {
      return(
        <View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Nama Proyek"
                  onChangeText={text => setFieldName(text)}
                  value={fieldName}
              />
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
              <Picker
                  selectedValue={fieldCatId}
                  onValueChange={(itemValue, itemIndex) => setFieldCatId(itemValue)}
                  style={{ ...layout.dropdown.input }}
              >
                  <Picker.Item label="Pilih Kategori" value="" />
                  {categories.map((item,i) => {
                    return(
                      <Picker.Item key={"cat"+i} label={item.category_name} value={item.id} />
                    )
                  })}
                  
              </Picker>
          </View>
          <TouchableOpacity onPress={openModal} style={{ ...styles.row, marginTop: -10, marginBottom: 20 }}>
            <Icon name="ios-add-circle-outline" style={{ ...styles.icon_add }} size={20} />
            <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Tambah Kategori</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStartDateVisible(true)} style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Tanggal Mulai "
                  editable={false}
                  onChangeText={text => setFieldStart(text)}
                  value={fieldStart}
              />
          </TouchableOpacity>
          {/*
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                  style={{ ...layout.textbox.input }}
                  placeholder="Deadline "
              />
          </View>
          */}
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <TextInput
                  style={{ ...layout.textbox.textarea }}
                  placeholder="Deskripsi"
                  multiline={true}
                  onChangeText={text => setFieldSummary(text)}
                  value={fieldSummary}
              />
          </View>
        </View>
      )
    }

    const _renderDokumen = () => {
      return(
        <View>
          <View style={{...layout.file_field.container, marginTop: 0 }}>
              <View style={{...layout.file_field.container_inside}}>
                  <View style={{flexDirection:'row'}}>
                      <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                      <View style={{marginLeft:0.027*deviceWidth}}>
                          <Text style={{...layout.file_field.namefile}}>IMG-1234.jpg</Text>
                          <Text style={{...layout.file_field.sizefile}}>210 kb</Text>
                      </View>
                  </View>
                  <View style={{...layout.file_field.button_group}}>
                      <Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />
                  </View>
              </View>
              <TouchableOpacity style={styles.row}>
                <Icon name="ios-add-circle-outline" style={{ ...styles.icon_add }} size={20} />
                <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Tambah Dokumen Lain</Text>
              </TouchableOpacity>
          </View>
        </View>
      )
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

    const handleStartDatePicked = date => {
      setFieldStart(moment(date).format("YYYY-MM-DD"));
      setStartDateVisible(false);
    };

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />
        <DateTimePicker
          isVisible={startDateVisible}
          onConfirm={handleStartDatePicked}
          onCancel={() => setStartDateVisible(false)}
        />

        <Head type="detail" title={(props.navigation.state.params.type == 'add') ? 'Tambah proyek baru' : 'Ubah Proyek'} navigation={props.navigation} />
        
        <ScrollView 
          style={layout.container.content_wtabbar}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
            <Accordion
                sections={SECTIONS}
                activeSections={activeSections}
                renderSectionTitle={_renderSectionTitle}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
                underlayColor={"#fff"}
                sectionContainerStyle={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, ...layout.accordion.section }}
            />

            <Button onPress={() => saveProject()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
              {(props.navigation.state.params.type == "edit" &&
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Ubah Proyek</Text>
              )}
              {(props.navigation.state.params.type == "add" &&
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Tambahkan Proyek</Text>
              )}
            </Button>
            
          </View>

        </ScrollView>

        <Modal
            style={{ ...layout.modalbox.modal}}
            ref={menuModal}
            backdropPressToClose={true}
            swipeToClose={true}>
          <View style={{ ...layout.modal.body }}>
            <Text style={{...layout.modalbox.modal_header}} text="Tambah Kategori" />
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginTop:0.077*deviceWidth }}>
                <TextInput
                    style={{ ...layout.textbox.input }}
                    placeholder="Masukkan nama kategori"
                    onChangeText={text => setCatName(text)}
                    value={catName}
                />
            </View>
            <View style={{...layout.modalbox.button_modal}}>
                <TouchableOpacity onPress={()=>{ closeModal() }} style={{...layout.modalbox.batal_button}}>
                    <Text style={{...layout.modalbox.batal_text}}>BATAL</Text>
                </TouchableOpacity> 
                <TouchableOpacity onPress={()=>{ addCategory() }} style={{...layout.modalbox.ok_button}}>
                    <Text style={{...layout.modalbox.ok_text}}>OK</Text>
                </TouchableOpacity>    
            </View>
          </View>
        </Modal>

      </View>
    )
})
