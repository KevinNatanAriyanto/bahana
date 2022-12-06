import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, DatePickerAndroid, KeyboardAvoidingView } from "react-native"
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
import Accordion from 'react-native-collapsible/Accordion';
import Reactotron from 'reactotron-react-native';
import DocumentPicker from 'react-native-document-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  row: {
    flexDirection: "row"
  },
  icon_add: {
    marginRight: 10, color: "#381D5C"
  }
}


export interface FormPengajuanScreenProps extends NavigationScreenProps<{}> {
}

export const FormPengajuanScreen: React.FunctionComponent<FormPengajuanScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const menuModal = useRef(null);
    const [leaveType, setLeaveType] = useState([]);
    const [leaveOnlyType, setLeaveOnlyType] = useState([]);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const [activeSections, setActiveSections] = React.useState([0]);
    const [dropdownType, setDropdownType] = useState('')
    const [dataDropdownType, setDataDropdownType] = useState({
      id:0,
      type:''
    })
    
    const [refScrollView, setRefScrollView] = useState(null);

    //ijin
    const [tanggalIjin, setTanggalIjin] = useState('Tanggal Mulai Izin');
    const [tanggalIjinSelesai, setTanggalIjinSelesai] = useState('Tanggal Selesai Izin');
    const [idPengajuan, setIdPengajuan] = useState(-1);
    const [alasanIjin, setAlasanIjin] = useState('');
    const [fileIjin, setFileIjin] = useState(null);
    const [ijinDescription, setIjinDescription] = useState('');

    //cuti
    const [tanggalMulaiCuti, setTanggalMulaiCuti] = useState('Tanggal Mulai Cuti');
    const [tanggalAkhirCuti, setTanggalAkhirCuti] = useState('Tanggal Akhir Cuti');
    const [cutiType, setCutiType] = useState('');
    const [cutiTypeDropdownVal, setCutiTypeDropdownVal] = useState('');
    const [cutiTypeLabel, setCutiTypeLabel] = useState('');
    const [cutiDescription, setCutiDescription] = useState('');

    //dinas sementara
    const [tanggalDinasSementara, setTanggalDinasSementara] = useState('Tanggal Dinas Sementara');
    const [datePickerAwalDinas, setDatePickerAwalDinas] = useState(false);
    const [datePickerAkhirDinas, setDatePickerAkhirDinas] = useState(false);
    const [jamAwalDinas, setJamAwalDinas] = useState('Jam Mulai Dinas');
    const [jamAkhirDinas, setJamAkhirDinas] = useState('Jam Selesai Dinas');
    const [tujuanDinas, setTujuanDinas] = useState('');
    const [dinasDescription, setDinasDescription] = useState('');
    
    //dinas luar kota
    const [tanggalAwalDinasLuar, setTanggalAwalDinasLuar] = useState('Tanggal Awal Dinas');
    const [tanggalAkhirDinasLuar, setTanggalAkhirDinasLuar] = useState('Tanggal Selesai Dinas');
    const [ruteAwalDinas, setRuteAwalDinas] = useState('');
    const [ruteAkhirDinas, setRuteAkhirDinas] = useState('');
    const [alasanDinas, setAlasanDinas] = useState('');
    const [biayaDinas, setBiayaDinas] = useState(0);
    const [dinasLuarDescription, setDinasLuarDescription] = useState('');
    const [myLeave, setMyLeave] = useState(null);

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {
      loadLeaveType()
      loadLeaveOnlyType()
      loadMyLeave()
    }, []);

    const loadLeaveType = async () => {
      // get new data of user profile
      setLoading(true);
      var result = await rootStore.getLeaveType();
      setLoading(false);
      if(result.kind == "ok" && result.data){
        setLeaveType(result.data)
      }
    }
    const loadLeaveOnlyType = async () => {
      // get new data of user profile
      setLoading(true);
      var result = await rootStore.getLeaveOnlyType();
      setLoading(false);
      if(result.kind == "ok" && result.data.tipeCuti){
        setLeaveOnlyType(result.data.tipeCuti)
      }
    }
    const loadMyLeave = async () => {
      // get new data of user profile
      setLoading(true);
      var result = await rootStore.getMyLeave();
      setLoading(false);
      if(result.kind == "ok" && result.data){
        setMyLeave(result.data)
      }
    }

    const renderMyLeave = (type) => {
      if(!!myLeave && !!type && type != ""){

        if(type.indexOf("+") != -1){
          var ll = myLeave[type.split('+')[1]]
        }else{
          var ll = myLeave[type]
        }

        if(!!ll){
          return ll.leave_taken+ "/" +ll.limit;
        }else{
          return null;
        }
      }
    }

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

              setTanggalIjin(pickedDate)
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

              setTanggalIjinSelesai(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

    const openDateAwalCuti = async () => {
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

              setTanggalMulaiCuti(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

    const openDateAkhirCuti = async () => {
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

              setTanggalAkhirCuti(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

    const openDateDinasSementara = async () => {
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

              setTanggalDinasSementara(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

    const openDateMulaiDinas = async () => {
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

              setTanggalAwalDinasLuar(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

  const openDateSelesaiDinas = async () => {
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

              setTanggalAkhirDinasLuar(pickedDate)
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }
        }else{
                  }
      }

    const pickDocument = async () => {
      try {
        const results = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        // Reactotron.log('results')
        // Reactotron.log(results)
        setFileIjin(results);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }

    const ajukan = async () => {
      var valid = false;

      if(dataDropdownType.type != ''){

        let formData = new FormData();

        switch(dataDropdownType.type){
          case "izin":
            if(idPengajuan && tanggalIjin != "Tanggal Mulai Izin" && tanggalIjinSelesai != "Tanggal Selesai Izin" && alasanIjin != ""){
              valid = true;
            }

            var date_awal = tanggalIjin.split('-')
            var dateAwal = date_awal[2]+'-'+date_awal[1]+'-'+date_awal[0]
            var date_akhir = tanggalIjinSelesai.split('-')
            var dateAkhir = date_akhir[2]+'-'+date_akhir[1]+'-'+date_akhir[0]

            formData.append("leave_type_id", idPengajuan );
            formData.append("leave_date", dateAwal);
            formData.append("leave_date_end", dateAkhir);
            formData.append("alasan_izin", alasanIjin);
            // formData.append("surat_keterangan_sakit", skrg);
            if(fileIjin){
              formData.append("surat_keterangan_sakit", {
                uri: fileIjin.uri,
                name: 'photo.jpg',
                type: (fileIjin.type) ? fileIjin.type : "image/jpeg"
              });
            }
            
            formData.append("deskripsi", ijinDescription);
          break;
          case "cuti":
            if(idPengajuan && tanggalMulaiCuti != "Tanggal Mulai Cuti" && tanggalAkhirCuti != "Tanggal Akhir Cuti" && cutiDescription != ""){
              valid = true;
            }

            var date_awal = tanggalMulaiCuti.split('-')
            var dateAwal = date_awal[2]+'-'+date_awal[1]+'-'+date_awal[0]
            var date_akhir = tanggalAkhirCuti.split('-')
            var dateAkhir = date_akhir[2]+'-'+date_akhir[1]+'-'+date_akhir[0]

            formData.append("leave_type_id", idPengajuan );
            formData.append("leave_date", dateAwal);
            formData.append("leave_date_end", dateAkhir);
            // formData.append("kategori_cuti", cutiType);
            // formData.append("tipe_cuti_id", cutiType);
            formData.append("deskripsi", cutiDescription);
          break;
          case "cuti-3-bulanan":
            if(idPengajuan && tanggalMulaiCuti != "Tanggal Mulai Cuti" && tanggalAkhirCuti != "Tanggal Akhir Cuti" && cutiDescription != ""){
              valid = true;
            }

            var date_awal = tanggalMulaiCuti.split('-')
            var dateAwal = date_awal[2]+'-'+date_awal[1]+'-'+date_awal[0]
            var date_akhir = tanggalAkhirCuti.split('-')
            var dateAkhir = date_akhir[2]+'-'+date_akhir[1]+'-'+date_akhir[0]

            formData.append("leave_type_id", idPengajuan );
            formData.append("leave_date", dateAwal);
            formData.append("leave_date_end", dateAkhir);
            // formData.append("kategori_cuti", cutiType);
            // formData.append("tipe_cuti_id", cutiType);
            formData.append("deskripsi", cutiDescription);
          break;
          case "cuti-custom":
            if(idPengajuan && tanggalMulaiCuti != "Tanggal Mulai Cuti" && tanggalAkhirCuti != "Tanggal Akhir Cuti" && cutiType && cutiDescription != ""){
              valid = true;
            }

            var date_awal = tanggalMulaiCuti.split('-')
            var dateAwal = date_awal[2]+'-'+date_awal[1]+'-'+date_awal[0]
            var date_akhir = tanggalAkhirCuti.split('-')
            var dateAkhir = date_akhir[2]+'-'+date_akhir[1]+'-'+date_akhir[0]

            formData.append("leave_type_id", idPengajuan );
            formData.append("leave_date", dateAwal);
            formData.append("leave_date_end", dateAkhir);
            formData.append("kategori_cuti", cutiType);
            formData.append("tipe_cuti_id", cutiType);
            formData.append("deskripsi", cutiDescription);
          break;
          case "dinas-sementara":
            if(idPengajuan && tanggalDinasSementara != "Tanggal Dinas Sementara" && jamAwalDinas != "Jam Mulai Dinas" && jamAkhirDinas != "Jam Selesai Dinas" && tujuanDinas != "" && dinasDescription != ""){
              valid = true;
            }

            var date_awal = tanggalDinasSementara.split('-')
            var dateAwal = date_awal[2]+'-'+date_awal[1]+'-'+date_awal[0]

            formData.append("leave_type_id", idPengajuan);
            formData.append("leave_date", dateAwal);
            formData.append("leave_date_end", dateAwal);
            formData.append("jam_mulai", jamAwalDinas);
            formData.append("jam_selesai", jamAkhirDinas);
            formData.append("tujuan_dinas", tujuanDinas);
            formData.append("deskripsi", dinasDescription);
          break;
          case "dinas-luar-kota":
            if(idPengajuan && tanggalAwalDinasLuar != "Tanggal Awal Dinas" && tanggalAkhirDinasLuar != "Tanggal Selesai Dinas" && ruteAwalDinas != "" && ruteAkhirDinas != "" && alasanDinas != "" && biayaDinas != "" && dinasLuarDescription != ""){
              valid = true;
            }

            var date_awal = tanggalAwalDinasLuar.split('-')
            var dateAwal = date_awal[2]+'-'+date_awal[1]+'-'+date_awal[0]
            var date_akhir = tanggalAkhirDinasLuar.split('-')
            var dateAkhir = date_akhir[2]+'-'+date_akhir[1]+'-'+date_akhir[0]

            formData.append("leave_type_id", idPengajuan);
            formData.append("leave_date", dateAwal);
            formData.append("leave_date_end", dateAkhir);
            formData.append("rute_awal", ruteAwalDinas);
            formData.append("rute_akhir", ruteAkhirDinas);
            formData.append("alasan", alasanDinas);
            formData.append("biaya", biayaDinas);
            formData.append("deskripsi", dinasLuarDescription);
          break;
        }

        Reactotron.log(formData)
        
        if(valid){
          // Reactotron.log('formData 2')
          // Reactotron.log(formData)
          setLoading(true);
          var result = await rootStore.leaveStore(formData);
          setLoading(false);

          Reactotron.log("=================result");
          Reactotron.log(result);
          if(result.kind == "ok" && result.data.data){
            // goback
            alert(result.data.message)
            props.navigation.goBack(null)
          }
        }else{
          Toast.show("Lengkapi semua field");
        }
      }else{
        alert('Anda belum memilih tipe pengajuan')
      }
      
    }

    const deleteFileIjin = () =>{
      // alert('s')
      setFileIjin(null)
    }

    const setTipe = (itemValue) =>{
      // Reactotron.log(itemValue)

      var param = itemValue.split('+')
      var value = {
        id:0,
        type:''
      }
      if(param[1] == 'Ijin'){
        value = {
          id:param[0],
          type:'izin'
        }
      }else if(param[1] == 'Cuti 3 Bulanan'){
        value = {
          id:param[0],
          type:'cuti-3-bulanan'
        }
      }else if(param[1] == 'Cuti Lainnya' || param[1] == 'Cuti Custom'){
        value = {
          id:param[0],
          type:'cuti-custom'
        }
      }else if(param[1] == 'Cuti' || param[1] == 'Cuti Tahunan'){
        value = {
          id:param[0],
          type:'cuti'
        }
      }else if(param[1] == 'Dinas sementara'){
        value = {
          id:param[0],
          type:'dinas-sementara'
        }
      }else if(param[1] == 'Dinas Luar Kota'){
        value = {
          id:param[0],
          type:'dinas-luar-kota'
        }
      }

      setDropdownType(itemValue)
      setIdPengajuan(param[0])
      setDataDropdownType(value)
    }
    const _renderIzin = () => {
      return(
        <View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="calendar" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{openDateAwal()}} style={{ ...layout.textbox.input, justifyContent:'center'}}>
              <Text style={{...styles.date_text, textAlignVertical: "center", marginLeft:0.02*deviceWidth}} >{tanggalIjin}</Text>
            </TouchableOpacity>
            {/*<TextInput
                style={{ ...layout.textbox.input }}
                placeholder="Tanggal Izin"
            />*/}
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="calendar" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{openDateAkhir()}} style={{ ...layout.textbox.input, justifyContent:'center'}}>
              <Text style={{...styles.date_text, textAlignVertical: "center", marginLeft:0.02*deviceWidth}} >{tanggalIjinSelesai}</Text>
            </TouchableOpacity>
            {/*<TextInput
                style={{ ...layout.textbox.input }}
                placeholder="Tanggal Izin"
            />*/}
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
              <Picker
                  selectedValue={alasanIjin}
                  onValueChange={(itemValue, itemIndex) => setAlasanIjin(itemValue)}
                  style={{ ...layout.dropdown.input }}
              >
                  <Picker.Item label="Pilih Alasan Izin" value="" />
                  <Picker.Item label="Tidak Masuk" value="tidak-masuk" />
                  <Picker.Item label="Sakit" value="sakit" />
                  <Picker.Item label="Datang Terlambat" value="datang-terlambat" />
                  <Picker.Item label="Pulang Awal" value="pulang-awal" />
                  <Picker.Item label="Keluar Kantor" value="keluar-kantor" />
              </Picker>
          </View>

          <View style={{...layout.file_field.container, marginTop: 0, marginBottom: 20 }}>
          {(fileIjin) &&
              <View style={{...layout.file_field.container_inside, marginBottom: 20 }}>
                <View style={{flexDirection:'row'}}>
                  <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                  <View style={{marginLeft:0.027*deviceWidth}}>
                    <Text style={{...layout.file_field.namefile}}>{(fileIjin.name) ? fileIjin.name : fileIjin.filename}</Text>
                    <Text style={{...layout.file_field.sizefile}}>210 kb</Text>
                  </View>
                </View>
                <TouchableOpacity style={{...layout.file_field.button_group}} onPress={deleteFileIjin}>
                  <Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />
                </TouchableOpacity>
            </View>
          }

          
            
            <TouchableOpacity onPress={() => pickDocument()}>
              <View style={styles.row}>
                <Icon name="plus-square-o" style={{ ...styles.icon_add }} size={20} />
                <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Unggah File Keterangan</Text>
              </View>
              <Text style={{ ...layout.typography.body_smaller, paddingLeft: 30, color: color.placeholder }}>Contoh : surat dokter, surat keterangan dll</Text>
              <Text style={{ ...layout.typography.body_smaller, paddingLeft: 30, color: color.placeholder }}>Jika alasan izin anda adalah izin sakit yang memerlukan istirahat lebih dari satu harı</Text>
            </TouchableOpacity>

          </View>

          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <TextInput
                  style={{ ...layout.textbox.textarea }}
                  placeholder="Tulis deskripsi pengajuan Anda"
                  multiline={true}
                  onChangeText={text => setIjinDescription(text)}
                  value={ijinDescription}
                  onFocus={() => {
                    refScrollView.scrollToEnd({ animated: true })
                  }}
              />
          </View>
        </View>
      )
    }

    const setCutiTypeDropdown = (value) =>{
      var vl = value.split("+")

      // cutiTypeLabel = vl[1]
      setCutiType(vl[0])
      setCutiTypeLabel(vl[1])
      setCutiTypeDropdownVal(value)
    }
    const _renderCuti = () => {
      return(
        <View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="calendar" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{openDateAwalCuti()}} style={{ ...layout.textbox.input, justifyContent:'center'}}>
              <Text style={{...styles.date_text, textAlignVertical: "center", marginLeft:0.02*deviceWidth}} >{tanggalMulaiCuti}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="calendar" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{openDateAkhirCuti()}} style={{ ...layout.textbox.input, justifyContent:'center'}}>
              <Text style={{...styles.date_text, textAlignVertical: "center", marginLeft:0.02*deviceWidth}} >{tanggalAkhirCuti}</Text>
            </TouchableOpacity>
          </View>

          {(dataDropdownType.type == 'cuti-custom' &&
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={cutiTypeDropdownVal}
                    onValueChange={(itemValue, itemIndex) => setCutiTypeDropdown(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Pilih Kategori Cuti" value="" />
                    {(leaveOnlyType.map((item,i) => {
                      return(
                        <Picker.Item label={item.name} value={item.id+"+"+item.name} />
                      )
                    }))}
                </Picker>
            </View>
          )}

          {(dataDropdownType.type == 'cuti-custom' &&
            cutiTypeLabel != "" &&
            <View style={{ ...layout.textbox.wrapper }}>
              <Text>Digunakan: </Text>
              <Text>{renderMyLeave(cutiTypeLabel)}</Text>
            </View>
          )}

          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <TextInput
                  style={{ ...layout.textbox.textarea }}
                  placeholder="Tulis deskripsi pengajuan Anda"
                  multiline={true}
                  onChangeText={text => setCutiDescription(text)}
                  value={cutiDescription}
                  onFocus={() => {
                    refScrollView.scrollToEnd({ animated: true })
                  }}
              />
          </View>
        </View>
      )
    }

    const handleConfirmAwalDinas = (time) =>{
      
      var hours = new Date(time).getHours(); //To get the Current Hours
      var min = new Date(time).getMinutes(); //To get the Current Minutes
      if(hours<10){
        hours = '0'+hours
      }
      if(min<10){
        min = '0'+min
      }
      var waktu = hours+':'+min
      setJamAwalDinas(waktu)
    }

    const handleConfirmAkhirDinas = (time) =>{
      
      var hours = new Date(time).getHours(); //To get the Current Hours
      var min = new Date(time).getMinutes(); //To get the Current Minutes
      if(hours<10){
        hours = '0'+hours
      }
      if(min<10){
        min = '0'+min
      }
      var waktu = hours+':'+min
      setJamAkhirDinas(waktu)
    }

    const _renderDinasSementara = () => {
      return(
        <View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="calendar" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{openDateDinasSementara()}} style={{ ...layout.textbox.input, justifyContent:'center'}}>
              <Text style={{...styles.date_text, textAlignVertical: "center", marginLeft:0.02*deviceWidth}} >{tanggalDinasSementara}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="clock-o" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{setDatePickerAwalDinas(true)}}>
              <Text
                style={{ ...layout.textbox.input, textAlignVertical:'center' }}
                // placeholder="Jam Mulai Dinas"
                // value='sss'
              >{jamAwalDinas}</Text>
            </TouchableOpacity>
            
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="clock-o" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{setDatePickerAkhirDinas(true)}}>
              <Text
                  style={{ ...layout.textbox.input, textAlignVertical:'center' }}
                  // placeholder="Jam Selesai Dinas"
              >{jamAkhirDinas}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="map-marker" style={{ ...layout.textbox.icon }} size={20} />
            <TextInput
                style={{ ...layout.textbox.input }}
                placeholder="Tujuan Dinas Sementara"
                onChangeText={text => setTujuanDinas(text)}
                value={tujuanDinas}
            />
          </View>

          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <TextInput
                  style={{ ...layout.textbox.textarea }}
                  placeholder="Tulis deskripsi pengajuan Anda"
                  multiline={true}
                  onChangeText={text => setDinasDescription(text)}
                  value={dinasDescription}
                  onFocus={() => {
                    refScrollView.scrollToEnd({ animated: true })
                  }}
              />
          </View>
          <DateTimePickerModal
            isVisible={datePickerAwalDinas}
            mode="time"
            onConfirm={handleConfirmAwalDinas}
            onCancel={()=>{setDatePickerAwalDinas(false)}}
          />
          <DateTimePickerModal
            isVisible={datePickerAkhirDinas}
            mode="time"
            onConfirm={handleConfirmAkhirDinas}
            onCancel={()=>{setDatePickerAkhirDinas(false)}}
          />
        </View>
      )
    }

    const _renderDinasLuar = () => {
      return(
        <View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="map-marker" style={{ ...layout.textbox.icon }} size={20} />
            <TextInput
              style={{ ...layout.textbox.input }}
              placeholder="Rute Awal Dinas"
              onChangeText={text => setRuteAwalDinas(text)}
              value={ruteAwalDinas}/>
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="map-marker" style={{ ...layout.textbox.icon }} size={20} />
            <TextInput
              style={{ ...layout.textbox.input }}
              placeholder="Rute Akhir Dinas"
              onChangeText={text => setRuteAkhirDinas(text)}
              value={ruteAkhirDinas}
            />
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="calendar" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{openDateMulaiDinas()}} style={{ ...layout.textbox.input, justifyContent:'center'}}>
              <Text style={{...styles.date_text, textAlignVertical: "center", marginLeft:0.02*deviceWidth}} >{tanggalAwalDinasLuar}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="calendar" style={{ ...layout.textbox.icon }} size={20} />
            <TouchableOpacity onPress={()=>{openDateSelesaiDinas()}} style={{ ...layout.textbox.input, justifyContent:'center'}}>
              <Text style={{...styles.date_text, textAlignVertical: "center", marginLeft:0.02*deviceWidth}} >{tanggalAkhirDinasLuar}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="map-marker" style={{ ...layout.textbox.icon }} size={20} />
            <TextInput
                style={{ ...layout.textbox.input }}
                placeholder="Alasan Mengajukan Perjalanan…"
                onChangeText={text => setAlasanDinas(text)}
                value={alasanDinas}
            />
          </View>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
            <Icon name="money" style={{ ...layout.textbox.icon }} size={20} />
            <TextInput
                style={{ ...layout.textbox.input }}
                placeholder="Biaya yang Dibutuhkan"
                onChangeText={text => setBiayaDinas(text)}
                value={biayaDinas}
            />
          </View>

          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
              <TextInput
                  style={{ ...layout.textbox.textarea }}
                  placeholder="Tulis deskripsi pengajuan Anda"
                  multiline={true}
                  onChangeText={text => setDinasLuarDescription(text)}
                  value={dinasLuarDescription}
                  onFocus={() => {
                    refScrollView.scrollToEnd({ animated: true })
                  }}
              />
          </View>
        </View>
      )
    }

    const _renderForm = () => {
      // alert(dropdownType.id)
      // if(idPengajuan != -1){
      //   setIdPengajuan(dropdownType.id)  
      // }
      // var switchShow = datadropdownType.split('+')
      // Reactotron.log(dataDropdownType)

      switch(dataDropdownType.type){
        case "izin":
          return _renderIzin()
        break;
        case "cuti":
          return _renderCuti()
        break;
        case "cuti-tahunan":
          return _renderCuti()
        break;
        case "cuti-custom":
          return _renderCuti()
        break;
        case "cuti-3-bulanan":
          return _renderCuti()
        break;
        case "dinas-sementara":
          return _renderDinasSementara()
        break;
        case "dinas-luar-kota":
          return _renderDinasLuar()
        break;
      }
    }

    return (
      <KeyboardAvoidingView
        behavior={(Platform.OS === "ios") ? "padding" : null}
        style={layout.container.general}
      >
        <Loading loading={loading} />
        <Head type="detail" title={"Pengajuan"} navigation={props.navigation} />

        {(dropdownType == "cuti" &&
          <View style={{ ...layout.top_alert.container }}>
            <View style={{ ...layout.top_alert.wrapper }}>
              <Text style={layout.typography.body}>Pengajuan cuti dilakukan minimal H-7 dari tanggal  anda akan mengambil cuti.</Text>
            </View>
          </View>
        )}
        
        <ScrollView
          ref={(ref) => {
              setRefScrollView(ref);
          }}
          style={layout.container.content_wtabbar}
        >
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.disabled }}>
                <Icon name="user" style={{ ...layout.textbox.icon }} size={20} />
                <TextInput
                    style={{ ...layout.textbox.input }}
                    placeholder="Nama"
                    editable={false}
                    value={rootStore.getCurrentUser().name}
                />
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.disabled }}>
                <Icon name="user" style={{ ...layout.textbox.icon }} size={20} />
                <TextInput
                    style={{ ...layout.textbox.input }}
                    placeholder="Jabatan"
                    editable={false}
                    value={rootStore.getCurrentUser().user_other_role}
                />
            </View>
            <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                <Icon name="list-alt" style={{ ...layout.textbox.icon }} size={20} />
                <Picker
                    selectedValue={dropdownType}
                    onValueChange={(itemValue, itemIndex) => setTipe(itemValue)}
                    style={{ ...layout.dropdown.input }}
                >
                    <Picker.Item label="Pilih Tipe Pengajuan" value="" />
                    {leaveType.map((item,i)=>{
                    
                    return (<Picker.Item label={item.display_name} value={item.id+'+'+item.display_name} />)
                  })}
                    {/*<Picker.Item label="Izin" value="izin" />
                    <Picker.Item label="Cuti" value="cuti" />
                    <Picker.Item label="Dinas Sementara" value="dinas-sementara" />
                    <Picker.Item label="Dinas Luar Kota" value="dinas-luar-kota" />*/}
                </Picker>
            </View>

            {(dropdownType != '' && 
              dropdownType.split('+')[1] != 'Dinas sementara' && 
              dropdownType.split('+')[1] != 'Dinas Luar Kota' && 
              dropdownType.split('+')[1] != 'Ijin' && 
              dropdownType.split('+')[1] != 'Cuti Lainnya' &&
              <View style={{ ...layout.textbox.wrapper }}>
                <Text>Digunakan: </Text>
                <Text>{renderMyLeave(dropdownType)}</Text>
              </View>
            )}

            {_renderForm()}

            <Button onPress={ajukan} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>AJUKAN</Text>
            </Button>

            <View style={{height: 100}} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
})
