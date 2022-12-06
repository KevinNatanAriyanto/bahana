import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Icon, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import HTML from 'react-native-render-html';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import { translate } from "@i18n"
import Toast from 'react-native-root-toast';
// import BottomDrawer from 'rn-bottom-drawer';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface TocScreenProps extends NavigationScreenProps<{}> {
}

export const TocScreen: React.FunctionComponent<TocScreenProps> = observer((props) => {
  const rootStore = useStores()
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState(null);

	const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
	const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
		props.navigation,
	])

	useEffect(() => {
		loadAbout()
	}, []);

	const loadAbout = async () => {
		setLoading(true);
		var result = await rootStore.getToc();
		setLoading(false);

		if(result.kind == "ok"){
			setContent(result.data);
		}
	}

  return (
    <View style={layout.container.general}>
    	<Loading loading={loading} />
		<ScrollView>
			<Header type="detail" title={translate("general.toc")} navigation={props.navigation} />

			<View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>
	        	
        		<HTML
	              html={content}
	              ignoredStyles={['font-family', 'line-height', 'display']}
	            />
	        	
	        </View>
        </ScrollView>

		<Footer active="notif" navigation={props.navigation} />
    </View>
  )
})
