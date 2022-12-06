import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, DatePickerAndroid, BackHandler } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
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
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    base:{
        minWidth: 0.875*deviceWidth,
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
    },
    image_calendar:{
        height:0.041*deviceWidth,
        width:0.041*deviceWidth,
        marginRight:0.055*deviceWidth,
    },
    container:{
        width: 0.875*deviceWidth,
        // height: 0.22*deviceWidth,
        backgroundColor:'white',
        marginTop:0.055*deviceWidth,
        marginLeft:0.0625*deviceWidth,
        marginRight:0.0625*deviceWidth,
        borderRadius:10,
        elevation:2,
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
        paddingTop:0.027*deviceWidth,
        paddingBottom:0.027*deviceWidth
        // flexDirection:'row'
      },
    separator_line_grey:{
        borderBottomColor: "#CCCCCC", 
        borderBottomWidth: 1,
        width: deviceWidth*0.77,
        marginTop:0.027*deviceWidth,
        marginBottom:0.027*deviceWidth
        // alignSelf: "center"
      },
    date_text:{
        fontSize:14,
        color:"#CCCCCC",
        textAlignVertical: "center"
        },
    center:{
        alignItems: 'center', justifyContent: 'center'
        },
    akhir_tgl:{
        flexDirection:'row', 
        // marginTop:0.055*deviceWidth
        },
    absence_list:{
        // width: 0.875*deviceWidth,
        borderRadius:10,
        elevation:1,
        padding:0.055*deviceWidth,
        marginBottom:0.027*deviceWidth,
        backgroundColor: "#fff"
        // paddingRight:0.055*deviceWidth,
        // paddingTop:0.055*deviceWidth,
        // paddingBottom:0.055*deviceWidth
        },
    status_list_in:{
        fontSize:12,
        color:"#E96925",
        },
    status_list_out:{
        fontSize:12,
        color:"#8333E9",
        },
    status_box_in:{
        borderRadius:10,
        // elevation:1,
        width:0.3*deviceWidth,
        paddingBottom:0.013*deviceWidth,
        paddingTop:0.013*deviceWidth,
        paddingLeft:0.027*deviceWidth,
        paddingRight:0.027*deviceWidth,
        backgroundColor:'#FFE6D8',
        marginBottom:0.02*deviceWidth
        // marginBottom:0.027*deviceWidth
        },
    status_box_out:{
        borderRadius:10,
        // elevation:1,
        width:0.3*deviceWidth,
        paddingBottom:0.013*deviceWidth,
        paddingTop:0.013*deviceWidth,
        paddingLeft:0.027*deviceWidth,
        paddingRight:0.027*deviceWidth,
        backgroundColor:'#E9D8FF',
        marginBottom:0.02*deviceWidth
        // marginBottom:0.027*deviceWidth
        },
    date_list:{
        fontSize:16,
        color:"#5F5959",
        fontWeight: "bold",
        marginBottom:0.01*deviceWidth
        },
    absen_list:{
        fontSize:12,
        color:"#5F5959",
        },
    absen_button:{
        flexDirection:'row',
        position: "absolute",
        alignSelf:'center',
        bottom:0.138*deviceWidth,
        paddingRight:0.055*deviceWidth,
        paddingLeft:0.055*deviceWidth,
        paddingTop:0.027*deviceWidth,
        paddingBottom:0.027*deviceWidth,
        backgroundColor:'#381D5C',
        borderRadius:10,
        },
    fingerprint_image:{
        height:0.055*deviceWidth,
        width:0.055*deviceWidth,
        marginRight:0.027*deviceWidth,
        },
    absen_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
        },
    modal:{
        width: deviceWidth*0.8, 
        padding: 0, 
        elevation: 999, 
        zIndex: 999, 
        borderRadius: 10, 
        height: deviceWidth*0.65, 
        position: "relative"
     },
     ok_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.4*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center'
     },
     cancel_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.4*deviceWidth,
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
    cancel_text:{
        fontSize:14,
        color:"#8D8D8D",
        fontWeight: "bold",
        },
    modal_header:{
        fontSize:18,
        color:"#5F5959",
        fontWeight: "bold",
        },
    pil_text:{
        fontSize: 14,
        textAlignVertical: "center",
        marginLeft:0.055*deviceWidth
        }
    }


