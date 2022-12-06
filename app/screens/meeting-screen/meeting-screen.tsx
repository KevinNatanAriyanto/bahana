import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, Picker, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl } from "react-native"
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
    color: "#000", marginRight: 5
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


export interface MeetingScreenProps extends NavigationScreenProps<{}> {
}

export const MeetingScreen: React.FunctionComponent<MeetingScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [statuses, setStatuses] = useState({});
    const [incomplete, set_incomplete] = useState([]);
    const [in_progress, set_in_progress] = useState([]);
    const [in_review, set_in_review] = useState([]);
    const [completed, set_completed] = useState([]);
  	const [cariText, setCariText] = useState(null);
    const [whoseTask, setWhoseTask] = useState(null);

  	const [search, setSearch] = useState(null);
    const [assignees, setAssignees] = useState([]);
    const [stat, setStat] = useState({
      incomplete: null,
      in_progress: null,
      in_review: null,
      completed: null
    });

    const [tasks, setTasks] = useState({
      incomplete: [],
      in_progress: [],
      in_review: [],
      completed: []
    });

    // const [progresses, setProgresses] = useState([]);
    // const [reviews, setReviews] = useState([]);
    // const [dones, setDones] = useState([]);

    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    // const netInfo = useNetInfo();

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadTasks(cariText, filterData);
      setRefreshing(false);

    }, [refreshing]);

    useEffect( () => {
      // loadStatus(cariText, filterData);
      loadAssignee();
      loadTasks(cariText, filterData);

      var who = (filterData.assignee_user_id == rootStore.getCurrentUser().id) ? "Saya" : "Semua";
      setWhoseTask(who)

    }, []);

    const loadAssignee = async () => {
      // setLoading(true);
      var result = await rootStore.getAssignee();
      // setLoading(false);

      if(result.kind == "ok" && result.data){
        setAssignees(result.data.assignee);
      }
    }

    const loadTasks = async (search, additional) => {
      var param = {};

      if(search){
        param.heading = search;
      }

      if(additional){
        param = {
          ...param,
          ...additional
        };
      }

      param = {
        ...param,
        is_meeting: 1
      };

      setLoading(true);
      var result = await rootStore.getTasks(param);
      setLoading(false);

      // get from storage when offline
      var isOffline = false;
      if(result.kind != "ok"){
          result.data = {};
          result.kind = "ok"
          isOffline = true;

          result.data.task = rootStore.getData("tasks");
      }

      if(result.kind == "ok" && result.data){
        var datas = {
          incomplete: [],
          in_progress: [],
          in_review: [],
          completed: []
        };

        result.data.task.map((item,i) => {
          switch(item.board_column_id){
            case 3:
              datas.incomplete.push(item);
            break;

            case 5:
              datas.in_progress.push(item);
            break;

            case 6:
              datas.in_review.push(item);
            break;

            case 4:
              datas.completed.push(item);
            break;            
          }
        });

        // console.log(datas)

        Reactotron.log("======datas");
        Reactotron.log(datas);
        setTasks(datas);
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

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'akan_dilakukan', title: 'Akan Dilakukan' },
        { key: 'dalam_proses', title: 'Dalam Proses' },
        { key: 'review', title: 'Menunggu di ACC' },
        { key: 'selesai', title: 'Selesai' },
    ]);

    const AkanDilakukanRoute = () => (
      <View style={{ flex: 1 }}>
        {_render("incomplete")}
      </View>
    );

    const DalamProsesRoute = () => (
      <View style={{ flex: 1 }}>
        {_render("in_progress")}
      </View>
    );

    const ReviewRoute = () => (
      <View style={{ flex: 1 }}>
        {_render("in_review")}
      </View>
    );

    const SelesaiRoute = () => (
      <View style={{ flex: 1 }}>
        {_render("completed")}
      </View>
    );
    const renderScene = SceneMap({
        akan_dilakukan: AkanDilakukanRoute,
        dalam_proses: DalamProsesRoute,
        review: ReviewRoute,
        selesai: SelesaiRoute,
    });

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{ ...layout.tabs.indicator }}
        style={{ ...layout.tabs.container }}
        tabStyle={{ width: deviceWidth*0.35 }}
        scrollEnabled={true}
        labelStyle={{ ...layout.tabs.title }}
        activeColor={"#381D5C"}
        inactiveColor={"#BABABA"}
      />
    );

    const formatDate = (datenow) => {
      return moment(datenow).format('Do MMM YYYY');

      // return moment(datenow).calendar(null, {
      //   sameElse: 'Do MMM YYYY'
      // })
    }

    const selisihDate = (datenow) => {
      // return moment(datenow).fromNow()
      return moment().diff(datenow, 'days')
    }

    const onSubmit = (values) => {
      // Reactotron.log(values)
    }

    const SearchSchema = Yup.object().shape({
      search: Yup.string()
        .required('Search is required'),
      });

    const _render = (slug) => {
      var slugnow = slug;
      var datas = tasks[slugnow];

      return(
        <View key={slugnow}>
          <ScrollView 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={layout.container.content_wtabbar}>
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

              
                <Formik
                initialValues={{ 
                  search: rootStore.showCurrentUser("search"),
                }}
                validationSchema={SearchSchema}
                onSubmit={values => onSubmit(values)}>
                {props => (
                <View style={{ ...styles.action.wrapper, ...styles.row }}>
                  <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
                    <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
                    <TextInput
                        style={{ ...layout.textbox.input }}
                        placeholder="Cari Meeting..."
                        onChangeText={props.handleChange('search')}
                        onBlur={props.handleBlur('search')}
                        value={props.values.search}
                        onSubmitEditing={()=>{
                          loadTasks(props.values.search, filterData)
                        }}

                    />
                  </View>
                  <TouchableOpacity 
                    onPress={() => {
                      loadTasks(props.values.search, filterData)
                    }} 
                    style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn }}
                  >
                      <Icon name="ios-search" size={20} style={{ color: "#fff", marginRight: 10 }} />
                      <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Cari</Text>
                  </TouchableOpacity>
                </View>
                )}
                </Formik>
                
              

              {datas.length > 0 && datas.map((item,i) => {
                var color_pick = '';
                var now_status;

                if(selisihDate(item.due_date)<-3){
                  color_pick = color.palette.white_task
                }else if(selisihDate(item.due_date)<=0){
                  color_pick = color.palette.yellow_task
                  now_status = "almost";
                }else {
                  color_pick = color.palette.red_task
                  now_status = "late";
                }

                return(
                  <TouchableOpacity key={slugnow+item.id} onPress={() => navigateTo("meeting_detail", {id: item.id, onBack: onRefresh})} style={[{...layout.list.absence_list, borderColor: color_pick }, (now_status) ? { borderWidth: 2 } : null]}>
                      {(!item.is_sync && ("is_sync" in item) &&
                        <Icon name="ios-cloud-upload" size={15} style={{ color: "#cecece", position: "absolute", top: 20, right: 20 }} />
                      )}

                      <Text style={{ ...layout.typography.h3, ...styles.title }}>{item.heading}</Text>

                      {(now_status == "almost" &&
                        <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Mendekati Deadline</Text>
                      )}

                      {(now_status == "late" && slugnow != "completed" &&
                        <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>Terlambat</Text>
                      )}

                      <View style={styles.row}>
                        <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Deadline:</Text>
                        <Text style={{ ...layout.typography.body_smaller }}>{formatDate(item.due_date)}</Text>
                      </View>
                      <Text style={{ ...layout.typography.body_smaller }}>Untuk: {item.users[0].name}</Text>

                  </TouchableOpacity>
                )
              })}
            </View>

          </ScrollView>
          
        </View>
      )
    }

    {/* Filter */}
    const [filterData, setfilterData] = useState({
      assignee_user_id: "all",
      // board_column_id: "",
      start_date: "",
      end_date: "",
      limit: 300,
      offset: 0
    });
    const [filterUI, setfilterUI] = useState({
      start_date_picker: false,
      end_date_picker: false
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
        loadTasks(cariText, filterData);
      }, 500);
    }

    let all_assignees = [
      {
        id: rootStore.getCurrentUser().id,
        name: "Diri Sendiri"
      },
      ...assignees
    ]

    const items_assignees = [
      {
        name: 'Pilih semua orang',
        id: 0,
        children: all_assignees
      },
    ];

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

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Lihat Meeting</Text>

                {/*
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <Picker
                      selectedValue={filterData.assignee_user_id}
                      onValueChange={(itemValue, itemIndex) => {
                        changeFilterValue("assignee_user_id", itemValue);

                        let ass = assignees.find(assigne => assigne.id === itemValue);
                        // Reactotron.log(ass.name);

                        if(ass){
                          setWhoseTask(ass.name);
                        }
                      }}
                      style={{ ...layout.dropdown.input }}
                  >
                      <Picker.Item label="Diri Sendiri" value={rootStore.getCurrentUser().id} />
                      {assignees.map((item,i) => {
                        return(
                          <Picker.Item key={"assignee"+i} label={item.name} value={item.id} />
                        )
                      })}
                  </Picker>
                </View>
                */}

                <View style={{ marginBottom: 20, ...layout.textbox.outline, borderRadius: 10 }}>
                  <SectionedMultiSelect
                    items={items_assignees}
                    uniqueKey="id"
                    subKey="children"
                    displayKey={"name"}
                    selectText="Pilih orang"
                    searchPlaceholderText={"Cari Orang..."}
                    showDropDowns={false}
                    readOnlyHeadings={true}
                    onSelectedItemsChange={(itemValue) => {

                      changeFilterValue("assignee_user_id", itemValue);

                      let ass = assignees.find(assigne => assigne.id === itemValue);
                      // Reactotron.log(ass.name);

                      if(ass){
                        setWhoseTask(ass.name);
                      }
                    }}
                    selectedItems={[ filterData.assignee_user_id ]}
                    selectChildren={true}
                    single={true}
                  />
                </View>

                {/*
                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Status</Text>
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <Picker
                      selectedValue={filterData.board_column_id}
                      onValueChange={(itemValue, itemIndex) => changeFilterValue("board_column_id", itemValue)}
                      style={{ ...layout.dropdown.input }}
                  >
                      <Picker.Item label="Semua" value="" />
                      <Picker.Item label="Akan Dilakukan" value={stat.incomplete} />
                      <Picker.Item label="Dalam Proses" value={stat.in_progress} />
                      <Picker.Item label="Di Review" value={stat.in_review} />
                      <Picker.Item label="Selesai" value={stat.completed} />
                  </Picker>
                </View>
                */}

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tanggal Mulai</Text>
                <TouchableOpacity 
                  onPress={() => changeFilterValue("start_date_picker", true, "filterUI")} 
                  style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <TextInput
                      style={{ ...layout.textbox.input }}
                      placeholder="Tanggal Mulai "
                      editable={false}
                      value={filterData.start_date}
                  />
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={filterUI.start_date_picker}
                  onConfirm={(date) => {
                    var dd = moment(date).format("YYYY-MM-DD");
                    changeFilterValue("start_date", dd.toString());
                    changeFilterValue("start_date_picker", false, "filterUI");
                  }}
                  onCancel={() => {
                    changeFilterValue("start_date_picker", false, "filterUI");
                  }}
                />

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tanggal Selesai</Text>
                <TouchableOpacity 
                  onPress={() => changeFilterValue("end_date_picker", true, "filterUI")} 
                  style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <TextInput
                      style={{ ...layout.textbox.input }}
                      placeholder="Tanggal Selesai "
                      editable={false}
                      value={filterData.end_date}
                  />
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={filterUI.end_date_picker}
                  onConfirm={(date) => {
                    var dd = moment(date).format("YYYY-MM-DD");
                    changeFilterValue("end_date", dd.toString());
                    changeFilterValue("end_date_picker", false, "filterUI");
                  }}
                  onCancel={() => {
                    changeFilterValue("end_date_picker", false, "filterUI");
                  }}
                />

            </ScrollView>
            <View style={{ ...layout.bottom_notif.row }}>
                <Button 
                  onPress={() => {
                    _panelFilter.hide()

                    setTimeout(function(){
                      setWhoseTask("Semua");
                    },500);
                  }} 
                  style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}
                >
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                </Button>
                <Button onPress={() => confirmFilter()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                </Button>
            </View>

        </SlidingUpPanel>
      )
    }

    // var whoseTask = (filterData.assignee_user_id == rootStore.getCurrentUser().id) ? "Saya" : "Semua"

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />

        <Head type="detail" title={'Briefing - '+whoseTask} navigation={props.navigation} noBorder={true} 
          // right_content={(
          //   <View style={{ flexDirection: 'row' }}>
          //     <Icon name="ios-cog" size={16} style={{ color: "#000", marginRight: 5 }} />
          //     <Text style={{ ...layout.typography.body_smaller }}>Filter</Text>
          //   </View>
          // )}
          right_action={() => _panelFilter.show()}
          right_content={(
            <View onPress={props.handleSubmit} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.small, paddingVertical: 5, paddingHorizontal: 10 }}>
                {/*<Image source={require('@assets/ico-filter-white.png')} style={layout.button.icon} />*/}
                <Icon name="ios-wine" size={14} style={{ color: "#8D8D8D", marginRight: 5 }} />
                <Text style={{ ...layout.button.text, ...layout.button.text_outline, fontSize: 12 }}>Filter</Text>
            </View>
          )}
        />

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={renderTabBar}
        />

        <TouchableOpacity onPress={() => navigateTo('form_meeting', {type: "add", onBack: onRefresh})} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.floating_btn }}>
            <Image source={require('@assets/fingerprint_white.png')} style={layout.button.icon} />
            <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Tambah Briefing</Text>
        </TouchableOpacity>

        {_renderFilter()}
      </View>
    )
})
