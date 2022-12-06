import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, Linking, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Switch, Wallpaper, TextField, ErrorMessage, Footer } from "@components"
import { BottomDrawerCustom } from "@vendor"
import { color, layout } from "@theme"
import { Helper } from "@utils/helper"
import { NavigationScreenProps } from "react-navigation"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Carousel from 'react-native-snap-carousel';
// import BottomDrawer from 'rn-bottom-drawer';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStores } from "@models/root-store"
import { CONFIG } from "@utils/config"
import Reactotron from 'reactotron-react-native';
import * as Animatable from 'react-native-animatable';

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */

const styles = {
  popup: {
    opacity: 0, width: deviceWidth, height: deviceHeight, backgroundColor: "rgba(0,0,0,0.8)", position: "absolute", top: 0, left: 0, zIndex: -1, elevation: 0
  },
  open: {
    zIndex: 99999, elevation: 10
  },
  card: {
    paddingVertical: 30, paddingHorizontal: 10, backgroundColor: "#fff", marginBottom: 50, width: deviceWidth*0.8, alignSelf: "center", borderRadius: 10, marginTop: 100
  },
  card_img: {
    height: deviceHeight/2
  },
  close: {
    position: "absolute", top: 20, right: 20
  },
  container: {
    alignItems: "center", justifyContent: "center"
  },
  thumbs: {
    width: deviceWidth*0.8, alignSelf: "center"
  },
  thumb_img: {
    width: 65, height: 65, marginRight: 10, opacity: 0.3
  },
  thumb_img_active: {
    width: 65, height: 65, marginRight: 10, opacity: 1
  }
}

const fadeIn = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};

export const Gallery: React.FunctionComponent<GalleryProps> = props => {
  let {
    style,
    data,
    startIndex,
    isOpen,
    offset,

    // on popup event callbacks
    onClose,
    onOpen
  } = props

  // let getProp = false;

  const sliderWidth = deviceWidth;
  const itemWidth = deviceWidth*0.8;

  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(false);
  const [slideOffset, setSlideOffset] = useState(offset);

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
  ])

  useEffect( () => {
    if(typeof slideOffset === 'undefined' || typeof offset === 'undefined'){
      setSlideOffset(0);
    }

    if(isOpen){
      show();
    }
  });

  useEffect( () => {
    if(typeof slideOffset === 'undefined' || typeof offset === 'undefined'){
      setSlideOffset(0);
    }
    else if(offset != slideOffset){
      selectSlide(offset);
    }
  }, [offset]);

  useEffect( () => {
    
  }, []);

  const show = () => {
    setPopupOpen(true);

    var el = this;
    setTimeout(function(){
      el.popup.transitionTo({ opacity: 1 });
    }, 500);
  }

  const hide = () => {
    this.popup.transitionTo({ opacity: 0 });
    setTimeout(function(){
      setPopupOpen(false)
    }, 500);

    onClose();
  }

  const selectSlide = (i) => {
    offset = i;
    setSlideOffset(i);

    // console.log("offset: "+ offset);
    // console.log("slideOffset: "+slideOffset);
  }

  const renderPopup = () => {

    var popupStyles = {
      ...styles.popup, ...props.style, 
      // ...styles.open
    }

    if(popupOpen){
      popupStyles = {
        ...popupStyles,
        ...styles.open
      }
    }

    return(
      <Animatable.View ref={(c) => { this.popup = c; }} style={popupStyles}>
        <TouchableOpacity onPress={() => hide()} style={styles.close}>
          <Icon name="ios-close" size={40} style={{ color: "#fff" }} />
        </TouchableOpacity>

        <View style={styles.container}>

          <View style={{ ...styles.card }}>
            <Image source={{ uri: data[slideOffset] }} style={{ ...styles.card_img }} />
          </View>

          <View style={{ ...styles.thumbs }}>
            {/*
            <Carousel
              ref={(c) => { this._carouselThumb = c; }}
              data={data}
              renderItem={_renderThumb}
              sliderWidth={sliderWidth}
              itemWidth={65}
              itemHeight={65}
              activeSlideAlignment={"start"}
              inactiveSlideOpacity={0.3}
            />
            */}

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {(data.map((item, i) => {
                return(
                  <TouchableOpacity onPress={() => selectSlide(i)} key={"slidethumb"+i} style={{ overflow: "hidden" }}>
                    <Image source={{ uri: item }} style={(i == slideOffset) ? { ...styles.thumb_img_active } : { ...styles.thumb_img }} />
                  </TouchableOpacity>
                )
              }))}
            </ScrollView>
          </View>
        </View>
      </Animatable.View>
    )
  }

  const _renderThumb = ({item, index}) => {
    return (
      <TouchableOpacity key={"slidethumb"+index} style={{ overflow: "hidden" }}>
        <Image source={{ uri: item }} style={{ width: 65, height: 65 }} />
      </TouchableOpacity>
    );
  }

  const _renderGallery = () => {
    return(
      <View style={{ ...layout.inline_label.wrapper }}>
        {(data.map((item, i) => {
          return(
            <TouchableOpacity onPress={() => show()} key={"img"+i}>
                <Image source={{ uri: item }} style={layout.gallery.img} />
            </TouchableOpacity>
          )
        }))}

        {(button &&
          <TouchableOpacity onPress={buttonAction} style={{ ...layout.inline_label.small.box, ...layout.inline_label.small.box_active, justifyContent: "center" }}>
            <Text style={{ ...layout.inline_label.small.text, ...layout. inline_label.small.text_active }} text={buttonText} />
          </TouchableOpacity>
        )}

      </View>
    )
  }

  return(
    <View>
      {renderPopup()}
    </View>
  )
}
