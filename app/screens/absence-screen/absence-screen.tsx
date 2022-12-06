import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Head, Icon, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
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
// import BottomDrawer from 'rn-bottom-drawer';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    section: {
        borderTopWidth: 1, borderColor: "#ececec", paddingTop: 40
    },
    absence_desc: {
        marginBottom: 10, textAlign: "center"
    }
}

export interface AbsenceScreenProps extends NavigationScreenProps<{}> {
}

let interval;
export const AbsenceScreen: React.FunctionComponent<AbsenceScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [todayAttendance, setTodayAttendance] = useState(false);
    const [todayFinish, setTodayFinish] = useState(false);
    const [attendances, setAttendances] = React.useState([]);
    const [attendance_settings, setAttendanceSettings] = React.useState(null);
    const [clock, setClock] = React.useState(null);

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
		props.navigation,
	])

    // const netInfo = useNetInfo();

    useEffect( () => {

        loadAttendances();
        loadAttendanceSettings();

        interval = setInterval(function(){
            setClock(moment().format("LTS"));
        }, 1000);

        // unmount
        return () => {
            clearInterval(interval);
        }
    }, []);

    const loadAttendances = async () => {

        setLoading(true);
        var param = {

        }
        var result = await rootStore.getAttendances(param);
        setLoading(false);

        if(result.kind == "ok"){
            setAttendances(result.data);

            // mark if today already clockin
            if(moment().format("DD-MM-YYYY") == moment(result.data[0].clock_in_time).format("DD-MM-YYYY")){
                setTodayAttendance(true);
            }

            // mark if today already clockin & clockout
            if(moment().format("DD-MM-YYYY") == moment(result.data[0].clock_out_time).format("DD-MM-YYYY")){
                setTodayFinish(true);
            }
        }
    }
    const loadAttendanceSettings = async () => {

        setLoading(true);
        var param = {

        }
        var result = await rootStore.getAttendanceSettings(param);
        setLoading(false);

        if(result.kind == "ok"){
            setAttendanceSettings(result.data);
        }
    }

    const storeAttendance = (type) => {
        var str = "";
        if(type == 'clockin'){
            str = "masuk"
        }else{
            str = "pulang"
        }

        Alert.alert(
          "Perhatian",
          "Apa anda yakin untuk melakukan absen "+str,
          [
            {
              text: "Batalkan",
              // onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Lanjut", onPress: () => doStore(type) }
          ],
          { cancelable: true }
        );
    }

    const doStore = async (type) => {
        setLoading(true);
        var param = {
            date: moment().format("YYYY-MM-DD"),
            working_from: "office",
            late: "no",
            half_day: "no"
        }

        if(type == "clockin"){
            var obj = {
                clock_in_time: clock,
                clock_in_ip: "::1",
                clock_out_ip: "::1"
            }
        }else if(type == "clockout"){

            var obj = {
                clock_in_time: moment(attendances[0].clock_in_time).format("LTS"),
                clock_in_ip: "::1",
                clock_out_time: clock,
                clock_out_ip: "::1"
            }
        }
        param = {
            ...param,
            ...obj
        };

        var result = await rootStore.storeAttendance(param);
        setLoading(false);

        if(result.kind == "ok"){
            Toast.show("Absensi Berhasil");

            setTimeout(function(){
                navigateTo("home");
            }, 1500);
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

    const withinOfficeHour = () => {
        if(attendance_settings){
            var office_start = moment().format("YYYY-MM-DD")+" "+attendance_settings[0].office_start_time;
            var office_end = moment().format("YYYY-MM-DD")+" "+attendance_settings[0].office_end_time;

            if(moment().isBetween(office_start, office_end)){
                return true;
            }
        }
        return false;
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

    		<ScrollView>
    			<Head type="detail" title={I18n.t("general.attendance")} navigation={props.navigation} />

    			<View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

                    <View style={{ marginBottom: 80, alignSelf: "center" }}>

                        {(!todayAttendance && withinOfficeHour() &&
                            <View>
                                <Text style={{ ...styles.absence_desc }} text="Anda belum absen hari ini" />
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ padding: 20, borderColor: "#1979a9", width: deviceWidth/3, borderWidth: 1, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                                        <Text style={{ color: "#000" }}>{clock}</Text>
                                    </View>

                                    <TouchableOpacity 
                                        onPress={() => storeAttendance("clockin")}
                                        style={{ ...layout.list.component.btn, padding: 10, margin: 0, width: 90 }}>
                                        <Text style={{ ...layout.list.component.btn_txt, fontSize: 12 }}>Absen Masuk</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {(todayAttendance && !todayFinish && withinOfficeHour() &&
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <View style={{ padding: 20, borderColor: "red", width: deviceWidth/3, borderWidth: 1, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                                    <Text style={{ color: "#000" }}>{clock}</Text>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => storeAttendance("clockout")}
                                    style={{ ...layout.list.component.btn, padding: 10, margin: 0, width: 90, backgroundColor: "red" }}>
                                    <Text style={{ ...layout.list.component.btn_txt, fontSize: 12 }}>Absen Keluar</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {(!withinOfficeHour() &&
                            <Text style={{ ...styles.absence_desc }}>Batas absensi sudah lewat{"\n"}Tidak berada pada jam kantor</Text>
                        )}

                        {(todayFinish &&
                            <Text style={{ ...styles.absence_desc }}>Hari ini anda telah melakukan proses absensi masuk dan pulang</Text>
                        )}
                    </View>
    	        	
                    {(attendances.map((item,i) => {

                        var arr = [];

                        if(item.clock_out_time){
                            arr.push(
                        		<View key={"co"+i} style={{ ...layout.list.notif.section }}>
                        			<View style={{ ...layout.list.notif.info }}>
                        				<Text style={{ ...layout.list.notif.title }} text="Absen Keluar" />
                        				<Text style={{ ...layout.list.notif.description }} text={formatDate(item.clock_out_time)} />
                        			</View>
                        			<View>
                        				<Text style={{ ...layout.list.notif.date }} text={formatTime(item.clock_out_time)} />
                        			</View>
                        		</View>
                            )
                        }

                        if(item.clock_in_time){
                            arr.push(
                                <View key={"ci"+i} style={{ ...layout.list.notif.section }}>
                                    <View style={{ ...layout.list.notif.info }}>
                                        <Text style={{ ...layout.list.notif.title }} text="Absen Masuk" />
                                        <Text style={{ ...layout.list.notif.description }} text={formatDate(item.clock_in_time)} />

                                        {(item.late == "yes" &&
                                            <Text style={{ ...layout.list.notif.description, marginTop: 5, color: "red" }} text="Terlambat" />
                                        )}
                                    </View>
                                    <View>
                                        <Text style={{ ...layout.list.notif.date }} text={formatTime(item.clock_in_time)} />
                                    </View>
                                </View>
                            )
                        }

                        return arr;
                    }))}
    	        	
    	        </View>
            </ScrollView>

    		<Footer active="attendance" navigation={props.navigation} />
        </View>
    )
})
