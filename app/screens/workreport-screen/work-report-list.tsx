import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Picker, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl, FlatList, SafeAreaView } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Head, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
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
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { clone } from 'lodash';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
import DateTimePicker from "react-native-modal-datetime-picker";

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    base:{
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
        },
    report_list:{
        alignSelf: "center",
        width: deviceWidth*0.8,
        borderRadius:10,
        elevation:1,
        padding:0.055*deviceWidth,
        marginBottom:0.055*deviceWidth,
        backgroundColor: "#fff"
        },
    title_list:{
        fontSize:16,
        color:"#5F5959",
        fontWeight: "bold",
        },
    description_list:{
        fontSize:12,
        color:"#5F5959",
        // fontWeight: "bold",
        }

    }


export interface WorkReportListScreenProps extends NavigationScreenProps<{}> {
}

export const WorkReportListScreen: React.FunctionComponent<WorkReportListScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const menuModal = useRef(null);
    const [index, setIndex] = React.useState(0);
    const [current_page, setCurrentPage] = React.useState({
      in_review: 0,
      rejected: 0,
      accepted: 0
    });
    
    const [assignees, setAssignees] = useState([]);

    const [inReviews, setInReviews] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [accepted, setAccepted] = useState([]);
    const [approval, setApproval] = useState(1);

    // let current_page = 1;
    let offset_posts = {
      in_review: 0,
      rejected: 0,
      accepted: 0
    };
    let limit_posts = 100;

    // let timelogs = {
    //   in_review: [],
    //   rejected: [],
    //   accepted: []
    // }
    const [timelogs, setTimelogs] = useState({
      in_review: [],
      rejected: [],
      accepted: []
    });

    const [routes] = React.useState([
        { key: 'masuk', title: 'Laporan Masuk' },
        { key: 'diterima', title: 'Laporan di ACC' },
        { key: 'ditolak', title: 'Laporan Ditolak' },
    ]);

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {
      loadInit()
    }, []);

    const loadInit = async () => {
      setLoading(true)

      await loadTimelogs();
      await loadAssignee();

      setLoading(false)
    }

    const onRefresh = React.useCallback( () => {
      setLoading(true);
      setRefreshing(true);

      setTimelogs({
        in_review: [],
        rejected: [],
        accepted: []
      })

      setTimeout(async() => {
        await loadTimelogs(filterData);
        await loadAssignee();

        setRefreshing(false);
        setLoading(false);
      }, 500)

    }, [refreshing]);

    const loadAssignee = async () => {
      // setLoading(true);
      var result = await rootStore.getAssignee();
      // setLoading(false);

      if(result.kind == "ok" && result.data){
        setAssignees(result.data.assignee);
      }
    }

    const loadTimelogs = async (otherfilter = null, isReset = false) => {
      var param;

      if(otherfilter){
        param = {
          ...otherfilter
        }
      }else{
        param = {
          assignee_user_id: "all",
          status: "in_review",
          offset: 0,
          limit: limit_posts
        }
      }

      param = {
        ...param,
        need_my_approval: (approval == 1) ? true : false,
      }

      Reactotron.log("=====param");
      Reactotron.log(param);
      
      // setLoading(true);
      var result = await rootStore.getLogsList(param);
      setLoading(false);

      // get from storage when offline
      var isOffline = false;
      if(result.kind != "ok"){
          result.data = {};
          result.kind = "ok"
          isOffline = true;

          var ptimelogs = rootStore.getData("timelogs");

          var new_timelogs = [];
          ptimelogs = ptimelogs.map((item,i) => {
            var tmp = { ...item }
            tmp.task = rootStore.findTaskById(item.task_id)
            new_timelogs.push(tmp)
          })

          result.data.data = {}
          result.data.data.project_time_log = new_timelogs;
      }

      if(result.kind == "ok" && result.data.data){
        var datas;

        if(!isReset){
          datas = {
            in_review: timelogs.in_review,
            rejected: timelogs.rejected,
            accepted: timelogs.accepted
          };
        }else{
          datas = {
            in_review: [],
            rejected: [],
            accepted: []
          };
        }

        result.data.data.project_time_log.map((item,i) => {
          // console.log(item)

          switch(item.status){
            case "in_review":
              datas.in_review.push(item);
            break;

            case "rejected":
              datas.rejected.push(item);
            break;

            case "accepted":
              datas.accepted.push(item);
            break;  
          }
        });

        if(result.data.data.project_time_log.length > 0){
          // setTimelogs(datas);
          setInReviews(datas.in_review)
          setAccepted(datas.accepted)
          setRejected(datas.rejected)

          if(param.current_page){
            setCurrentPage(param.current_page);
          }

          // save to storage
          rootStore.removeData("timelogs");
          rootStore.pushData("timelogs", result.data.data.project_time_log);
        }
      }
    }

    const formatDate = (datenow) => {
        return moment(datenow).format("MMM Do, YYYY");
    }
    const formatTime = (datenow) => {
        return moment(datenow).format("h:mm:ss a");
    }

    const FirstRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderElementFirst()}
      </View>
    );

    const SecondRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderElementTwo()}
      </View>
    );

    const ThirdRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderElementThree()}
      </View>
    );

    const renderScene = SceneMap({
        masuk: FirstRoute,
        diterima: SecondRoute,
        ditolak: ThirdRoute,
    });

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{ ...layout.tabs.indicator }}
        style={{ ...layout.tabs.container }}
        labelStyle={{ ...layout.tabs.title }}
      />
    );

    const _renderElementFirst = () => {
        return(
          <SafeAreaView>
            <FlatList
              // data={timelogs.in_review}
              data={inReviews}
              renderItem={_renderReport}
              keyExtractor={item => item.id}
              contentContainerStyle={{ marginVertical: 20 }}
              removeClippedSubviews={true}
              refreshing={ loading }
              onRefresh={ onRefresh }
              onEndReachedThreshold={0.01}
              onEndReached={info => {
                // Reactotron.log(info)

                if(index == 0 && timelogs.in_review.length > 0){
                  loadPage("in_review", true)
                }
              }}
            />
          </SafeAreaView>
        )
    }

    const _renderElementTwo = () => {
        return(
          <SafeAreaView>
            <FlatList
              // data={timelogs.accepted}
              data={accepted}
              renderItem={_renderReport}
              keyExtractor={item => item.id}
              contentContainerStyle={{ marginVertical: 20 }}
              removeClippedSubviews={true}
              refreshing={ loading }
              onRefresh={ onRefresh }
              onEndReachedThreshold={0.01}
              onEndReached={info => {
                // Reactotron.log(info)

                if(index == 1 && timelogs.accepted.length > 0){
                  loadPage("accepted", true)
                }
              }}
            />
          </SafeAreaView>
        )
    }

    const _renderElementThree = () => {
        return(
          <SafeAreaView>
            <FlatList
              // data={timelogs.rejected}
              data={rejected}
              renderItem={_renderReport}
              keyExtractor={item => item.id}
              contentContainerStyle={{ marginVertical: 20 }}
              removeClippedSubviews={true}
              refreshing={ loading }
              onRefresh={ onRefresh }
              onEndReachedThreshold={0.01}
              onEndReached={info => {
                // Reactotron.log(info)

                if(index == 2 && timelogs.rejected.length > 0){
                  loadPage("rejected", true)
                }
              }}
            />
          </SafeAreaView>
        )
    }

    const _renderReport = ({item}) => {
      return(
        <TouchableOpacity key={Math.random().toString(36).substring(3)+item.id} style={{...styles.report_list}} onPress={() => navigateTo("work_report_detail", {id: item.id, onBack: onRefresh })}>

            {(!item.is_sync && ("is_sync" in item) &&
              <Icon name="ios-cloud-upload" size={15} style={{ color: "#cecece", position: "absolute", top: 20, right: 20 }} />
            )}

            <Text style={styles.title_list}>{(item.task[0]) ? item.task[0].heading : ""}</Text>
            {(item.project &&
              <Text style={styles.description_list}>Proyek : {item.project.project_name}</Text>
            )}
            <Text style={styles.description_list}>Tanggal Kerja : {formatDate(item.start_time)}</Text>
            <Text style={styles.description_list}>Yang Mengerjakan : {item.user.name}</Text>
            <Text style={{ ...styles.description_list, marginTop: 10 }}>Tanggal Laporan : {moment(item.created_at).format("MMM Do, YYYY h:mm:ss a")}</Text>

            {(item.di_review_oleh != null) && <Text style={{ ...styles.description_list, marginTop: 10 }}>Di Review Oleh : {item.di_review_oleh.name}</Text>}
            {(item.di_tolak_oleh != null) && <Text style={{ ...styles.description_list, marginTop: 5 }}>Di Tolak Oleh : {item.di_tolak_oleh.name}</Text>}
        </TouchableOpacity>
      )
    }

    {/* Filter */}
    const [filterData, setfilterData] = useState({
      assignee_user_id: "all",
      status: "in_review",
      offset: 0,
      limit: limit_posts
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
      // reset tabs
      setIndex(0);
      // this.props.jumpTo('masuk');

      // reset all
      setCurrentPage({
        in_review: 0,
        rejected: 0,
        accepted: 0
      });
      offset_posts = {
        in_review: 0,
        rejected: 0,
        accepted: 0
      };
      setTimelogs({
        in_review: [],
        rejected: [],
        accepted: []
      });

      setLoading(true);

      setTimeout(function(){
        _panelFilter.hide();
        loadTimelogs(filterData, true);
      }, 1500);
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

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Lihat Tugas</Text>
                {/*
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <Picker
                      selectedValue={filterData.assignee_user_id}
                      onValueChange={(itemValue, itemIndex) => changeFilterValue("assignee_user_id", itemValue)}
                      style={{ ...layout.dropdown.input }}
                  >
                      <Picker.Item label="Semua" value={"all"} />
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
                    }}
                    selectedItems={[ filterData.assignee_user_id ]}
                    selectChildren={true}
                    single={true}
                  />
                </View>

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Perlu Approval Saya</Text>

                <TouchableOpacity
                  style={layout.checkbox.wrapper}
                  onPress={() => {
                    setApproval(1)
                  }}
                >
                  <View style={layout.checkbox.rounded}>
                    {(approval == 1) &&
                      <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                    }
                  </View>
                  <Text style={layout.checkbox.text}>Ya</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={layout.checkbox.wrapper}
                  onPress={() => {
                    setApproval(0)
                  }}
                >
                  <View style={layout.checkbox.rounded}>
                    {(approval == 0) &&
                      <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                    }
                  </View>
                  <Text style={layout.checkbox.text}>Tidak</Text>
                </TouchableOpacity>

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

    const loadPage = (type, next = false) => {
      var next_page = 0;
      
      if(next){
        next_page = current_page[type]+1;
      }

      offset_posts[type] = limit_posts * next_page;

      // update current page
      var update_current = {
        ...current_page
      }
      update_current[type] = next_page;
      // setCurrentPage(update_current);

      // get current filterData
      var result = { ...filterData };
      result.offset = offset_posts[type];
      result.status = type;
      result.current_page = update_current;

      Reactotron.log(result);

      // load next page
      if(timelogs[type].length == 0 || next){
        loadTimelogs(result);
      }

    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 20;
      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    };

    const changeTab = (id) => {
      setIndex(id);
      // Reactotron.log(id);

      switch(id){
        case 0:
          loadPage("in_review")
        break;
        case 1:
          loadPage("accepted")
        break;
        case 2:
          loadPage("rejected")
        break;
      }
    }
    
    return (
        <View style={layout.container.general}>

          <Loading loading={loading} />

          <Head type="detail" title={'Semua Laporan Pekerjaan'} navigation={props.navigation} noBorder={true}
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
              onIndexChange={changeTab}
              initialLayout={{ width: Dimensions.get('window').width }}
              renderTabBar={renderTabBar}
          />
          
          <Modal
              style={{ ...styles.modal}}
              ref={menuModal}
              backdropPressToClose={true}
              swipeToClose={true}>
            <View style={{ ...layout.modal.body }}>
              <Text>a</Text>
            </View>
          </Modal>

          {_renderFilter()}

        </View>
    )
})
