import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, RefreshControl, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, BackHandler } from "react-native"
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

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  sublabel: {
    color: "#BABABA", marginRight: 5
  },
}


export interface FormHistoryScreenProps extends NavigationScreenProps<{}> { }

export const FormHistoryScreen: React.FunctionComponent<FormHistoryScreenProps> = observer((props) => {
  const rootStore = useStores();
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation]);

  const formatDate = (datenow) => {
    return moment(datenow).calendar(null, {
      sameElse: 'MMMM Do YYYY'
    })
  };

  const formatTime = (datenow) => {
    return moment(datenow).format("h:mm:ss a");
  }

  const loadForms = async (paramFormID) => {
    var param = {
      spk_id: paramFormID
    };

    setLoading(true);
    var result = await rootStore.getHistorySPK(param);
    setLoading(false);

    if (result.kind == "ok" && result.data) {
      setForms(result.data.activity)
    }
  };

  const backAction = () => {
    props.navigation.state.params.onGoBack();
    goBack();
    return true;
  };

  useEffect(() => {
    loadForms(props.navigation.state.params.form_id);

    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <View style={layout.container.general}>
      <Loading loading={loading} />

      <Head type="detail" title={'Histori Form'} navigation={props.navigation} />

      <ScrollView style={layout.container.content_wtabbar}>
        <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

          {(forms.map((item, i) => {
            return (
              <View style={{ ...layout.list.form_list }}>
                <View style={{ flexDirection: "row", marginBottom: 0.027 * deviceWidth, width: 0.66 * deviceWidth }}>
                  {/* <Text style={{ ...layout.typography.body }}><Text style={{ ...layout.typography.h3 }}>{item.person}</Text> {item.subject}</Text> */}
                  <Text style={{ ...layout.typography.body }}>{item.activity}</Text>
                </View>

                <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>{formatDate(item.created_at)} {formatTime(item.created_at)}</Text>
              </View>
            )
          }))}

        </View>
      </ScrollView>
    </View>
  )
})
