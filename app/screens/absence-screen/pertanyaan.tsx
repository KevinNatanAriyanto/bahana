import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, RefreshControl, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Head, Icon, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
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
import { Radio } from 'native-base';
import Reactotron from 'reactotron-react-native';
import WifiManager from "react-native-wifi-reborn";
const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    danger_box:{
        marginTop:0.055*deviceWidth,
        borderRadius:10,
        // elevation:1,
        // width:0.3*deviceWidth,
        paddingBottom:0.013*deviceWidth,
        paddingTop:0.013*deviceWidth,
        // paddingLeft:0.027*deviceWidth,
        // paddingRight:0.027*deviceWidth,
        backgroundColor:'#FAD2D2',
        marginBottom:0.02*deviceWidth,
        flexDirection:'row'
        // marginBottom:0.027*deviceWidth
        },
    danger_text:{
        fontSize:14,
        color:"#C13636",
    },
    high_priority:{
        height:0.055*deviceWidth,
        width:0.055*deviceWidth,
    },
    high_priority_view:{
        width:0.166*deviceWidth,
        justifyContent:'center',
        alignItems:'center'
    },
    thermometer:{
        width:0.041*deviceWidth,
        height:0.041*deviceWidth,
    },
    image_form_text_field:{
        justifyContent:'center',
        alignItems:'center',
        marginLeft:0.055*deviceWidth,
        marginRight:0.055*deviceWidth,
    },
    form_text_field:{
        width:0.88*deviceWidth,
        height:0.11*deviceWidth,
        flexDirection:'row',
        borderRadius:10,
        borderWidth:1,
        borderColor:"#BABABA",
        marginTop:0.055*deviceWidth
    },
    cinput_icon: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingLeft: 50,
        borderRadius: 10,
        width: null,
        backgroundColor: "#F5F5F5",
        },
    question_group:{
        marginTop:0.055*deviceWidth,
    },
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
    answer_group:{
        flexDirection:'row',
        marginTop:0.055*deviceWidth
    },
    next_button:{
        flexDirection:'row',
        alignSelf:'center',
        width:0.88*deviceWidth,
        height:0.111*deviceWidth,
        // borderWidth:1,
        borderRadius:10,
        backgroundColor:'#381D5C',
        // borderColor:'#8D8D8D'
        justifyContent:'center',
        alignItems:'center',
        position:'absolute', bottom:0.083*deviceWidth
        },
    next_text:{
        fontSize:14,
        color:"#FFFFFF",
        fontWeight: "bold",
        },

}

export interface PertanyaanScreenProps extends NavigationScreenProps<{}> {
}

