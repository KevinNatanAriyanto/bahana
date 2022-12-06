import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, RefreshControl, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, StyleSheet } from "react-native"
import { Text, Status, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
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
import { useNetInfo } from "@react-native-community/netinfo";
import Modal from 'react-native-modalbox';
// import BottomDrawer from 'rn-bottom-drawer';
import { Radio } from 'native-base';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import * as Animatable from 'react-native-animatable';
import SlidingUpPanel from 'rn-sliding-up-panel';

import ButtonForm from '../../components/buttonForm';
import ListFormContent from '../../components/listFormContent';
import AsyncStorage from '@react-native-community/async-storage';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  row: {
    flexDirection: "row", flex: 1, flexWrap: "wrap"
  },
  action: {
    wrapper: {
      marginBottom: 40
    },
    textbox: {
      flex: 1
    }
  },
}

	const dummyData = [
  {
    id: 1,
    titleForm : "List Form Anda",
    totalFormData : 4,
    showDeleteButton : false,
    formData : [
      {
        id   : 1,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/surat-tugas/create/65",
        text : "Form Surat Tugas",
        number : "KB/2022/01-01",
        date : "22/08/2022",
        status : "open"
      },
      {
        id   : 2,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/forminternal-memo/create/65",
        text : "Form Internal Memo",
        number : "KB/2022/01-02",
        date : "22/08/2022",
        status : "open"
      },
      {
        id   : 3,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/formpermintaan-dana/create/65",
        text : "Form Permintaan Dana",
        number : "KB/2022/01-03",
        date : "22/08/2022",
        status : "open"
      },
      {
        id   : 4,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/formkasbon-sementara/create/65",
        text : "Form Kasbon Sementara",
        number : "KB/2022/01-04",
        date : "22/08/2022",
        status : "open"
      }
    ]
  },
  {
    id: 2,
    titleForm : "List Form Yang Sudah Terkirim",
    totalFormData : 4,
    showDeleteButton : true,
    formData : [
      {
        id   : 5,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/surat-tugas/create/65",
        text : "Form Surat Tugas",
        number : "KB/2022/01-01",
        date : "22/08/2022",
        status : "sended"
      },
      {
        id   : 6,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/forminternal-memo/create/65",
        text : "Form Internal Memo",
        number : "KB/2022/01-02",
        date : "22/08/2022",
        status : "sended"
      },
      {
        id   : 7,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/formpermintaan-dana/create/65",
        text : "Form Permintaan Dana",
        number : "KB/2022/01-03",
        date : "22/08/2022",
        status : "sended"
      },
      {
        id   : 8,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/formkasbon-sementara/create/65",
        text : "Form Kasbon Sementara",
        number : "KB/2022/01-04",
        date : "22/08/2022",
        status : "sended"
      }
    ]
  },
  {
    id: 3,
    titleForm : "List Form Yang Sudah Di Approve",
    totalFormData : 4,
    showDeleteButton : true,
    formData : [
      {
        id   : 9,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/surat-tugas/create/65",
        text : "Form Surat Tugas",
        number : "KB/2022/01-01",
        date : "22/08/2022",
        status : "approved"
      },
      {
        id   : 10,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/forminternal-memo/create/65",
        text : "Form Internal Memo",
        number : "KB/2022/01-02",
        date : "22/08/2022",
        status : "approved"
      },
      {
        id   : 11,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/formpermintaan-dana/create/65",
        text : "Form Permintaan Dana",
        number : "KB/2022/01-03",
        date : "22/08/2022",
        status : "approved"
      },
      {
        id   : 12,
        link : "https://6c2a-123-253-232-155.ap.ngrok.io/formkasbon-sementara/create/65",
        text : "Form Kasbon Sementara",
        number : "KB/2022/01-04",
        date : "22/08/2022",
        status : "approved"
      }
    ]
  },
  {
    id: 4,
    titleForm : "List Form Yang Belum Di Approve",
    totalFormData : 4,
    showDeleteButton : true,
    formData : [
      {
        id   : 13,
        link : "http://ebislive.bahanagroup.com",
        text : "Form Cuti",
        number : "KB/2022/01-01",
        date : "22/08/2022",
        status : "waiting"
      },
      {
        id   : 14,
        link : "http://ebislive.bahanagroup.com",
        text : "Form Sakit",
        number : "KB/2022/01-02",
        date : "22/08/2022",
        status : "waiting"
      }
    ]
  },
];


