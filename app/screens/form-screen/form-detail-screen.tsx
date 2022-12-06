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
import { WebView } from "react-native-webview";
import { CONFIG } from "@utils/config"
import Reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  webView: {
    flex: 1,
  },
}


export interface FormDetailScreenProps extends NavigationScreenProps<{}> { }

export const FormDetailScreen: React.FunctionComponent<FormDetailScreenProps> = observer((props) => {
  const rootStore = useStores();
  const [loading, setLoading] = useState(false);

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [
    props.navigation,
  ])

  const userAgentAndroid =
    "Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";

  const _onNavigationStateChange = (status) => {
    const { url } = status;

    if (
      url.indexOf(CONFIG.WEB_URL) === 0 &&
      url.indexOf("success") !== -1
    ) {
      Toast.show("Form berhasil diedit");
      goBack();
      props.navigation.state.params.onGoBack();
    }
  };

  const backAction = () => {
    props.navigation.state.params.onGoBack();
    goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <View style={layout.container.general}>
      <Loading loading={loading} />

      <Head type="detail" title={'Detail'} navigation={props.navigation} />

      <WebView
        startInLoadingState
        style={styles.webView}
        source={{ uri: CONFIG.WEB_URL + "/spk/detail/" + props.navigation.state.params.user_id + "/" + props.navigation.state.params.form_id }}
        userAgent={userAgentAndroid}
        onNavigationStateChange={(status) =>
          _onNavigationStateChange(status)
        }
        scalesPageToFit
      />
    </View>
  )
})
