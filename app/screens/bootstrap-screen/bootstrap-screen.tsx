import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ImageBackground, Picker, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, Screen, Button, Checkbox, FormRow, Header, Head, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Ads } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import OneSignal from 'react-native-onesignal';
import PushNotification from 'react-native-push-notification';
import * as Animatable from 'react-native-animatable';
// import BottomDrawer from 'rn-bottom-drawer';
import { Client } from 'bugsnag-react-native';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import { translate } from "@i18n"
import { CONFIG } from "@utils/config"
import moment from "moment";
import MapView from 'react-native-maps';
import Modal from 'react-native-modalbox';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
import SlidingUpPanel from 'rn-sliding-up-panel';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface BootstrapScreenProps extends NavigationScreenProps<{}> {
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const styles = {
    
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
        width:0.32*deviceWidth,
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
        width:0.32*deviceWidth,
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
    function_text:{
        fontSize:14,
        color:"#3B3B3B",
      },
      modal_container:{
        width:0.305*deviceWidth, 
        height:0.16*deviceWidth, 
        position:'absolute', 
        top:-0.65*deviceWidth, 
        right:0.4*deviceWidth, 
        borderRadius:10,
        borderWidth:1,
        zIndex:3,
      }
}

export const BootstrapScreen: React.FunctionComponent<BootstrapScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  	const rootStore = useStores()
  	const [loading, setLoading] = useState(false);
  	const [current_user_role, setCurrentUserRole] = useState(null);
  	const [refreshing, setRefreshing] = React.useState(false);
  	const [tasks, setTasks] = React.useState([]);
  	const [currentCompany, setCurrentCompany] = React.useState([]);
  	const [companyLogo, setCompanyLogo] = React.useState(require('@assets/logo.png'));
  	const [notifications, setNotifications] = React.useState([]);
    const [activeSections, setActiveSections] = React.useState([0]);
    const menuModal = useRef(null);
    const opsiModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
        props.navigation,
    ])


    // Tabs
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'element', title: 'Element' },
        { key: 'typography', title: 'Typography' },
        { key: 'grids', title: 'Grids' },
    ]);

    const FirstRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderElement()}
      </View>
    );

    const SecondRoute = () => (
      <View style={{ flex: 1 }}>
        {_renderTypo()}
      </View>
    );

    const ThirdRoute = () => (
      <View style={{ flex: 1 }} />
    );
    const renderScene = SceneMap({
        element: FirstRoute,
        typography: SecondRoute,
        grids: ThirdRoute,
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

    //Modal
    const openModal = () => {
        menuModal.current.open()
        }

    const closeModal = () => {
        menuModal.current.close()
        }

    const openModalOpsi = () => {
        opsiModal.current.open()
        }

    const closeModalOpsi = () => {
        opsiModal.current.close()
        }
    // Accordion
    const SECTIONS = [
        {
            title: 'Isi detail tugas',
            slug: "detail-tugas"
        },
        {
            title: 'Opsi tugas',
            slug: "opsi-tugas"
        },
        {
            title: 'Unggah dokumen pendukung',
            slug: "unggah-dokumen"
        },
    ];

    const _renderSectionTitle = section => {
        return (
          <View style={styles.content}>
            
          </View>
        );
    };

    const _renderHeader = section => {
        return (
          <View style={{ ...layout.accordion.header.wrapper }}>
            <Text style={{ ...layout.typography.h4, ...layout.accordion.header.title }}>{section.title}</Text>
            <Icon name="ios-arrow-down" style={{ ...layout.accordion.header.icon }} size={20} />
          </View>
        );
    };

    const _renderContent = section => {
        return (
          <View style={{ ...layout.accordion.content.wrapper }}>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nibh sapien, venenatis sit amet orci vel, interdum pharetra eros. Integer varius et augue at placerat. Integer vel metus vel lacus ullamcorper condimentum non in nisl.</Text>
          </View>
        );
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    const _renderTypo = () => {
        return(
            <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                {/* Title */}
                <Text text="Title" style={{ marginVertical: 20 }} />
                <Text style={layout.typography.h1}>Manrope Bold 24 px</Text>
                <Text style={layout.typography.h2}>Manrope Bold 21 px</Text>
                <Text style={layout.typography.h3}>Manrope Bold 16 px</Text>
                <Text style={layout.typography.h4}>Manrope Bold 14 px</Text>
                <Text style={layout.typography.h5}>Manrope Bold 12 px</Text>

                {/* Body copy */}
                <Text text="Body Copy" style={{ marginVertical: 20 }} />
                <Text text="Manrope Regular 14 px" />
                <Text style={layout.typography.body}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nibh sapien, venenatis sit amet orci vel, interdum pharetra eros. Integer varius et augue at placerat. Integer vel metus vel lacus ullamcorper condimentum non in nisl.</Text>

                <Text text="Manrope Bold 14 px" style={{ marginTop: 20 }} />
                <Text style={{ ...layout.typography.body, ...layout.typography.bold }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nibh sapien, venenatis sit amet orci vel, interdum pharetra eros. Integer varius et augue at placerat. Integer vel metus vel lacus ullamcorper condimentum non in nisl.</Text>

                <Text text="Manrope Bold 12 px" style={{ marginTop: 20 }} />
                <Text style={{ ...layout.typography.body_smaller, ...layout.typography.bold }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nibh sapien, venenatis sit amet orci vel, interdum pharetra eros. Integer varius et augue at placerat. Integer vel metus vel lacus ullamcorper condimentum non in nisl.</Text>

                <Text text="Manrope Regular 12 px" style={{ marginTop: 20 }} />
                <Text style={{ ...layout.typography.body_smaller }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nibh sapien, venenatis sit amet orci vel, interdum pharetra eros. Integer varius et augue at placerat. Integer vel metus vel lacus ullamcorper condimentum non in nisl.</Text>
            </View>
        )
    }

    const editFunction = (params) => {
        alert('you hit edit function with params '+params)
        }

    const deleteFunction = (params) => {
        alert('you hit delete function with params '+params)
        }

    const _renderElement = () => {
        return(
            <View>
                <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

                    {/* Filter Element */}
                    <Text text="Filter Element" style={{ marginVertical: 20 }} />
                    <View style={{...layout.list.container }}>
                        <TouchableOpacity style={{ flexDirection:'row' }}>
                            <View style={{...layout.list.center}}>
                                <Image source={require('@assets/ic_calendar.png')} style={layout.list.image_calendar} />
                            </View>
                            <Text style={{...layout.list.date_text}}>Pilih batas awal periode</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <View style={{...layout.list.separator_line_grey}}/>
                        </View>
                        <TouchableOpacity style={{ ...layout.list.akhir_tgl }}>
                            <View style={{...layout.list.center}}>
                                <Image source={require('@assets/ic_calendar.png')} style={layout.list.image_calendar} />
                            </View>
                            <Text style={{...layout.list.date_text}}>Pilih batas akhir periode</Text>
                        </TouchableOpacity>
                    </View>

                    {/* List Element */}
                    <Text text="List Element" style={{ marginVertical: 20 }} />
                    <TouchableOpacity style={{...layout.list.absence_list}}>
                        <View style={layout.list.status_box_in}>
                            <Text style={layout.list.status_list_in}>IN</Text>
                        </View>
                        
                        <Text style={layout.list.date_list}>19 Sep 2020</Text>
                        <Text style={layout.list.absen_list}>Absen - 19.00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...layout.list.absence_list}}>
                        <View style={layout.list.status_box_in}>
                            <Text style={layout.list.status_list_in}>IN</Text>
                        </View>
                        
                        <Text style={layout.list.date_list}>19 Sep 2020</Text>
                        <Text style={layout.list.absen_list}>Absen - 19.00</Text>
                    </TouchableOpacity>

                    <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                        <View style={{ ...styles.row, ...layout.list_row.container }}>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Pemberi Tugas</Text>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>John Doe</Text>
                        </View>
                        <View style={{ ...styles.row, ...layout.list_row.container }}>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Proyek</Text>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>Pembaruan semua surat dan perijinan</Text>
                        </View>
                        <View style={{ ...styles.row, ...layout.list_row.container }}>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Tanggal Mulai</Text>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>13 April 2020</Text>
                        </View>
                        <View style={{ ...styles.row, ...layout.list_row.container }}>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_label }}>Deadline</Text>
                          <Text style={{ ...layout.typography.body, ...layout.list_row.list_value }}>20 April 2020</Text>
                        </View>
                    </View>

                    {/* Alert */}
                    <Text text="Alert" style={{ marginVertical: 20 }} />
                    <View style={{ ...layout.alert.wrapper, ...layout.alert.info }}>
                        <Text style={layout.alert.text}>Anda mempunyai 9 pemberitahuan penting. Lihat di sini.</Text>
                        <TouchableOpacity style={layout.alert.close}>
                            <Icon name="ios-close" style={{ color: "#535353" }} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ ...layout.alert.wrapper, ...layout.alert.info_alt }}>
                      <Text style={{ ...layout.alert.text, ...layout.alert.text_info_alt }}>Tugas ini mengharuskan anda untuk mengaktifkan GPS. </Text>
                    </View>

                    {/* Buttons */}
                    <Text text="Button Disabled" style={{ marginVertical: 20 }} />
                    <Button onPress={props.handleSubmit} style={{ ...layout.button.disabled, ...layout.button.wrapper }} disabled={true}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_disabled }}>Submit</Text>
                    </Button>

                    <Text text="Button Large" style={{ marginVertical: 20 }} />
                    <Button onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Submit</Text>
                    </Button>

                    <Text text="Button Large with icon" style={{ marginVertical: 20 }} />
                    <Button onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper }}>
                        <Image source={require('@assets/fingerprint_white.png')} style={layout.button.icon} />
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Submit</Text>
                    </Button>

                    <Text text="Button Small" style={{ marginVertical: 20 }} />
                    <TouchableOpacity onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Submit</Text>
                    </TouchableOpacity>

                    <Text text="Button Small with icon" style={{ marginVertical: 20 }} />
                    <TouchableOpacity onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small }}>
                        <Image source={require('@assets/fingerprint_white.png')} style={layout.button.icon} />
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Submit</Text>
                    </TouchableOpacity>

                    <Text text="Button Large Outline" style={{ marginVertical: 20 }} />
                    <Button onPress={props.handleSubmit} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>Submit</Text>
                    </Button>

                    {/* Labels */}
                    <Text text="Labels" style={{ marginVertical: 20 }} />
                    <View style={layout.container.row}>
                        <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Warning</Text>
                        <Text style={{ ...layout.label.wrapper, ...layout.label.primary }}>Primary</Text>
                        <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>Error</Text>
                        <Text style={{ ...layout.label.wrapper, ...layout.label.info }}>Info</Text>
                    </View>

                    {/* Radio */}
                    <Text text="Radio" style={{ marginVertical: 20 }} />
                    <TouchableOpacity style={layout.radio.wrapper}>
                        <View style={layout.radio.rounded}>
                            <View style={layout.radio.rounded_active}>
                            </View>
                        </View>
                        <Text style={layout.radio.text}>Scan QR Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={layout.radio.wrapper}>
                        <View style={layout.radio.rounded}></View>
                        <Text style={layout.radio.text}>Scan QR Code</Text>
                    </TouchableOpacity>

                    {/* Checkbox */}
                    <Text text="Checkbox" style={{ marginVertical: 20 }} />
                    <TouchableOpacity style={layout.checkbox.wrapper}>
                        <View style={layout.checkbox.rounded}>
                            <Icon name="ios-checkmark" style={{ ...layout.checkbox.rounded_active }} size={20} />
                        </View>
                        <Text style={layout.checkbox.text}>Scan QR Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={layout.checkbox.wrapper}>
                        <View style={layout.checkbox.rounded}></View>
                        <Text style={layout.checkbox.text}>Scan QR Code</Text>
                    </TouchableOpacity>

                    {/* Textbox */}
                    <Text text="Textbox" style={{ marginVertical: 20 }} />
                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.input }}
                            placeholder="Nama"
                            placeholderTextColor={color.placeholder}
                        />
                    </View>

                    <Text text="Textbox with icon" style={{ marginVertical: 20 }} />
                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                        <TextInput
                            style={{ ...layout.textbox.input }}
                            placeholder="Nama"
                        />
                    </View>

                    <Text text="Textbox disabled" style={{ marginVertical: 20 }} />
                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.disabled }}>
                        <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                        <TextInput
                            style={{ ...layout.textbox.input }}
                            placeholder="Nama"
                            editable={false}
                        />
                    </View>

                    {/* Textarea */}
                    <Text text="Textarea" style={{ marginVertical: 20 }} />
                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.textarea }}
                            placeholder="Tulis deskripsi pengajuan Anda"
                            multiline={true}
                        />
                    </View>

                    {/* Dropdown */}
                    <Text text="Dropdown" style={{ marginVertical: 20 }} />
                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <Icon name="ios-lock" style={{ ...layout.textbox.icon }} size={20} />
                        <Picker
                            // selectedValue={selectedValue}
                            // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            style={{ ...layout.dropdown.input }}
                        >
                            <Picker.Item label="Java" value="java" />
                            <Picker.Item label="JavaScript" value="js" />
                        </Picker>
                    </View>

                    {/* File Field */}
                    <Text text="File Field" style={{ marginVertical: 20 }} />
                    <View style={{...layout.file_field.container }}>
                        <View style={{...layout.file_field.container_inside}}>
                            <View style={{flexDirection:'row'}}>
                                <Image source={require('@assets/doc.png')} style={{...layout.file_field.image_doc}} />
                                <View style={{marginLeft:0.027*deviceWidth}}>
                                    <Text style={{...layout.file_field.namefile}}>IMG-1234.jpg</Text>
                                    <Text style={{...layout.file_field.sizefile}}>210 kb</Text>
                                </View>
                            </View>
                            <View style={{...layout.file_field.button_group}}>
                                <Image source={require('@assets/ic_delete.png')} style={{...layout.file_field.image_ic_delete}} />
                                <Image source={require('@assets/ic_download.png')} style={{...layout.file_field.image_ic_download}} />
                            </View>
                        </View>
                    </View>

                    {/* Location Picker */}
                    <Text text="Location Picker" style={{ marginVertical: 20 }} />

                    <View style={{...layout.location_picker.container}}>
                        <View style={{...layout.location_picker.map_view}}>
                            <MapView
                                style={{...layout.location_picker.image_map}}
                                initialRegion={{
                                  latitude: 37.78825,
                                  longitude: -122.4324,
                                  latitudeDelta: 0.0922,
                                  longitudeDelta: 0.0421,
                                }}
                            />
                        </View>
                        <Text style={{...layout.location_picker.desc}}>Kantor Samsat Surabaya
                        </Text>
                        <Text style={{...layout.location_picker.desc}}>Jl. Manyar Kertoarjo No.1, Manyar 
                        </Text>
                        <Text style={{...layout.location_picker.desc}}>Sabrangan, Kec. Mulyorejo, Kota SBY, Jawa Timur 60116
                        </Text>
                        <Text style={{...layout.location_picker.desc}}>(-7.221277, 122.721976)
                        </Text>
                    </View>

                    {/* Accordion */}
                    <Text text="Accordion" style={{ marginVertical: 20 }} />
                    <Accordion
                        sections={SECTIONS}
                        activeSections={activeSections}
                        renderSectionTitle={_renderSectionTitle}
                        renderHeader={_renderHeader}
                        renderContent={_renderContent}
                        onChange={_updateSections}
                        underlayColor={"#fff"}
                        sectionContainerStyle={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, ...layout.accordion.section }}
                    />

                    {/* Activity Timeline */}
                    <Text text="Activity Timeline" style={{ marginVertical: 20 }} />
                    <View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section }}>
                        <View style={{ ...layout.list_activity.line }} />

                        <View style={layout.list_activity.wrapper}>
                          <Image style={layout.list_activity.avatar} source={require("@assets/dummy_avatar.png")} />
                          <View style={layout.list_activity.info}>
                            <View style={styles.row}>
                              <Text style={{ ...styles.activity_person }}>John Doe</Text>
                              <Text style={{ ...layout.typography.body }}>mulai mengerjakan tugas ini</Text>
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
                              <Text style={{ ...layout.typography.body }}>mulai mengerjakan tugas ini</Text>
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
                              <Text style={{ ...layout.typography.body }}>mulai mengerjakan tugas ini</Text>
                            </View>
                            <View style={{ ...styles.row, marginTop: 10 }}>
                              <Text style={{ ...layout.list_activity.date, ...layout.typography.body_smaller }}>13 April 2020</Text>
                              <Text style={{ ...layout.list_activity.time, ...layout.typography.body_smaller }}>13:08</Text>
                            </View>
                          </View>
                        </View>
                    </View>

                    {/* Switch */}
                    <Text text="Switch" style={{ marginVertical: 20 }} />

                    {/* Maps */}
                    <Text text="Maps" style={{ marginVertical: 20 }} />

                    {/* Popup */}
                    <Text text="Popup" style={{ marginVertical: 20 }} />
                    <TouchableOpacity onPress={openModal} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>MODAL</Text>
                    </TouchableOpacity>
                    {/* Opsi */}
                    <Text text="Opsi" style={{ marginVertical: 20 }} />

                    {/* Bottom Notif */}
                    <Text text="Bottom Notif" style={{ marginVertical: 20 }} />
                    <TouchableOpacity onPress={() => _panel.show()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Press</Text>
                    </TouchableOpacity>
                </View>

                <SlidingUpPanel 
                    ref={c => _panel = c}
                    containerStyle={{ ...layout.bottom_notif.container }}
                    backdropStyle={{ ...layout.bottom_notif.backdrop }}
                    allowDragging={false}
                    draggableRange={{
                        top: 240,
                        bottom: 0
                    }}
                    friction={0.3}
                >
                    <View style={{ ...layout.bottom_notif.wrapper }}>
                        <Text style={layout.bottom_notif.title}>Hapus Tugas</Text>
                    </View>
                    <View style={{ ...layout.bottom_notif.wrapper, ...layout.bottom_notif.row, marginBottom: 50 }}>
                        <Icon name="ios-information-circle-outline" style={{ ...layout.bottom_notif.icon }} size={40} />
                        <Text style={layout.bottom_notif.text}>Apakah anda yakin anda akan menghapus tugas ini?</Text>
                    </View>
                    <View style={{ ...layout.bottom_notif.row }}>
                        <Button onPress={() => _panel.hide()} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}>
                            <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                        </Button>
                        <Button onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                            <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                        </Button>
                    </View>
                </SlidingUpPanel>
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

  	return (
	    <View style={layout.container.general}>
			<ScrollView>

				{/* Head Element */}

                <Animatable.View ref={handleViewRef} style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.header_option.container }}>
                  <TouchableOpacity style={{ ...layout.header_option.wrapper }}>
                    <Text style={layout.typography.body}>Edit Tugas</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ ...layout.header_option.wrapper, marginBottom: 0 }}>
                    <Text style={layout.typography.body}>Hapus</Text>
                  </TouchableOpacity>
                </Animatable.View>
				<Head type="detail" title={'Bootstrap'} navigation={props.navigation} 
                    noBorder={true} //true tidak ada garisnya, false ada garisnya
                    // opsi={openModalOpsi} // isikan modal untuk menampilkan opsinya
                    opsi={() => togglePopup() } // isikan modal untuk menampilkan opsinya
                />
                
                {/* Tabs */}
                <TabView
                  navigationState={{ index, routes }}
                  renderScene={renderScene}
                  onIndexChange={setIndex}
                  initialLayout={{ width: Dimensions.get('window').width }}
                  renderTabBar={renderTabBar}
                />

				
	        </ScrollView>
            <Modal
                style={{ ...layout.modalbox.modal}}
                ref={menuModal}
                backdropPressToClose={true}
                swipeToClose={true}>
              <View style={{ ...layout.modal.body }}>
                <Text style={{...layout.modalbox.modal_header}} text="Tolak Laporan Tugas?" />
                <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, marginTop:0.077*deviceWidth }}>
                    <TextInput
                        style={{ ...layout.textbox.textarea }}
                        placeholder="Tulis alasan anda menolak laporan ini"
                        multiline={true}
                    />
                </View>
                <View style={{...layout.modalbox.button_modal}}>
                    <TouchableOpacity onPress={()=>{ closeModal() }} style={{...layout.modalbox.batal_button}}>
                        <Text style={{...layout.modalbox.batal_text}}>BATAL</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={()=>{ closeModal() }} style={{...layout.modalbox.ok_button}}>
                        <Text style={{...layout.modalbox.ok_text}}>OK</Text>
                    </TouchableOpacity>    
                </View>
              </View>
            </Modal>
	    </View>
  	)
})
