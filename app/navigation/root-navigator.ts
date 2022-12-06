import { createStackNavigator } from "react-navigation"
import { PrimaryNavigator, LandingNavigator } from "./primary-navigator"

export const RootNavigator = createStackNavigator(
  {
    landingStack: { screen: LandingNavigator },
    primaryStack: { screen: PrimaryNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { 
    	gesturesEnabled: false,
    	header: null
    },
  },
)