export interface FormScreenProps extends NavigationScreenProps<{}> { }
export const FormScreen: React.FunctionComponent<FormScreenProps> = observer((props) => {
  const [listForm, setListForm] = useState([])
  const [activeTab, setActiveTab] = useState("Semua Form")
  
  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params ), [
    props.navigation,
  ])

  useEffect(() => {
    const setData = async () => {
      const checkStorage = await AsyncStorage.getItem('form_data')
      if(checkStorage !== null) {
        setListForm(JSON.parse(checkStorage))
  
      } else {
        setListForm(dummyData)
        await AsyncStorage.setItem('form_data', JSON.stringify(dummyData));
      }
    }

    setData()
  }, [])

  const filterForm = (active) => {
    let dataFilter = []
    setActiveTab(active)

    if(active !== "Semua Form") {
      for(const i in dummyData) {
        if(dummyData[i].titleForm === active) {
          dataFilter.push(dummyData[i])
        }
      }
  
      setListForm(dataFilter)
    } else {

      setListForm(dummyData)
    }
  }

      const filterSearch = (textCari) => {
            console.log(textCari);
   		    let filteredData = [];

   		    for(const i in dummyData) {

             let data ={
                 id: dummyData[i].id,
                 titleForm : dummyData[i].titleForm,
                 totalFormData : dummyData[i].totalFormData,
                 showDeleteButton : dummyData[i].showDeleteButton,
                 formData : []
             }

             let obj = dummyData[i].formData.find(o => o.text.toLowerCase() === textCari.toLowerCase());


                             	if (typeof(obj) !== 'undefined' && obj != null) {
             				         data.formData.push(obj);
             				  	}

             filteredData.push(data);
           }
            console.log(filteredData);
           setListForm(filteredData)
       }

         const deleteAction = (id) => {
/*             console.log(id);
           		    let filteredData = [];

          		    for(const i in dummyData) {
                   				let index = dummyData[i].formData.map(function(item) {
                   				    return item.id
                   				}).indexOf(id);
                   				dummyData[i].formData.splice(index, 1);
                           }

                           filteredData.push(dummyData);

                  setListForm(filteredData[0])
                  console.log(filteredData[0]); */
  }

  const clickWebview = (link, approved="open", data, formId) => {
    if(approved !== "waiting") {
      navigateTo("form_add", { link: link })
    } else {
      navigateTo("forms_approve", { link: link , data: data, formId: formId})
    }
  }

  return (
    <View style={layout.container.general}>
      <Head type="detail" title={'List form'} navigation={props.navigation} />
      <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
        <View style={{ ...styles.action.wrapper, ...styles.row, marginBottom: -10 }}>
          <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
            <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
            <TextInput
               onChange={(value) => filterSearch(value.nativeEvent.text)}
              style={{ ...layout.textbox.input }}

              placeholder="Cari nama form..."
            />

          </View>
        </View>
        <View style={style.bodyScroll}>
          <ScrollView style={layout.container.content_wtabbar} showsVerticalScrollIndicator={false}>
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
              <View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection:'row', paddingVertical:20 }}>
                    <ButtonForm text="Semua Form" onClick={filterForm} active={activeTab === "Semua Form" ? true : false}/>
                    <ButtonForm text="List Form Anda" onClick={filterForm} active={activeTab === "List Form Anda" ? true : false}/>
                    <ButtonForm text="List Form Yang Sudah Terkirim" onClick={filterForm} active={activeTab === "List Form Yang Sudah Terkirim" ? true : false}/>
                    <ButtonForm text="List Form Yang Sudah Di Approve" onClick={filterForm} active={activeTab === "List Form Yang Sudah Di Approve" ? true : false}/>
                    <ButtonForm text="List Form Yang Belum Di Approve" onClick={filterForm} active={activeTab === "List Form Yang Belum Di Approve" ? true : false}/>
                  </View>
                </ScrollView>
              </View>
              <View>
                {
                  listForm !== null &&
                  listForm.map((data, i) => {
                    return (
                      <ListFormContent title={data.titleForm} totalFormData={data.totalFormData} deleteAction={deleteAction} onClick={clickWebview} showDeleteBtn={data.showDeleteButton} formData={data.formData} key={i} idForm={data.id}/>
                    )
                  })
                }
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  )
})

const style = StyleSheet.create({
  bodyScroll : {
    marginTop: 50
  },
})