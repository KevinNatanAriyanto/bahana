import { ViewStyle, ImageStyle, TextStyle, Dimensions, Platform } from "react-native"
import { color, palette, spacing, timing, typography } from "@theme"

const { height, width, heightWindow } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export const layout = {
	img_header: {
		position: "absolute", top: 0, left: 0, width: deviceWidth
	},
	html: {
		tagsStyles: { 
		    p: { textAlign: 'justify' } 
		},
	},
	container: {
		general: {
			flex: 1,
		},
		content: {
			minHeight: deviceHeight
		},
		content_wtabbar: {
			minHeight: deviceHeight-80
		},
		wrapper: {
			flex: 1,
			width: deviceWidth*0.88,
			height: null,
			alignSelf: "center",
			marginBottom: 20,
			marginTop: 20
		},
		wrapperCenter: {
			alignSelf: "center",
			justifyContent: "center",
			alignItems: "center",
			flex: 1,
		},
		wrapperLogin: {
			marginTop: 40
		},
		bg: {
			backgroundColor: color.palette.red, position: "absolute", top: 0, left: 0, right: 0, height: 220, zIndex: -1
		},
		bodyView: {
			marginBottom: 110
		},
		mr0: {
			marginRight: 0
		},
		row: {
			flexDirection: "row", flexWrap: "wrap"
		}
	},
	loading: {
		wrapper: {
			position: "absolute", top: 0, left: 0, backgroundColor: "#000", opacity: 0.5, zIndex: 9999, elevation: 99, width: deviceWidth, height: deviceHeight
		},
		loader: {
			position: "absolute", top: (deviceHeight/2)-50, left: (deviceWidth/2)-50
		}
	},
	typography: {
		h1: {
			fontSize: 24, fontWeight: "bold"
		},
		h2: {
			fontSize: 21, fontWeight: "bold"
		},
		h3: {
			fontSize: 16, fontWeight: "bold"
		},
		h4: {
			fontSize: 14, fontWeight: "bold"
		},
		h5: {
			fontSize: 12
		},
		body: {
			fontSize: 14
		},
		body_smaller: {
			fontSize: 12
		},
		bold: {
			fontWeight: "bold"
		}
	},
	form: {
		touchField: {
			position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999
		},
		field: {
			position: "relative",
			marginBottom: 20
		},
		input: {
			paddingHorizontal: 20,
			paddingVertical: 10,
			elevation: 2,
			borderRadius: 10,
			width: null,
			backgroundColor: "#fff",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
		},
		cinput: {
			paddingHorizontal: 20,
			paddingVertical: 10,
			borderRadius: 10,
			width: null,
			backgroundColor: "#F5F5F5",
		},
		icon_input: {
			color: "#AEAEAE",
			position: "absolute",
			top: 13,
			left: 20,
			zIndex: 999
		},
		icon_show_hide: {
			position: "absolute",
			top: 13,
			right: -20,
			zIndex: 999
		},
		icon_show_hide_profile: {
			position: "absolute",
			top: 10,
			right: -20,
			zIndex: 999
		},
		cinput_icon: {
			paddingHorizontal: 20,
			paddingVertical: 10,
			paddingLeft: 50,
			borderRadius: 10,
			width: null,
			backgroundColor: "#F5F5F5",
		},
		input_alt: {
			paddingHorizontal: 20,
			paddingVertical: 10,
			elevation: 2,
			borderRadius: 10,
			width: null,
			backgroundColor: "#fff",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
		},
		textarea: {
			padding: 20,
			elevation: 2,
			borderRadius: 10,
			width: null,
			backgroundColor: "#fff",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
			textAlignVertical: "top",
			height: 100
		},
		submit: {
			marginTop: 20, backgroundColor: "#381D5C", marginBottom: 30
		},
		input_icon: {
			position: "absolute", right: 20, top: 20, zIndex: 9
		},
		input_wrapper: {
			position: "relative"
		},
		btn_ico: {
			paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: "#FEF3F2", top: 15
		},
		upload_wrapper: {
			flexDirection: "row", alignItems: "center"
		},
		upload_text: {
			fontSize: 12, marginLeft: 30, flexWrap: "wrap", width: (deviceWidth/2)-100
		}
	},
	textbox: {
		wrapper: {
			flexDirection: "row", borderRadius: 10, paddingHorizontal: 20, marginBottom: 20
		},
		outline: {
			borderColor: "#BABABA", borderWidth: 1
		},
		icon: {
			marginRight: 10, color: "#BABABA", alignSelf: "center"
		},
		input: {
			height: 40, fontSize: 14, flex: 1
		},
		disabled: {
			backgroundColor: "#E0E0E0"
		},
		textarea: {
			backgroundColor: "#fff", height: 120, textAlignVertical: "top"
		}
	},
	radio: {
		wrapper: {
			flexDirection: "row", marginBottom: 10
		},
		rounded: {
			borderColor: "#301254", borderWidth: 1, padding: 1, width: 20, height: 20, borderRadius: 10, marginRight: 10
		},
		rounded_active: {
			backgroundColor: "#301254", borderRadius: 10, flex: 1
		},
		text: {
			color: "#5F5959", fontSize: 14
		}
	},
	checkbox: {
		wrapper: {
			flexDirection: "row", marginBottom: 10
		},
		rounded: {
			borderColor: "#301254", borderWidth: 1, padding: 1, width: 20, height: 20, borderRadius: 2, marginRight: 10, position: "relative"
		},
		rounded_active: {
			position: "absolute", top: 0, left: 5
		},
		text: {
			color: "#5F5959", fontSize: 14
		}
	},
	button: {
		wrapper: {
			flexDirection: "row", justifyContent: "center", borderRadius: 10, elevation: 2, shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
		},
		no_shadow: {
			elevation: 0,
			shadowOpacity: 0
		},
		small: {
			paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start'
		},
		primary: {
			backgroundColor: "#381D5C"
		},
		text: {
			fontSize: 14, fontWeight: "bold"
		},
		text_primary: {
			color: "#fff"
		},
		icon: {
			marginRight: 10, width: 20, height: 20, resizeMode: "contain"
		},
		outline: {
			backgroundColor: "#fff", borderColor: "#8D8D8D", borderWidth: 1
		},
		icon_outline: {
			color: "#8D8D8D"
		},
		text_outline: {
			color: "#8D8D8D", fontWeight: "bold"
		},
		disabled: {
			backgroundColor: "#C0C0C0"
		},
		text_disabled: {
			color: "#fff"
		}
	},
	dropdown: {
		wrapper: {
			marginBottom: 20,
			elevation: 2,
			borderRadius: 10,
			width: null,
			backgroundColor: "#fff",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
		},
		choice: {
			padding: 30, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20,
			elevation: 2,
			borderRadius: 10,
			width: null,
			backgroundColor: "#fff",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
		},
		choice_active: {
			backgroundColor: "#EA2326"
		},
		choice_text: {

		},
		choice_text_active: {
			color: "#fff"
		},
		item: {
			padding: 20, borderBottomWidth: 1, borderBottomColor: "#F1F1F1"
		},
		item_active: {
			
		},
		text: {
			textAlign: "center"
		},
		text_active: {
			color: "#EA2326"
		},
		input: {
			flex: 1
		}
	},
	notif: {
		wrapper: {
			marginBottom: 20
		},
		msg: {
			textAlign: "center"
		},
		error: {
			color: color.error
		}
	},
	bottom_notif: {
		container: {
			borderRadius: 10, padding: 20, backgroundColor: "#fff", zIndex: 9999, elevation: 999
		},
		backdrop: {
			zIndex: 999, elevation: 999
		},
		wrapper: {
			marginBottom: 0
		},
		title: {
			fontSize: 18, fontWeight: "bold", color: "#5F5959", marginBottom: 30
		},
		icon: {
			marginRight: 15
		},
		text: {
			fontSize: 14, color: "#5F5959", width: "80%"
		},
		row: {
			flexDirection: "row"
		},
		btn: {
			flex: 1
		}
	},
	header_option: {
		container: {
			position: "absolute", right: 20, top: 50, zIndex: 999, opacity: 0, zIndex: -1
		},
		wrapper: {
			paddingVertical: 10, paddingHorizontal: 20
		}
	},
	rounded: {
		wrapper: {
			flex: 1,
			flexDirection: "row"
		},
		btn: {
			borderWidth: 2,
			borderColor: "#FFBCBC",
			borderRadius: 26,
			paddingVertical: 15,
			paddingHorizontal: 30,
			marginRight: 20,
			marginTop: 20
		},
		btn_active: {
			borderColor: "#FF0000",
			backgroundColor: "#FF0000"
		},
		text: {
			color: "#C0C6CF"
		},
		text_active: {
			color: "#fff"
		}
	},
	choices: {
		wrapper: {
			flex: 1,
			flexDirection: "row",
			flexWrap: "wrap"
		},
		btn: {
			borderRadius: 10,
			paddingVertical: 10,
			paddingHorizontal: 20,
			marginBottom: 20
		},
		btn_active: {
			backgroundColor: "#FF0000"
		},
		text: {
			color: "#20222B", opacity: 0.6
		},
		text_active: {
			color: "#fff"
		}
	},
	otp: {
		wrapper: {
			flexDirection: "row", marginBottom: 40
		},
		box: {
			elevation: 2, marginRight: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#fff"
		},
		text: {
			fontSize: 30, fontWeight: "bold"
		}
	},
	success: {
		bg: {
			backgroundColor: "#FF1919"
		},
		wrapper: {
			width: deviceWidth, 
			height: deviceHeight, 
			alignSelf: "center",
			justifyContent: "center",
			alignItems: "center",
			flex: 1,
		},
		text: {
			color: color.text_light,
			marginBottom: 80,
			fontSize: 25,
			fontWeight: "bold",
			textAlign: "center"
		},
		img: {
			marginBottom: 40
		}
	},
	menu: {
		wrapper: {
			flexDirection: "row", alignSelf: "center", alignItems: "center", flexWrap: "wrap", 
		},
		box: {
			elevation: 2, borderRadius: 10, width: (deviceWidth/3)-40, height: 100, marginVertical: 10, marginHorizontal: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 10
		},
		img: {
			marginBottom: 5, width: 40, height: 40, resizeMode: "contain"
		},
		grid: {
			flexDirection: "row", flexWrap: "wrap"
		},
		txt: {
			fontSize: 12, fontWeight: "bold", fontFamily: "Manrope", marginTop: 10, textAlign: "center"
		}
	},
	menuvertical: {
		list: {
			flexDirection: "row", paddingVertical: 20, borderBottomWidth: 1, borderColor: "#BABABA"
		},
		no_border: {
			borderBottomWidth: 0
		},
		icon: {
			marginRight: 20, width: 20, height: 20, resizeMode: "contain"
		},
		text: {
			
		}
	},
	accordion: {
		header: {
			wrapper: {
				flexDirection: "row", flex: 1, zIndex: 9, position: "relative", backgroundColor: "#fff", marginBottom: 0, padding: 20, borderRadius: 10
			},
			title: {
				flex: 1
			},
			icon: {
				color: "#C8C8C8"
			}
		},
		content: {
			wrapper: {
				paddingHorizontal: 20, position: "relative", borderRadius: 10, paddingBottom: 20
			}
		},
		section: {
			padding: 0, borderRadius: 10
		}
	},
	slides: {
		container: {

		},
		wrapper: {
			flexDirection: "row", borderRadius: 8, elevation: 2, backgroundColor: "#fff", height: 150, margin: 5
		},
		title: {
			marginBottom: 15, fontSize: 11, color: "#09133C", flexWrap: "wrap", width: deviceWidth-300
		},
		category: {
			marginBottom: 10, fontSize: 12, color: "#C3C9DF"
		},
		date: {
			fontSize: 10, color: "#C3C9DF"
		},
		info: {
			padding: 20
		},
		img: {
			width: 150, height: 150, borderTopLeftRadius: 8, borderBottomLeftRadius: 8
		},
		header: {
			flexDirection: "row", marginBottom: 20
		}
	},
	list_activity: {
		line: {
			width: 1, height: "80%", flex: 1, backgroundColor: "#BABABA", position: "absolute", left: 40, top: 20
		},
		wrapper: {
			flexDirection: "row", marginBottom: 40
		},
		info: {
			flex: 1
		},
		avatar: {
			width: 40, height: 40, marginRight: 20, borderRadius:20
		},
		date: {
			color: "#BABABA", marginRight: 10
		},
		time: {
			color: "#BABABA"
		}
	},
	list_row: {
		container: {
		    marginBottom: 10, justifyContent: "flex-end", flexDirection: "row"
		},
		list_label: {
		    color: "#8D8D8D", alignSelf: "flex-start", marginRight: 10, flex: 1, textAlign: "left"
		},
		list_value: {
		    color: "#5F5959", alignSelf: "flex-end", flex: 1, textAlign: "right", maxWidth: deviceWidth*0.5
		}
	},
	list: {
		image_calendar:{
	        height:0.041*deviceWidth,
	        width:0.041*deviceWidth,
	        marginRight:0.055*deviceWidth,
	    },
	    container:{
	    	// height: 0.22*deviceWidth,
	        backgroundColor:'white',
	        borderRadius:10,
	        elevation:2,
	        paddingLeft:0.055*deviceWidth,
	        paddingRight:0.055*deviceWidth,
	        paddingTop:0.027*deviceWidth,
	        paddingBottom:0.027*deviceWidth
	        // flexDirection:'row'
	    },
	    separator_line_grey:{
	        borderBottomColor: "#CCCCCC", 
	        borderBottomWidth: 1,
	        marginTop:0.027*deviceWidth,
	        marginBottom:0.027*deviceWidth
	        // alignSelf: "center"
	    },
	    date_text:{
	        fontSize:14,
	        color:"#CCCCCC",
	        textAlignVertical: "center"
	    },
	    center:{
	        alignItems: 'center', justifyContent: 'center'
	    },
	    akhir_tgl:{
	        flexDirection:'row', 
	        // marginTop:0.055*deviceWidth
	    },
	    absence_list:{
	        // width: 0.875*deviceWidth,
	        borderRadius:10,
	        elevation:1,
	        padding:0.055*deviceWidth,
	        marginBottom:0.027*deviceWidth,
	        backgroundColor: "#fff"
	        // paddingRight:0.055*deviceWidth,
	        // paddingTop:0.055*deviceWidth,
	        // paddingBottom:0.055*deviceWidth
	    },
	    form_list:{
	        borderRadius:10,
	        elevation:1,
	        paddingLeft: 0.055*deviceWidth,
	        paddingRight: 0.055*deviceWidth,
	        paddingTop: 0.027*deviceWidth,
	        paddingBottom: 0.027*deviceWidth,
	        marginBottom:0.027*deviceWidth,
	        backgroundColor: "#fff"
	    },
	    status_list_in:{
	        fontSize:12,
	        color:"#E96925",
	    },
	    status_list_out:{
	        fontSize:12,
	        color:"#8333E9",
	    },
	    status_box_in:{
	        borderRadius:10,
	        // elevation:1,
	        width:0.3*deviceWidth,
	        paddingBottom:0.013*deviceWidth,
	        paddingTop:0.013*deviceWidth,
	        paddingLeft:0.027*deviceWidth,
	        paddingRight:0.027*deviceWidth,
	        backgroundColor:'#FFE6D8',
	        marginBottom:0.02*deviceWidth
	        // marginBottom:0.027*deviceWidth
	    },
	    status_box_out:{
	        borderRadius:10,
	        // elevation:1,
	        width:0.3*deviceWidth,
	        paddingBottom:0.013*deviceWidth,
	        paddingTop:0.013*deviceWidth,
	        paddingLeft:0.027*deviceWidth,
	        paddingRight:0.027*deviceWidth,
	        backgroundColor:'#E9D8FF',
	        marginBottom:0.02*deviceWidth
	        // marginBottom:0.027*deviceWidth
	    },
	    date_list:{
	        fontSize:16,
	        color:"#5F5959",
	        fontWeight: "bold",
	        marginBottom:0.01*deviceWidth
	    },
	    absen_list:{
	        fontSize:12,
	        color:"#5F5959",
	    },
	    absen_button:{
	        flexDirection:'row',
	        position: "absolute",
	        alignSelf:'center',
	        bottom:0.138*deviceWidth,
	        paddingRight:0.055*deviceWidth,
	        paddingLeft:0.055*deviceWidth,
	        paddingTop:0.027*deviceWidth,
	        paddingBottom:0.027*deviceWidth,
	        backgroundColor:'#381D5C',
	        borderRadius:10,
	    },
	    fingerprint_image:{
	        height:0.055*deviceWidth,
	        width:0.055*deviceWidth,
	        marginRight:0.027*deviceWidth,
	    },
	    absen_text:{
	        fontSize:14,
	        color:"#FFFFFF",
	        fontWeight: "bold",
	    },
	},
	alert: {
		wrapper: {
			flexDirection: "row", paddingHorizontal: 20, paddingVertical: 10, position: "relative", borderRadius: 5, marginBottom: 10
		},
		text:{
			color: "#535353", fontSize: 12
		},
		info: {
			backgroundColor: "#FBF7FF"
		},
		info_alt: {
			backgroundColor: "#E9D8FF"
		},
		text_info_alt:{
			color: "#8333E9", fontSize: 14
		},
		warning: {
			backgroundColor: "#E9EBF8"
		},
		danger: {
			backgroundColor: "#E8AEB7"
		},
		close: {
			position: "absolute", top: 10, right: 20
		}
	},
	tabs: {
		container: {
			backgroundColor: "#fff", 
			marginBottom: 5,
			elevation: 3, shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
		},
		indicator: {
			backgroundColor: '#381D5C', height: 3
		},
		title: {
			color: '#381D5C', fontWeight: "bold", fontSize:(deviceWidth*0.035),
			textTransform: "capitalize"
		},
		inactive_title: {

		}
	},
	grid: {
		wrapper: {
			flexDirection: "row", flexWrap: "wrap", flex: 1, justifyContent: "space-between"
		},
		half: {
			width: "48%"
		}
	},
	avatar: {
		container: {
			marginBottom: 20, alignItems: "center", 
		},
		wrapper: {
			marginBottom: 20
		},
		shadow: {
			width: 120, height: 120, marginLeft: 0, backgroundColor: "#F3F5F9", borderRadius: 60, position: "absolute"
		},
		img: {
			width: 120, height: 120, borderRadius: 60
		},
		icon: {
			position: "absolute", top: 40, right: -20
		},
		name: {
			fontSize: 32, fontWeight: "bold"
		},
		job: {
			fontSize: 20, color: color.palette.red, fontWeight: "300"
		},
		award: {
			flexDirection: "row", marginTop: 20
		},
		award_title: {
			color: "#FFBF11", fontStyle: "italic", marginLeft: 10
		}
	},
	info: {
		wrapper: {
			flexDirection: "row"
		},
		section: {
			marginBottom: 20
		},
		section_alt: {
			marginBottom: 20, width: deviceWidth*0.7
		},
		title: {
			color: "#223269", opacity: 0.3, fontSize: 14, marginBottom: 10
		},
		description: {
			color: "#242134", 
			paddingHorizontal: 20
		},
		action: {

		},
		action_text: {
			fontSize: 14
		}
	},
	label: {
		wrapper: {
			paddingVertical: 5, fontSize: 12, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 10, marginRight: 10, textTransform: "capitalize"
		},
		warning: {
			backgroundColor: "#FFE6D8", color: "#E96925"
		},
		info: {
			backgroundColor: "#CDF1FC", color: "#01A1D1"
		},
		error: {
			backgroundColor: "#FAD2D2", color: "#C13636"
		},
		primary: {
			backgroundColor: "#E9D8FF", color: "#8333E9"
		}
	},
	page: {
		header_round: {
			backgroundColor: color.palette.red, borderRadius: 40, height: 240, width: deviceWidth, position: "absolute", top: -40,
		}
	},
	well: {
		wrapper: {
			paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "#fff", borderRadius: 10,
			elevation: 3,
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
		},
		header: {
			borderBottomWidth: 1, borderColor: "#E5E5E5", paddingBottom: 15
		},
		header_title: {
			fontSize: 14, fontWeight: "bold"
		},
		content: {
			marginTop: 20
		}
	},
	filter: {
		date: {
			wrapper: {

			}
		}
	},
	detail: {
		feat: {
			borderRadius: 10, height: 230, marginBottom: 40
		},
		feat_alt: {
			height: 275, marginBottom: 20, width: deviceWidth
		},
		header: {
			flexDirection: "row", marginBottom: 20
		},
		header_info: {
			flexDirection: "row", position: "absolute", right: 0, flex: 1, justifyContent: "flex-end", minWidth: 100, 
		},
		header_award_text: {
			marginLeft: 10, fontSize: 15, fontStyle: "italic", color: "#FFBF11"
		},
		description: {
			color: "#B4B4B4", fontSize: 12, marginBottom: 20, marginTop: 0
		},
		gps: {
			flexDirection: "row", marginBottom: 50
		},
		gps_text: {
			fontWeight: "bold", fontSize: 14, marginLeft: 10,
		},
		news_info: {
			flexDirection: "row"
		},
		news_info_text: {
			color: "#CFCFCF", fontSize: 12
		},
		news_info_separator: {
			marginHorizontal: 10, width: 1, height: 15, backgroundColor: "#CFCFCF"
		},
		title: {
			fontSize: 25, fontWeight: "bold", color: "#1F2833"
		},
		subtitle: {
			fontWeight: "bold", color: color.palette.red
		},
		small: {
			fontSize: 10, color: "#1F2833", opacity: 0.6, marginBottom: 10
		}
	},
	gallery: {
		wrapper: {
			flexDirection: "row", flexWrap: "wrap", marginRight: -20
		},
		title: {
			color: "#2E384D", fontSize: 14, fontWeight: "bold", marginBottom: 10
		},
		img: {
			width: 100, height: 100, marginBottom: 15, marginRight: 15
		},
		misc: {
			width: 100, height: 100, justifyContent: "center", alignItems: "center",
		},
		misc_text: {
			fontWeight: "bold", fontSize: 12, color: color.palette.white, textAlign: "center"
		}
	},
	slider: {
		track: {
			height: 2,
		    borderRadius: 5,
		    backgroundColor: '#F2F2F2',
		},
		thumb: {
			width: 5,
		    height: 20,
		    borderRadius: 2,
		    backgroundColor: '#EB1F07',
		},
		title: {
			fontSize: 13, fontWeight: "bold", alignSelf: "center", marginBottom: 20
		},
		value: {
			fontSize: 10, alignSelf: "center"
		}
	},
	banner: {
		wrapper: {
			width: deviceWidth*0.8, height: 190, borderRadius: 10, justifyContent: "flex-end",
		},
		title: {
			fontSize: 13, color: color.palette.white,
		},
		category: {
			paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, marginBottom: 20, alignSelf: "flex-start"
		},
		category_title: {
			fontWeight: "bold", fontSize: 10, color: color.palette.white
		},
		info: {
			padding: 20
		}
	},
	btn: {
		wrapper: {
			flexDirection: "row", justifyContent: "space-between"
		},
		twoCol: {
			width: (deviceWidth*0.8)-10
		},
		big: {
			borderRadius: 10, height: 150, width: 150, justifyContent: "center", alignItems: "center"
		},
		big_text: {
			fontSize: 15, fontWeight: "bold", marginTop: 10
		},
		regular: {
			height: 40, paddingHorizontal: 40, borderRadius: 10, justifyContent: "center", alignItems: "center"
		},
		btn_alt: {
			borderRadius: 5
		}
	},
	comment: {
		wrapper: {
			width: 20, height: 20, borderRadius: 10, borderBottomLeftRadius: 0, marginRight: 5, backgroundColor: "#FFCC00", justifyContent: "center", alignItems: "center"
		},
		img: {
			borderRadius: 10, borderBottomLeftRadius: 0, flex: 1, 
		},
		text: {
			color: "#fff", fontSize: 8, fontWeight: "bold"
		}
	},
	progressbar: {
		wrapper: {
			height: 5, backgroundColor: "#F5F5F5", borderRadius: 3
		},
		fill: {
			height: 5, backgroundColor: "#34C255", borderRadius: 3	
		}
	},
	top_alert: {
		container: {
			backgroundColor: "#fff", padding: 20, elevation: 3,
	    	shadowColor: "#232323",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.15,
			shadowRadius: 2.22,
		},
		wrapper: {
			width: deviceWidth*0.88,
			alignSelf: "center",
		}
	},
	box: {
		wrapper: {
			backgroundColor: "#fff", borderRadius: 10, margin: 3, position: "relative"
		},
		section: {
			marginBottom: 20, padding: 20
		},
		shadow: {
			elevation: 3,
	    	shadowColor: "#232323",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.15,
			shadowRadius: 2.22,
		}
	},
	rating: {
	    wrapper: {
	      flexDirection: "row", alignItems: "center"
	    },
	    container: {
	      width: 8, height: 8, borderRadius: 4, marginRight: 3, backgroundColor: "#A0A0A0"
	    },
	    empty: {
	      backgroundColor: "#A0A0A0"
	    },
	    fill: {
	      backgroundColor: "#DD3E3E"
	    },
	    text: {
	      fontSize: 12, color: "#A0A0A0", marginLeft: 5
	    }
  	},
  	qty: {
	    wrapper: {
	      flexDirection: "row", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 12, borderColor: "#FF0000", borderWidth: 1
	    },
	    text: {
	      color: "#FF0000", fontSize: 20, textAlign: "center"
	    },
	    inactive: {
	      backgroundColor: "#fff"
	    },
	    active: {
	      backgroundColor: "#FF0000", borderRadius: 10
	    },
	    active_text: {
	      color: "#fff"
	    },
	    left: {
	      borderTopLeftRadius: 10, borderBottomLeftRadius: 10, flex: 1
	    },
	    right: {
	      borderTopRightRadius: 10, borderBottomRightRadius: 10, flex: 1
	    }
  	},
  	modal: {
  		wrapper: {
  			width: deviceWidth*0.8, padding: 0, elevation: 999, zIndex: 999, borderRadius: 10, height: deviceHeight*0.7, position: "relative"
  		},
  		close: {
  			position: "absolute", right: 40, top: 20, zIndex: 999
  		},
  		info: {
  			flexDirection: "row",
  		},
  		info_wrap: {
  			width: deviceWidth*0.4
  		},
  		img: {
  			width: 70, height: 70, marginRight: 20, resizeMode: "contain"
  		},
  		title: {
  			fontSize: 25, fontWeight: "bold", color: "#FF0000", marginBottom: 10
  		},
  		subtitle: {
  			fontSize: 11, fontStyle: "italic", color: "#1A2E4B", fontWeight: "bold"
  		},
  		description_header: {
  			marginTop: 30, color: "#1A2E4B", fontSize: 12, fontWeight: "bold", fontStyle: "italic", marginBottom: 10
  		},
  		description: {
  			fontSize: 12, fontWeight: "100", color: "#081220"
  		},
  		header: {
  			backgroundColor: "#1979a9", borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 20
  		},
  		header_title: {
  			color: "#fff"
  		},
  		body: {
  			padding: 20
  		}
  	},
  	ads: {
  		wrapper: {
  			justifyContent: "center", alignItems: "center", height: 100
  		},
  		text: {
  			fontSize: 18, color: "#000"
  		},
  		img: {
  			height: 200, resizeMode: "contain"
  		}
  	},
  	location_picker:{
  		container:{
	  		borderRadius:10,
	        elevation:1,
	        padding:0.055*deviceWidth,
	        marginBottom:0.027*deviceWidth,
	        marginTop:0.055*deviceWidth,
  		},
  		map_view:{
  			marginTop:0.027*deviceWidth, 
  			marginBottom:0.027*deviceWidth, 
  		},
  		image_map:{
  			height:0.5*deviceWidth,
        	width:0.77*deviceWidth,
  		},
  		desc:{
	        fontSize:12,
	        color:"#5F5959",
	        marginTop:0.01*deviceWidth
	        // width:0.35*deviceWidth
	    },
  	},
  	file_field:{
  		container:{
	  		borderRadius:10,
	        elevation:1,
	        padding:0.055*deviceWidth,
	        marginBottom:0.027*deviceWidth,
	        marginTop:0.055*deviceWidth
	    },
	    container_inside:{
		    borderRadius:10,
	        elevation:1,
	        padding:0.055*deviceWidth,
	        marginBottom:0.027*deviceWidth,
	        flexDirection:'row',
	        justifyContent:'space-between'
	        },
	    image_doc:{
	        height:0.083*deviceWidth,
	        width:0.083*deviceWidth,
	        // marginRight:0.055*deviceWidth,
	    },
	    image_ic_delete:{
	        height:0.041*deviceWidth,
	        width:0.041*deviceWidth,
	        marginRight:0.027*deviceWidth,
	    },
	    image_ic_download:{
	        height:0.041*deviceWidth,
	        width:0.041*deviceWidth,
	        // marginRight:0.055*deviceWidth,
	    },
	    button_group:{
	    	flexDirection:'row', 
	    	justifyContent:'center', 
	    	alignItems:'center'
	    },
	    namefile:{
	        fontSize:14,
	        color:"#301254",
	        fontWeight:'bold',
	        width: deviceWidth* 0.5,
	        flex: 1,
	        flexWrap: "wrap",
	        // marginTop:0.055*deviceWidth
	    },
	    sizefile:{
	        fontSize:12,
	        color:"#BABABA",
	        // marginTop:0.055*deviceWidth
	    },
  	},
  	modalbox:{
  		modal:{
	        width: deviceWidth*0.88, 
	        padding: 0, 
	        elevation: 999, 
	        zIndex: 999, 
	        borderRadius: 10, 
	        height: null, 
	        position: "relative"
	    },
	    modal_header:{
	        fontSize:18,
	        color:"#5F5959",
	        fontWeight: "bold",
	        textAlign: "center"
        },
	    ok_button:{
	        flexDirection:'row',
	        alignSelf:'center',
	        width:0.361*deviceWidth,
	        height:0.111*deviceWidth,
	        // borderWidth:1,
	        borderRadius:10,
	        backgroundColor:'#381D5C',
	        // borderColor:'#8D8D8D'
	        justifyContent:'center',
	        alignItems:'center'
	     },
	     batal_button:{
	        flexDirection:'row',
	        alignSelf:'center',
	        width:0.361*deviceWidth,
	        height:0.111*deviceWidth,
	        borderWidth:1,
	        borderRadius:10,
	        borderColor:'#8D8D8D',
	        justifyContent:'center',
	        alignItems:'center'
	     },
	    ok_text:{
	        fontSize:14,
	        color:"#FFFFFF",
	        fontWeight: "bold",
	        },
	    batal_text:{
	        fontSize:14,
	        color:"#8D8D8D",
	        fontWeight: "bold",
	        },
	    button_modal:{
	    	flexDirection:'row',
	    	justifyContent: "space-between", 
	    	marginTop: 0
	    }
  	},
  	opsi:{
  		button_group:{
  			width:0.305*deviceWidth,
  			height:0.222*deviceWidth
  		},
  		modal_container:{
	        width:0.305*deviceWidth, 
	        height:0.16*deviceWidth, 
	        position:'absolute', 
	        top:-0.65*deviceWidth, 
	        right:0.4*deviceWidth, 
	        borderRadius:10,
	        borderWidth:1,
	        zIndex:3,
	    },
	    button_opsi:{
	    	paddingLeft:0.027*deviceWidth, 
	    	paddingTop:0.013*deviceWidth, 
	    	paddingRight:0.027*deviceWidth, 
	    	paddingBottom:0.013*deviceWidth, 
	    	zIndex:7
	    },
	    function_text:{
	        fontSize:14,
	        color:"#3B3B3B",
	    },
  	}
}