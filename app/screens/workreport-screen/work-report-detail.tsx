import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, Linking, RefreshControl } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Status, Head, Icon, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
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
import MapView, {Marker} from 'react-native-maps';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    
    question_text:{
        fontSize:14,
        color:"#5F5959",
        fontWeight: "bold",
    },
    answer_text:{
        fontSize:14,
        color:"#5F5959",
        marginLeft:0.055*deviceWidth
    },
    terima_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.416*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center'
     },
     tolak_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.416*deviceWidth,
        height:0.111*deviceWidth,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#8D8D8D',
        justifyContent:'center',
        alignItems:'center'
     },
    terima_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
        },
    tolak_text:{
        fontSize:14,
        color:"#8D8D8D",
        fontWeight: "bold",
        },
    container:{
        backgroundColor: "#fff",
        borderRadius:10,
        elevation:1,
        padding:0.055*deviceWidth,
        marginBottom:0.027*deviceWidth,
        width: deviceWidth*0.88
    },
    container_inside:{
        borderRadius:10,
        elevation:1,
        padding:0.055*deviceWidth,
        marginBottom:0.027*deviceWidth,
        flexWrap: "wrap",
        flex: 0.5,
    },
    status_box:{
        borderRadius:10,
        width:0.35*deviceWidth,
        paddingBottom:0.013*deviceWidth,
        paddingTop:0.013*deviceWidth,
        paddingLeft:0.027*deviceWidth,
        paddingRight:0.027*deviceWidth,
        backgroundColor:'#FFE6D8',
        marginBottom:0.02*deviceWidth
    },
    status_text:{
        fontSize:12,
        color:"#E96925",
    },
    title:{
        fontSize:16,
        color:"#5F5959",
    },
    description:{
        fontSize:12,
        color:"#5F5959",
        // width:0.35*deviceWidth
    },
    desc:{
        fontSize:12,
        color:"#5F5959",
        marginTop:0.01*deviceWidth
        // width:0.35*deviceWidth
    },
    subheader:{
        fontSize:14,
        color:"#5F5959",
        marginTop:0.055*deviceWidth,
        fontWeight:'bold'
    },
    image_map:{
        height:0.5*deviceWidth,
        width:0.77*deviceWidth,
        // marginRight:0.055*deviceWidth,
    },
    image_doc:{
        height:0.083*deviceWidth,
        width:0.083*deviceWidth,
        // marginRight:0.055*deviceWidth,
    },
    image_ic_delete:{
        height:0.041*deviceWidth,
        width:0.041*deviceWidth,
        marginRight:0.027*deviceWidth,
    },
    image_ic_download:{
        height:0.041*deviceWidth,
        width:0.041*deviceWidth,
        // marginRight:0.055*deviceWidth,
    },
    image_ic_info_purple:{
        height:0.11*deviceWidth,
        width:0.11*deviceWidth,
        marginRight:0.027*deviceWidth
    },
    namefile:{
        fontSize:14,
        color:"#301254",
        fontWeight:'bold'
        // marginTop:0.055*deviceWidth
    },
    sizefile:{
        fontSize:12,
        color:"#BABABA",
        // marginTop:0.055*deviceWidth
    },
    modal:{
        width: deviceWidth*0.88, 
        padding: 0, 
        elevation: 999, 
        zIndex: 999, 
        borderRadius: 10, 
        height: deviceWidth*0.8, 
        position: "relative"
     },
     modal_diterima:{
        width: deviceWidth*0.8, 
        padding: 0, 
        elevation: 999, 
        zIndex: 999, 
        borderRadius: 10, 
        height: deviceWidth*0.7, 
        position: "relative"
     },
    modal_header:{
        fontSize:18,
        color:"#5F5959",
        fontWeight: "bold",
        },
    ok_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.361*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center'
     },
     batal_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.361*deviceWidth,
        height:0.111*deviceWidth,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#8D8D8D',
        justifyContent:'center',
        alignItems:'center'
     },
    ok_button_diterima:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.416*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center'
     },
     batal_button_diterima:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.416*deviceWidth,
        height:0.111*deviceWidth,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#8D8D8D',
        justifyContent:'center',
        alignItems:'center'
     },
    ok_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
        },
    batal_text:{
        fontSize:14,
        color:"#8D8D8D",
        fontWeight: "bold",
        },
}

export interface WorkReportDetailScreenProps extends NavigationScreenProps<{}> {
}

