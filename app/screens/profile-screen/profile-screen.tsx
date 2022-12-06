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
export interface ProfileScreenProps extends NavigationScreenProps<{}> {
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

export const ProfileScreen: React.FunctionComponent<ProfileScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(rootStore.getCurrentUser());
  const [skills, setSkills] = useState([]);
  const [specialist, setSpecialist] = useState([]);
  const [imageGalleries, setImageGalleries] = useState([]);
  const [videoGalleries, setVideoGalleries] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [nowEditing, setNowEditing] = useState(null);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [jamKantor, setJamKantor] = useState(props.navigation.state.params.jamKantor);
  // const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // const [galleryOffset, setGalleryOffset] = useState(0);
  let call_update = false;
  const [atasan1, setAtasan1] = useState("");
  const [atasan2, setAtasan2] = useState("");
  const [atasan3, setAtasan3] = useState("");
  const [atasanHRD, setAtasanHRD] = useState("");
  const [sisaCuti, setSisaCuti] = useState("");
  
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
  ])

	const loadProfile = async () => {
		// get new data of user profile
		// alert('s')
		setLoading(true);
		var result = await rootStore.getCurrentProfile();
		setLoading(false);
		Reactotron.log('getCurrentProfile 1')
		Reactotron.log(result)
		if(result.kind == "ok" && result.data){
			rootStore.assignCurrentUser(result.data);
			var profile_url = CONFIG.ASSETS_URL+'/user-uploads/avatar/'+result.data.image;
			Reactotron.log('profile_url 1')
			Reactotron.log(profile_url)
			setProfilePic({ uri: profile_url });

			loadCuti();
		}
	}

	const loadCuti = async () => {
		setLoading(true);
		var result = await rootStore.getEmployeePermission();
		setLoading(false);

		Reactotron.log('===========getEmployeePermission 1')
		Reactotron.log(result)

		if(result.kind == "ok" && result.data){
			if(result.data.arr_atasan[0] != null){
				setAtasan1(result.data.arr_atasan[0].name);
			}
			if(result.data.arr_atasan[1] != null){
				setAtasan2(result.data.arr_atasan[1].name);
			}
			if(result.data.arr_atasan[2] != null){
				setAtasan3(result.data.arr_atasan[2].name);
			}
			if(result.data.hrd != null){
				setAtasanHRD(result.data.hrd.name);
			}
			setSisaCuti(result.data.leave.available_leave[1].Cuti);
		}
	}

	useEffect( () => {
		loadProfile();
	}, []);

	// immediately edit user on current user changes
	useEffect(() => {
		if(call_update){
			doEdit();
		}
	}, [currentUser]);

	const options = {
	  title: 'Select Avatar',
	  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
	  storageOptions: {
	    skipBackup: true,
	    path: 'images',
	  },
	};

	let imgpick;
	const onChangeAvatar = () => {

		ImagePicker.openPicker({
		  width: 300,
		  height: 300,
		  cropping: true,
		  avoidEmptySpaceAroundImage: false,
		  freeStyleCropEnabled: true,
		  mediaType: 'photo'
		}).then(response => {
		  // console.log(response);
		  imgpick = response;
		  const source = { uri: response.path };
		  setProfilePic(source);

		  // update profile action
		  doEdit();

		}).catch(e => {
		  // console.log(e);
		});
	}

	// let imgpickgallery;
	// const addGallery = () => {

	// 	ImagePicker.openPicker({
	// 	  width: 300,
	// 	  height: 300,
	// 	  cropping: true,
	// 	  avoidEmptySpaceAroundImage: false,
	// 	  freeStyleCropEnabled: true,
	// 	  mediaType: 'photo'
	// 	}).then(response => {
	// 	  // console.log(response);
	// 	  imgpickgallery = response;
	// 	  const source = { uri: response.path };
	// 	  // setProfilePic(source);

	// 	  // update profile action
	// 	  // doEdit();

	// 	  submitGallery("image");

	// 	}).catch(e => {
	// 	});
	// }

	const doEdit = async () => {
		let formData = new FormData();

	    if(rootStore.getCurrentUser().name){
	        formData.append("name", rootStore.getCurrentUser().name);
	    }
	    if(rootStore.getCurrentUser().email){
	        formData.append("email", rootStore.getCurrentUser().email);
	    }

		if(imgpick){
		    formData.append("image", {
	            uri: imgpick.path,
	            name: imgpick.modificationDate+".jpg",
	            type: (imgpick.mime) ? imgpick.mime : "jpg"
	        });

		}

		setLoading(true);
	    var result = await rootStore.editUser(formData);
	    setLoading(false);
	    _panel.hide();

	    if(result.kind == "ok" && result.data){
	      // rootStore.removeCurrentUser();

	      rootStore.assignCurrentUser(result.data);
	      call_update = false;

	      ImagePicker.clean();

	      // setCurrentUser(result.data);
	    }

	}

	/*
	const showDateTimePicker = () => {
	    setIsDateTimePickerVisible(true);
  	};

	const hideDateTimePicker = () => {
		setIsDateTimePickerVisible(false);	
	};

	const handleDatePicked = date => {
		var date_str = date.getFullYear()+"-"+("0"+(parseInt(date.getMonth())+1)).slice(-2)+"-"+("0"+date.getDate()).slice(-2)
		// Reactotron.log(date);
		// Reactotron.log(date_str);

		rootStore.setCurrentUser("tanggal_lahir", date_str);
	  	setCurrentUser(rootStore.getCurrentUser());
    	doEdit();

    	setIsDateTimePickerVisible(false);	
	};
	*/

	const removeAllStorage = () => {
	    console.log('clearing last storage data');
	    setStorage('notifications','');
	    setStorage('attendances','');
	    setStorage('currentUser','');
	    setStorage('settings','');
	    setStorage('gps','');
	    setStorage('employee','');
	    setStorage('cluster','');
	    setStorage('office','');
	    setStorage('my_attendance','');
	    setStorage('my_designation','');
	    setStorage('my_permission','');
	    setStorage('my_leaves','');
	    setStorage('my_queues','');
	    setStorage('timelogs','');
	    setStorage('tasks','');
    	setStorage('projects','');
    	setStorage('ship','');
    	setStorage('ship_schedules','');
    	setStorage('questions','');
    	setStorage('notifications','');

    	AsyncStorage.removeItem('task_reminders')

    	clearInterval(global.blockScreen)
	}

	const doLogout = async() => {
	    setLoading(true);
	    var result = await rootStore.doLogout();
	    setLoading(false);

	    Reactotron.log(result);
	    if(result.kind == "ok"){
	    	// BackgroundJob.cancel({jobKey: 'gpsJobBackground'})
				  // .then(() => Reactotron.log("Success cancel dari logout"))
				  // .catch(err => Reactotron.log(err));
	    	BackgroundTimer.stopBackgroundTimer();
			// PushNotification.cancelLocalNotifications({id: '1'});
			// BackgroundGeolocation.stop()
	    	// await storageOfficeData('')
	    	// await storageClusterData('')

	    	// remove all storages
		    removeAllStorage()

		    // remove all background jobs
		    ReactNativeForegroundService.remove_task('generalTasks');
	    	ReactNativeForegroundService.remove_task('permissionTasks');
	    	ReactNativeForegroundService.remove_task('reminderTasks');
	    	ReactNativeForegroundService.stop();

	      	navigateTo("login");
	    }
  	}

  	const setStorage = (item, val) => {
	    try {
	      if(val && val != ''){
	        console.log('storage '+item+' have value!')

	        const jsonVal = JSON.stringify(val)
	        val = {
	        	...val,
	        	data: JSON.stringify(val)
	        }
	        rootStore.assignData(item, val);

	      }else{
	        console.log('removing '+item+'!')

	        rootStore.removeData(item)
	      }
	    } catch (e) {
	      // saving error
	      console.error(e)
	    }
  	}

	// const _renderAll = () => {
	// 	return(
	// 		<View>

	// 			<View style={layout.info.wrapper}>
	//   				<View style={{ ...layout.info.section_alt }}>
	// 	  				<Text style={layout.info.title} text="Name" />
	// 	  				<Text style={{ ...layout.info.description, paddingLeft: 0 }} text={currentUser.name} />
	//   				</View>
	//   			</View>
	//   			<View style={layout.info.wrapper}>
	//   				<View style={{ ...layout.info.section_alt }}>
	// 	  				<Text style={layout.info.title} text="Email" />
	// 	  				<Text style={{ ...layout.info.description, paddingLeft: 0 }} text={currentUser.email} />
	//   				</View>
	//   				<TouchableOpacity style={layout.info.action} onPress={() => openPopup("email")}>
	//   					<Text style={layout.info.action_text} text="Edit" />
	// 				</TouchableOpacity>
	//   			</View>

	//   			<Button onPress={() => doLogout()} style={{ ...layout.button.primary, ...layout.button.wrapper }}>
 //                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Keluar</Text>
 //                </Button>

 //  			</View>
	// 	)
	// }

	/*
	const RegisterSchema = Yup.object().shape({
	  email: Yup.string()
	  	.email('Email must be a valid email')
	  	.required('Email is required')
  	});

	const onSubmit = (values) => {
	  	Keyboard.dismiss();
	  	call_update = true;

	  	rootStore.setCurrentUser("email", values.email);
	  	setCurrentUser(rootStore.getCurrentUser());
    	doEdit();

	}

	const _renderPopupForm = (type) => {
		return(
			<View>
				<Text preset="header_filter" text="Update your account" style={{ marginBottom: 40 }} />
				<View style={layout.filter.wrapper}>
					<ScrollView style={{ ...layout.filter.scrollable, height: deviceHeight/2 }}>
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

									{(type == "email" &&
								      	<View style={layout.form.field}>
									      	<TextInput
									          onChangeText={props.handleChange('email')}
									          onBlur={props.handleBlur('email')}
									          value={props.values.email}
									          keyboardType={"email-address"}
									          style={{ ...layout.form.input, textAlign: "center" }}
									          placeholder={"Email"}
									          placeholderTextColor={color.placeholder}
									      	/>
								      	</View>
							      	)}

							      	<Button onPress={props.handleSubmit} style={layout.filter.btn}>
										<Image source={require("@assets/ico_check_light.png")} />
									</Button>

						      	</View>
						    )}
						</Formik>
					</ScrollView>
				</View>
			</View>
		)
	}
	*/

	/*
	const changeLocation = () => {

		var arr = [];
		Object.keys(DataIndonesia).map((item,i) => {
			arr.push(DataIndonesia[item]);
		});

		var location = currentUser.location.split(",");
		var selected = [];

		if(location.length > 0 && location[0] != ""){
			// Reactotron.log(location);
			selected[0] = location[1].trim();
			selected[1] = location[0].trim();
		}

		Picker.init({
		    pickerData: arr,
		    selectedValue: selected,
		    pickerConfirmBtnText: "Select",
		    pickerCancelBtnText: "Cancel",
		    pickerTitleText: "Select your location",
		    pickerTextEllipsisLen: 12,
		    pickerFontSize: 12,
		    pickerRowHeight: 48,

		    onPickerConfirm: (data) => {
		    	// call_update = true;
		    	var str = data[1]+", "+data[0];
				rootStore.setCurrentUser("location", str);
		    	setCurrentUser(rootStore.getCurrentUser());

		    	// Reactotron.log("get current user again");
		    	// Reactotron.log(rootStore.getCurrentUser().location);

		    	// setTimeout(function(){
			    // 	Reactotron.log(currentUser.location);
			    // }, 300);

		    	doEdit();
		    },
		});
		Picker.show();
	}

	const changeBirthplace = () => {

		var arr = [];
		Object.keys(DataIndonesia).map((item,i) => {
			arr.push(DataIndonesia[item]);
		});

		var location = currentUser.location.split(",");
		var selected = [];

		if(location.length > 0 && location[0] != ""){
			// Reactotron.log(location);
			selected[0] = location[1].trim();
			selected[1] = location[0].trim();
		}

		Picker.init({
		    pickerData: arr,
		    selectedValue: selected,
		    pickerConfirmBtnText: "Select",
		    pickerCancelBtnText: "Cancel",
		    pickerTitleText: "Select your Birthplace",
		    pickerTextEllipsisLen: 12,
		    pickerFontSize: 12,
		    pickerRowHeight: 48,

		    onPickerConfirm: (data) => {
		    	// call_update = true;
		    	var str = data[1]+", "+data[0];
				rootStore.setCurrentUser("tempat_lahir", str);
		    	setCurrentUser(rootStore.getCurrentUser());

		    	// Reactotron.log("get current user again");
		    	// Reactotron.log(rootStore.getCurrentUser().location);

		    	// setTimeout(function(){
			    // 	Reactotron.log(currentUser.location);
			    // }, 300);

		    	doEdit();
		    },
		});
		Picker.show();
	}

	const openPopup = (slug) => {
		setNowEditing(slug);

		setTimeout(function(){
			_panel.show();
		}, 1000);
	}
	*/

	const storageClusterData = async (value) => {
      try {
        if(value != ''){
          console.log('masuk if storageClusterData login')
          const jsonCluster = JSON.stringify(value)
          await AsyncStorage.setItem('cluster', jsonCluster)  
        }else{
          console.log('masuk else storageClusterData login')
          await AsyncStorage.removeItem('cluster')  
        }
      } catch (e) {
        // saving error
        console.log(e)
      }
    }

	const storageOfficeData = async (value) => {
      try {
        if(value != ''){
          const jsonOffice = JSON.stringify(value)
          await AsyncStorage.setItem('office', jsonOffice)  
        }else{
          await AsyncStorage.setItem('office', value)  
        }
      } catch (e) {
        // saving error
      }
    }

    const _renderLogout = () => {
    	var valid = false;
    	if(rootStore.employee.is_abk){
    		var last_checkin = rootStore.findLatestCheckin();

    		if(last_checkin){
    			last_checkin = last_checkin[0];

    			if(last_checkin.clock_out_time){
	    			valid = true;
				}
    		}
    	}else{
    		valid = true;
    	}

    	if(rootStore.settings.offline_mode){
    		valid = false;
    	}

    	if(jamKantor){
    		console.log('didalam jam kantor')
    		valid = false;
    	}else{
    		console.log('diluar jam kantor')
    		valid = true;
    	}

    	if(valid){
	    	return(
				<Button onPress={() => doLogout()} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 80 }}>
	                <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>KELUAR</Text>
	            </Button>
			)
	    }
    }

    const launchBugsee = async () => {
	    let appToken;
	    var bugseeOptions;

	    if (Platform.OS === 'ios') {
	        appToken = '';
	        bugseeOptions = new Bugsee.AndroidLaunchOptions();
	        
	    } else {
	        appToken = CONFIG.BUGSEE_KEY;
	        bugseeOptions = new Bugsee.AndroidLaunchOptions();
	        bugseeOptions.notificationBarTrigger = false;
	        bugseeOptions.shakeToTrigger = false;
	    }

	    bugseeOptions.maxRecordingTime = 320;

	    await Bugsee.launch(appToken, bugseeOptions);

	    // set in app version
	    Bugsee.setAttribute("app_version", CONFIG.APP_VERSION);
  	}

    const doReport = async () => {
		await launchBugsee();
		Toast.show("Anda sekarang dapat melaporkan masalah. Tekan tombol di sebelah kanan jika ingin menyudahi pelaporan masalah.", {
			duration: Toast.durations.LONG
		})

		// Bugsee.showReportDialog();
	}

  	return (
	    <View style={layout.container.general}>
			<Loading loading={loading} />

			<ScrollView>
				<Head type="detail" title={'Profil Saya'} navigation={props.navigation} />

				{(currentUser &&
					<View style={{ ...layout.container.wrapper, ...layout.container.bodyView, marginTop: 20 }}>
			        	
			        	{/*
		        		<View style={layout.avatar.container}>
		        			<TouchableOpacity style={layout.avatar.wrapper} onPress={onChangeAvatar}>
		        				<View style={layout.avatar.shadow}></View>
		        				<Image style={layout.avatar.img} source={profilePic} />
		        				<Image style={layout.avatar.icon} source={require("@assets/camera.png")} />
		        			</TouchableOpacity>
		        			<Text style={layout.avatar.name}>{currentUser.name}</Text>

		        			{(currentUser.role && currentUser.role.length > 0 &&
		        				<Text style={layout.avatar.job}>{currentUser.roles[0].display_name}</Text>
		        			)}

		        		</View>
		        		*/}

		        		<View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...styles.avatar.wrapper }}>
		        			<Image style={{ ...layout.avatar.img, ...styles.avatar.pic }} source={profilePic} />
		        			<View style={styles.avatar.info}>
		        				<Text style={{ ...layout.typography.h2 }}>{currentUser.name}</Text>
		        				{(currentUser.role && currentUser.role.length > 0 &&
			        				<Text style={{ ...layout.typography.h4, marginTop: 10 }}>{currentUser.roles[0].display_name}</Text>
			        			)}

								<Text style={layout.typography.body}>{"Atasan 1: "}</Text>
								<Text style={layout.typography.body}>{(atasan1 != "") ? atasan1 : "-"}</Text>
								<Text style={layout.typography.body}>{"\nAtasan 2: "}</Text>
								<Text style={layout.typography.body}>{(atasan2 != "") ? atasan2 : "-"}</Text>
								<Text style={layout.typography.body}>{"\nAtasan 3: "}</Text>
								<Text style={layout.typography.body}>{(atasan3 != "") ? atasan3 : "-"}</Text>
								<Text style={layout.typography.body}>{"\nHRD: "}</Text>
								<Text style={layout.typography.body}>{(atasanHRD != "") ? atasanHRD : "-"}</Text>
								<Text style={layout.typography.body}>{"\nSisa Cuti: "}</Text>
								<Text style={layout.typography.body}>{(sisaCuti != "") ? sisaCuti : "-"}</Text>
		        			</View>
		        		</View>
		        		<View style={{ ...layout.box.wrapper, ...layout.box.shadow, ...layout.box.section, paddingVertical: 0 }}>
							<TouchableOpacity onPress={() => navigateTo("edit_profile")} style={layout.menuvertical.list}>
								<Image source={require('@assets/ico-pencil.png')} style={layout.menuvertical.icon} />
								<Text style={layout.typography.body}>Edit Profil</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => navigateTo("change_password")} style={layout.menuvertical.list}>
								<Image source={require('@assets/ico-lock.png')} style={layout.menuvertical.icon} />
								<Text style={layout.typography.body}>Ganti Password</Text>
							</TouchableOpacity>
							{/*
							<TouchableOpacity style={{ ...layout.menuvertical.list }}>
								<Image source={require('@assets/ico-bell.png')} style={layout.menuvertical.icon} />
								<Text style={layout.typography.body}>Pengaturan Notifikasi</Text>
							</TouchableOpacity>
							*/}
							<TouchableOpacity onPress={() => doReport()} style={{ ...layout.menuvertical.list}}>
								<Image source={require("@assets/ico-complaint.png")} style={layout.menuvertical.icon} />
								<Text style={layout.typography.body}>Pelaporan Masalah</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => navigateTo("iframe", {url: "iframe/employee/edit/"+rootStore.getCurrentUser().id}) } style={{ ...layout.menuvertical.list, borderBottomWidth: 0 }}>
								<Image source={require('@assets/ico-pencil.png')} style={layout.menuvertical.icon} />
								<Text style={layout.typography.body}>Ubah Delegasi</Text>
							</TouchableOpacity>
		        		</View>

		        		{_renderLogout()}
			        	
			        </View>
		         )}
	        </ScrollView>

	        {/*
			<SlidingUpPanel 
	    		ref={c => _panel = c}
	    		containerStyle={{ backgroundColor: "#fff", borderRadius: 20, elevation: 7 }}
	    		allowDragging={false}
	    		draggableRange={{
	    			top: 540,
	    			bottom: 0
	    		}}
			>
				<View style={layout.filter.container}>
					<TouchableOpacity style={layout.filter.close} onPress={() => {
						_panel.hide()
					}}>
						<Image source={require('@assets/ico_close.png')} />
					</TouchableOpacity>

					{_renderPopupForm("email")}
				</View>
	    	</SlidingUpPanel>
	    	*/}
	    </View>
  	)
})
