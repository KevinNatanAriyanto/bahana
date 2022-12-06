import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Alert, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Icon, Switch, Wallpaper, TextField, ErrorMessage, Loading } from "@components"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
import { translate } from "@i18n"

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface ForgotScreenProps extends NavigationScreenProps<{}> {
}

const WRAPPER: ViewStyle = {
	...layout.container.wrapper, 
	...layout.container.wrapperCenter,
	justifyContent: "center",
	alignItems: "center",
	marginTop: 40
}

const styles = {
  socialTxt: {
  	textAlign: "center", fontSize: 12
  },
  socialImg: {
  	width: 100, height: 100, alignSelf: "center", marginTop: 10, marginBottom: 30
  }
}

export const ForgotScreen: React.FunctionComponent<ForgotScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  // const nextScreen = React.useMemo(() => () => props.navigation.navigate("verify"), [
  //   props.navigation,
  // ])
  const nextScreen = React.useMemo(() => () => props.navigation.navigate("success", {msg: "Email untuk mengubah password anda telah dikirimkan. Silahkan cek email anda.", btnTxt: "Kembali ke Login", btnLink: "login"}), [
    props.navigation,
  ])

  const RegisterSchema = Yup.object().shape({
	  email: Yup.string()
	  	.email('Email must be a valid email')
	  	.required('Email is required'),
  }); 

  const onSubmit = async (values) => {
  	Keyboard.dismiss();

  	if(values.password == values.confirm_password){

	  	setLoading(true);
	  	var result = await rootStore.doForgot({
	  		email: values.email
	  	});
	  	setLoading(false);

		if(result.kind == "ok"){
			nextScreen();
	    }

	}
  }

  const loginScreen = React.useMemo(() => () => props.navigation.navigate("login"), [
    props.navigation,
  ])

  return (
    
    <View>
      <Loading loading={loading} />
      <ScrollView>
      
      <Image style={layout.img_header} source={require("@assets/home-header.png")} />
      <View style={{ ...layout.container.wrapperCenter, ...layout.box.wrapper, ...layout.box.shadow, paddingVertical: 40, paddingHorizontal: 20, marginTop: (deviceHeight*0.10) }}>

		<View style={{ ...layout.container.wrapperCenter }}>
			<Text preset="header" tx="general.forgot_password" style={{ marginBottom: 20 }} />
			<Text style={{ color: "#5F5959", marginBottom: 40 }}>Masukkan alamat email anda yang terdaftar {"\n"}untuk konfirmasi penggantian kata sandi.</Text>
		</View>

      	<Formik
		    initialValues={{ 
		    	email: rootStore.showCurrentUser("email"),
		    }}
		    validationSchema={RegisterSchema}
		    onSubmit={values => onSubmit(values)}
		>
		    {props => (

		    	<View style={{ width: deviceWidth*0.8, marginBottom: 40 }}>

		    		<ErrorMessage errors={props.errors} />

			      	<View style={layout.form.field}>
			      		<Icon name="ios-mail" style={{ ...layout.form.icon_input }} size={20} />
				      	<TextInput
				          onChangeText={props.handleChange('email')}
				          onBlur={props.handleBlur('email')}
				          value={props.values.email}
				          keyboardType={"email-address"}
				          style={{ ...layout.form.cinput_icon }}
				          placeholder={translate("general.email")}
				          placeholderTextColor={color.placeholder}
				      	/>
			      	</View>

			      	<Button onPress={props.handleSubmit} tx="general.forgot_password" style={layout.form.submit} />
		      	</View>
		    )}
		</Formik>
		<TouchableOpacity onPress={loginScreen}>
	        <Text style={{ textAlign: "center", textDecorationLine: "underline" }}>Kembali ke halaman masuk</Text>
      	</TouchableOpacity>

      </View>
      </ScrollView>
    </View>
  )
})
