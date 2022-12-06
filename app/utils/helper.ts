import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle, View, Image, ImageStyle, Text, TextStyle, Platform, Linking } from "react-native"
import { Screen, Button, Checkbox, FormRow, Header, Icon, Switch, Wallpaper } from "@components"
import { color, layout } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import Reactotron from 'reactotron-react-native';
import { showMessage, hideMessage } from "react-native-flash-message";

export class Helper{

	static convertTime(inputDate) {
		var dateParts = inputDate.split(" ");
		var time = dateParts[1].split(":");
		return time[0]+":"+time[1];
	}

	static openGps(latlong){
		var coord = latlong.split(",");
		var lat = coord[0];
		var lng = coord[1].trim();

		const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
		const latLng = `${lat},${lng}`;
		const label = 'Your Place';
		const url = Platform.select({
		  ios: `${scheme}${label}@${latLng}`,
		  android: `${scheme}${latLng}(${label})`
		});

		Linking.openURL(url); 
	}

	static renderDateNum(day, month, year, bol) {

		// console.log("INPUT DATE =====> " + day + "/" + month + "/" + year)
		let hari = '';
		let bulan = '';
		let tahun = '';
		let tanggal = '';

		let tempMonth = month + 1

		if (day < 10) {
			hari = "0" + day;
		} else {
			hari = day;
		}

		if (tempMonth < 10) {
			bulan = "0" + tempMonth;
		} else {
			bulan = tempMonth;
		}

		tahun = year;

		if (bol) {
			tanggal = hari + "-" + bulan + "-" + tahun

		} else {

			tanggal = hari + "/" + bulan + "/" + tahun
		}

		return tanggal;

	}
	
