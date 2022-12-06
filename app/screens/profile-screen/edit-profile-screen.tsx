import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react"
import { ViewStyle, View, ScrollView, Image, ImageStyle, TextStyle, TouchableOpacity, TextInput, Dimensions, Platform, Keyboard } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Head, Loading, Wallpaper, TextField, ErrorMessage, Footer, Gallery } from "@components"
import Icon from 'react-native-vector-icons/Ionicons';
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

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export interface EditProfileScreenProps extends NavigationScreenProps<{}> {
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
}

export const EditProfileScreen: React.FunctionComponent<EditProfileScreenProps> = observer((props) => {
  const rootStore = useStores()
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(rootStore.getCurrentUser());
  const [skills, setSkills] = useState([]);
  const [specialist, setSpecialist] = useState([]);
  const [imageGalleries, setImageGalleries] = useState([]);
  const [videoGalleries, setVideoGalleries] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [jabatan, setJabatan] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [nowEditing, setNowEditing] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [editWfh, setEditWfh] = useState(false);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  // const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // const [galleryOffset, setGalleryOffset] = useState(0);
  let call_update = false;

  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const navigateTo = React.useMemo((routeName, params) => (routeName, params) => props.navigation.navigate(routeName, params), [
      props.navigation,
  ])

	const loadProfile = async () => {
		// get new data of user profile
		setLoading(true);
		var result = await rootStore.getCurrentProfile();
		setLoading(false);

		if(result.kind == "ok" && result.data){
			rootStore.assignCurrentUser(result.data);

			var profile_url = CONFIG.ASSETS_URL+'/user-uploads/avatar/'+result.data.image;
			// Reactotron.log(profile_url)
			setProfilePic({ uri: profile_url });
		}
	}

	const loadJabatan = async () => {
		// get new data of user profile
		setLoading(true);
		var result = await rootStore.getProfileUser();
		setLoading(false);
		Reactotron.log('getProfileUser')
		Reactotron.log(result)
		if(result.kind == "ok" && result.data.user){
			// rootStore.assignCurrentUser(result.data.user);
			// var profile_url = CONFIG.ASSETS_URL+'/user-uploads/avatar/'+result.data.user.image;
			setJabatan(result.data.designation.name)
			setDepartemen(result.data.team.team_name)
			if(result.data.employee.latitude){
				setLatitude(result.data.employee.latitude)
				setLongitude(result.data.employee.longitude)
			}
			var additionalFieldData = JSON.parse(result.data.employee.additional_field)
			Reactotron.log('additionalFieldData.edit_lat_long')
			Reactotron.log(additionalFieldData.edit_lat_long)
			setEditWfh((additionalFieldData.edit_lat_long == 0)? false : true)
			Reactotron.log('result.data.user')
			Reactotron.log(result.data.user)
			// setProfilePic({ uri: profile_url });
		}
	}

	/*
	const loadGalleries = async () => {
		// get new data of user profile
	setLoading(true);
	var result = await rootStore.getGalleries();
	setLoading(false);

	if(result.kind == "ok" && result.data){
		var imgs = [];
		var videos = [];

		result.data.map((item,i) => {
			if(item.type == "image"){
				imgs.push(CONFIG.ASSETS_URL + item.file);
			}else if(item.type == "video"){
				videos.push(item.yt_link);
			}
		});

		setImageGalleries(imgs);
		setVideoGalleries(videos);
	}
	}
	*/

	useEffect( () => {

		loadProfile();
		loadJabatan();
		// loadGalleries();

		if(currentUser){
			// Reactotron.log('currentUser sekarang adalah');
			// Reactotron.log(currentUser);

			// setSkills((currentUser.skills) ? JSON.parse(currentUser.skills) : []);
			// setSpecialist((currentUser.specialist) ? JSON.parse(currentUser.specialist) : []);

			// var profile_url = (currentUser.image_url.indexOf("http://") == 0 || currentUser.image_url.indexOf("https://") == 0) ? currentUser.image_url : CONFIG.ASSETS_URL+currentUser.image_url;
			// setProfilePic({ uri: profile_url });

			// rootStore.setCurrentUser("get_notif", "1");
			// rootStore.setCurrentUser("price", "0");
			// setCurrentUser(rootStore.getCurrentUser());
		}
		// Reactotron.log(currentUser);

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

	/*
	const submitGallery = async (type, value) => {
		let formData = new FormData();
		formData.append("type", type);

		if(type == "image"){
			formData.append("image", {
	            uri: imgpickgallery.path,
	            name: imgpickgallery.modificationDate+".jpg",
	            type: (imgpickgallery.mime) ? imgpickgallery.mime : "jpg"
	        });
		}else if(type == "video"){
			formData.append("yt_link", value);
		}

        setLoading(true);
	    var result = await rootStore.addGallery(formData);
	    setLoading(false);
	    _panel.hide();

	    if(result.kind == "ok" && result.data){
	      // rootStore.removeCurrentUser();
	      // rootStore.assignCurrentUser(result.data);
	      // call_update = false;

	      ImagePicker.clean();
	      loadGalleries();

	      // setCurrentUser(result.data);
	    }
	}
	*/

	const doEdit = async (back) => {
		let formData = new FormData();

	    if(rootStore.getCurrentUser().name){
	        formData.append("name", rootStore.getCurrentUser().name);
	    }
	    if(rootStore.getCurrentUser().email){
	        formData.append("email", rootStore.getCurrentUser().email);
	    }

	    if(rootStore.getCurrentUser().email){
	        formData.append("mobile", rootStore.getCurrentUser().mobile);
	    }

	    // if(rootStore.getCurrentUser().latitude){
	    //     formData.append("latitude", rootStore.getCurrentUser().latitude);
	    // }

	    // if(rootStore.getCurrentUser().longitude){
	    //     formData.append("longitude", rootStore.getCurrentUser().longitude);
	    // }

	    formData.append("latitude", latitude);
	    formData.append("longitude", longitude);

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
	    // _panel.hide();

	    if(result.kind == "ok" && result.data){
	      // rootStore.removeCurrentUser();
	      // alert('Sukses')
	      rootStore.assignCurrentUser(result.data);
	      call_update = false;

	      ImagePicker.clean();
	      if(back){
	      	alert('Sukses')
    		props.navigation.goBack()
	      }
	      // props.navigation.goBack()
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

	const doLogout = async() => {
	    setLoading(true);
	    var result = await rootStore.doLogout();
	    setLoading(false);

	    Reactotron.log(result);
	    if(result.kind == "ok"){
	      navigateTo("login");
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

	const RegisterSchema = Yup.object().shape({
	  	email: Yup.string()
	  		.email('Email must be a valid email')
	  		.required('Email is required'),
  		name: Yup.string()
		  	.required('Name is required'),
	  	mobile: Yup.string()
		  	.required('Mobile is required'),
  	});

	const onSubmit = (values) => {
	  	Keyboard.dismiss();
	  	call_update = true;

	  	rootStore.setCurrentUser("email", values.email);
	  	rootStore.setCurrentUser("mobile", values.mobile);
	  	setCurrentUser(rootStore.getCurrentUser());
    	doEdit(true);
    	

	}

	/*
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
	const editWfhPage = () => {
		// alert('a')
		props.navigation.navigate('edit_lokasi_rumah', {data:'aa', simpanGPS: (latitude, longitude) => editLocation(latitude, longitude)})
	}

	const editLocation = (latitude, longitude) => {
		// alert('a')
		setLatitude(latitude)
		setLongitude(longitude)
		// props.navigation.navigate('edit_lokasi_rumah', {data:'aa'})
	}
  	return (
	    <View style={layout.container.general}>
			<Loading loading={loading} />

			<ScrollView>
				<Head type="detail" title={'Edit Profil'} navigation={props.navigation} />

				{(currentUser &&
					<View style={{ ...layout.container.wrapper, ...layout.container.bodyView, marginTop: 20 }}>
			        	
		        		<View style={layout.avatar.container}>
		        			<TouchableOpacity style={layout.avatar.wrapper} onPress={onChangeAvatar}>
		        				<View style={layout.avatar.shadow}></View>
		        				<Image style={layout.avatar.img} source={profilePic} />
		        				<Image style={layout.avatar.icon} source={require("@assets/camera.png")} />
		        			</TouchableOpacity>

		        		</View>

		        		<Formik
						    initialValues={{ 
						    	name: rootStore.showCurrentUser("name"),
						    	email: rootStore.showCurrentUser("email"),
						    	mobile: rootStore.showCurrentUser("mobile"),
						    	jabatan: jabatan,
						    	departemen: departemen
						    }}
						    validationSchema={RegisterSchema}
						    onSubmit={values => onSubmit(values)}
						>
						    {props => (

						    	<View style={{ width: deviceWidth*0.88, marginBottom: 40 }}>

						    		<ErrorMessage errors={props.errors} />

							      	<View style={{ ...layout.form.field, ...layout.textbox.wrapper, ...layout.textbox.disabled }}>
					                    <Icon name="ios-person" style={{ ...layout.textbox.icon }} size={20} />
					                    <TextInput
					                        style={{ ...layout.textbox.input }}
					                        onChangeText={props.handleChange('name')}
											onBlur={props.handleBlur('name')}
											value={props.values.name}
											placeholder={"Nama"}
											placeholderTextColor={color.placeholder}
											editable={false}
					                    />
					                </View>
					                <View style={{ ...layout.form.field, ...layout.textbox.wrapper, ...layout.textbox.disabled }}>
					                    <Icon name="ios-person" style={{ ...layout.textbox.icon }} size={20} />
					                    <TextInput
					                        style={{ ...layout.textbox.input }}
					                        onChangeText={props.handleChange('email')}
											onBlur={props.handleBlur('email')}
											value={jabatan}
											placeholder={"Jabatan"}
											placeholderTextColor={color.placeholder}
											editable={false}
					                    />
					                </View>
					                <View style={{ ...layout.form.field, ...layout.textbox.wrapper, ...layout.textbox.disabled }}>
					                    <Icon name="ios-person" style={{ ...layout.textbox.icon }} size={20} />
					                    <TextInput
					                        style={{ ...layout.textbox.input }}
					                        onChangeText={props.handleChange('email')}
											onBlur={props.handleBlur('email')}
											value={departemen}
											placeholder={"Departemen"}
											placeholderTextColor={color.placeholder}
											editable={false}
					                    />
					                </View>
					                <View style={{ ...layout.form.field, ...layout.textbox.wrapper, ...layout.textbox.outline }}>
					                    <Icon name="ios-mail" style={{ ...layout.textbox.icon }} size={20} />
					                    <TextInput
					                        style={{ ...layout.textbox.input }}
					                        onChangeText={props.handleChange('email')}
											onBlur={props.handleBlur('email')}
											value={props.values.email}
											keyboardType={"email-address"}
											placeholder={"Email"}
											placeholderTextColor={color.placeholder}
					                    />
					                </View>
					                <View style={{ ...layout.form.field, ...layout.textbox.wrapper, ...layout.textbox.outline }}>
					                    <Icon name="ios-phone-portrait" style={{ ...layout.textbox.icon }} size={20} />
					                    <TextInput
					                        style={{ ...layout.textbox.input }}
					                        onChangeText={props.handleChange('mobile')}
											onBlur={props.handleBlur('mobile')}
											value={props.values.mobile}
											keyboardType={"phone-pad"}
											placeholder={"No. Handphone"}
											placeholderTextColor={color.placeholder}
					                    />
					                </View>
					                <View style={{flexDirection:'row'}}>
					                	<View style={(editWfh) ? {width:0.6*deviceWidth} : {width:0.88*deviceWidth}}>
						                	<View style={{ ...layout.form.field, ...layout.textbox.wrapper, ...layout.textbox.disabled }}>
							                    <Icon name="ios-person" style={{ ...layout.textbox.icon }} size={20} />
							                    <TextInput
							                        style={{ ...layout.textbox.input }}
													value={(latitude) ? latitude+' , '+longitude : ''}
													placeholder={"Latitude Longitude Rumah"}
													placeholderTextColor={color.placeholder}
													editable={false}
							                    />
							                </View>
						                </View>
						                {(editWfh) &&
						                	<TouchableOpacity onPress={editWfhPage} style={{ ...layout.button.primary, ...layout.button.wrapper, ...layout.button.small, ...styles.action.btn, width:0.18*deviceWidth }}>
							                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>Edit</Text>
							                </TouchableOpacity>
						                }
						                
					                </View>
					                
							      	<Button onPress={props.handleSubmit} style={{ ...layout.button.primary, ...layout.button.wrapper, marginTop: 40 }}>
					                    <Text style={{ ...layout.button.text, ...layout.button.text_primary }}>SIMPAN PERUBAHAN</Text>
					                </Button>

						      	</View>
						    )}
						</Formik>
			        	
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
