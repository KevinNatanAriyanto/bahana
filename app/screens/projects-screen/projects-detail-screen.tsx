import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, RefreshControl, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
import SlidingUpPanel from 'rn-sliding-up-panel';

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
  members: {
    wrapper: {
      flexDirection: "row"
    },
    avatar: {
      width: 40, height: 40, marginRight: 20, marginBottom: 10
    },
    info: {
      flex: 1
    },
    sub: {
      marginBottom: 10, color: "#BABABA"
    }
  }
}


export interface ProjectsDetailScreenProps extends NavigationScreenProps<{}> {
}

export const ProjectsDetailScreen: React.FunctionComponent<ProjectsDetailScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [project, setProject] = useState(null);
    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    // const netInfo = useNetInfo();

    useEffect( () => {
      loadDetailProject(props.navigation.state.params.id)
    }, []);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadDetailProject(props.navigation.state.params.id)
      setRefreshing(false);

    }, [refreshing]);


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

    const loadDetailProject = async (id) => {
      var param = {
        id: id
      }
      
      setLoading(true);
      var result = await rootStore.getDetailProject(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setProject(result.data)
      }
    }

    const deleteProject = async () => {
      _panel.hide();

      var param = {
        id: props.navigation.state.params.id
      }
      
      setLoading(true);
      var result = await rootStore.deleteProject(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        // Reactotron.log(result.data)
        Toast.show("Proyek berhasil dihapus");

        goBack();
        props.navigation.state.params.onBack();
      }
    }

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'detail', title: 'Detail' },
        // { key: 'members', title: 'Anggota' },
        { key: 'activity', title: 'Aktivitas Proyek' },
    ]);

    const DetailRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderDetail()}
      </View>
    );

    const MembersRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderMembers()}
      </View>
    );
    const ActivityRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderActivity()}
      </View>
    );

    const renderScene = SceneMap({
        detail: DetailRoute,
        // members: MembersRoute,
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

    const _renderMembers = () => {
      return(
        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={layout.container.content_wtabbar}
        >
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>
            <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, ...styles.members.wrapper }}>
              <Image style={styles.members.avatar} source={require("@assets/dummy_avatar.png")} />
              <View style={styles.members.info}>
                <Text style={layout.typography.h4}>John Doe</Text>
                <Text style={{ ...layout.typography.body_smaller, ...styles.members.sub }}>Supervisor Logistik</Text>

                <Button onPress={() => _panel_member.show()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.button.small, ...styles.members.btn }}>
                    <Icon name="ios-trash" style={{ ...layout.button.icon, ...layout.button.icon_outline }} size={20} />
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>HAPUS ANGGOTA</Text>
                </Button>
              </View>
            </View>
            <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, ...styles.members.wrapper }}>
              <Image style={styles.members.avatar} source={require("@assets/dummy_avatar.png")} />
              <View style={styles.members.info}>
                <Text style={layout.typography.h4}>John Doe</Text>
                <Text style={{ ...layout.typography.body_smaller, ...styles.members.sub }}>Supervisor Logistik</Text>

                <Button onPress={() => _panel_member.show()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.button.small, ...styles.members.btn }}>
                    <Icon name="ios-trash" style={{ ...layout.button.icon, ...layout.button.icon_outline }} size={20} />
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>HAPUS ANGGOTA</Text>
                </Button>
              </View>
            </View>
            <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, ...styles.members.wrapper }}>
              <Image style={styles.members.avatar} source={require("@assets/dummy_avatar.png")} />
              <View style={styles.members.info}>
                <Text style={layout.typography.h4}>John Doe</Text>
                <Text style={{ ...layout.typography.body_smaller, ...styles.members.sub }}>Supervisor Logistik</Text>

                <Button onPress={() => _panel_member.show()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.button.small, ...styles.members.btn }}>
                    <Icon name="ios-trash" style={{ ...layout.button.icon, ...layout.button.icon_outline }} size={20} />
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>HAPUS ANGGOTA</Text>
                </Button>
              </View>
            </View>

          </View>

        </ScrollView>
      )
    }

    const _renderActivity = () => {
      return(
        <View>
          <ScrollView 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={layout.container.content_wtabbar}
          >
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                  
                {(project.projectActivity.map((item,i) => {
                  return(
                    <View key={"activity"+i} style={layout.list_activity.wrapper}>
                      <View style={layout.list_activity.info}>
                        <View style={styles.row}>
                          <Text style={{ ...layout.typography.body }}>{item.activity}</Text>
                        </View>
                        <View style={{ ...styles.row, marginTop: 10 }}>
                          <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>{formatDate(item.date)}</Text>
                          <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>{formatTime(item.date)}</Text>
                        </View>
                      </View>
                    </View>
                  )
                }))}

              </View>
            </View>
          </ScrollView>
        </View>
      )
    }

    const _renderDetail = () => {
      return(
        <View>
          <ScrollView 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={layout.container.content_wtabbar}
          >
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>

              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Status slug={project.status} />
                <Text style={{ ...layout.typography.h3, ...styles.title }}>{project.project_name}</Text>

                {(project.deadline &&
                  <View style={styles.row}>
                    <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Deadline:</Text>
                    <Text style={{ ...layout.typography.body_smaller }}>{formatDate(project.deadline)}</Text>
                  </View>
                )}
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Tentang Proyek</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                {(project.projectAdminData &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Pembuat Proyek</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{project.projectAdminData.name}</Text>
                  </View>
                )}
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tanggal Dibuat</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{formatDate(project.created_at)}</Text>
                </View>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tanggal Mulai</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{formatDate(project.start_date)}</Text>
                </View>
                {(project.deadline &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Deadline</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{formatDate(project.deadline)}</Text>
                  </View>
                )}
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Deskripsi Proyek</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Text style={layout.typography.body}>{project.project_summary}</Text>
              </View>

            </View>

          </ScrollView>
          
        </View>
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
        <Head type="detail" title={'Detail Proyek'} navigation={props.navigation} noBorder={true} opsi={() => togglePopup() } />

        {(JSON.parse(rootStore.showCurrentUser("permissions")).edit_proyek != "0" &&
          <Animatable.View ref={handleViewRef} style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.header_option.container, zIndex: -1 }}>
            <TouchableOpacity onPress={() => navigateTo('form_projects', {type: "edit", project: project, onBack: onRefresh})} style={{ ...layout.header_option.wrapper }}>
              <Text style={layout.typography.body}>Edit Proyek</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => _panel.show()} style={{ ...layout.header_option.wrapper, marginBottom: 0 }}>
              <Text style={layout.typography.body}>Hapus</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        {(project &&
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={renderTabBar}
          />
        )}

        {/*(JSON.parse(rootStore.showCurrentUser("permissions")).edit_proyek != "0" &&
          <TouchableOpacity onPress={() => navigateTo('add_members')} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.floating_btn }}>
            <Image source={require('@assets/ico-user.png')} style={layout.button.icon} />
            <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Tambah Anggota</Text>
          </TouchableOpacity>
        )*/}

        {/* Delete Project */}
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
                <Text style={layout.bottom_notif.title}>Hapus Proyek</Text>
            </View>
            <View style={{ ...layout.bottom_notif.wrapper, ...layout.bottom_notif.row, marginBottom: 50 }}>
                <Icon name="ios-information-circle-outline" style={{ ...layout.bottom_notif.icon }} size={40} />
                <Text style={layout.bottom_notif.text}>Apakah anda yakin anda akan menghapus proyek ini?</Text>
            </View>
            <View style={{ ...layout.bottom_notif.row }}>
                <Button onPress={() => _panel.hide()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                </Button>
                <Button onPress={() => deleteProject()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                </Button>
            </View>
        </SlidingUpPanel>

      </View>
    )
})
