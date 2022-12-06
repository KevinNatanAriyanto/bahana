import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, RefreshControl, View, Picker, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
import * as Animatable from 'react-native-animatable';
import { clone } from 'lodash';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
import DateTimePicker from "react-native-modal-datetime-picker";

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


export interface ProjectsScreenProps extends NavigationScreenProps<{}> {
}

export const ProjectsScreen: React.FunctionComponent<ProjectsScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [projects, setProjects] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [cariText, setCariText] = useState(null);
    const [showProjects, setShowProjects] = useState(null);
    const [sortBy, setSortBy] = useState("id desc");

    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadProjects();
      loadProjectCategories();
      setRefreshing(false);

    }, [refreshing]);

    useEffect( () => {
      // loadProjects()
      loadProjectCategories()
    }, []);

    useEffect( () => {
      loadProjects()
    }, [sortBy]);

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

    const loadProjects = async (searchText = null, otherfilter = null) => {
      setLoading(true);
      var cur_prof = await rootStore.getProfileUser();
      setLoading(false);

      if(cur_prof.kind == "ok" && cur_prof.data){
        var param = {}

        if(searchText){
          param.search = searchText
          // setSearch(null)
        }

        if(otherfilter){
          param = {
            ...param,
            ...otherfilter
          }
        }

        if(showProjects == "related"){
          param = {
            ...param,
            team_id: cur_prof.data.employee.department_id,
            wilayah_id: cur_prof.data.employee.wilayah_id,
            subcompany_id: cur_prof.data.employee.sub_company_id,
          }
        }

        param = {
          ...param,
          sortby: "order=" + sortBy,
        };

        Reactotron.log("============param");
        Reactotron.log(param);
        
        setLoading(true);
        var result = await rootStore.getProjects(param);
        setLoading(false);

        if(result.kind == "ok" && result.data){
          setProjects(result.data)
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

    const openModalOpsi = () => {
        opsiModal.current.open()
        }

    const closeModalOpsi = () => {
        opsiModal.current.close()
        }

    const _render = () => {
      return(
        <View>
          <ScrollView 
            style={layout.container.content_wtabbar}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

              <View style={{ ...styles.action.wrapper, ...styles.row, marginBottom: -5 }}>
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
                    <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
                    <TextInput
                        style={{ ...layout.textbox.input }}
                        placeholder="Cari Tugas..."
                        onChangeText={(txt) => setCariText(txt)}
                        onSubmitEditing={()=>{
                          loadProjects(cariText)
                        }}
                    />
                </View>

                <TouchableOpacity 
                  onPress={()=>{
                    loadProjects(cariText)
                  }} 
                  style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn }}
                >
                    <Icon name="ios-search" size={20} style={{ color: "#fff", marginRight: 10 }} />
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Cari</Text>
                </TouchableOpacity>
              </View>

              <View style={{ ...styles.action.wrapper, ...styles.row, marginBottom: 20 }}>
                <TouchableOpacity 
                  onPress={()=>{
                    if(sortBy !== "project_name asc"){
                      setSortBy("project_name asc");
                    }
                    else{
                      setSortBy("id desc");
                    }
                  }} 
                  style={[
                    { ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn },
                    (sortBy !== "project_name asc") && { backgroundColor: "white" },
                  ]}
                >
                  <Text style={[
                    { ...layout.button.text, ...layout.button.text_primary },
                    (sortBy !== "project_name asc") && { color: "#381D5C" },
                  ]}>Urut Abjad</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={()=>{
                    if(sortBy !== "created_at desc"){
                      setSortBy("created_at desc");
                    }
                    else{
                      setSortBy("id desc");
                    }
                  }} 
                  style={[
                    { ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn },
                    (sortBy !== "created_at desc") && { backgroundColor: "white" },
                  ]}
                >
                  <Text style={[
                    { ...layout.button.text, ...layout.button.text_primary },
                    (sortBy !== "created_at desc") && { color: "#381D5C" },
                  ]}>Urut Tanggal</Text>
                </TouchableOpacity>
              </View>

              {(projects.map((item,i) => {
                return(
                  <TouchableOpacity key={"project"+i} onPress={() => navigateTo("projects_detail", {id: item.id, data: item, onBack: onRefresh} )} style={{...layout.list.absence_list}}>

                      <Status slug={item.status} />
                      <Text style={{ ...layout.typography.body_smaller, }}>{moment(item.start_date).format("DD MMMM YYYY")}</Text>
                      <Text style={{ ...layout.typography.h3, ...styles.title }}>{item.project_name}</Text>

                      {/*(item.deadline &&
                        <View style={styles.row}>
                          <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Deadline:</Text>
                          <Text style={{ ...layout.typography.body_smaller }}>{formatDate(item.deadline)}</Text>
                        </View>
                      )*/}
                  </TouchableOpacity>
                )
              }))}

            </View>

          </ScrollView>
          
        </View>
      )
    }

    const loadProjectCategories = async () => {

      var param = {};
      setLoading(true);
      var result = await rootStore.getProjectCategories(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setProjectCategories(result.data)
      }
    }

    {/* Filter */}
    const [projectCategories, setProjectCategories] = useState([]);
    const [filterData, setfilterData] = useState({
      category_id: "",
    });
    const [filterUI, setfilterUI] = useState({
      // start_date_picker: false,
      // end_date_picker: false
    });

    const changeFilterValue = (variable, value, filterd = "filterData") => {
      eval("var tmp_data = "+filterd);
      var next_data = clone(tmp_data);

      if(typeof value == "string"){
        eval("next_data."+variable+" = '"+value+"'");
      }else{
        eval("next_data."+variable+" = "+value);
      }

      eval("set"+filterd+"(next_data)");

      // Reactotron.log(next_data);
    }

    const confirmFilter = () => {

      // convert to search string
      /*
      var resultText = "";
      Object.entries(filterData).map((item,i) => {
        resultText += item[0] + " eq " + item[1];

        if(i > 0 && i < Object.keys(filterData).length-1){
          resultText += " and ";
        }
      });
      */

      _panelFilter.hide();

      setTimeout(function(){
        // setCariText(resultText);
        loadProjects(cariText, filterData);
      }, 500);
    }

    const _renderFilter = () => {
      return(
        <SlidingUpPanel 
            ref={c => _panelFilter = c}
            containerStyle={{ ...layout.bottom_notif.container }}
            backdropStyle={{ ...layout.bottom_notif.backdrop }}
            allowDragging={false}
            draggableRange={{
                top: deviceHeight-20,
                bottom: 0
            }}
            friction={0.3}
        >
            <View style={{ ...layout.bottom_notif.wrapper }}>
                <Text style={layout.bottom_notif.title}>Filter</Text>
            </View>
            <ScrollView style={{ ...layout.bottom_notif.wrapper, marginBottom: 50 }}>

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Kategori</Text>
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <Picker
                      selectedValue={filterData.category_id}
                      onValueChange={(itemValue, itemIndex) => changeFilterValue("category_id", itemValue)}
                      style={{ ...layout.dropdown.input }}
                  >
                    <Picker.Item label={"Semua"} value={""} />
                    {projectCategories.map((item,i) => {
                      return(
                        <Picker.Item key={"pc"+i} label={item.category_name} value={item.id} />
                      )
                    })}
                  </Picker>
                </View>

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tampilkan</Text>
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <Picker
                      selectedValue={showProjects}
                      onValueChange={(itemValue, itemIndex) => setShowProjects(itemValue)}
                      style={{ ...layout.dropdown.input }}
                  >
                    <Picker.Item label={"Semua divisi"} value={"all"} />
                    <Picker.Item label={"Divisi yang terkait"} value={"related"} />
                  </Picker>
                </View>

            </ScrollView>
            <View style={{ ...layout.bottom_notif.row }}>
                <Button onPress={() => _panelFilter.hide()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                </Button>
                <Button onPress={() => confirmFilter()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                </Button>
            </View>

        </SlidingUpPanel>
      )
    }

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />

        <Head type="detail" title={'Semua Proyek'} navigation={props.navigation} 
          right_action={() => _panelFilter.show()}
          right_content={(
            <View onPress={props.handleSubmit} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.small, paddingVertical: 5, paddingHorizontal: 10 }}>
                {/*<Image source={require('@assets/ico-filter-white.png')} style={layout.button.icon} />*/}
                <Icon name="ios-wine" size={14} style={{ color: "#8D8D8D", marginRight: 5 }} />
                <Text style={{ ...layout.button.text, ...layout.button.text_outline, fontSize: 12 }}>Filter</Text>
            </View>
          )}
        />

        {_render()}

        {(JSON.parse(rootStore.showCurrentUser("permissions")).create_proyek != "0" &&
          <TouchableOpacity onPress={() => navigateTo('form_projects', {type: "add", onBack: onRefresh})} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.floating_btn }}>
              <Image source={require('@assets/fingerprint_white.png')} style={layout.button.icon} />
              <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Tambah Proyek</Text>
          </TouchableOpacity>
        )}

        {_renderFilter()}

      </View>
    )
})
