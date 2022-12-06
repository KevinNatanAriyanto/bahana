import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, Linking, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Loading, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
import { useStores } from "@models/root-store"
import Reactotron from 'reactotron-react-native';
// import BottomDrawer from 'rn-bottom-drawer';
import { CONFIG } from "@utils/config"
const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface MenuScreenProps extends NavigationScreenProps<{}> {
}

export const MenuScreen: React.FunctionComponent<MenuScreenProps> = observer((props) => {
  // const { someStore } = useStores()

  const rootStore = useStores()
  const [loading, setLoading] = useState(false);

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
  ])

  const styles = {
  	logo: {
  		marginBottom: 120
  	},
  	menu: {
  		marginBottom: 20
  	},
  	logout: {
  		marginTop: 90
  	},
  	text: {
  		fontWeight: "bold", color: "#fff"
  	},
    sosmed: {
      justifyContent: "space-around", flexDirection: "row", flex: 1, width: deviceWidth*0.4, marginTop: 50
    }
  }

  const doLogout = async() => {
    setLoading(true);
    var result = await rootStore.doLogout();
    setLoading(false);

    // Reactotron.log(result);
    if(result.kind == "ok" && result.data){
      navigateTo("login");
    }
  }

  return (
    <View style={{ ...layout.container.general, backgroundColor: "#FF0000" }}>
      <Loading loading={loading} />

  		<ScrollView>
  			<Header type="menu" navigation={props.navigation} />

  			<View style={{ ...layout.container.wrapper, ...layout.container.wrapperCenter }}>

  				<Image source={require('@assets/logo_shadow.png')} style={styles.logo} />

  				<TouchableOpacity onPress={() => navigateTo("about")} style={styles.menu}>
        		<Text style={styles.text} tx="general.about_app" />
        	</TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("toc")} style={styles.menu}>
            <Text style={styles.text} tx="general.toc" />
          </TouchableOpacity>
        	<TouchableOpacity onPress={() => navigateTo("privacy")} style={styles.menu}>
        		<Text style={styles.text} tx="general.privacy" />
        	</TouchableOpacity>

          {/*
          <TouchableOpacity onPress={() => navigateTo("shopReview")} style={styles.menu}>
            <Text style={styles.text} tx="general.cart" />
          </TouchableOpacity>
          */}

          {/*
          <TouchableOpacity onPress={() => navigateTo("privacy")}>
            <Text style={styles.text} text="Konfirmasi Pembayaran" />
          </TouchableOpacity>
          */}
        	
        	<TouchableOpacity onPress={() => doLogout()} style={styles.logout}>
        		<Text style={{ ...styles.text, fontSize: 20 }} tx="general.logout" />
        	</TouchableOpacity>

          <View style={styles.sosmed}>
            <TouchableOpacity onPress={() => Linking.openURL(CONFIG.FB_URL)}>
              <Icon name="logo-facebook" style={{ color: "#fff" }} size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(CONFIG.TWITTER_URL)}>
              <Icon name="logo-twitter" style={{ color: "#fff" }} size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(CONFIG.IG_URL)}>
              <Icon name="logo-instagram" style={{ color: "#fff" }} size={30} />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  )
})