	static convertDate(inputDate) {
		var dateParts = inputDate.split("-");
		var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));

		var month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
		//var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		month = month[date.getMonth()];

		var dateStr = date.getDate() + ' ' + month + ' ' + date.getFullYear();
		// var dateStr = month + ' ' + date.getDate() + ', ' + date.getFullYear();
		return dateStr;
	}

	static convertDateFromUTC(inputDate) {
		var date = new Date(inputDate)
        var tgl = date.getDate()+' '+(Helper.getMonth(date.getMonth()))+' '+date.getFullYear()
		return tgl;
	}

	static convertDateFromUTCWithDay(inputDate) {
		
		var date = new Date(inputDate)
		var day = this.renderDay(date.getDay())
        var tgl = day+', '+date.getDate()+' '+(Helper.getMonth(date.getMonth()))+' '+date.getFullYear()
		return tgl;
	}

	static removeHTML(data){
		return data.replace(/<\/?[^>]+(>|$)/g, "");
	}

	static currencyThousand(value){
		if(value){
			value = value;
		}else{
			value = 0;
		}

		var currency = parseInt(value);
		currency = (currency > 1000) ? (currency/1000)+"K" : currency;
		return currency;
	}

	static string_to_slug (str) {
	    str = str.replace(/^\s+|\s+$/g, ''); // trim
	    str = str.toLowerCase();
	  
	    // remove accents, swap ñ for n, etc
	    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	    var to   = "aaaaeeeeiiiioooouuuunc------";
	    for (var i=0, l=from.length ; i<l ; i++) {
	        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	    }

	    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
	        .replace(/\s+/g, '_') // collapse whitespace and replace by _
	        .replace(/-+/g, '_'); // collapse dashes

	    return str;
	}

	static diffNowDays(target_date){
		var now = new Date();
		var dateParts = target_date.split("-");
		var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));

		var Difference_In_Time = jsDate.getTime() - now.getTime(); 
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

		return Difference_In_Days.toFixed(0)+" days to go";
	}

	static mysqlGmtStrToJSDate(str) {

        var t = str.split(/[- :]/);

        // Apply each element to the Date function
        return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

    }

    static mysqlGmtStrToJSLocal(str) {
        // first create str to Date object
        var g = this.mysqlGmtStrToJSDate(str);
        // 
        return new Date(g.getTime() - ( g.getTimezoneOffset() * 60000 ));
    }

    static convertToUTC(tgl){
    	// YYYY-MM-DDTHH:mm:ss.SSSZ
    	return tgl.toISOString();
    	// return tgl.getUTCFullYear()+"-"+("0"+tgl.getUTCMonth()+1).slice(-2)+"-"+("0"+tgl.getUTCDate()).slice(-2)+"T"+("0"+tgl.getUTCHours()).slice(-2)+":"+("0"+tgl.getUTCMinutes()).slice(-2)+":"+("0"+tgl.getUTCSeconds())+".";
    }

    static getSettings(arr, name){
    	var result;
    	arr.map((item, key) => {
    		if(item.key == name){
    			result = item.value
    		}
    	});

    	return result;
    }

    static renderDay(day) {
		var weekday = new Array(7);
		weekday[0] = 'Minggu';
		weekday[1] = 'Senin';
		weekday[2] = 'Selasa';
		weekday[3] = 'Rabu';
		weekday[4] = 'Kamis';
		weekday[5] = 'Jumat';
		weekday[6] = 'Sabtu';

		return weekday[day]
	}
	static getUTC(){
		var date = new Date();
		var offsetInHours = -1 * (date.getTimezoneOffset() / 60);

		return offsetInHours;
	}
	static getMonth(params){
		var month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
		//var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		month = month[params];
		return month;
	}
	static renderTimeAmPm(date){
		var hour = date.getHours()
		var minutes = date.getMinutes()
		var status = 'am'

		if(hour>12){
			hour = hour-12
			status = 'pm'
		}else if(hour==12){
			hour = 0
			status = 'pm'	
		}
		if(hour<10){
			hour = '0'+hour
		}

		if(minutes<10){
			minutes = '0'+minutes
		}

		var data = hour+':'+minutes+' '+status
		return data
	}

	static convertTimeAmPm(date){
		if(date){
			var hour = date.split(" ");
			var hours = hour[0].split(":")
			var tambah = 0
			if(hour[1]=='PM'){
				tambah = 12
				if(parseInt(hours[0]) == 12){
					tambah = 0
				}
			}

			
			var jam = parseInt(hours[0])+tambah
			if(jam < 10){
				jam = "0"+jam
			}
			var menit = parseInt(hours[1])
			if(menit < 10){
				menit = "0"+menit
			}
			var date = new Date().getDate(); //Current Date
		    var month = new Date().getMonth() + 1; //Current Month
		    var year = new Date().getFullYear(); //Current Year
			var time = date + "/" + month + "/" + year + " "+jam+":"+menit+":00"
			return time
			// return hour[0]+""+hour[1]
		}
	}

	static getDateNow(){
		var date = new Date().getDate(); //Current Date
	    var month = new Date().getMonth() + 1; //Current Month
	    var year = new Date().getFullYear(); //Current Year
	    var hours = new Date().getHours(); //Current Hours
	    var min = new Date().getMinutes(); //Current Minutes
	    var sec = new Date().getSeconds(); //Current Seconds
		var date_now = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec

		return date_now
	}

	static offlineMsg(state = true){
		if(state){
			showMessage({
		      message: "Anda sekarang offline",
		      // description: "Cek koneksi internet anda",
		      type: "danger",
		      autoHide: false,
			  hideOnPress: false,
			  style: { height: 40, paddingVertical: 10 }
		    });
		}else{
			showMessage({
		      message: "Koneksi internet tersambung",
		      // description: "Cek koneksi internet anda",
		      type: "success",
		      autoHide: false,
			  hideOnPress: false,
			  style: { height: 40, paddingVertical: 10 }
		    });
		}
	}

	static isOffline(rootStore){
        // offline mode checker
        var settings = rootStore.getData("settings");
        var offline_mode = (settings.offline_mode) ? settings.offline_mode : false;
        return offline_mode;
    }
	
}