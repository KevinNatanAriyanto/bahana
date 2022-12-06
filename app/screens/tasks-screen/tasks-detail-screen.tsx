import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, Linking, RefreshControl } from "react-native"
import { Text, Screen, Button, Checkbox, Status, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
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
import Reactotron from 'reactotron-react-native';
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-root-toast';
import { useNetInfo } from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';
import DocumentPicker from 'react-native-document-picker';

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
  floating_btn: {
    position: "absolute", bottom: 50, alignSelf: "center"
  },
  activity_person: {
    fontWeight: "bold", marginRight: 3,
  },
  report_list: {
    width: deviceWidth * 0.8,
    borderRadius: 10,
    elevation: 1,
    padding: 0.055 * deviceWidth,
    marginBottom: 0.055 * deviceWidth,
    backgroundColor: "#fff"
  },
  title_list: {
    fontSize: 16,
    color: "#5F5959",
    fontWeight: "bold",
    marginBottom: 10
  },
  description_list: {
    fontSize: 12,
    color: "#5F5959",
    // fontWeight: "bold",
  }
}


export interface TasksDetailScreenProps extends NavigationScreenProps<{}> {
}

export const TasksDetailScreen: React.FunctionComponent<TasksDetailScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pilihan, setPilihan] = useState(1);
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState(null);
  const [commentTitle, setCommentTitle] = useState("");
  const [fileComment, setFileComment] = useState(null);
  const [pageID, setPageID] = useState(-1);
  const menuModal = useRef(null);
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
    props.navigation,
  ])

  // const netInfo = useNetInfo();

  useEffect(() => {
    loadDetailTask(props.navigation.state.params.id);
    loadComments(props.navigation.state.params.id);
    setPageID(props.navigation.state.params.id);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadDetailTask(props.navigation.state.params.id)
    setRefreshing(false);

  }, [refreshing]);

  const loadDetailTask = async (id) => {
    var param = {
      id: id
    }

    setLoading(true);
    var result = await rootStore.getDetailTask(param);
    setLoading(false);

    // get from storage when offline
    var isOffline = false;
    if (result.kind != "ok") {
      result.data = {};
      result.kind = "ok"
      isOffline = true;

      result.data = rootStore.findTaskById(id);
      result.data = (result.data.length > 0) ? result.data[0] : null;
      // result.data.taskboard_columns = result.data.taskboardColumns;
      result.data.timelog = rootStore.findTimelogByTaskId(id);

      console.log('check task')
      console.log(result.data)
      // console.log(rootStore.findTimelogByTaskId(props.navigation.state.params.id))
    }

    if (result.kind == "ok" && result.data) {
      // Reactotron.log(result.data)
      setTask(result.data)
      console.log(result.data.history)
    }
  }

  const loadComments = async (id) => {
    var param = {
      task_id: id
    }

    setLoading(true);
    var result = await rootStore.getComments(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      setComment(result.data.data.chat.reverse());
    }
  }

  const giveComments = async (id) => {
    if (commentTitle === "") {
      Toast.show("Komentar tidak boleh kosong");
      return;
    }

    var param = new FormData();
    param.append("task_id", id);
    param.append("msg", commentTitle);

    if (fileComment != null) {
      param.append("files[0]", {
        uri: fileComment.uri,
        name: 'file',
        type: (fileComment.type) ? fileComment.type : "",
      });
    }

    setLoading(true);
    var result = await rootStore.sendComments(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      deleteFileComment();
      loadComments(pageID);
      setCommentTitle("");
    }
  }

  const startWorking = async () => {
    var param = {
      task_id: props.navigation.state.params.id
    }

    setLoading(true);
    var result = await rootStore.startTask(param);
    setLoading(false);

    // something from storage when offline
    var isOffline = false;
    if (result.kind != "ok") {
      result.data = {};
      result.kind = "ok"
      isOffline = true;

      // update existing record
      var ntask = rootStore.findTaskById(param.task_id);
      ntask = (ntask.length > 0) ? ntask[0] : null;
      if (ntask) {
        ntask.startWorking()
      }

      // add new timelog record
      var rand_id = new Date().getTime();
      rootStore.pushData('timelogs', {
        id: rand_id,
        task_id: param.task_id,
        start_time: moment().format(),
        status: 'active'
      }, false)

      // add action to queue
      rootStore.pushData('my_queues', {
        related_id: rand_id,
        type: 'start-task',
        action: 'startTask',
        will_update: "tasks",
        description: "Mulai bekerja pada tugas",
        data: JSON.stringify(param)
      });
    }

    if (result.kind == "ok" && result.data) {
      // Reactotron.log(result.data)
      Toast.show("Anda mulai bekerja pada tugas ini");
      goBack();
      props.navigation.state.params.onBack();
    }
  }

  /*
  const stopWorking = async () => {
    var param = {
      task_id: props.navigation.state.params.id
    }
    
    setLoading(true);
    var result = await rootStore.startTask(param);
    setLoading(false);

    if(result.kind == "ok" && result.data){
      // Reactotron.log(result.data)
      Toast.show("Anda berhenti bekerja pada tugas ini");
      goBack();
      props.navigation.state.params.onBack();
    }
  }
  */

  const pickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      Reactotron.log('results')
      Reactotron.log(results)
      setFileComment(results);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  const deleteFileComment = () => {
    // alert('s')
    setFileComment(null)
  }

  const deleteTask = async () => {
    _panel.hide();

    var param = {
      task_id: props.navigation.state.params.id
    }

    setLoading(true);
    var result = await rootStore.deleteTask(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      // Reactotron.log(result.data)
      Toast.show("Tugas berhasil dihapus");
      goBack();
      props.navigation.state.params.onBack();
    }
  }

  const formatDate = (datenow) => {
    // return moment(datenow).calendar(null, {
    //   sameElse: 'MMMM Do YYYY'
    // })

    return moment(datenow).format("MMM Do, YYYY");
  }
  const formatTime = (datenow) => {
    // return moment(datenow).calendar(null, {
    //   sameElse: 'h:mm:ss a'
    // })

    return moment(datenow).format("h:mm:ss a");
  }

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'detail', title: 'Detail' },
    { key: 'timelog', title: 'Laporan Tugas' },
    { key: 'activity', title: 'History Tugas' },
  ]);

  const DetailRoute = () => (
    <View>
      {_renderDetail()}
    </View>
  );

  const ActivityRoute = () => (
    <View style={{ flex: 1 }}>
      {_renderActivity()}
    </View>
  );
  const TimelogRoute = () => (
    <View style={{ flex: 1 }}>
      {_renderTimelog()}
    </View>
  );

  const renderScene = SceneMap({
    detail: DetailRoute,
    timelog: TimelogRoute,
    activity: ActivityRoute
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ ...layout.tabs.indicator }}
      style={{ ...layout.tabs.container }}
      labelStyle={{ ...layout.tabs.title }}
      activeColor={"#381D5C"}
      inactiveColor={"#BABABA"}
    />
  );

  const _renderReport = (datas) => {
    var arr = [];

    if (datas) {
      datas.map((item, i) => {
        arr.push(
          <TouchableOpacity key={item.status + item.id} style={{ ...styles.report_list }} onPress={() => navigateTo("work_report_detail", { id: item.id, onBack: onRefresh })}>
            <Text style={styles.title_list}>{(item.user) ? item.user.name : "Saya"}</Text>
            <Text style={styles.description_list}>Tanggal Kerja : {formatDate(item.start_time) + " " + formatTime(item.start_time)}</Text>
            {(item.end_time &&
              <Text style={styles.description_list}>Tanggal Selesai : {formatDate(item.end_time) + " " + formatTime(item.end_time)}</Text>
            )}
          </TouchableOpacity>
        )
      });
    } else {
      arr = null;
    }

    return arr;
  }

  const _renderTimelog = () => {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={layout.container.content_wtabbar}
        >

          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>

            {_renderReport(task.timelog)}

          </View>
        </ScrollView>
      </View>
    )
  }

  const _renderActivity = () => {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={layout.container.content_wtabbar}
        >

          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>
            <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>

              {(task.history && task.history.length > 1 &&
                <View style={{ ...layout.list_activity.line }} />
              )}

              {task.history && task.history.map((item, i) => {

                return (
                  <View key={"activity" + i} style={{ ...layout.list_activity.wrapper, backgroundColor: "#fff"}}>
                    {/*<Image style={layout.list_activity.avatar} source={{ uri: item.user.image_url }} />*/}
                    <View style={layout.list_activity.info}>
                      <View style={styles.row}>
                        {/*<Text style={{ ...styles.activity_person }}>{item.user.name}</Text>*/}
                        <Text style={{ ...layout.typography.body }}>{item.activity_log}</Text>
                      </View>
                      <View style={{ ...styles.row, marginTop: 10 }}>
                        <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>{formatDate(item.date_time)}</Text>
                        <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>{formatTime(item.date_time)}</Text>
                      </View>
                    </View>
                  </View>
                )
              })}

            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  const _renderDetail = () => {
    return (
      <View />
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

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/*
          <Head type="detail" title={'Detail Tugas'} navigation={props.navigation} noBorder={true} opsi={() => togglePopup() } />
          */}

        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_task != "0" &&
          <Head type="detail" title={'Detail Tugas'} navigation={props.navigation} noBorder={true} opsi={() => togglePopup()} />
        )}

        {(JSON.parse(rootStore.showCurrentUser("permissions")).manage_task == "0" &&
          <Head type="detail" title={'Detail Tugas'} navigation={props.navigation} noBorder={true} />
        )}

        <Animatable.View ref={handleViewRef} style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.header_option.container }}>
          <TouchableOpacity onPress={() => navigateTo('form_tasks', { type: "edit", id: task.id, task: task, onBack: onRefresh })} style={{ ...layout.header_option.wrapper }}>
            <Text style={layout.typography.body}>Edit Tugas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _panel.show()} style={{ ...layout.header_option.wrapper, marginBottom: 0 }}>
            <Text style={layout.typography.body}>Hapus</Text>
          </TouchableOpacity>
        </Animatable.View>

        {(task &&
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={renderTabBar}
            swipeEnabled={false}
          />
        )}

        {(index === 0 && task != null && comment != null) &&
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{
              marginTop: (deviceHeight * -1) + 80
            }}
          >
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>

              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Status slug={task.taskboard_columns.slug} />
                <Text style={{ ...layout.typography.h3, ...styles.title }}>{task.heading}</Text>

                <View style={styles.row}>
                  <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Tanggal:</Text>
                  <Text style={{ ...layout.typography.body_smaller }}>{formatDate(task.created_at)}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Deadline:</Text>
                  <Text style={{ ...layout.typography.body_smaller }}>{formatDate(task.due_date)}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Untuk:</Text>
                  <Text style={{ ...layout.typography.body_smaller }}>{task.assignee_user.name}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Dari:</Text>
                  <Text style={{ ...layout.typography.body_smaller }}>{task.create_by.name}</Text>
                </View>
              </View>

              {(task.is_requires_gps == 1 &&
                <View style={{ ...layout.alert.wrapper, ...layout.alert.info_alt }}>
                  <Text style={{ ...layout.alert.text, ...layout.alert.text_info_alt }}>Tugas ini mengharuskan anda untuk mengaktifkan GPS. </Text>
                </View>
              )}

              {(task.is_requires_camera == 1 &&
                <View style={{ ...layout.alert.wrapper, ...layout.alert.info_alt }}>
                  <Text style={{ ...layout.alert.text, ...layout.alert.text_info_alt }}>Tugas ini mengharuskan anda untuk mengaktifkan kamera. </Text>
                </View>
              )}

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Tentang Tugas</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Untuk</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{(task.users[0]) ? task.users[0].name : "Belum ada"}</Text>
                </View>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Pemberi Tugas</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{task.create_by.name}</Text>
                </View>

                {(task.atasan_1 &&
                  (task.atasan_1.name &&
                    <View style={{ ...styles.row, ...layout.list_row.container }}>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Direview Oleh</Text>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{task.atasan_1.name}</Text>
                    </View>
                  )
                )}

                {(task.project &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Proyek</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{task.project.project_name}</Text>
                  </View>
                )}

                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tanggal Mulai</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{formatDate(task.start_date)}</Text>
                </View>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Deadline</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{formatDate(task.due_date)}</Text>
                </View>
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Deskripsi Tugas</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Text style={layout.typography.body}>{task.description}</Text>
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Dokumen Pendukung</Text>
              <View style={{ ...layout.file_field.container, marginTop: 0, backgroundColor: "white" }}>

                {task.files.map((item, i) => {
                  return (
                    <View key={"file" + i} style={{ ...layout.file_field.container_inside }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('@assets/doc.png')} style={{ ...layout.file_field.image_doc }} />
                        <View style={{ marginLeft: 0.027 * deviceWidth }}>
                          <Text style={{ ...layout.file_field.namefile }}>{item.filename}</Text>
                        </View>
                      </View>
                      <View style={{ ...layout.file_field.button_group }}>
                        {/*<Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />*/}
                        <TouchableOpacity onPress={() => Linking.openURL(item.file_url)}>
                          <Image source={require('@assets/ic_download.png')} style={{ ...layout.file_field.image_ic_download }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}

                {(task.files.length == 0 &&
                  <Text style={layout.typography.body}>Tidak ada</Text>
                )}

              </View>

              {(!task.time_log_active && task.users && task.users[0].id == rootStore.getCurrentUser().id &&
                <Button onPress={() => startWorking()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginVertical: 50 }}>
                  <Image source={require('@assets/ico-power.png')} style={layout.button.icon} />
                  <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>MULAI BEKERJA</Text>
                </Button>
              )}

              {(task.time_log_active && task.users && task.users[0].id == rootStore.getCurrentUser().id &&
                <Button
                  // onPress={() => stopWorking()} 
                  onPress={() => navigateTo("report_tasks", { task: task, onBack: props.navigation.state.params.onBack })}
                  style={{ ...layout.button.primary, ...layout.button.wrapper, marginVertical: 50 }}>
                  <Image source={require('@assets/ico-power.png')} style={layout.button.icon} />
                  <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>BERHENTI BEKERJA</Text>
                </Button>
              )}

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Komentar</Text>
              <View style={{ ...layout.file_field.container, marginTop: 0, backgroundColor: "white" }}>
                <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Tambah Komentar</Text>

                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <TextInput
                    style={{ ...layout.textbox.input }}
                    placeholder="Tulis komentar..."
                    value={commentTitle}
                    onChangeText={setCommentTitle}
                  />
                </View>

                <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Lampirkan Dokumen</Text>

                {(fileComment) &&
                  <View style={{ ...layout.file_field.container_inside, marginBottom: 20, backgroundColor: "white" }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('@assets/doc.png')} style={{ ...layout.file_field.image_doc }} />
                      <View style={{ marginLeft: 0.027 * deviceWidth }}>
                        <Text style={{ ...layout.file_field.namefile }}>{(fileComment.name) ? fileComment.name : fileComment.filename}</Text>
                        <Text style={{ ...layout.file_field.sizefile }}>210 kb</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ ...layout.file_field.button_group }} onPress={deleteFileComment}>
                      <Image source={require('@assets/ic_delete.png')} style={{ ...layout.file_field.image_ic_delete }} />
                    </TouchableOpacity>
                  </View>
                }

                {(fileComment == null) &&
                  <TouchableOpacity
                    onPress={() => pickDocument()}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                      marginBottom: 20,
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
                      text={"Tambah Dokumen"}
                    />
                  </TouchableOpacity>
                }

                <Button onPress={() => giveComments(pageID)} style={{ ...layout.button.primary, ...layout.button.wrapper }}>
                  <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>KIRIM KOMENTAR</Text>
                </Button>
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Semua Komentar</Text>
              <View style={{ ...layout.file_field.container, marginTop: 0, backgroundColor: "white" }}>
                {comment.map((item, i) => {
                  return (
                    <View key={"comment" + i} style={{

                    }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#5F5959",
                            fontWeight: "bold",
                          }}
                          text={item.user.name}
                        />

                        <Text
                          style={{
                            fontSize: 12,
                            color: "#BABABA",
                          }}
                          text={moment.parseZone(item.created_at).format("MMM Do, YYYY HH:mm")}
                        />
                      </View>

                      <Text
                        style={{
                          fontSize: 14,
                          color: "#5F5959",
                          marginVertical: 10,
                        }}
                        text={item.msg}
                      />

                      {(item.files.length > 0) &&
                        <TouchableOpacity
                          onPress={() => Linking.openURL(item.files[0].full_url_file)}
                          style={{ ...layout.file_field.container_inside, marginBottom: 20, backgroundColor: "white" }}
                        >
                          <View style={{ flexDirection: 'row' }}>
                            <Image source={require('@assets/doc.png')} style={{ ...layout.file_field.image_doc }} />
                            <View style={{ marginLeft: 0.027 * deviceWidth }}>
                              <Text style={{ ...layout.file_field.namefile }}>{(item.files[0].name) ? item.files[0].name : item.files[0].filename}</Text>
                              <Text style={{ ...layout.file_field.sizefile }}>210 kb</Text>
                            </View>
                          </View>
                          {/* <TouchableOpacity style={{ ...layout.file_field.button_group }} onPress={deleteFileNotes}>
                            <Image source={require('@assets/ic_delete.png')} style={{ ...layout.file_field.image_ic_delete }} />
                          </TouchableOpacity> */}
                        </TouchableOpacity>
                      }

                      {(i !== comment.length - 1) &&
                        <View
                          style={{
                            height: 2,
                            backgroundColor: "#5F5959",
                            marginBottom: 20,
                          }}
                        />
                      }
                    </View>
                  )
                })}
              </View>
            </View>
          </ScrollView>
        }

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
            <Text style={layout.bottom_notif.text}>Apakah anda yakin anda akan menghapus tugas ini?</Text>
          </View>
          <View style={{ ...layout.bottom_notif.row }}>
            <Button onPress={() => _panel.hide()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}>
              <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
            </Button>
            <Button onPress={() => deleteTask()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
              <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
            </Button>
          </View>
        </SlidingUpPanel>
      </ScrollView>
    </View>
  )
})