let atasanAccept = true;
let statusResponse = -1;

export interface AbsenceHistoryScreenProps extends NavigationScreenProps<{}> {
}

export const AbsenceHistoryScreen: React.FunctionComponent<AbsenceHistoryScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(0);
    const [tanggalAwal, setTanggalAwal] = useState('Pilih batas awal periode');
    const [tanggalAkhir, setTanggalAkhir] = useState('Pilih batas akhir periode');
    const menuModal = useRef(null);
    const [datang, setDatang] = useState(false);
    const [pulang, setPulang] = useState(false);
    const [kerja, setKerja] = useState(true);
    const [khusus, setKhusus] = useState(false);
    const [workingFrom, setWorkingFrom] = useState('');
    const [current_params, setCurrentParams] = useState(null);

    const [isMethodScanOpen, setIsMethodScanOpen] = useState(false);
    const [isMethodWFHOpen, setIsMethodWFHOpen] = useState(false);
    const [isMethodGPSOpen, setIsMethodGPSOpen] = useState(false);

    const [absence, setAbsence] = React.useState([]);
  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
		props.navigation,
	])

    // const netInfo = useNetInfo();

    const convertJam = (a) => {
        // alert('s')
        // menuModal.current.open()
        return a+1;
    }

    const processData = (result) => {
        var absensi = []
        var data = {}
        result.map((item,i)=>{
            
            var working_location = "";
            
            if(item.clock_out_time){

                if(item.clock_out_from == "WFH"){
                    working_location = "Work From Home"
                }else if(item.clock_out_from){
                    working_location = item.clock_out_from+" via QR Code Scan"
                }else{
                    working_location = "GPS Tracking"
                }

                if(item.cron_clock_out){
                    working_location = "Absen oleh sistem"
                }

                data={
                    'id':item.id,
                    'status' : 'Absensi Pulang',
                    'type' : 'out' ,
                    'tanggal': moment(item.clock_out_time).format("DD MMMM YYYY"),
                    // 'absen':(item.clock_out_from=='LACAKGPS') ? 'GPS Tracking' : (item.working_from == 'WFH') ? 'Work From Home' : item.clock_out_from + ' via QR Code Scan',
                    'absen': working_location,
                    'jam': moment.parseZone(item.clock_out_time).format("HH:mm"),
                    'is_sync': ("is_sync" in item) ? item.is_sync : true
                }

                absensi.push(data);
            }

            if(item.clock_in_time){
                if(item.working_from == "WFH"){
                    working_location = "Work From Home"
                }else if(item.working_from){
                    working_location = item.working_from+" via QR Code Scan"
                }else{
                    working_location = "GPS Tracking"
                }

                data={
                    'id':item.id,
                    'status' : 'Absensi Masuk',
                    'type' : 'in' ,
                    'tanggal': moment(item.clock_in_time).format("DD MMMM YYYY"),
                    // 'absen':(item.clock_out_from=='LACAKGPS') ? 'GPS Tracking' : (item.working_from == 'WFH') ? 'Work From Home' : item.clock_out_from + ' via QR Code Scan',
                    'absen': working_location,
                    'jam': moment(item.clock_in_time).format("HH:mm"),
                    'is_sync': ("is_sync" in item) ? item.is_sync : true
                }
                absensi.push(data)
            }

            
        })

        return absensi;
    }

    const loadAbsenceHistory = async (tanggalAwal, tanggalAkhir) => {

        setLoading(true);
        var date ={};
        if((tanggalAwal != 'Pilih batas awal periode')&&(tanggalAkhir != 'Pilih batas akhir periode')){
            date.start_date = tanggalAwal;
            date.end_date = tanggalAkhir ;
        }
        
        Reactotron.log('date 3');
        Reactotron.log(date);
        var result = await rootStore.getAbsenceHistory(date);
        setLoading(false);

        // get from storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            result.data = {};
            result.kind = "ok"
            isOffline = true;

            result.data.attendance = rootStore.getData("attendances");

            // save to queue
            // rootStore.pushData('my_queues', {
            //     type: 'attendance-list',
            //     action: 'getAbsenceHistory',
            //     will_update: "attendances",
            //     description: "Semua data absensi",
            //     data: JSON.stringify(date)
            // });
        }

        if(result.kind == "ok" && result.data){
            
            var absensi = processData(result.data.attendance, isOffline)

            // push to storage
            if(!isOffline){

                var arr = rootStore.saveAttendanceFormat(result.data.attendance)

                rootStore.removeData("attendances");
                rootStore.pushData("attendances", arr);
            }

            setAbsence(absensi)
        }
    }

    const getEmployeePermission = async () => {
        setLoading(true);
        var result = await rootStore.getEmployeePermission();
        setLoading(false);

        // et from storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            result.data = {};
            result.kind = "ok"
            isOffline = true;

            result.data.permission = rootStore.my_permission;
        }

        if(result.kind == "ok" && result.data){

            // when on special employee
            var karyawanKhusus = (result.data.permission.karyawan_khusus == 1) ? true : false
            if(karyawanKhusus){
                setKhusus(karyawanKhusus)
            }

            // when on dinas luar kota
            var leaves = rootStore.getData('my_leaves');
            if(leaves && leaves != "" && leaves.length > 0){
                Reactotron.log(leaves)

                leaves.map((item,i) => {
                    if(item.id){
                        if(item.type_name == 'Dinas Luar Kota'){
                            setKhusus(true)
                        }
                    }
                });
            }
        }
    }

    const checkWorkingDone = (result) => {
        // get latest attendance
        result.data.attendance = rootStore.findLatestCheckin();

        if(result.data.attendance){
            result.data.attendance = result.data.attendance[0];

            if(!result.data.attendance.clock_out_time){

                // check clockin today
                if(result.data.attendance.clock_in_time){

                    var after_clockin = rootStore.findLogAfterCheckIn(result.data.attendance.clock_in_time);

                    if(after_clockin && after_clockin.length > 0){

                        // absen masuk dan sudah kerja
                        result.data.status = 1;
                    }else{

                        // absen masuk dan belum kerja
                        result.data.status = 4;
                    }

                }else{

                    // belum absen masuk
                    result.data.status = 0;
                }
            }
        }
    }

    const checkAttendance = async () => {

        // get all timelogs
        await rootStore.getAllTimelogs(100);

        var date = new Date()
        var skrg = Helper.renderDateNum(date.getDate(), date.getMonth(), date.getFullYear(), true)
        var data ={
            date : skrg
        };
        
        setLoading(true);
        var result = await rootStore.checkAttendance(data);
        setLoading(false);

        // get from storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            result.data = {};
            result.kind = "ok"
            isOffline = true;
        }
        
        checkWorkingDone(result);

        if(result.kind == "ok" && result.data){
            statusResponse = result.data.status;

            var sudahDatang = (result.data.status == 1) ? true : false
            setDatang(sudahDatang)
            var sudahPulang = (result.data.status == 2) ? true : true
            setPulang(sudahPulang)
            
            atasanAccept = (result.data.status == 3) ? false : true;

            var sudahKerja = (result.data.status == 4) ? false : true
            setKerja(sudahKerja)
            if((result.data.status == 1)||(result.data.status == 4)){
                if(result.data.attendance){
                    if(result.data.attendance.working_from == 'LACAKGPS'){
                        setWorkingFrom('LACAKGPS')
                    }else if(result.data.attendance.working_from == 'WFH'){
                        setWorkingFrom('WFH')
                    }else{
                        setWorkingFrom('SCANQR')
                    }
                }
            }
        }
    }

    useEffect( () => {
        loadAbsenceHistory(tanggalAwal, tanggalAkhir)
    }, [tanggalAwal, tanggalAkhir]);

    useEffect( () => {
        _panel.hide()
        checkAttendance()
        getEmployeePermission();

        // BackHandler.addEventListener("hardwareBackPress", backAction);
        // return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    const backAction = () => {
        props.navigation.state.params.onGoBack()
        props.navigation.navigate("home")
        return true;
    };

    // const takePicture = async () => {
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

    const _renderAbsence = () => {
        var arr = [];

        absence.map((item,i) => {
          arr.push(
            <View style={{...styles.absence_list}}>
                {(!item.is_sync &&
                    <Icon name="ios-cloud-upload" size={15} style={{ color: "#cecece", position: "absolute", top: 20, right: 20 }} />
                )}

                <View style={(item.type=='in') ? styles.status_box_in : styles.status_box_out}>
                    <Text style={(item.type=='in') ? styles.status_list_in : styles.status_list_out}>{item.status}
                    </Text>
                </View>
                
                <Text style={styles.date_list}>{item.tanggal}
                </Text>
                <Text style={styles.absen_list}>{item.absen} - {item.jam}
                </Text>
            </View>
          )
        });

        return arr;
      }

    const openAttendanceMethod = () => {
        var valid = false;

        // check for ABK
        if(rootStore.employee.is_abk){
            rootStore.ship_schedules.map((item,i) => {
                var date_start = moment(item.date_start, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm");
                var date_end = moment(item.date_end, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm");
                
                if(moment().isBetween(date_start, date_end)){
                    valid = true;
                }

            });
        }else{
            valid = true;
        }

        // check for worklog
        if(!kerja){
            alert('Anda belum menyelesaikan pekerjaan')
        }else{
            valid = true;
        }

        if(valid){

            // open all method for karyawan khusus
            if(khusus){
                setIsMethodGPSOpen(true)
                setIsMethodWFHOpen(true)
                setIsMethodScanOpen(true)
            }else{
                setIsMethodWFHOpen(true)
                setIsMethodScanOpen(true)
            }
        }

    }

    const absenFunction = async () => {
        openAttendanceMethod();

        var params={
            karyawan_khusus:khusus, 
            absen_datang:!datang
        }

        // check apakah masih ada pekerjaan yg belum diterima atasan lebih dari 2x24 jam
        var expired_logs = rootStore.findTimelogByMoreThan(2, 'in_review');

        console.log('statusResponse', statusResponse)

        if(!datang && expired_logs.length > 0 && workingFrom == ''){
            atasanAccept = false;
        }

        if(statusResponse == 3){
            atasanAccept = false;
        }

        // if(atasanAccept){
            if(kerja){
                
                // jika merupakan karyawan khusus
                if(khusus){ 

                    // jika user belum absen masuk
                    if(workingFrom == ''){

                        // user tidak bisa absen masuk apabila masih ada pekerjaan yang belum diterima
                        if(atasanAccept){
                            setTimeout(function(){
                                modalOpen()
                            }, 1000);
                        }
                    }else if(workingFrom == 'LACAKGPS'){
                        // props.navigation.navigate("absence_gps",{params, onGoBack: () => props.navigation.state.params.onGoBack()});

                        params.office_name = "LACAKGPS";
                        props.navigation.replace("absence_photo",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                    }else if(workingFrom == 'SCANQR'){
                        props.navigation.navigate("absence_scan_qr",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                    }else if(workingFrom == 'WFH'){

                        //default
                        params = {
                            ...params,
                            wfh:true
                        }

                        // membuka metode absensi lainnya apabila ada panggilan ke kantor
                        setCurrentParams(params);

                        setTimeout(function(){
                            modalOpen('is_wfh', params);
                        }, 1000);

                        // props.navigation.navigate("absence_check_gps",{params, curParam: params, nextRoute: "absence_photo", workingFrom: "WFH", onGoBack: () => props.navigation.state.params.onGoBack()});
                    }
                    
                    // props.navigation.navigate("absence_gps",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                }

                // jika bukan karyawan khusus
                else{

                    var valid = false;

                    // pengecekan bila abk kapal mempunyai jam masuk
                    if(rootStore.employee.is_abk){
                        rootStore.ship_schedules.map((item,i) => {
                            var date_start = moment(item.date_start, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm");
                            var date_end = moment(item.date_end, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm");
                            
                            if(moment().isBetween(date_start, date_end)){
                                valid = true;
                            }

                        });
                    }else{
                        valid = true;
                    }

                    if(valid){

                        // jika karyawan belum absen masuk
                        if(!datang){ 

                            // user tidak bisa absen masuk apabila masih ada pekerjaan yang belum diterima
                            if(atasanAccept){
                                setTimeout(function(){
                                    modalOpen()
                                }, 1000);
                            }

                            // props.navigation.navigate("absence_pertanyaan",{params,onGoBack: () => props.navigation.state.params.onGoBack()});
                        }

                        // jika karyawan belum absen pulang
                        else{
                            if(workingFrom == 'WFH'){

                                // default
                                params = {
                                    ...params,
                                    wfh:true
                                }
                                // props.navigation.navigate("absence_photo",{params,onGoBack: () => props.navigation.state.params.onGoBack()});

                                // membuka metode absensi lainnya apabila ada panggilan ke kantor
                                setCurrentParams(params);

                                setTimeout(function(){
                                    modalOpen('is_wfh', params);
                                }, 1000);

                            }else if(workingFrom == 'LACAKGPS'){
                                props.navigation.navigate("absence_gps",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                            }else{
                                // props.navigation.navigate("absence_scan_qr",{params, onGoBack: () => props.navigation.state.params.onGoBack()});

                                var leaves = rootStore.getData('my_leaves');
                                console.log('have leave?')
                                console.log(leaves)
                                
                                if(leaves && leaves != "" && leaves.length > 0){
                                    var have_leave = false;
                                    var date_now = moment().format();

                                    leaves.map((item,i) => {
                                        if(item.id){
                                            var start_date = moment(item.leave_date.toString()).format("YYYY-MM-DD");
                                            // var item_child = JSON.parse(item.child);
                                            var item_child = item.child;

                                            if(item_child && item_child.start_hour){
                                                start_date += " "+item_child.start_hour;
                                            }else{
                                                start_date += " 00:00:00";
                                            }
                                            start_date = moment(start_date);

                                            var end_date = moment(item.leave_date_end.toString()).format("YYYY-MM-DD");
                                            if(item_child && item_child.end_hour){
                                                end_date += " "+item_child.end_hour;
                                            }else{
                                                end_date += " 23:59:59";
                                            }
                                            end_date = moment(end_date);

                                            var is_between = moment().isBetween(start_date, end_date);

                                            if(is_between){
                                                have_leave = true;
                                            }
                                        }
                                    });

                                    if(have_leave){
                                        setIsMethodWFHOpen(true);
                                    }
                                    
                                }else{
                                    setIsMethodWFHOpen(false);
                                }

                                setTimeout(function(){
                                    modalOpen()
                                }, 1000);
                            }
                            
                        }
                    }else{
                        alert('Tidak bisa absen. Anda belum punya jadwal ke kapal, silahkan hubungi HRD kapal & PC.')
                    }
                }
            }else{
                alert('Anda belum menyelesaikan pekerjaan')
            }
        // }

        if(!atasanAccept){
            Alert.alert('Tidak bisa absen', 'Anda tidak bisa absen karena pekerjaan anda belum di review atasan selama 2x24 jam. Silahkan hubungi atasan anda secara langsung.')
        }
    }


    const modalOpen = (before_state = null, params = null) => {
        // alert('s')
        // menuModal.current.open()

        if(before_state && before_state == 'is_wfh'){
            setTimeout(function(){
                Alert.alert('Perhatian!', 'Anda telah absen masuk dengan metode WFH. Pastikan anda sudah ijin atasan untuk menggunakan metode lainnya, jika tidak atasan akan ternotif!');
            }, 1500);
        }

        _panel.show()
    }

    const ok = () => {

        if(pilihan != 0){
            var params={
                karyawan_khusus:khusus, 
                absen_datang:!datang,
                // ...current_params
            }
            // Reactotron.log('params on pressing ok')
            // Reactotron.log(params)

            if(kerja){
                _panel.hide()
                if(pilihan == '2'){
                    // props.navigation.navigate("absence_gps",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                    params.office_name = "LACAKGPS";
                    props.navigation.replace("absence_photo",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                    
                    // if(!datang){
                    //     props.navigation.replace("absence_photo",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                    // }else{
                    //     props.navigation.navigate("absence_gps",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
                    // }

                }else if(pilihan == '1'){
                    if(!datang){
                        props.navigation.navigate("absence_pertanyaan",{params,onGoBack: () => props.navigation.state.params.onGoBack()});
                    }else{
                        props.navigation.navigate("absence_scan_qr",{params,onGoBack: () => props.navigation.state.params.onGoBack()});
                    }
                }else if(pilihan == '3'){
                    params = {
                        ...params,
                        wfh:true
                    }
                    props.navigation.navigate("absence_check_gps",{params, curParam: params, nextRoute: "absence_photo",workingFrom: "WFH",onGoBack: () => props.navigation.state.params.onGoBack()});
                }
                
            }else{
                alert('Anda belum menyelesaikan pekerjaan')
            }
        }else{
            alert('Anda belum memilih metode absensi')
        }
    }

    const cancel = () => {
        // menuModal.current.close()
        _panel.hide()
        }
    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

    		<ScrollView>
    			<Head type="detail" title={'History Absensi'} navigation={props.navigation} />
    			<View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                    <View style={{ marginBottom: 0, alignSelf: "center" }}>

                        {(!rootStore.settings.offline_mode &&
                            <View style={{...styles.container, marginBottom:0.111*deviceWidth}}>
                                <View style={{ flexDirection:'row' }}>
                                    <View style={{...styles.center}}>
                                        <Image source={require('@assets/ic_calendar.png')} style={styles.image_calendar} />
                                    </View>
                                    <TouchableOpacity onPress={()=>{openDateAwal()}}>
                                        <Text style={{...styles.date_text}}>{tanggalAwal}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{...styles.separator_line_grey}}/>
                                </View>
                                <View style={{ ...styles.akhir_tgl }}>
                                    <View style={{...styles.center}}>
                                        <Image source={require('@assets/ic_calendar.png')} style={styles.image_calendar} />
                                    </View>
                                    <TouchableOpacity onPress={()=>{openDateAkhir()}}>
                                        <Text style={{...styles.date_text}}>{tanggalAkhir}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        <View style={{...styles.base}}>
                            {_renderAbsence()}
                        </View>
                    </View>
    	        </View>
            </ScrollView>
            <SlidingUpPanel 
                friction={0.1}
                ref={c => _panel = c}
                containerStyle={{ backgroundColor: "#fff", borderRadius: 20, elevation: 7 }}
                allowDragging={false}
                draggableRange={{
                    top: 0.4*deviceHeight,
                    bottom: 0
                }}>
                <View style={{ ...layout.modal.body }}>
                <Text style={{ ...styles.modal_header, marginBottom: 10 }} text="Pilih Metode Absensi" />

                {(isMethodScanOpen &&
                    <View style={{flexDirection:'row', marginTop:0.083*deviceWidth}}>
                        <Radio 
                          selected={(pilihan == 1) ? true : false} 
                          // style={Styles.Form.Radio.input} 
                          onPress={() => setPilihan(1)}
                          />
                        <TouchableOpacity onPress={() => setPilihan(1)}>
                            <Text style={{ ...styles.pil_text  }} text="Scan QR Code" />
                        </TouchableOpacity>
                    </View>
                )}
                {(isMethodGPSOpen && !rootStore.settings.offline_mode &&
                    <View style={{flexDirection:'row', marginTop:0.02*deviceWidth}}>
                        <Radio 
                          selected={(pilihan == 2) ? true : false} 
                          // style={Styles.Form.Radio.input} 
                          onPress={() => setPilihan(2)}
                          />
                        <TouchableOpacity onPress={() => setPilihan(2)}>
                            <Text style={{ ...styles.pil_text }} text="Pelacakan GPS - Karyawan Khusus" />
                        </TouchableOpacity>
                    </View>
                )}
                {(isMethodWFHOpen && !rootStore.settings.offline_mode &&
                    <View style={{flexDirection:'row', marginTop:0.02*deviceWidth}}>
                        <Radio 
                          selected={(pilihan == 3) ? true : false} 
                          // style={Styles.Form.Radio.input} 
                          onPress={() => setPilihan(3)}
                        />
                        <TouchableOpacity onPress={() => setPilihan(3)}>
                            <Text style={{ ...styles.pil_text }} text="Work from home" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{flexDirection:'row',justifyContent: "space-between", marginTop:0.1*deviceWidth}}>
                    <TouchableOpacity onPress={()=>{ cancel() }} style={{...styles.cancel_button}}>
                        <Text style={{...styles.cancel_text}}>CANCEL</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={()=>{ ok() }} style={{...styles.ok_button}}>
                        <Text style={{...styles.ok_text}}>OK</Text>
                    </TouchableOpacity>    
                </View>
              </View>
            </SlidingUpPanel>
            {(pulang) &&
                <TouchableOpacity onPress={ ()=> absenFunction() } style={{...styles.absen_button}}>
                    <Image source={require('@assets/fingerprint_white.png')} style={styles.fingerprint_image} />
                    <Text style={{...styles.absen_text}}>ABSEN</Text>
                </TouchableOpacity>
            }
        </View>
    )
})
