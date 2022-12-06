import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, DatePickerAndroid, Picker } from "react-native"
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
import { Radio } from 'native-base';
import Reactotron from 'reactotron-react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import DateTimePicker from "react-native-modal-datetime-picker";

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    base:{
        paddingLeft:0.055*deviceWidth,
        paddingRight:0.055*deviceWidth,
    },
    image_calendar:{
        height:0.041*deviceWidth,
        width:0.041*deviceWidth,
        marginRight:0.055*deviceWidth,
    },
    row: {
        flexDirection: "row"
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
    meeting_list:{
        // width: 0.875*deviceWidth,
        borderRadius:10,
        elevation:1,
        padding:0.055*deviceWidth,
        marginBottom:0.027*deviceWidth
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
    meet_list:{
        fontSize:12,
        color:"#5F5959",
        },
    meeting_button:{
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
    meeting_text:{
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
        },
    action: {
        wrapper: {
          marginBottom: 0
        },
        btn: {
          marginLeft: 10
        },
        textbox: {
          flex: 1
        }
      },
    }


export interface MeetingScreenProps extends NavigationScreenProps<{}> {
}

export const MeetingScreen: React.FunctionComponent<MeetingScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [tanggalAwal, setTanggalAwal] = useState('Pilih batas awal periode');
    const [tanggalAkhir, setTanggalAkhir] = useState('Pilih batas akhir periode');
    const [startDatePicker, setStartDatePicker] = useState(false);
    const [finishDatePicker, setFinishDatePicker] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [meeting, setMeeting] = React.useState([
            {
                'id':1,
                'title':'Meeting Zoom',
                'date':'Senin, 1 September 2020',
                'time':'09:00',                
            },
            {
                'id':1,
                'title':'Meeting Zoom',
                'date':'Senin, 1 September 2020',
                'time':'09:00',                
            },
        ]);
  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
		props.navigation,
	])


    useEffect( () => {
        
    }, []);

    
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

    const _renderMeeting = () => {
        var arr = [];

        meeting.map((item,i) => {
          arr.push(
            <TouchableOpacity style={{...styles.meeting_list}}>
                {/*jika ada status2 bisa ditambah di salah satu style*/}
                {/*style 1*/}
                {/*<View style={styles.status_box_in}>
                    <Text style={styles.status_list_in}>Belum dimulai
                    </Text>
                </View>*/}
                {/*style 2*/}
                {/*<View style={styles.status_box_out}>
                    <Text style={styles.status_list_out}>Selesai
                    </Text>
                </View>*/}
                <Text style={styles.date_list}>{item.title}
                </Text>
                <Text style={styles.meet_list}>{item.date}, {item.time}
                </Text>
            </TouchableOpacity>
          )
        });

        return arr;
      }

    const addMeetingPage = () => {
        navigateTo("add_meeting")
    }

    const confirmFilter = () => {

      _panelFilter.hide();

      setTimeout(function(){
        // loadStatus(cariText, filterData);
      }, 500);
    }

    

    const cari = () => {
      Reactotron.log(searchText)
    }

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

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tanggal Mulai</Text>
                <TouchableOpacity 
                  onPress={() => setStartDatePicker(true)} 
                  style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <TextInput
                      style={{ ...layout.textbox.input }}
                      placeholder="Tanggal Mulai "
                      editable={false}
                      value={tanggalAwal}
                  />
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={startDatePicker}
                  onConfirm={(date) => {
                    var dd = moment(date).format("YYYY-MM-DD");
                    setTanggalAwal(dd.toString())
                    setStartDatePicker(false)
                  }}
                  onCancel={() => {
                    setStartDatePicker(false)
                  }}
                />

                <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tanggal Selesai</Text>
                <TouchableOpacity 
                  onPress={() => setFinishDatePicker(true)} 
                  style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                  <TextInput
                      style={{ ...layout.textbox.input }}
                      placeholder="Tanggal Selesai "
                      editable={false}
                      value={tanggalAkhir}
                  />
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={finishDatePicker}
                  onConfirm={(date) => {
                    var dd = moment(date).format("YYYY-MM-DD");
                    setTanggalAkhir(dd.toString())
                    setFinishDatePicker(false)
                  }}
                  onCancel={() => {
                    setFinishDatePicker(false)
                  }}
                />

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

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

    		<ScrollView>
    			
            <Head type="detail" title={'Daftar Meeting'} navigation={props.navigation} noBorder={false} 
              right_action={() => _panelFilter.show()}
              right_content={(
                <View onPress={props.handleSubmit} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.small, paddingVertical: 5, paddingHorizontal: 10 }}>
                    {/*<Image source={require('@assets/ico-filter-white.png')} style={layout.button.icon} />*/}
                    <Icon name="ios-wine" size={14} style={{ color: "#8D8D8D", marginRight: 5 }} />
                    <Text style={{ ...layout.button.text, ...layout.button.text_outline, fontSize: 12 }}>Filter</Text>
                </View>
              )}/>
    			<View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

                    <View style={{ marginBottom: 0, alignSelf: "center" }}>
                        <View style={{ ...styles.action.wrapper, ...styles.row }}>
                          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
                            <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
                            <TextInput
                                style={{ ...layout.textbox.input }}
                                placeholder="Cari Meeting..."
                                value={searchText}
                                onChangeText={text => setSearchText(text)}
                                onSubmitEditing={()=>{
                                    cari()
                                  // loadTasks(slugnow, board_column_id, props.values.search)
                                }}
                            />
                          </View>
                          <TouchableOpacity 
                            onPress={() => {
                              cari()
                            }} 
                            style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn }}
                          >
                              {/*<Image source={require('@assets/ico-filter-white.png')} style={layout.button.icon} />*/}
                              <Icon name="ios-search" size={20} style={{ color: "#fff", marginRight: 10 }} />
                              <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Cari</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{...layout.container.wrapper, ...layout.container.bodyView}}>
                            {_renderMeeting()}
                        </View>
                    </View>
    	        </View>
            </ScrollView>
            <TouchableOpacity onPress={()=>{ addMeetingPage() }} style={{...styles.meeting_button}}>
                <Image source={require('@assets/fingerprint_white.png')} style={styles.fingerprint_image} />
                <Text style={{...styles.meeting_text}}>Tambah Meeting</Text>
            </TouchableOpacity>
            {_renderFilter()}
        </View>
    )
})
