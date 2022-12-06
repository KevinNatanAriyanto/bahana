import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, RefreshControl, View, Alert, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
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
import {useNetInfo} from "@react-native-community/netinfo";
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
  title: {
    marginBottom: 10
  },
  sublabel: {
    color: "#BABABA", marginRight: 5
  },
  row: {
    flexDirection: "row", flex: 1, flexWrap: "wrap"
  },
  action: {
    wrapper: {
      marginBottom: 40
    },
    btn: {
      marginLeft: 10
    },
    textbox: {
      flex: 1
    }
  },
  floating_btn: {
    position: "absolute", bottom: 50, alignSelf: "center"
  },
  dot: {
    width: 2, height: 2, borderRadius: 1, backgroundColor: "#5F5959", marginHorizontal: 5, alignSelf: "center"
  }
}


export interface LaporanScreenProps extends NavigationScreenProps<{}> {
}

export const LaporanScreen: React.FunctionComponent<LaporanScreenProps> = observer((props) => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(false);
    const [pilihan, setPilihan] = useState(1);
    const [tickets, setTickets] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const menuModal = useRef(null);
    const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

    const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
    ])

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      loadTickets()

      setRefreshing(false);

    }, [refreshing]);

    useEffect( () => {
      // loadTimelogs('in_review');
      loadTickets();
      // loadTimelogs('rejected');
    }, []);

    const loadTickets = async (status) => {
      var param = {
        // status: status
      }
      
      setLoading(true);
      var result = await rootStore.getTickets(param);
      setLoading(false);

      if(result.kind == "ok" && result.data){
        setTickets(result.data)
      }
    }

    const formatDate = (datenow) => {
      return moment(datenow).calendar(null, {
        sameElse: 'MMMM Do YYYY'
      })
    }

    return (
      <View style={layout.container.general}>
        <Loading loading={loading} />

        <Head type="detail" title={'Semua Laporan Masalah'} navigation={props.navigation} />

        <ScrollView 
          style={layout.container.content_wtabbar}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
            
          <View style={{ ...layout.container.wrapper, ...layout.container.bodyView }}>

            <View style={{ ...styles.action.wrapper, ...styles.row }}>
              <View style={{ ...layout.textbox.wrapper, ...layout.textbox.outline, ...styles.action.textbox }}>
                  <Icon name="ios-search" style={{ ...layout.textbox.icon }} size={20} />
                  <TextInput
                      style={{ ...layout.textbox.input }}
                      placeholder="Cari Laporan..."
                  />
              </View>
              <TouchableOpacity onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn }}>
                  <Image source={require('@assets/ico-filter-white.png')} style={layout.button.icon} />
                  <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Filter</Text>
              </TouchableOpacity>
            </View>

            {(tickets.map((item,i) => {
              return(
                <TouchableOpacity key={"ticket"+i} onPress={() => navigateTo("laporan_detail", {id: item.id, data: item, onBack: onRefresh })} style={{...layout.list.absence_list}}>
                    <View style={layout.container.row}>
                        <Status slug={item.status} />
                    </View>

                    <Text style={{ ...layout.typography.h3, ...styles.title }}>{item.subject}</Text>

                    <View style={styles.row}>
                      <Text style={{ ...layout.typography.body_smaller }}>{formatDate(item.created_at)}</Text>
                      <View style={{ ...styles.dot }} />
                      <Text style={{ ...layout.typography.body_smaller }}>Dibuat oleh {item.requester.name}</Text>
                    </View>

                    {(item.priority != "" && item.priority &&
                      <View style={{ ...styles.row}}>
                        <Text style={{ ...layout.typography.body_smaller, ...styles.sublabel }}>Prioritas:</Text>
                        <Text style={{ ...layout.typography.body_smaller, color: color.important, textTransform: "capitalize" }}>{item.priority}</Text>
                      </View>
                    )}
                </TouchableOpacity>
              )
            }))}

          </View>

        </ScrollView>

        <TouchableOpacity onPress={() => navigateTo('form_laporan', {type: "add", onBack: onRefresh })} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.floating_btn }}>
            <Image source={require('@assets/ico-laporan.png')} style={layout.button.icon} />
            <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>TAMBAH LAPORAN</Text>
        </TouchableOpacity>
      </View>
    )
})
