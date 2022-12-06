import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer, Head } from "@components"
import Icon from 'react-native-vector-icons/FontAwesome';
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
import Accordion from 'react-native-collapsible/Accordion';
import reactotron from 'reactotron-react-native';
import ImagePicker from 'react-native-image-crop-picker';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
    row: {
        flexDirection: "row"
    },
    icon_add: {
        marginRight: 10, color: "#381D5C"
    },
    section: {
        marginBottom: 20
    }
}


export interface FormAssigneeScreenProps extends NavigationScreenProps<{}> {
}

export const FormAssigneeScreen: React.FunctionComponent<FormAssigneeScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const [fieldDescription, setFieldDescription] = useState("");
    const [assignees, setAssignees] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState([]);
    const [selectedAssigneeName, setSelectedAssigneeName] = useState([]);

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
        props.navigation,
    ])

    useEffect(() => {
        loadAll()
    }, []);

    const loadAll = async () => {
        await loadAssignee();

        var tt = props.navigation.state.params.assignee;
        
        reactotron.log("======================= { tt }");
        reactotron.log({ tt });

        if (tt) {
            if(tt.assignees != null){
                // setSelectedAssignee([81,80]);

                var arr = [];
                var as = JSON.parse(tt.assignees);
                as.map((item,i ) => {
                    arr.push(parseInt(item))
                })
                setSelectedAssignee(arr);
            }

            setFieldDescription(tt.fieldDescription);
        }
    }

    const items = [
        {
            name: 'Pilih penerima catatan',
            id: 0,
            children: [
                {
                    id: rootStore.getCurrentUser().id,
                    name: "Diri Sendiri"
                },
                ...assignees
            ]
        },
    ];

    const loadAssignee = async () => {
        var param = {

        };

        setLoading(true);
        var result = await rootStore.getAssignee();
        setLoading(false);

        // get from storage when offline
        var isOffline = false;
        if (result.kind != "ok") {
            result.data = {};
            result.kind = "ok"
            isOffline = true;

            result.data.assignee = rootStore.getData("assignees");
        }

        if (result.kind == "ok" && result.data) {
            var array = []
            result.data.assignee.map((item, i) => {

                if (item.id != rootStore.getCurrentUser().id) {
                    data = {
                        ...item,
                        selected: false
                    }
                    array.push(data)
                }
            })
            // Reactotron.log(array)
            setAssignees(array)
        }
    }

    const doSave = async () => {
        if (selectedAssignee.length == 0) {
            Toast.show("Penerima catatan harus diisi");
            return;
        }
        if (fieldDescription == "") {
            Toast.show("Deskripsi pengumuman harus diisi");
            return;
        }

        reactotron.log("======================= { selectedAssignee, fieldDescription }");
        reactotron.log({ selectedAssignee, fieldDescription });
        props.navigation.state.params.onBack(selectedAssignee, fieldDescription, selectedAssigneeName);
        goBack();
    }

    return (
        <View style={layout.container.general}>
            <Loading loading={loading} />
            <Head type="detail" title={'Pilih Penerima Catatan'} navigation={props.navigation} />

            <ScrollView style={layout.container.content_wtabbar}>

                <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
                    <View style={{ marginBottom: 20, ...layout.textbox.outline, borderRadius: 10 }}>
                        <SectionedMultiSelect
                            items={items}
                            uniqueKey="id"
                            subKey="children"
                            selectText="Pilih penerima catatan"
                            searchPlaceholderText={"Cari Orang..."}
                            showDropDowns={false}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={(selectedItems) => {
                                setSelectedAssignee(selectedItems);
                            }}
                            onSelectedItemObjectsChange={(selectedItems) => {
                                let tempArr = selectedItems;
                                let tempResult = [];

                                for (let i = 0; i < tempArr.length; i++) {
                                    tempResult.push(tempArr[i].name);
                                }

                                setSelectedAssigneeName(tempResult);
                            }}
                            selectedItems={selectedAssignee}
                            // selectedItems={["24"]}
                            selectChildren={true}
                            single={false}
                        />
                    </View>

                    <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline }}>
                        <TextInput
                            style={{ ...layout.textbox.textarea }}
                            placeholder="Tulis pesan untuk catatan…"
                            multiline={true}
                            onChangeText={text => setFieldDescription(text)}
                            value={fieldDescription}
                        />
                    </View>

                    <Button onPress={() => doSave()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
                        <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>SIMPAN</Text>
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
})
