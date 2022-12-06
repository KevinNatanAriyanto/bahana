import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Alert, ScrollView, Picker, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
  delete_action: {
    alignSelf: "center", marginLeft: 20, marginTop: -20
  }
}


export interface AddMembersScreenProps extends NavigationScreenProps<{}> {
}

export const AddMembersScreen: React.FunctionComponent<AddMembersScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
    const [activeSections, setActiveSections] = React.useState([0]);

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    useEffect( () => {

    }, []);

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />
        <Head type="detail" title={'Tambah Anggota'} navigation={props.navigation} />
        
        <ScrollView style={layout.container.content_wtabbar}>
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

            <View style={styles.row}>
              <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, width: "90%" }}>
                  <Icon name="user-circle" style={{ ...layout.textbox.icon }} size={20} />
                  <Picker
                      // selectedValue={selectedValue}
                      // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                      style={{ ...layout.dropdown.input }}
                  >
                      <Picker.Item label="Pilih Anggota" value="" />
                      <Picker.Item label="Jason" value="java" />
                      <Picker.Item label="Mickey" value="js" />
                  </Picker>
              </View>

              <TouchableOpacity style={styles.delete_action}>
                <Icon name="trash" size={20} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.row}>
              <Icon name="user-plus" style={{ ...styles.icon_add }} size={20} />
              <Text style={{ ...layout.typography.body, color: "#381D5C" }}>Tambah Anggota Lainnya</Text>
            </TouchableOpacity>

            <Button onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 50 }}>
                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Tambah Anggota</Text>
            </Button>
            
          </View>

        </ScrollView>

      </View>
    )
})