export const PertanyaanScreen: React.FunctionComponent<PertanyaanScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [question1, setQuestion1] = useState(1);
    const [question2, setQuestion2] = useState(1);
    const [question, setQuestion] = useState([]);
    const [answer, setAnswer] = useState([]);
    // const [pilihan, setPilihan] = useState(1);
    const [isGpsOn, setIsGpsOn] = useState(true);

  	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

	const navigateTo = React.useMemo((routeName) => (routeName) => props.navigation.navigate(routeName), [
		props.navigation,
	])

    // const netInfo = useNetInfo();

    const NextSchema = Yup.object().shape({
      suhu: Yup.string().required('Isi field suhu terlebih dahulu'),
    });

    const checkWifiRadius = () => {
        WifiManager.loadWifiList().then(
          (WifiEntry) => {
            console.log("Listed successfully!");
            Reactotron.log(WifiEntry);
            var array = []
            JSON.parse(WifiEntry).map((item,i) => {
              Reactotron.log(item.BSSID)
              var data = item.BSSID
              // if(wifiAccess.includes(item.BSSID)){
              //   Toast.show("Anda berada pada radius kantor");
              // }
              array.push(data)
            });
            Reactotron.log(array)
            // setWifiAccess(array)
            setIsGpsOn(true);
          },
          (error) => {
            // console.log("Listed failed!");
            Reactotron.log(error);

            switch(error.code){
              case "locationServicesOff":
                setIsGpsOn(false)
                Toast.show("Anda belum menyalakan GPS");
              break;
              case "locationPermissionMissing":
                setIsGpsOn(false)
                Toast.show("Anda belum mengijinkan pemakaian GPS");
              break;
            }
          }
        );

    }

    const getQuestion = async () => {
        setLoading(true);
        var result = await rootStore.getQuestion();
        setLoading(false);

        // get from storage when offline
        var isOffline = false;
        if(result.kind != "ok"){
            result.data = {};
            result.kind = "ok"
            isOffline = true;

            result.data.pertanyaan = rootStore.getData("questions");
        }

        if(result.kind == "ok" && result.data){
            // Reactotron.log(result)
            setQuestion(result.data.pertanyaan)
            var array_isi = []
            for(var ii = 0; ii<result.data.pertanyaan.length;ii++){
                var data_isi = ''
                array_isi.push(data_isi)
            }
            setAnswer(array_isi)
        }
    }

    const next = async () => {

        checkWifiRadius();
        
        if(isGpsOn || rootStore.settings.offline_mode){
            var params = {
                ...props.navigation.state.params.params,
                pertanyaan:JSON.stringify(question),
                jawaban:JSON.stringify(answer),
                // suhu:values.suhu,
                // question1:(question1 == 1) ? 1 : 0,
                // question2:(question2 == 1) ? 1 : 0,
                }
            props.navigation.navigate("absence_scan_qr",{params, onGoBack: () => props.navigation.state.params.onGoBack()});
        }else{
            alert('Anda harus menyalakan dan memberi akses GPS, silahkan kembali setelah menyalakan GPS')
        }
        
    }

    const jawab = (values,i) => {
        arr = []
        answer.map((item,index)=>{
            Reactotron.log(values)
            Reactotron.log(i)
            Reactotron.log(item)
            Reactotron.log(index)
            var data = item
            if(i == index){
                data = values
            }
            arr.push(data)
        })
        Reactotron.log(arr)
        setAnswer(arr)
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        checkWifiRadius();

        setRefreshing(false);
        
    }, [refreshing]);
    
    useEffect( () => {
        getQuestion()
        checkWifiRadius()

    }, []);

    const _renderQuestion = () => {
        var arr = [];
        
        question.map((item,i) => {
          arr.push(
            <View style={{...styles.question_group}}>
                <Text style={{...styles.question_text}}>
                    {item.pertanyaan}
                </Text>
                <View style={styles.form_text_field}>
                    {/*<View style={{...styles.image_form_text_field}}>
                        <Image source={require('@assets/thermometer.png')} style={styles.thermometer} />
                    </View>*/}
                    <TextInput
                        onChangeText={(text)=>{jawab(text, i)}}
                        // onBlur={props.handleBlur('suhu')}
                        value={answer[i]}
                        // keyboardType={"numeric"}
                        // style={{ ...layout.form.cinput_icon }}
                        placeholder="Isi jawaban anda"
                        />
                </View>
            </View>
          )
        });

        return arr;
      }
    

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Head type="detail" title={'Isi Data Riwayat Kesehatan'} navigation={props.navigation} />
                {/*<Formik
                    initialValues={{ 
                    suhu: ""
                    }}
                    validationSchema={NextSchema}
                    onSubmit={values => next(values)}>
                    {props => (
                    
                    )}

                </Formik>*/}
                <View>
                    <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                        <View style={{ marginBottom: 0, alignSelf: "center" }}>
                            <View style={{...styles.base}}>
                                <View style={{...styles.danger_box}}>
                                    <View style={{...styles.high_priority_view}}>
                                        <Image source={require('@assets/high_priority.png')} style={styles.high_priority} />
                                    </View>
                                    <View style={{width:0.722*deviceWidth}}>
                                        <Text style={{...styles.danger_text}}>Anda wajib mengisi data riwayat kesehatan anda seputar COVID-19 untuk dapat melakukan absensi</Text>
                                    </View>
                                </View>
                                {_renderQuestion()}
                                {/*<View style={styles.form_text_field}>
                                    <View style={{...styles.image_form_text_field}}>
                                        <Image source={require('@assets/thermometer.png')} style={styles.thermometer} />
                                    </View>
                                    <TextInput
                                        onChangeText={props.handleChange('suhu')}
                                        onBlur={props.handleBlur('suhu')}
                                        value={props.values.suhu}
                                        keyboardType={"numeric"}
                                        // style={{ ...layout.form.cinput_icon }}
                                        placeholder="Isi suhu tubuh anda"
                                        />
                                </View>
                                <ErrorMessage errors={props.errors} style={{alignSelf:'flex-start'}}/>

                                <View style={{...styles.question_group}}>
                                    <Text style={{...styles.question_text}}>
                                        Apakah anda sudah melakukan PCR test?
                                    </Text>
                                    <View style={{...styles.answer_group}}>
                                        <Radio 
                                          selected={(question1 == 1) ? true : false} 
                                          // style={Styles.Form.Radio.input} 
                                          onPress={() => setQuestion1(1)}
                                          />
                                        <TouchableOpacity onPress={() => setQuestion1(1)}>
                                            <Text style={{...styles.answer_text}}>
                                                Sudah
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{...styles.answer_group}}>
                                        <Radio 
                                          selected={(question1 == 2) ? true : false} 
                                          // style={Styles.Form.Radio.input} 
                                          onPress={() => setQuestion1(2)}
                                          />
                                        <TouchableOpacity onPress={() => setQuestion1(2)}>
                                            <Text style={{...styles.answer_text}}>
                                                Belum
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{...styles.question_group}}>
                                    <Text style={{...styles.question_text}}>
                                        Apakah anda sudah mencuci tangan anda sebelum mulai bekerja?
                                    </Text>
                                    <View style={{...styles.answer_group}}>
                                        <Radio 
                                          selected={(question2 == 1) ? true : false} 
                                          // style={Styles.Form.Radio.input} 
                                          onPress={() => setQuestion2(1)}
                                          />
                                        <TouchableOpacity onPress={() => setQuestion2(1)}>
                                            <Text style={{...styles.answer_text}}>
                                                Sudah
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{...styles.answer_group}}>
                                        <Radio 
                                          selected={(question2 == 2) ? true : false} 
                                          // style={Styles.Form.Radio.input} 
                                          onPress={() => setQuestion2(2)}
                                          />
                                        <TouchableOpacity onPress={() => setQuestion2(2)}>
                                            <Text style={{...styles.answer_text}}>
                                                Belum
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            */}
                            </View>
                        </View>
                    </View>
                    
                    <TouchableOpacity onPress={()=>{next()}} style={{...styles.next_button}}>
                        <Text style={{...styles.next_text}}>LANJUTKAN KE ABSENSI</Text>
                    </TouchableOpacity> 
                    </View>
            </ScrollView>
        </View>
    )
})
