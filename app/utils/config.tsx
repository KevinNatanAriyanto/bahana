import { ENVIRONMENT } from "react-native-dotenv"
import Config from "react-native-config";

var _config;

console.log('---------ENVIRONMENT-----------');
console.log(Config.ENVIRONMENT);

if(Config.ENVIRONMENT == "STAGING"){ //local
	_config = {
		ENVIRONMENT: "STAGING",
		VERSION: "2.6",
		APP_VERSION: "dev-v1.16.8b",
		USER_PLACEHOLDER: "https://thechefapps.com/wp-content/uploads/2019/10/cropped-the-chef-apps-logo-192x192.png",
	  	WEB_URL: "http://ebisdev.bahanagroup.com",
	  	ASSETS_URL: "http://ebisdev.bahanagroup.com/public",
		API_URL: "http://ebisdev.bahanagroup.com/api/v1",
		GOOGLE_MAPS_API_KEY: "abcdefgh",
		ONESIGNAL_KEY: "b002fa3a-4dda-4e66-8cd2-e60b64ef4136",
		YOUTUBE_API_KEY: "AIzaSyDCupFQh5Pp8N0vFSGMSH20rf9KPVfwLls",
		CODEPUSH_KEY: "ypsmUMGHdbz8edppcnE23bKWmrnULmcW9X4nq",
		BUGSNAG_KEY: "152cb49ebbc1fb50b31562809c099456",
		BUGSEE_KEY: "527b74b5-8d3d-4e84-b089-efba4177d872",

		FB_URL: "https://www.facebook.com/thechefid",
		IG_URL: "https://www.instagram.com/thechefid/",
		TWITTER_URL: "https://twitter.com/thechefid/",
		WA_NUMBER: "+6281388333677",

		"UTASK_ID": "00",
		DEBUG_MOCK_LOCATION: true
	}
}else if(Config.ENVIRONMENT == "PRODUCTION"){ //publish
	_config = {
		ENVIRONMENT: "PRODUCTION",
		VERSION: "4.0",
		APP_VERSION: "v1.17.12",
		USER_PLACEHOLDER: "https://thechefapps.com/wp-content/uploads/2019/10/cropped-the-chef-apps-logo-192x192.png",
	  	WEB_URL: "http://ebislive.bahanagroup.com",
	  	ASSETS_URL: "http://ebislive.bahanagroup.com/public",
		API_URL: "http://ebislive.bahanagroup.com/api/v1",
		GOOGLE_MAPS_API_KEY: "abcdefgh",
		ONESIGNAL_KEY: "b002fa3a-4dda-4e66-8cd2-e60b64ef4136",
		YOUTUBE_API_KEY: "AIzaSyDCupFQh5Pp8N0vFSGMSH20rf9KPVfwLls",
		CODEPUSH_KEY: "pP7qjTH4DGZ8lS8bfKKnu_cfCRBux8ESw9aNpm",
		BUGSNAG_KEY: "152cb49ebbc1fb50b31562809c099456",
		BUGSEE_KEY: "527b74b5-8d3d-4e84-b089-efba4177d872",

		FB_URL: "https://www.facebook.com/thechefid",
		IG_URL: "https://www.instagram.com/thechefid/",
		TWITTER_URL: "https://twitter.com/thechefid/",
		WA_NUMBER: "+6281388333677",

		"UTASK_ID": "00",
		DEBUG_MOCK_LOCATION: false
	}
}

export const CONFIG = _config;