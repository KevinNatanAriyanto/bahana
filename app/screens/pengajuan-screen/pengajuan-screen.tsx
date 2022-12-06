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
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
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


export interface PengajuanScreenProps extends NavigationScreenProps<{}> {
}

export const PengajuanScreen: React.FunctionComponent<PengajuanScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [leaveType, setLeaveType] = useState([]);
    const menuModal = useRef(null);
    const [tujuanPengajuan, setTujuanPengajuan] = useState('diri');
    const [tipePengajuan, setTipePengajuan] = useState('');
    const [filterPengajuan, setFilterPengajuan] = useState('');
    const [filterAtasan, setFilterAtasan] = useState('atasan 2');
    const [tanggalAwal, setTanggalAwal] = useState('01-01-2020');
    const [listAssignee, setListAssignee] = useState([]);

    // get last date of the month
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const [tanggalAkhir, setTanggalAkhir] = useState(lastDay.getDate()+'-'+((lastDay.getMonth()+1 < 10) ? '0'+(lastDay.getMonth()+1) :lastDay.getMonth()+1 )+'-'+lastDay.getFullYear());

    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const [jabatan, setJabatan] = useState('');
    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {
      var js = JSON.parse(rootStore.showCurrentUser('data'))
      setJabatan(js.jabatan)

      loadLeaveType()
      loadListAssignee()
    }, []);

    useEffect( () => {
        // loadList()
      newLoadList()
    }, [tanggalAwal, tanggalAkhir, tujuanPengajuan, tipePengajuan, filterPengajuan, filterAtasan]);


    const openDateAwal = async () => {
        if(Platform.OS == "android"){
          try {
            const { action, year, month, day } = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              // Selected year, month (0-11), 
              var pickedDate = Helper.renderDateNum(day, month, year, true)

              setTanggalAwal(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

    const openDateAkhir = async () => {
        if(Platform.OS == "android"){
          try {
            const { action, year, month, day } = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              // Selected year, month (0-11), 
              var pickedDate = Helper.renderDateNum(day, month, year, true)

              setTanggalAkhir(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

    /*
    const loadList = async () => {
      // get new data of user profile
      // alert()
      var data ={};
      var getStartDate = tanggalAwal.split('-')
      var startDate = getStartDate[2]+'-'+getStartDate[1]+'-'+getStartDate[0]
      var getEndDate = tanggalAkhir.split('-')
      var EndDate = getEndDate[2]+'-'+getEndDate[1]+'-'+getEndDate[0]
      var arrayAssignee = []
      listAssignee.map((item,i)=>{
        arrayAssignee.push(item.id)
      })
      data.start_date = startDate;
      data.end_date = EndDate;
      data.tujuan_pengajuan = (tujuanPengajuan == 'diri') ? [rootStore.getCurrentUser().id] : arrayAssignee;
      data.tipe_pengajuan = tipePengajuan;
      Reactotron.log('data wildan')
      Reactotron.log(data)
      setLoading(true);
      var result = await rootStore.getLeaveList(data);
      setLoading(false);

      // Reactotron.log(result.data);

      if(result.kind == "ok" && result.data){
        Reactotron.log(result.data)
        setList(result.data)
        // alert('a')
        // rootStore.assignCurrentUser(result.data);
      }
    }
    */

    const newLoadList = async () => {

      var data ={};
      var getStartDate = tanggalAwal.split('-')
      var startDate = getStartDate[2]+'-'+getStartDate[1]+'-'+getStartDate[0]
      var getEndDate = tanggalAkhir.split('-')
      var EndDate = getEndDate[2]+'-'+getEndDate[1]+'-'+getEndDate[0]
      var arrayAssignee = []
      listAssignee.map((item,i)=>{
        arrayAssignee.push(item.id)
      })
      data.start_date = startDate;
      data.end_date = EndDate;
      data.user_id = (tujuanPengajuan == 'diri') ? rootStore.getCurrentUser().id : 'bawahan';
      data.leave_type_id = tipePengajuan;
      data.masking_status = filterPengajuan;
      data.limit = 200;

      if(filterPengajuan === "in progress"){
        data.waiting_for = filterAtasan;
      }
      
      Reactotron.log(data)

      setLoading(true);
      var result = await rootStore.getLeaveListNew(data);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setList(result.data.leave)
      }
    }

    const loadListAssignee = async () => {
      var data ={};
      setLoading(true);
      var result = await rootStore.getAssignee(data);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setListAssignee(result.data.assignee)
      }
    }

    const loadLeaveType = async () => {
      // get new data of user profile
      setLoading(true);
        var result = await rootStore.getLeaveType();
        setLoading(false);

        if(result.kind == "ok" && result.data){
          setTipePengajuan(result.data[0].id)

          setLeaveType(result.data)
        }
    }

    const _renderList = () => {
        var arr = [];

        // Reactotron.log(list);

        list.map((item,i) => {
          var date_in = new Date(item.leave_date)

          arr.push(
            <TouchableOpacity onPress={() => navigateTo("pengajuan_detail",{data:item})} style={{...layout.list.absence_list}}>
                <View style={layout.container.row}>
                  <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>{item.masking_status}</Text>
                </View>
                <Text style={{ ...layout.typography.h3, ...styles.title }}>{item.reason}</Text>
                <Text style={{ ...layout.typography.body_smaller }}>{date_in.getDate()+' '+(Helper.getMonth(date_in.getMonth()))+' '+date_in.getFullYear()}</Text>

                {(!!item.user && !!item.user.name &&
                  <Text style={{ ...layout.typography.body_smaller, marginTop: 5, color: "#c0c0c0" }}>Oleh: {item.user.name}</Text>
                )}
            </TouchableOpacity>
          )
        });

        return arr;
      }

    const set_tujuan_pengajuan = (params) =>{
      // alert(params)
      setTujuanPengajuan(params)
    }
    const set_tipe_pengajuan = (params) =>{
      // alert(params)
      setTipePengajuan(params)
    }

    const set_filter_pengajuan = (params) =>{
      // alert(params)
      setFilterPengajuan(params)
    }
    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />

        <Head type="detail" title={'Semua Status Pengajuan'} navigation={props.navigation} />

        <ScrollView style={layout.container.content_wtabbar}>
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

            <View style={{...layout.list.container, marginBottom: 20 }}>
                <TouchableOpacity style={{ flexDirection:'row' }} onPress={()=>{openDateAwal()}}>
                    <View style={{...layout.list.center}}>
                        <Image source={require('@assets/ic_calendar.png')} style={layout.list.image_calendar} />
                    </View>
                    <Text style={{...layout.list.date_text}}>{tanggalAwal}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <View style={{...layout.list.separator_line_grey}}/>
                </View>
                <TouchableOpacity style={{ ...layout.list.akhir_tgl }} onPress={()=>{openDateAkhir()}}>
                    <View style={{...layout.list.center}}>
                        <Image source={require('@assets/ic_calendar.png')} style={layout.list.image_calendar} />
                    </View>
                    <Text style={{...layout.list.date_text}}>{tanggalAkhir}</Text>
                </TouchableOpacity>
            </View>
            {(jabatan != 'Sekretaris') &&
              <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginBottom: 20 }}>
                <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={tujuanPengajuan}
                    onValueChange={(itemValue, itemIndex) => set_tujuan_pengajuan(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Diri sendiri" value="diri" />
                    <Picker.Item label="Bawahan" value="bawahan" />
                  </Picker>
              </View>
            }
            
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginBottom: 20 }}>
                <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={tipePengajuan}
                    onValueChange={(itemValue, itemIndex) => set_tipe_pengajuan(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    
                    {leaveType.map((item,i)=>{
                    return (<Picker.Item label={item.type_name} value={item.id} />)
                  })}
                </Picker>
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginBottom: 20 }}>
                <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={filterPengajuan}
                    onValueChange={(itemValue, itemIndex) => set_filter_pengajuan(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Semua" value="" />
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="In Progress" value="in progress" />
                    <Picker.Item label="Done" value="done" />
                    <Picker.Item label="Rejected" value="rejected" />
                </Picker>
            </View>

            {(filterPengajuan === "in progress") &&
              <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginBottom: 20 }}>
                  <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                  <Picker
                      selectedValue={filterAtasan}
                      onValueChange={(itemValue, itemIndex) => setFilterAtasan(itemValue)}
                      style={{ ...layout.dropdown.input }}
                  >
                      <Picker.Item label="Atasan 2" value="atasan 2" />
                      <Picker.Item label="HRD" value="hrd" />
                  </Picker>
              </View>
            }

            {_renderList()}
            {/*<TouchableOpacity onPress={() => navigateTo("pengajuan_detail")} style={{...layout.list.absence_list}}>
                <View style={layout.container.row}>
                  <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Disetujui Supervisor</Text>
                </View>
                <Text style={{ ...layout.typography.h3, ...styles.title }}>Izin Sakit Perut</Text>
                <Text style={{ ...layout.typography.body_smaller }}>13 April 2020</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("pengajuan_detail")} style={{...layout.list.absence_list}}>
                <View style={layout.container.row}>
                  <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Disetujui Supervisor</Text>
                </View>
                <Text style={{ ...layout.typography.h3, ...styles.title }}>Izin Sakit Perut</Text>
                <Text style={{ ...layout.typography.body_smaller }}>13 April 2020</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("pengajuan_detail")} style={{...layout.list.absence_list}}>
                <View style={layout.container.row}>
                  <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Disetujui Supervisor</Text>
                </View>
                <Text style={{ ...layout.typography.h3, ...styles.title }}>Izin Sakit Perut</Text>
                <Text style={{ ...layout.typography.body_smaller }}>13 April 2020</Text>
            </TouchableOpacity> */}
            
          </View>

        </ScrollView>
      </View>
    )
})
