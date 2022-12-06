import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle, View, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard, ImageBackground } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Icon, Switch, Wallpaper, TextField, ErrorMessage } from "@components"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface SuccessScreenProps extends NavigationScreenProps<{}> {
}

const WRAPPER: ViewStyle = {
	...layout.container.wrapper, 
	...layout.container.wrapperCenter,
}

export const SuccessScreen: React.FunctionComponent<SuccessScreenProps> = observer((props) => {
  // const { someStore } = useStores()

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const nextScreen = React.useMemo(() => () => props.navigation.navigate(props.navigation.state.params.btnLink), [
    props.navigation,
  ])

  return (
    <Screen preset="success" style={{ ...layout.success.bg }}>
    	<ImageBackground source={require('@assets/bg_success.png')} style={{ ...layout.success.wrapper }}>
    		<Image source={require('@assets/checked.png')} style={{ ...layout.success.img }} />

    		<Text style={{ ...layout.success.text }}>{props.navigation.state.params.msg}</Text>
    		
    		<Button preset="default" onPress={nextScreen} text={props.navigation.state.params.btnTxt} />
    	</ImageBackground>
    </Screen>
  )
})