export const WorkReportDetailScreen: React.FunctionComponent<WorkReportDetailScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    // const [question1, setQuestion1] = useState(1);
    // const [question2, setQuestion2] = useState(1);
    const [log, setLog] = useState(null);
    const [comment, setComment] = useState([]);
    const [fieldReason, setFieldReason] = useState(null);

    const menuModal = useRef(null);
    const menuModalApprove = useRef(null);
    const menuModalDiterima = useRef(null);
    // const [pilihan, setPilihan] = useState(1);

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    const next = async (values) => {
        navigateTo("absence_success");
    }
    
    useEffect( () => {
        // console.log(log);

        loadDetailLog(props.navigation.state.params.id)
    }, []);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadDetailLog(props.navigation.state.params.id)
      setRefreshing(false);

    }, [refreshing]);

    const loadDetailLog = async (id) => {
      var param = {
        id: id
      }
      
      setLoading(true);
      var result = await rootStore.getDetailLog(param);
      setLoading(false);

      // get from storage when offline
      var isOffline = false;
      if(result.kind != "ok"){
          result.data = {};
          result.kind = "ok"
          isOffline = true;

          result.data = rootStore.findTimelogById(id)
          result.data = (result.data.length > 0) ? result.data[0] : null

          if(result.data){
            result.data.task = rootStore.findTaskById(result.data.task_id)
          }
          
      }

      if(result.kind == "ok" && result.data){
        setLog(result.data)
        setComment(result.data.list_comments);
        // console.log(result.data)
      }
    }

    const doTerima = async () => {
      var param = {
        task_id: props.navigation.state.params.id,
        status: "accepted",
        checker_user_id: rootStore.getCurrentUser().id,
        reason: fieldReason
      }
      
      setLoading(true);
      var result = await rootStore.postTerimaTask(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        Toast.show("Anda berhasil menerima laporan");
        goBack();
        props.navigation.state.params.onBack();
      }
    }

    const doTolak = async () => {

        if(fieldReason && fieldReason != ""){
            menuModal.current.close();

            var param = {
                task_id: props.navigation.state.params.id,
                status: "rejected",
                checker_user_id: rootStore.getCurrentUser().id,
                reason: fieldReason
            }

            setLoading(true);
            var result = await rootStore.postTerimaTask(param);
            setLoading(false);

            if(result.kind == "ok" && result.data){
                Toast.show("Anda menolak laporan ini");
                goBack();
                props.navigation.state.params.onBack();
            }
        }else{
            Toast.show("Kolom alasan harus diisi")
        }
    }

    const batal = (type) => {

        if(!!type && type == 'approve'){
            menuModalApprove.current.close()
        }else{
            menuModal.current.close()
        }
    }
    const ok = (type) => {
        if(!!type && type == 'approve'){
            menuModalApprove.current.close()

            setTimeout(function(){
                _panel.show()
            }, 1000);
        }else{
            doTolak();
        }
    }
    const batalDiterima = () => {
        _panel.hide()
    }
    const okDiterima = () => {
        _panel.hide();
        doTerima();
    }
    const terima = () => {
        menuModalApprove.current.open()
    }

    const tolak = () => {
        menuModal.current.open()
    }

    const formatDate = (datenow) => {
        return moment(datenow).format("MMM Do, YYYY");
    }
    const formatTime = (datenow) => {
        return moment(datenow).format("h:mm:ss a");
    }
    const formatDigit = (time) => {
        return ("0"+time).slice(-2)
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            {(log &&
                <ScrollView
                    refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <Head type="detail" title={'Detail Laporan'} navigation={props.navigation} />
                    <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                        <View style={{ marginBottom: 0, alignSelf: "center" }}>
                            <View style={{...styles.base}}>
                                <TouchableOpacity onPress={() => navigateTo("task_detail", {id: log.task.id, onBack: onRefresh})} style={{...styles.container, marginTop:0.055*deviceWidth}}>
                                    <Status slug={log.status} />
                                    
                                    <Text style={styles.title}>{log.task.heading}</Text>
                                    <Text style={styles.description}>Tanggal kerja: {formatDate(log.task.start_date)}</Text>
                                </TouchableOpacity>
                                <Text style={{...styles.subheader}}>Tentang Laporan
                                </Text> 
                                <View style={{...styles.container, marginTop:0.055*deviceWidth}}>
                                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                        <Text style={styles.desc}>Yang mengerjakan</Text>
                                        <Text style={styles.desc}>{log.user.name}</Text>
                                    </View>
                                    {(log.project &&
                                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                            <Text style={styles.desc}>Proyek</Text>
                                            <Text style={{...styles.desc, width:0.35*deviceWidth, textAlign:'right'}}>{log.project.project_name}</Text>
                                        </View>
                                    )}
                                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                        <Text style={styles.desc}>Tanggal Mulai</Text>
                                        <Text style={styles.desc}>{formatDate(log.start_time)}</Text>
                                    </View>

                                    {(log.end_time &&
                                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                            <Text style={styles.desc}>Tanggal Selesai</Text>
                                            <Text style={styles.desc}>{formatDate(log.end_time)}</Text>
                                        </View>
                                    )}

                                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                        <Text style={styles.desc}>Waktu Mulai</Text>
                                        <Text style={styles.desc}>{formatTime(log.start_time)}</Text>
                                    </View>

                                    {(log.end_time &&
                                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                            <Text style={styles.desc}>Waktu Selesai</Text>
                                            <Text style={styles.desc}>{formatTime(log.end_time)}</Text>
                                        </View>
                                    )}

                                    {( (log.total_hours || log.total_minutes) &&
                                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                            <Text style={styles.desc}>Total Bekerja</Text>
                                            <Text style={styles.desc}>{formatDigit(log.total_hours)+":"+formatDigit(log.total_minutes)}</Text>
                                        </View>
                                    )}

                                    {( (!!log.checker && log.checker_user_id != null) &&
                                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                            <Text style={styles.desc}>Sudah direview oleh</Text>
                                            <Text style={styles.desc}>{(log.checker) ? log.checker.name : ''}</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={{...styles.subheader}}>Deskripsi Pekerjaan</Text>
                                <View style={{...styles.container, marginTop:0.055*deviceWidth}}>
                                    <Text style={styles.desc}>{log.task.description}</Text>
                                </View>

                                <Text style={{...styles.subheader}}>Catatan Pekerjaan</Text>
                                <View style={{...styles.container, marginTop:0.055*deviceWidth}}>
                                    <Text style={styles.desc}>{log.memo}</Text>
                                </View>

                                {(log.reason && log.status == "rejected") &&
                                    <View>
                                        <Text style={{...styles.subheader}}>Alasan Penolakan</Text>
                                        <View style={{...styles.container, marginTop:0.055*deviceWidth}}>
                                            <Text style={styles.desc}>{log.reason}</Text>
                                        </View>
                                    </View>
                                }

                                {(log.reason && log.status != "rejected") &&
                                    <View>
                                        <Text style={{...styles.subheader}}>Alasan Penerimaan</Text>
                                        <View style={{...styles.container, marginTop:0.055*deviceWidth}}>
                                            <Text style={styles.desc}>{log.reason}</Text>
                                        </View>
                                    </View>
                                }
                                
                                {(log.longitude && log.latitude &&
                                    <View>
                                        <Text style={{...styles.subheader}}>Lokasi</Text>
                                        <View style={{...styles.container, marginTop:0.055*deviceWidth}}>
                                            <View style={{marginTop:0.027*deviceWidth, marginBottom:0.027*deviceWidth}}>
                                                <MapView
                                                    style={{...styles.image_map}}
                                                    initialRegion={{
                                                      latitude: parseFloat(log.latitude),
                                                      longitude: parseFloat(log.longitude),
                                                      latitudeDelta: 0.0922,
                                                      longitudeDelta: 0.0421,
                                                    }}
                                                >
                                                    <Marker
                                                      coordinate={{
                                                        latitude: parseFloat(log.latitude),
                                                        longitude: parseFloat(log.longitude),
                                                      }}
                                                      // title={"Posisi sekarang"}
                                                      // description={marker.description}
                                                    />
                                                </MapView>
                                                {/*<Image source={require('@assets/map.png')} style={styles.image_map} />*/}
                                            </View>
                                            
                                            {/*
                                            <Text style={styles.desc}>Kantor Samsat Surabaya
                                            </Text>
                                            <Text style={styles.desc}>Jl. Manyar Kertoarjo No.1, Manyar 
                                            </Text>
                                            <Text style={styles.desc}>Sabrangan, Kec. Mulyorejo, Kota SBY, Jawa Timur 60116
                                            </Text>
                                            <Text style={styles.desc}>(-7.221277, 122.721976)
                                            </Text>
                                            */}

                                        </View>
                                    </View>
                                )}

                                {(log.files && log.files.length > 0 &&
                                    <View>
                                        <Text style={{...styles.subheader}}>Lampiran Foto</Text>
                                        <View style={{...styles.container, marginTop:0.055*deviceWidth}}>

                                            {(log.files.map((item,i) =>{
                                                return(
                                                    <View style={{...styles.container_inside, flexDirection:'row', justifyContent:'space-between'}}>
                                                        <View style={{flexDirection:'row'}}>
                                                            <Image source={require('@assets/doc.png')} style={styles.image_doc} />
                                                            <View style={{marginLeft:0.027*deviceWidth, flexWrap: "wrap", flex: 1, width: deviceWidth*0.5 }}>
                                                                <Text style={{...styles.namefile, flexWrap: "wrap", flex: 1, width: deviceWidth*0.5 }}>{item.filename}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                                            <TouchableOpacity onPress={() => Linking.openURL(item.file_url) }>
                                                                <Image source={require('@assets/ic_download.png')} style={styles.image_ic_download} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )
                                            }))}
                                            
                                        </View>
                                    </View>
                                )}

                                {/*!log.checker_user_id */}
                                {/* rootStore.getCurrentUser().id != log.user_id && !log.checker_user_id */ }

                                {( rootStore.getCurrentUser().id != log.user_id && log.status == 'in_review' &&
                                    <View style={{flexDirection:'row',justifyContent: "space-between", marginTop:0.1*deviceWidth, width:0.88*deviceWidth}}>
                                        <TouchableOpacity onPress={()=>{ tolak() }} style={{...styles.tolak_button}}>
                                            <Text style={{...styles.tolak_text}}>TOLAK</Text>
                                        </TouchableOpacity> 
                                        <TouchableOpacity onPress={()=>{ terima() }} style={{...styles.terima_button}}>
                                            <Text style={{...styles.terima_text}}>TERIMA</Text>
                                        </TouchableOpacity>    
                                    </View>
                                )}

                                <Text style={{ ...layout.typography.h4, ...styles.title_header, marginTop: 40 }}>Semua Komentar</Text>
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

                                      {(!!item && !!item.files && item.files.length > 0) &&
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
                        </View>
                    </View>
                    
                    
                </ScrollView>
            )}

            <Modal
                style={{ ...styles.modal}}
                ref={menuModalApprove}
                backdropPressToClose={true}
                swipeToClose={true}>
              <View style={{ ...layout.modal.body }}>
                <Text style={styles.modal_header} text="Terima Laporan Tugas?" />
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginTop:0.077*deviceWidth }}>
                    <TextInput
                        style={{ ...layout.textbox.textarea }}
                        placeholder="Komentar"
                        multiline={true}
                        onChangeText={text => setFieldReason(text)}
                        value={fieldReason}
                    />
                </View>
                <View style={{flexDirection:'row',justifyContent: "space-between", marginTop:0.1*deviceWidth}}>
                    <TouchableOpacity onPress={()=>{ batal('approve') }} style={{...styles.batal_button}}>
                        <Text style={{...styles.batal_text}}>BATAL</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={()=>{ ok('approve') }} style={{...styles.ok_button}}>
                        <Text style={{...styles.ok_text}}>OK</Text>
                    </TouchableOpacity>    
                </View>
              </View>
            </Modal>
            
            <Modal
                style={{ ...styles.modal}}
                ref={menuModal}
                backdropPressToClose={true}
                swipeToClose={true}>
              <View style={{ ...layout.modal.body }}>
                <Text style={styles.modal_header} text="Tolak Laporan Tugas?" />
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginTop:0.077*deviceWidth }}>
                    <TextInput
                        style={{ ...layout.textbox.textarea }}
                        placeholder="Komentar"
                        multiline={true}
                        onChangeText={text => setFieldReason(text)}
                        value={fieldReason}
                    />
                </View>
                <View style={{flexDirection:'row',justifyContent: "space-between", marginTop:0.1*deviceWidth}}>
                    <TouchableOpacity onPress={()=>{ batal() }} style={{...styles.batal_button}}>
                        <Text style={{...styles.batal_text}}>BATAL</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={()=>{ ok() }} style={{...styles.ok_button}}>
                        <Text style={{...styles.ok_text}}>OK</Text>
                    </TouchableOpacity>    
                </View>
              </View>
            </Modal>

            <SlidingUpPanel 
                ref={c => _panel = c}
                containerStyle={{ backgroundColor: "#fff", borderRadius: 20, elevation: 7 }}
                allowDragging={false}
                friction={0.3}
                draggableRange={{
                    top: 0.61*deviceWidth,
                    bottom: 0
                }}>

                <View style={{ ...layout.modal.body }}>
                <Text style={styles.modal_header} text="Konfirmasi Terima Laporan" />
                <View style={{ flexDirection:'row', marginTop:0.1*deviceWidth }}>

                   <Image source={require('@assets/ic_info_purple.png')} style={styles.image_ic_info_purple} />
                   <View style={{width:0.6*deviceWidth}}>
                    <Text style={{fontSize:14,color:"#5F5959"}}>
                        Apakah anda yakin anda menyetujui laporan pekerjaan ini?
                    </Text>
                   </View>
                </View>
                <View style={{flexDirection:'row',justifyContent: "space-between", marginTop:0.1*deviceWidth}}>
                    <TouchableOpacity onPress={()=>{ batalDiterima() }} style={{...styles.batal_button_diterima}}>
                        <Text style={{...styles.batal_text}}>BATAL</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={()=>{ okDiterima() }} style={{...styles.ok_button_diterima}}>
                        <Text style={{...styles.ok_text}}>OK</Text>
                    </TouchableOpacity>    
                </View>
              </View>
            </SlidingUpPanel>
        </View>
    )
})
