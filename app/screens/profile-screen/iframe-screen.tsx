import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Head, Loading, Icon, Wallpaper, TextField, ErrorMessage, Footer, Gallery } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { DataIndonesia, ChefSkills, ChefSpecialists, ChefSubroles } from "@utils/data"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Picker from 'react-native-picker';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import { CONFIG } from "@utils/config"
import Toast from 'react-native-root-toast';
import HTML from 'react-native-render-html';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Thumbnail } from 'react-native-thumbnail-video';
import AsyncStorage from '@react-native-community/async-storage';
import Bugsee from 'react-native-bugsee';
// import BackgroundJob from 'react-native-background-job';
import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import BackgroundTimer from 'react-native-background-timer';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { WebView } from "react-native-webview";

export interface IframeScreenProps extends NavigationScreenProps<{}> {
}

const DEFAULT_HTML_STYLE = {
  baseFontStyle: {
    ...layout.info.description
  },
  ...layout.html
}

const styles = {
	avatar: {
		wrapper: {
			flexDirection: "row", paddingHorizontal: 40, paddingVertical: 20, marginBottom: 20
		},
		pic: {
			backgroundColor: "#ececec", width: 80, height: 80
		},
		info: {
			marginLeft: 20, justifyContent: "center", flex: 1
		}
	},
	floating_btn: {
	    position: "absolute", bottom: 50, alignSelf: "center"
	}
}

export const IframeScreen: React.FunctionComponent<IframeScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(rootStore.getCurrentUser());
  
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
  ])

	const loadProfile = async () => {
		setLoading(true);
		var result = await rootStore.getCurrentProfile();
		setLoading(false);
	}

	useEffect( () => {
		loadProfile();
	}, []);

	const userAgentAndroid =
        "Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";

    const _onNavigationStateChange = (status) => {
        const { url } = status;

        if (
            url.indexOf(CONFIG.WEB_URL) === 0 &&
            url.indexOf("success") !== -1
        ) {
            Toast.show("Berhasil");
            goBack();
            props.navigation.state.params.onGoBack();
        }
    };

  	return (
	    <View style={layout.container.general}>
			<Loading loading={loading} />

			<Head type="detail" title={'Aplikasi'} navigation={props.navigation} />

				{(currentUser &&
					<View style={{ ...layout.container.wrapper, ...layout.container.bodyView, marginTop: 20 }}>
			        	
			        	<WebView
			                startInLoadingState
			                style={{
			                	flex: 1, width: deviceWidth-40, height: deviceHeight+150
			                }}
			                source={{ uri: CONFIG.WEB_URL + '/'+ props.navigation.state.params.url }}
			                userAgent={userAgentAndroid}
			                onNavigationStateChange={(status) =>
			                    _onNavigationStateChange(status)
			                }
			                scalesPageToFit
			            />
			        	
			        </View>
		         )}

	    </View>
  	)
})
