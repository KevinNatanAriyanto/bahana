import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Icon, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
// import BottomDrawer from 'rn-bottom-drawer';
import Spinner from 'react-native-spinkit';
import { useStores } from "@models/root-store"

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface LoadingProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function Loading(props: LoadingProps) {
  // grab the props
  const { loading, tx, text, style, ...rest } = props
  const textStyle = { }

  if(props.loading){
    return (
      <View key="loading" style={{ ...layout.loading.wrapper }}>
        <Spinner style={{ ...layout.loading.loader }} size={100} type={"ThreeBounce"} color={"#ececec"}/>
      </View>
    )
  }else{
    return null;
  }
}
