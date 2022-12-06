import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, Picker, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, RefreshControl } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomDrawerCustom, SectionedMultiSelect } from "@vendor"
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
import { clone } from 'lodash';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Reactotron from 'reactotron-react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    title: {
        marginBottom: 10
    },
    sublabel: {
        color: "#000", marginRight: 5
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


export interface NotesScreenProps extends NavigationScreenProps<{}> {
}

export const NotesScreen: React.FunctionComponent<NotesScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const [cariText, setCariText] = useState(null);
    const [tasks, setTasks] = useState({
        first: [],
        second: [],
    });

    // const [progresses, setProgresses] = useState([]);
    // const [reviews, setReviews] = useState([]);
    // const [dones, setDones] = useState([]);

    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
        props.navigation,
    ])

    // const netInfo = useNetInfo();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadNotes(cariText, filterData);
        setRefreshing(false);
    }, [refreshing]);

    useEffect(() => {
        loadNotes(cariText, filterData);
    }, []);

    const loadNotes = async (search, additional) => {
        var param = {};

        if (search) {
            param.title = search;
        }

        if (additional) {
            param = {
                ...param,
                ...additional
            };
        }

        setLoading(true);
        var result = await rootStore.getNotes(param);
        setLoading(false);

        // notes untuk catatan yg di buat diri sendiri
        // catatan saya untuk catatan yg di share oleh org lain
        // reactotron.log(result.data);

        if (result.kind == "ok" && result.data) {
            var datas = {
                own: [],
                shared: [],
            };

            // let tempArr = result.data.data.notes.reverse();
            let tempArr = result.data.data;

            datas.own = tempArr.notes.reverse();
            datas.shared = tempArr.catatan_saya.reverse();

            /*
            tempArr.map((item, i) => {
                // switch (item.id) {
                //     case 3:
                //         datas.first.push(item);
                //         break;

                //     case 5:
                //         datas.second.push(item);
                //         break;
                // }

                if(item.created_by != rootStore.getCurrentUser().id){
                    datas.shared.push(item);
                }else{
                    datas.own.push(item);
                }
                
            });
            */

            // reactotron.log(datas)

            setTasks(datas);
        }
    }

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'own_notes', title: 'Catatan Saya' },
        { key: 'shared_notes', title: 'Catatan yang Dibagikan' },
    ]);

    const FirstRoute = () => (
        <View style={{ flex: 1 }}>
            {_render("own")}
        </View>
    );

    const SecondRoute = () => (
        <View style={{ flex: 1 }}>
            {_render("shared")}
        </View>
    );

    const renderScene = SceneMap({
        own_notes: FirstRoute,
        shared_notes: SecondRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ ...layout.tabs.indicator }}
            style={{ ...layout.tabs.container }}
            tabStyle={{ width: deviceWidth * 0.35 }}
            scrollEnabled={true}
            labelStyle={{ ...layout.tabs.title }}
            activeColor={"#381D5C"}
            inactiveColor={"#BABABA"}
        />
    );

    const onSubmit = (values) => {
        // Reactotron.log(values)
    }

    const SearchSchema = Yup.object().shape({
        search: Yup.string()
            .required('Search is required'),
    });

    const formatDate = (datenow) => {
        return moment(datenow).format('Do MMM YYYY');

        // return moment(datenow).calendar(null, {
        //   sameElse: 'Do MMM YYYY'
        // })
    }

    const _render = (slug) => {
        var slugnow = slug;
        var datas = tasks[slugnow];

        return (
            <View key={slugnow}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={layout.container.content_wtabbar}>

                    <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                        <Formik
                            initialValues={{
                                search: rootStore.showCurrentUser("search"),
                            }}
                            validationSchema={SearchSchema}
                            onSubmit={values => onSubmit(values)}>
                            {props => (
                                <View style={{ ...styles.action.wrapper, ...styles.row }}>
                                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
                                        <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
                                        <TextInput
                                            style={{ ...layout.textbox.input }}
                                            placeholder="Cari Catatan..."
                                            onChangeText={props.handleChange('search')}
                                            onBlur={props.handleBlur('search')}
                                            value={props.values.search}
                                            onSubmitEditing={() => {
                                                loadNotes(props.values.search, filterData)
                                            }}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            loadNotes(props.values.search, filterData)
                                        }}
                                        style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn }}
                                    >
                                        <Icon name="ios-search" size={20} style={{ color: "#fff", marginRight: 10 }} />
                                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Cari</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>

                        {!!datas && datas.length > 0 && datas.map((item, i) => {

                            return (
                                <TouchableOpacity
                                    onPress={() => navigateTo('form_notes', { item: item, type: "edit", onBack: onRefresh, share_type: slugnow })}
                                    style={{...layout.file_field.container_inside, marginBottom: 20, backgroundColor: "white", flexDirection: "column" }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: "#5F5959",
                                            fontWeight: "bold",
                                        }}
                                        text={item.title}
                                    />

                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#5F5959",
                                            marginVertical: 10,
                                        }}
                                        text={item.content}
                                    />

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#BABABA",
                                        }}
                                        text={formatDate(item.date)}
                                    />

                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                                        <Image
                                            style={{
                                            width: 20,
                                            height: 20,
                                            resizeMode: "contain",
                                            }}
                                            source={require('@assets/ic_book.png')}
                                        />

                                        <Text style={{
                                            fontSize: 12,
                                            color: "#5F5959",
                                            marginLeft: 5,
                                        }}>{(!!item.user) ? item.user.name : ''}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }

    {/* Filter */ }
    const [filterData, setfilterData] = useState({
        // assignee_user_id: "all",
        // board_column_id: "",
        // start_date: "",
        // end_date: "",
        date: "",
        limit: 300,
        offset: 0
    });
    const [filterUI, setfilterUI] = useState({
        start_date_picker: false,
        end_date_picker: false
    });

    const changeFilterValue = (variable, value, filterd = "filterData") => {
        eval("var tmp_data = " + filterd);
        var next_data = clone(tmp_data);

        if (typeof value == "string") {
            eval("next_data." + variable + " = '" + value + "'");
        } else {
            eval("next_data." + variable + " = " + value);
        }

        eval("set" + filterd + "(next_data)");
    }

    const confirmFilter = () => {
        _panelFilter.hide();

        setTimeout(function () {
            loadNotes(cariText, filterData);
        }, 500);
    }

    const _renderFilter = () => {
        return (
            <SlidingUpPanel
                ref={c => _panelFilter = c}
                containerStyle={{ ...layout.bottom_notif.container }}
                backdropStyle={{ ...layout.bottom_notif.backdrop }}
                allowDragging={false}
                draggableRange={{
                    top: deviceHeight - 20,
                    bottom: 0
                }}
                friction={0.3}
            >
                <View style={{ ...layout.bottom_notif.wrapper }}>
                    <Text style={layout.bottom_notif.title}>Filter</Text>
                </View>

                <ScrollView style={{ ...layout.bottom_notif.wrapper, marginBottom: 50 }}>
                    <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tanggal</Text>
                    <TouchableOpacity
                        onPress={() => changeFilterValue("date_picker", true, "filterUI")}
                        style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.input }}
                            placeholder="Tanggal "
                            editable={false}
                            value={filterData.date}
                        />
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={filterUI.date_picker}
                        onConfirm={(date) => {
                            var dd = moment(date).format("YYYY-MM-DD");
                            changeFilterValue("date", dd.toString());
                            changeFilterValue("date_picker", false, "filterUI");
                        }}
                        onCancel={() => {
                            changeFilterValue("date_picker", false, "filterUI");
                        }}
                    />

                    {/* <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tanggal Mulai</Text>
                    <TouchableOpacity
                        onPress={() => changeFilterValue("start_date_picker", true, "filterUI")}
                        style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.input }}
                            placeholder="Tanggal Mulai "
                            editable={false}
                            value={filterData.start_date}
                        />
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={filterUI.start_date_picker}
                        onConfirm={(date) => {
                            var dd = moment(date).format("YYYY-MM-DD");
                            changeFilterValue("start_date", dd.toString());
                            changeFilterValue("start_date_picker", false, "filterUI");
                        }}
                        onCancel={() => {
                            changeFilterValue("start_date_picker", false, "filterUI");
                        }}
                    />

                    <Text style={{ ...layout.typography.h3, marginBottom: 10 }}>Tanggal Selesai</Text>
                    <TouchableOpacity
                        onPress={() => changeFilterValue("end_date_picker", true, "filterUI")}
                        style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.input }}
                            placeholder="Tanggal Selesai "
                            editable={false}
                            value={filterData.end_date}
                        />
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={filterUI.end_date_picker}
                        onConfirm={(date) => {
                            var dd = moment(date).format("YYYY-MM-DD");
                            changeFilterValue("end_date", dd.toString());
                            changeFilterValue("end_date_picker", false, "filterUI");
                        }}
                        onCancel={() => {
                            changeFilterValue("end_date_picker", false, "filterUI");
                        }}
                    /> */}
                </ScrollView>

                <View style={{ ...layout.bottom_notif.row }}>
                    <Button
                        onPress={() => {
                            _panelFilter.hide();
                        }}
                        style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.no_shadow, ...layout.bottom_notif.btn }}
                    >
                        <Text style={{ ...layout.button.text, ...layout.button.text_outline }}>BATAL</Text>
                    </Button>

                    <Button onPress={() => confirmFilter()} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.bottom_notif.btn, marginLeft: 20 }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>OK</Text>
                    </Button>
                </View>
            </SlidingUpPanel>
        )
    }

    // var whoseTask = (filterData.assignee_user_id == rootStore.getCurrentUser().id) ? "Saya" : "Semua"

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />

            <Head type="detail" title={'Catatan'} navigation={props.navigation} noBorder={true}
                // right_content={(
                //   <View style={{ flexDirection: 'row' }}>
                //     <Icon name="ios-cog" size={16} style={{ color: "#000", marginRight: 5 }} />
                //     <Text style={{ ...layout.typography.body_smaller }}>Filter</Text>
                //   </View>
                // )}
                right_action={() => _panelFilter.show()}
                right_content={(
                    <View onPress={props.handleSubmit} style={{ ...layout.button.outline, ...layout.button.wrapper, ...layout.button.small, paddingVertical: 5, paddingHorizontal: 10 }}>
                        {/*<Image source={require('@assets/ico-filter-white.png')} style={layout.button.icon} />*/}
                        <Icon name="ios-wine" size={14} style={{ color: "#8D8D8D", marginRight: 5 }} />
                        <Text style={{ ...layout.button.text, ...layout.button.text_outline, fontSize: 12 }}>Filter</Text>
                    </View>
                )}
            />

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
            />

            <TouchableOpacity
                onPress={() => navigateTo('form_notes', { type: "add", onBack: onRefresh })}
                style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.floating_btn }}>
                <Image source={require('@assets/fingerprint_white.png')} style={layout.button.icon} />
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Tambah Catatan</Text>
            </TouchableOpacity>

            {_renderFilter()}
        </View>
    )
})
