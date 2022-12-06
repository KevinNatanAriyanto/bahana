import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
import { CONFIG } from "@utils/config"
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
    flexDirection: "row", flex: 1, flexWrap: "wrap"
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
  dot: {
    width: 2, height: 2, borderRadius: 1, backgroundColor: "#5F5959", marginHorizontal: 5, alignSelf: "center"
  },
  wrap: {
    marginRight: 10,
    position: "relative",
    maxWidth: deviceWidth/5
  },
  innerWrap: {
    alignSelf: "center", flex: 1, flexDirection: "row"
  },
  round: {
    backgroundColor: "white",
    borderRadius: 100,
    borderColor: "black",
    borderWidth: 1,
    width: 50,
    height: 50,
    marginBottom: 10
  },
  bar: {
    backgroundColor: "black",
    marginRight: -5,
    width: deviceWidth,
    height: 5,
    position: "absolute",
    top: 20
  },
  txt_person: {
    fontWeight: "bold", marginRight: 3, fontSize: 14, textAlign: "left"
  },
  txt_status: {
    ...layout.typography.body, fontSize: 12
  }
}


export interface PengajuanDetailScreenProps extends NavigationScreenProps<{}> {
}

export const PengajuanDetailScreen: React.FunctionComponent<PengajuanDetailScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [alasanTolak, setAlasanTolak] = useState('');
    const [kategoriCuti, setKategoriCuti] = useState('');
    const [activity, setActivity] = useState([]);
    const [biaya, setBiaya] = useState('');
    const [detail, setDetail] = useState({
      status : '',
      reason_title : '',
      date : '',
      created_by:'',
      acc_by:'',
      created_at:'',
      leave_date:'',
      reason:'',
      description:'',
      can_approve:false,
      can_done:false,
      can_ajukan_akomodasi:false,
      can_laporkan_pengeluaran:false,
      sekretaris_approve:false,
      child:{}
    });
    const menuModal = useRef(null);
    const menuModalBiaya = useRef(null);
    const menuModalDone = useRef(null);
    const [fileSekretaris, setFileSekretaris] = useState(null);
    const [description, setDescription] = useState('');
    const [statusLeave, setStatusLeave] = useState(null);
    
    // const [statusLeave, setStatusLeave] = useState({
    //   atasan_1: {
    //     name: "Atasan 1",
    //     status: "waiting_approval",
    //   },
    //   atasan_2: {
    //     name: "Atasan 2",
    //     status: "waiting_approval",
    //   },
    //   atasan_3: {
    //     name: "Atasan 3",
    //     status: "waiting_approval",
    //   },
    //   hrd: {
    //     name: "HRD",
    //     status: "waiting_approval",
    //   },
    // });

    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    // const netInfo = useNetInfo();

    useEffect( () => {
      loadDetail(props.navigation.state.params.data.id)
      loadStatus(props.navigation.state.params.data.id)
    }, []);

    const loadStatus = async (id) => {
      setLoading(true);

      var data ={
        leave_id : id,
      };
      var result = await rootStore.getLeaveStatus(data);

      setLoading(false);

      if(result.kind == "ok" && result.data){
        Reactotron.log('getLeaveStatus')
        Reactotron.log(result.data)

        let item = result.data;
        let tempObj = {
          atasan_1: {
            name: (item.atasan_1 == false) ? "" : item.atasan_1.name,
            status: (item.atasan_1.status == "approved") ? "Menyetujui" :
            (item.atasan_1.status == "rejected") ? "Menolak" : 
            (item.atasan_1.status == "mengetahui") ? "Mengetahui" : "Menunggu",
          },
          atasan_2: {
            name: (item.atasan_2 == false) ? "" : item.atasan_2.name,
            status: (item.atasan_2 == false) ? "Mengetahui" :
            (item.atasan_2.status == "approved") ? "Menyetujui" :
            (item.atasan_2.status == "mengetahui") ? "Mengetahui" : "Menunggu",
          },
          atasan_3: {
            name: (item.atasan_3 == false) ? "" : item.atasan_3.name,
            status: (item.atasan_3 == false) ? "Mengetahui" :
            (item.atasan_3.status == "approved") ? "Menyetujui" :
            (item.atasan_3.status == "rejected") ? "Menolak" : 
            (item.atasan_3.status == "mengetahui") ? "Mengetahui" : "Menunggu",
          },
          hrd: {
            name: (item.hrd == false || item.hrd.name == null) ? "" : item.hrd.name,
            status: (item.hrd == false) ? "Mengetahui" :
            (item.hrd.status == "approved") ? "Menyetujui" :
            (item.hrd.status == "rejected") ? "Menolak" : 
            (item.hrd.status == "mengetahui") ? "Mengetahui" : "Menunggu",
          },
        };
        
        setStatusLeave(tempObj);
      }
    }

    const loadDetail = async (id) => {
      // get new data of user profile
      setLoading(true);
      var data ={
        leave_id : id 
      };
      var result = await rootStore.getLeaveDetail(data);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        Reactotron.log('getLeaveDetail')
        Reactotron.log(result.data)
        var item = result.data.data 
        // Reactotron.log(item.created_at)
        var created_at = Helper.convertDateFromUTCWithDay(item.created_at)
        var leave_date = Helper.convertDateFromUTCWithDay(item.leave_date)
        var leave_date_end = Helper.convertDateFromUTCWithDay(item.leave_date_end)

        var ajukanAkomodasi = 0
        if(item.child){
          if(item.child.is_approved_hrd){
            if(item.child.is_approved_hrd == 1){
              ajukanAkomodasi++
            }
            if(item.child.butuh_akomodasi == 0){
              ajukanAkomodasi++
            }
          }
        }
        
        var canApprove = false
        var isApprovedHrd = true
        if(item.child){
          if(item.child.is_approved_hrd == 1){
            isApprovedHrd = false
          }
        }
        // if(((item.can_approve)||(item.need_approval_hrd))&&(isApprovedHrd)){
        //   canApprove = true
        // }
        var alasan = ''
        var kategori_cuti = ''

        if(item.child.alasan_ijin){
          alasan = item.child.alasan_ijin.replace("-", " ")
          kategori_cuti = 'ijin'
        }else if(item.child.kategori_cuti){
          alasan = item.reason
          kategori_cuti = 'cuti'
        }else if(item.child.destination){
          alasan = item.child.destination.replace("-", " ")
          kategori_cuti = 'dinas_sementara'
        }else if(item.child.alasan){
          alasan = item.child.alasan.replace("-", " ")
          kategori_cuti = 'dinas_luar_kota'
        }
        var sekretarisApprove = false
        if((item.is_sekretaris)&&(item.is_sekretaris_can_add_accomodation)){
          
          if(item.child){
            if(item.child.butuh_akomodasi){
              if(item.child.butuh_akomodasi == 1){
                if(item.child.is_done != 1){
                  sekretarisApprove = true
                }
              }
            }
          }
        }
        var data = {
          status : item.masking_status,
          formated_status: item.formated_status,
          reason_title : item.type_name,
          tipe_cuti : (item.child && item.child.tipe_cuti) ? item.child.tipe_cuti : "",
          date : created_at,
          created_by:item.requested_by,
          acc_by:(item.approved_by_name.length > 0) ? item.approved_by_name[item.approved_by_name.length-1] : '',
          created_at:created_at,
          leave_date:leave_date,
          leave_date_end:leave_date_end,
          // reason:(item.child)? (item.child.alasan_ijin) ? item.child.alasan_ijin.replace("-", " "):'':'',
          budget_keuangan:item.budget_keuangan,
          reason:alasan,
          description:item.reason,
          can_approve:item.can_approve,
          // can_approve:(item.user_id != rootStore.currentUser.id) ? canApprove : false,
          can_done:(item.user_id == rootStore.currentUser.id) ? (item.dinas_mulai) ? item.dinas_mulai : false : false,
          can_ajukan_akomodasi:(item.user_id == rootStore.currentUser.id) && (ajukanAkomodasi == 2)? true : false, //Ini seharusnya hrd, saat skrg ini bisa semua
          can_laporkan_pengeluaran:(item.user_id == rootStore.currentUser.id) ? (item.dinas_mulai) ? (item.type_name == 'Dinas Luar Kota')?true :false : false : false,
          // can_approve:true,
          sekretaris_approve:sekretarisApprove,
          child:(item.child) ? item.child : {}
        }
        // if(data.){
        //   data.can_ajukan_akomodasi =   
        // }

        console.log(data);
        
        setDetail(data)
        setActivity(result.data.activity)
        setKategoriCuti(kategori_cuti)
        // Reactotron.log('data convertDateFromUTC')
        // Reactotron.log(data)
      }
    }

    const terima = async() => {
      // get new data of user profile
      setLoading(true);
      var data ={
        leave_id : props.navigation.state.params.data.id 
      };
      var result = await rootStore.approveLeave(data);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        alert('Sukses diterima')
        props.navigation.goBack(null)
      }
    }

    const tolak = async() => {
      // get new data of user profile
      setLoading(true);
      var data ={
        leave_id : props.navigation.state.params.data.id,
        reason : alasanTolak
      };
      var result = await rootStore.rejectLeave(data);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        alert('Sukses ditolak')
        props.navigation.goBack(null)
      }
    }

    const simpan = async() => {
      // get new data of user profile
      setLoading(true);
      var data ={
        leave_id : props.navigation.state.params.data.id 
      };
      var result = await rootStore.akomodasi(data);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        alert('Tersimpan')
        closeModalBiaya()
        // props.navigation.goBack(null)
      }
    }

    const simpanDone = async() => {
      // get new data of user profile
      setLoading(true);
      var data ={
        leave_id : props.navigation.state.params.data.id 
      };
      var result = await rootStore.markDone(data);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        alert('Terselesaikan')
        closeModalDone()
        props.navigation.goBack(null)
      }
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

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'detail', title: 'Detail' },
        { key: 'activity', title: 'Aktivitas Pengajuan' },
    ]);

    const DetailRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderDetail()}
      </View>
    );

    const ActivityRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderActivity()}
      </View>
    );

    const renderScene = SceneMap({
        detail: DetailRoute,
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

    const _renderProgressPengajuan = () => {
      
      if(statusLeave && statusLeave.atasan_1.name != ""){
        return(
          <View>
            <View
              style={{
                alignItems: "flex-start", justifyContent: "flex-start", marginTop: 10, position: "relative"
              }}
            >

              <View style={styles.bar} />

              <View style={styles.innerWrap}>
                {/* Atasan 1  */}
                {(statusLeave.atasan_1.name != "" && statusLeave.atasan_1.status != "none" &&
                  <View style={styles.wrap}>
                    <View style={styles.round} />
                    <Text style={styles.txt_person}>{statusLeave.atasan_1.name}</Text>
                    <Text style={styles.txt_status}>{statusLeave.atasan_1.status}</Text>
                  </View>
                )}

                {/* Atasan 2  */}
                {(statusLeave.atasan_2.name != "" && statusLeave.atasan_2.status != "none" &&
                  <View style={styles.wrap}>
                    <View style={styles.round} />
                    <Text style={styles.txt_person}>{statusLeave.atasan_2.name}</Text>
                    <Text style={styles.txt_status}>{statusLeave.atasan_2.status}</Text>
                  </View>
                )}

                {/* Atasan 3  */}
                {(statusLeave.atasan_3.name != "" && statusLeave.atasan_3.status != "none" &&
                  <View style={styles.wrap}>
                    <View style={styles.round} />
                    <Text style={styles.txt_person}>{statusLeave.atasan_3.name}</Text>
                    <Text style={styles.txt_status}>{statusLeave.atasan_3.status}</Text>
                  </View>
                )}

                {/* HRD  */}
                {(statusLeave.hrd.name != "" && statusLeave.hrd.status != "none" &&
                  <View style={styles.wrap}>
                    <View style={styles.round} />
                    <Text style={styles.txt_person}>{statusLeave.hrd.name}</Text>
                    <Text style={styles.txt_status}>{statusLeave.hrd.status}</Text>
                  </View>
                )}
              </View>

            </View>

          </View>
        );
      }else{
        return null;
      }
    }

    const _renderActivity = () => {
      return(
        <View>
          <ScrollView style={layout.container.content_wtabbar}>

            {_renderProgressPengajuan()}

            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <View style={{ ...layout.list_activity.line }} />

                {activity.map((item,i)=>{
                  if(item.updated_at){
                    var waktu = item.updated_at.split(' ')
                    var cek = Helper.mysqlGmtStrToJSLocal(item.updated_at)
                    var waktuShow = new Date(cek)
                    var tgl = waktu[0].split('-')
                    var jam = waktu[1].split(':')
                    // Reactotron.log('utc 5')
                    // Reactotron.log(waktuShow)
                  }
                  // var waktu = item.updated_at.split(' ')
                  // var waktuShow = new Date(item.updated_at)
                  // var date_in = new Date(item.updated_at)
                  // var hari = date_in.getDate()+' '+(Helper.getMonth(date_in.getMonth()))+' '+date_in.getFullYear()
                  // var tglShow = waktuShow.getDate()+' '+waktuShow.getMonth()+' '+waktuShow.getFullYear()
                  
                  return(
                    <View style={layout.list_activity.wrapper}>
                      <Image style={layout.list_activity.avatar} source={(item.image)?(item.image == CONFIG.WEB_URL+'/user-uploads/avatar')?require('@assets/dummy_profile.png'):{uri:item.image}:require('@assets/dummy_profile.png')} />
                      <View style={layout.list_activity.info}>
                        <View style={styles.row}>
                          <Text style={{ ...styles.activity_person }}>{item.user_name}</Text>
                          <Text style={{ ...layout.typography.body }}>{/*menolak pengajuan*/}</Text>
                        </View>
                        <Text style={{ ...layout.typography.body }}>{item.event}</Text>
                        {(item.updated_at) &&
                          <View style={{ ...styles.row, marginTop: 10 }}>
                            <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>{waktuShow.getDate()+' '+Helper.getMonth(waktuShow.getMonth())+' '+waktuShow.getFullYear()}</Text>
                            <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>{waktuShow.getHours()+':'+waktuShow.getMinutes()}</Text>
                          </View>
                        }
                        
                      </View>
                    </View>
                  )
                })}
                {/*
                <View style={layout.list_activity.wrapper}>
                  <Image style={layout.list_activity.avatar} source={require("@assets/dummy_avatar.png")} />
                  <View style={layout.list_activity.info}>
                    <View style={styles.row}>
                      <Text style={{ ...styles.activity_person }}>Ratna (Direktur)</Text>
                      <Text style={{ ...layout.typography.body }}>menolak pengajuan</Text>
                    </View>
                    <Text style={{ ...layout.typography.body }}>Alasan: Terlalu sering bolos</Text>

                    <View style={{ ...styles.row, marginTop: 10 }}>
                      <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>13 April 2020</Text>
                      <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>13:08</Text>
                    </View>
                  </View>
                </View>
                <View style={layout.list_activity.wrapper}>
                  <Image style={layout.list_activity.avatar} source={require("@assets/dummy_avatar.png")} />
                  <View style={layout.list_activity.info}>
                    <View style={styles.row}>
                      <Text style={{ ...styles.activity_person }}>Jack Watson (Supervisor)</Text>
                      <Text style={{ ...layout.typography.body }}>menerima pengajuan</Text>
                    </View>
                    <View style={{ ...styles.row, marginTop: 10 }}>
                      <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>13 April 2020</Text>
                      <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>13:08</Text>
                    </View>
                  </View>
                </View>
                <View style={layout.list_activity.wrapper}>
                  <Image style={layout.list_activity.avatar} source={require("@assets/dummy_avatar.png")} />
                  <View style={layout.list_activity.info}>
                    <View style={styles.row}>
                      <Text style={{ ...styles.activity_person }}>John Doe</Text>
                      <Text style={{ ...layout.typography.body }}>mengajukan pengajuan</Text>
                    </View>
                    <View style={{ ...styles.row, marginTop: 10 }}>
                      <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>13 April 2020</Text>
                      <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>13:08</Text>
                    </View>
                  </View>
                </View>
                */}
              </View>
            </View>
          </ScrollView>
        </View>
      )
    }

    const laporkanPengeluaran = () => {
      navigateTo('form_biaya', {id: props.navigation.state.params.data.id})
    }

    const sekretarisAccomodation = () => {
      navigateTo('form_sekretaris', {id: props.navigation.state.params.data.id})
    }
    

    const pickDocument = async () => {
      try {
        const results = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        setFileSekretaris(results);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }

    const deleteFileSekretaris = () =>{
      // alert('s')
      setFileSekretaris(null)
    }

    const _renderDetail = () => {
      return(
        <View>
          <ScrollView style={layout.container.content_wtabbar}>
            
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView, paddingTop: 20 }}>

              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>{detail.status}</Text>
                <Text style={{ ...layout.typography.h3, ...styles.title }}>{detail.reason_title}</Text>

                <View style={styles.row}>
                  <Text style={{ ...layout.typography.body_smaller }}>{detail.date}</Text>
                  <View style={{ ...styles.dot }} />
                  <Text style={{ ...layout.typography.body_smaller }}>Dibuat oleh {detail.created_by}</Text>
                </View>

                {(detail.acc_by != '') &&
                  <View style={styles.row}>
                    <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Diterima Oleh:</Text>
                    <Text style={{ ...layout.typography.body_smaller }}>{detail.acc_by}</Text>
                  </View>
                }
                
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Tentang Pengajuan</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Waktu Pengajuan</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.created_at}</Text>
                </View>
                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tanggal Mulai {(detail.child.alasan_ijin) && 'Izin'}</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.leave_date}</Text>
                </View>

                {(detail.child.start_hour &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Pukul</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.child.start_hour}</Text>
                  </View>
                )}

                <View style={{ ...styles.row, ...layout.list_row.container }}>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tanggal Selesai {(detail.child.alasan_ijin) && 'Izin'}</Text>
                  <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.leave_date_end}</Text>
                </View>

                {(detail.child.end_hour &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Pukul</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.child.end_hour}</Text>
                  </View>
                )}

                {(kategoriCuti=='ijin') &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Alasan Izin</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.reason}</Text>
                  </View>
                }
                {(kategoriCuti=='cuti') &&
                  <View>
                    <View style={{ ...styles.row, ...layout.list_row.container }}>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tipe Cuti</Text>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.tipe_cuti}</Text>
                    </View>
                    <View style={{ ...styles.row, ...layout.list_row.container }}>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Alasan</Text>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.reason}</Text>
                    </View>
                  </View>
                }
                {(kategoriCuti=='dinas_sementara') &&
                  <View>
                    <View style={{ ...styles.row, ...layout.list_row.container }}>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tujuan</Text>
                      <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.reason}</Text>
                    </View>
                  </View>
                }
                {(kategoriCuti=='dinas_luar_kota') &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tujuan</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>{detail.reason}</Text>
                  </View>
                }
                {(kategoriCuti=='dinas_luar_kota') &&
                  <View style={{ ...styles.row, ...layout.list_row.container }}>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Dana</Text>
                    <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>Rp. {(detail.budget_keuangan) ? detail.budget_keuangan : 0}</Text>
                  </View>
                }
                
              </View>

              <Text style={{ ...layout.typography.h4, ...styles.title_header }}>Deskripsi Pengajuan</Text>
              <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                <Text style={layout.typography.body}>{detail.description}</Text>
              </View>
              
              {(detail.can_approve) &&
                <View style={{ ...layout.grid.wrapper, marginTop: 20 }}>
                  <Button onPress={openModal} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.grid.half }}>
                      <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>TOLAK</Text>
                  </Button>
                  <Button onPress={terima} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.grid.half }}>
                      <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>TERIMA</Text>
                  </Button>
                </View>
              }
              <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                {(detail.can_ajukan_akomodasi) &&
                <Button onPress={openModalBiaya} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                  <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>AJUKAN AKOMODASI</Text>
                </Button>
                }
                {(detail.can_laporkan_pengeluaran) &&
                  <Button onPress={()=>{laporkanPengeluaran()}} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>LAPORKAN PENGELUARAN</Text>
                  </Button>
                }
                {(detail.can_done) &&
                  <Button onPress={openModalDone} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                  <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>SELESAIKAN PERJALANAN</Text>
                </Button>
                }
                
                {(detail.sekretaris_approve) &&
                  <Button onPress={()=>{sekretarisAccomodation()}} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>LAPORKAN AKOMODASI</Text>
                  </Button>
                }
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

    //Modal
    const openModal = () => {
        menuModal.current.open()
        }

    const closeModal = () => {
        menuModal.current.close()
        }
    const openModalBiaya = () => {
        menuModalBiaya.current.open()
        }

    const closeModalBiaya = () => {
        menuModalBiaya.current.close()
        }
    const openModalDone = () => {
        menuModalDone.current.open()
        }

    const closeModalDone = () => {
        menuModalDone.current.close()
        }
    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />
        {/*<Head type="detail" title={'Detail Pengajuan'} navigation={props.navigation} noBorder={true} opsi={() => togglePopup() } />*/}
        <Head type="detail" title={'Detail Pengajuan'} navigation={props.navigation} noBorder={true} />
        <Animatable.View ref={handleViewRef} style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.header_option.container }}>
          <TouchableOpacity onPress={() => navigateTo('form_tasks', {type: "edit"})} style={{ ...layout.header_option.wrapper }}>
            <Text style={layout.typography.body}>Edit Pengajuan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _panel.show()} style={{ ...layout.header_option.wrapper, marginBottom: 0 }}>
            <Text style={layout.typography.body}>Hapus</Text>
          </TouchableOpacity>
        </Animatable.View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={renderTabBar}
        />

        {/*<SlidingUpPanel 
            ref={c => _panel = c}
            containerStyle={{ ...layout.bottom_notif.container }}
            backdropStyle={{ ...layout.bottom_notif.backdrop }}
            allowDragging={false}
            draggableRange={{
                top: 240,
                bottom: 0
            }}
        >
            <View style={{ ...layout.bottom_notif.wrapper }}>
                <Text style={layout.bottom_notif.title}>Hapus Pengajuan</Text>
            </View>
            <View style={{ ...layout.bottom_notif.wrapper, ...layout.bottom_notif.row, marginBottom: 50 }}>
                <Icon name="ios-information-circle-outline" style={{ ...layout.bottom_notif.icon }} size={40} />
                <Text style={layout.bottom_notif.text}>Apakah anda yakin anda akan menghapus pengajuan ini?</Text>
            </View>
            <View style={{ ...layout.bottom_notif.row }}>
                <Button onPress={() => _panel.hide()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                </Button>
                <Button onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                </Button>
            </View>
        </SlidingUpPanel>*/}

        <Modal
            style={{ ...layout.modalbox.modal}}
            ref={menuModal}
            backdropPressToClose={true}
            swipeToClose={true}>
          <View style={{ ...layout.modal.body }}>
            <Text style={{...layout.modalbox.modal_header}} text="Tolak Pengajuan?" />
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginTop:0.077*deviceWidth }}>
                <TextInput
                    style={{ ...layout.textbox.textarea }}
                    placeholder="Tulis alasan anda menolak pengajuan ini"
                    multiline={true}
                    onChangeText={text => setAlasanTolak(text)}
                    value={alasanTolak}
                />
            </View>
            <View style={{...layout.modalbox.button_modal}}>
                <TouchableOpacity onPress={()=>{ closeModal() }} style={{...layout.modalbox.batal_button}}>
                    <Text style={{...layout.modalbox.batal_text}}>BATAL</Text>
                </TouchableOpacity> 
                <TouchableOpacity onPress={()=>{ tolak() }} style={{...layout.modalbox.ok_button}}>
                    <Text style={{...layout.modalbox.ok_text}}>OK</Text>
                </TouchableOpacity>    
            </View>
          </View>
        </Modal>

        <Modal
            style={{ ...layout.modalbox.modal}}
            ref={menuModalBiaya}
            backdropPressToClose={true}
            swipeToClose={true}>
          <View style={{ ...layout.modal.body }}>
            <Text style={{...layout.modalbox.modal_header, marginBottom:0.05*deviceWidth}} text="Mengajukan akomodasi ?" />
            <View style={{...layout.modalbox.button_modal}}>
                <TouchableOpacity onPress={()=>{ closeModalBiaya() }} style={{...layout.modalbox.batal_button}}>
                    <Text style={{...layout.modalbox.batal_text}}>BATAL</Text>
                </TouchableOpacity> 
                <TouchableOpacity onPress={()=>{ simpan() }} style={{...layout.modalbox.ok_button}}>
                    <Text style={{...layout.modalbox.ok_text}}>AJUKAN</Text>
                </TouchableOpacity>    
            </View>
          </View>
        </Modal>

        <Modal
            style={{ ...layout.modalbox.modal}}
            ref={menuModalDone}
            backdropPressToClose={true}
            swipeToClose={true}>
          <View style={{ ...layout.modal.body }}>
            <Text style={{...layout.modalbox.modal_header, marginBottom:0.05*deviceWidth}} text="Selesaikan perjalanan ?" />
            <View style={{...layout.modalbox.button_modal}}>
                <TouchableOpacity onPress={()=>{ closeModalDone() }} style={{...layout.modalbox.batal_button}}>
                    <Text style={{...layout.modalbox.batal_text}}>BATAL</Text>
                </TouchableOpacity> 
                <TouchableOpacity onPress={()=>{ simpanDone() }} style={{...layout.modalbox.ok_button}}>
                    <Text style={{...layout.modalbox.ok_text}}>SELESAI</Text>
                </TouchableOpacity>    
            </View>
          </View>
        </Modal>

      </View>
    )
})
