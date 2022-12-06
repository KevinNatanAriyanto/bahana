import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, Picker, RefreshControl, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Status, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
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
import { clone } from 'lodash';
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-root-toast';
import { useNetInfo } from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from "reactotron-react-native";
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
    flexDirection: "row", flex: 1, flexWrap: "wrap"
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
  },
  dot: {
    width: 2, height: 2, borderRadius: 1, backgroundColor: "#5F5959", marginHorizontal: 5, alignSelf: "center"
  }
}

var localUserID = 0;

export interface FormListScreenProps extends NavigationScreenProps<{}> { }

export const FormListScreen: React.FunctionComponent<FormListScreenProps> = observer((props) => {
  const rootStore = useStores();
  const [loading, setLoading] = useState(false);
  const [user_id, setUser_id] = useState(-1);
  const [search_text, setSearch_text] = useState("");
  const [forms, setForms] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [load_limit, setLoad_limit] = useState(3);
  const [load_offset, setLoad_offset] = useState(0);
  const [load_stop, setLoad_stop] = useState(false);
  const [load_filter, setLoad_filter] = useState(false);

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
    props.navigation,
  ]);

  const [filterData, setfilterData] = useState({
    status_id: 0,
    start_date: "",
    end_date: "",
  });

  const [filterUI, setfilterUI] = useState({
    start_date_picker: false,
    end_date_picker: false,
  });

  const changeFilterValue = (variable, value, filterd = "filterData") => {
    eval("var tmp_data = " + filterd);
    var next_data = clone(tmp_data);

    if (typeof value == "string") {
      eval("next_data." + variable + " = '" + value + "'");
    } else {
      eval("next_data." + variable + " = " + value);
    }

    eval("set" + filterd + "(next_data)");
  };

  const confirmFilter = () => {
    _panelFilter.hide();

    setTimeout(function () {
      loadFormsFilter();
    }, 500);
  };

  let all_status = [
    {
      id: 0,
      status: "Semua status"
    },
    {
      id: 1,
      status: "Diterima Nahkoda"
    },
    {
      id: 2,
      status: "Diterima Admin"
    },
    {
      id: 3,
      status: "Diterima Manager"
    },
    {
      id: 4,
      status: "Ditolak Nahkoda"
    },
    {
      id: 5,
      status: "Ditolak Admin"
    },
    {
      id: 6,
      status: "Ditolak Manager"
    },
  ];

  const _renderFilter = () => {
    return (
      <SlidingUpPanel
        ref={c => _panelFilter = c}
        containerStyle={{ ...layout.bottom_notif.container }}
        backdropStyle={{ ...layout.bottom_notif.backdrop }}
        allowDragging={false}
        draggableRange={{
          top: deviceHeight - 20,
          bottom: 0
        }}
        friction={0.3}
      >
        <View style={{ ...layout.bottom_notif.wrapper }}>
          <Text style={layout.bottom_notif.title}>Filter</Text>
        </View>
        <ScrollView style={{ ...layout.bottom_notif.wrapper, marginBottom: 50 }}>

          <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Status</Text>

          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Picker
              selectedValue={filterData.status_id}
              onValueChange={(itemValue, itemIndex) => changeFilterValue("status_id", itemValue)}
              style={{ ...layout.dropdown.input }}
            >
              {all_status.map((item, i) => {
                return (
                  <Picker.Item key={"pc" + i} label={item.status} value={item.id} />
                )
              })}
            </Picker>
          </View>

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
  };

  const formatDate = (datenow) => {
    return moment(datenow).calendar(null, {
      sameElse: 'MMMM Do YYYY'
    })
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 140;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const loadForms = async (paramUserID, paramAction) => {
    if(loading === false && (load_stop === false || paramAction == "search")){
      if(load_filter === true){
        loadFormsFilter();
      }
      else{
        var param = {
          user_id: paramUserID,
          cari: search_text,
          limit: load_limit,
          offset: load_offset,
        }
  
        setLoading(true);
        var result = await rootStore.getListSPK(param);
        setLoading(false);
  
        if (result.kind == "ok" && result.data) {
          let tempArr = forms;
  
          result.data.spk.map((item, key) => {
            tempArr.push(item);
          });
  
          setForms(tempArr);
          setLoad_offset(load_offset + load_limit);
  
          if (result.data.spk.length < load_limit) {
            setLoad_stop(true);
          }
        }
      }
    }
  };

  const loadFormsRefresh = async () => {
    let tempOffset = 0;

    var param = {
      user_id: localUserID,
      cari: search_text,
      limit: load_limit,
      offset: tempOffset,
    }

    setLoading(true);
    var result = await rootStore.getListSPK(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      setForms(result.data.spk);
      setLoad_offset(0);
      setLoad_stop(false);
      setLoad_filter(false);
    }
  };

  const loadFormsFilter = async () => {
    let tempOffset = 0;
    let param = {};

    if(filterData.status_id == 0){
      param = {
        user_id: localUserID,
        cari: search_text,
        limit: load_limit,
        offset: tempOffset,
        start_date: filterData.start_date,
        end_date: filterData.end_date,
      }
    }
    else{
      param = {
        user_id: localUserID,
        cari: search_text,
        limit: load_limit,
        offset: tempOffset,
        start_date: filterData.start_date,
        end_date: filterData.end_date,
        status_pengajuan: all_status[filterData.status_id].status,
      }
    }

    if(load_filter === true){
      param.offset = load_offset;
    }

    setLoading(true);
    var result = await rootStore.getListSPK(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      if(load_filter === true){
        let tempArr = forms;
  
        result.data.spk.map((item, key) => {
          tempArr.push(item);
        });

        setForms(tempArr);
        setLoad_offset(load_offset + load_limit);

        if (result.data.spk.length < load_limit) {
          setLoad_stop(true);
        }
      }
      else{
        setForms(result.data.spk);
        setLoad_offset(load_limit);
        setLoad_stop(false);
        setLoad_filter(true);
      }
    }
  };

  const loadProfile = async () => {
    setLoading(true);
    var result = await rootStore.getCurrentProfile();
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      setUser_id(result.data.id);
      localUserID = result.data.id;
      loadForms(result.data.id, "load");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadFormsRefresh();
    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View style={layout.container.general}>
      <Loading loading={loading} />

      <Head type="detail"
        title={'Semua form SPK'}
        navigation={props.navigation}
        filterButton={true}
        filterButtonAction={() => {setLoad_filter(false); _panelFilter.show()}}
      />

      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            loadForms(user_id, "more");
          }
        }}
        style={layout.container.content_wtabbar}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
          <View style={{ ...styles.action.wrapper, ...styles.row }}>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
              <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
              <TextInput
                style={{ ...layout.textbox.input }}
                placeholder="Cari form..."
                value={search_text}
                onChangeText={values => setSearch_text(values)}
                onSubmitEditing={() => { loadForms(user_id, "search") }}
              />
            </View>

            <TouchableOpacity onPress={() => { loadForms(user_id, "search") }} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn }}>
              <Image source={require('@assets/ico_search3.png')} style={layout.button.icon} />
              <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Cari</Text>
            </TouchableOpacity>
          </View>

          {(forms.map((item, i) => {
            return (
              <TouchableOpacity key={"form" + i}
                onPress={() => navigateTo("form_detail", { user_id: user_id, form_id: item.id, onGoBack: onRefresh })}
                style={{ ...layout.list.absence_list }}
              >
                <View style={layout.container.row}>
                  <Status slug={item.status} />
                </View>

                <Text style={{ ...layout.typography.h3, ...styles.title }}>{item.keperluan}</Text>

                <View style={{ ...styles.row }}>
                  <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Diajukan oleh:</Text>
                  <Text style={{ ...layout.typography.body_smaller, textTransform: "capitalize" }}>{item.user_name}</Text>
                </View>

                <View style={{ ...styles.row, marginBottom: 0.027 * deviceWidth }}>
                  <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Tanggal Pengajuan:</Text>
                  <Text style={{ ...layout.typography.body_smaller, textTransform: "capitalize" }}>{formatDate(item.created_at)}</Text>
                </View>

                <Text
                  onPress={() => navigateTo("form_history", { form_id: item.id, onGoBack: onRefresh })}
                  style={{ ...layout.typography.body_smaller, color: "#381D5C", textDecorationLine: "underline" }}
                >Lihat histori form</Text>
              </TouchableOpacity>
            )
          }))}

        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigateTo('form_add', { user_id: user_id, onGoBack: onRefresh })}
        style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.floating_btn }}
      >
        <Image source={require('@assets/ico_contact_form.png')} style={layout.button.icon} />
        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>TAMBAH FORM</Text>
      </TouchableOpacity>

      {_renderFilter()}
    </View>
  )
})
