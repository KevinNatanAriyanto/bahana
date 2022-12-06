import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, Linking, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Icon, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
// import BottomDrawer from 'rn-bottom-drawer';
import Spinner from 'react-native-spinkit';
import { useStores } from "@models/root-store"
import { CONFIG } from "@utils/config"
import Reactotron from 'reactotron-react-native';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */

const styles = {
  
}

export const Ads: React.FunctionComponent<AdsProps> = props => {
  let {
    type,
    category
  } = props
  // const headerType = type || (headerTx && translate(headerTx)) || ""

  const sliderWidth = deviceWidth;
  const itemWidth = deviceWidth*0.8;

  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
  ])

  useEffect( () => {

    if(props.category || props.type){
      loadAds();
    }
  }, []);

  const loadAds = async () => {

    var param = {
      category: (category) ? category : props.type
    };

    setLoading(true);
    var result = await rootStore.getAllAds(param);
    setLoading(false);

    Reactotron.log(result.data);

    if(result.kind == "ok"){
      var en = [];

      if(result.data.length > 0){
        result.data.map((item, i) => {
          en.push({
            ...item,
            img: {uri: CONFIG.ASSETS_URL+item.thumbnail},
          });
        });

        setEntries(en);
      }else if(param.category == props.category && props.type && result.data.length == 0){

        var param = {
          category: props.type
        };

        setLoading(true);
        var result = await rootStore.getAllAds(param);
        setLoading(false);

        if(result.kind == "ok"){
          var en = [];

          if(result.data.length > 0){
            result.data.map((item, i) => {
              en.push({
                ...item,
                img: {uri: CONFIG.ASSETS_URL+item.thumbnail},
              });
            });

            setEntries(en);
          }
        }
      }
    }
  }

  const doClick = (item) => {
    if(item.link_action == "external"){
      if(item.url){
        Linking.openURL(item.url);
      }
    }else if(item.link_action == "internal"){
      navigateTo(item.page_slug, {id: item.page_id});
    }
  }

  const _renderAds = () => {
    if(entries.length > 1){
      return(
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={entries}
          renderItem={_renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          autoplay={true}
          loop={true}
        />
      )
    }else if(entries.length == 1){
      return(
        <TouchableOpacity onPress={() => doClick(entries[0])} style={layout.ads.wrapper}>
          <Image source={entries[0].img} style={{ ...layout.ads.img, width: deviceWidth }} />
        </TouchableOpacity>
      )
    }else{
      return(
        <View style={layout.ads.wrapper}>
          <Image source={require("@assets/ads.jpg")} style={{ ...layout.ads.img }} />
        </View>
      )
    }
  }

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => doClick(item)} key={index} style={{ ...layout.slides.wrapper, overflow: "hidden" }}>
        <Image source={item.img} style={{ width: deviceWidth*0.8, height: 150, borderRadius: 5 }} />
      </TouchableOpacity>
    );
  }

  return(
    <View style={{ ...props.style }}>
      {_renderAds()}
    </View>
  )
}
