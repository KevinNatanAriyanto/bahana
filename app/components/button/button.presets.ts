import { ViewStyle, TextStyle } from "react-native"
import { color, spacing } from "../../theme"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  paddingVertical: 20,
  paddingHorizontal: 40,
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
}

const BASE_TEXT: TextStyle = {
  paddingHorizontal: spacing[3],
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets = {
  /**
   * A smaller piece of secondard information.
   */
  primary: { ...BASE_VIEW, backgroundColor: color.palette.red } as ViewStyle,
  default: { ...BASE_VIEW, backgroundColor: color.primary } as ViewStyle,
  search: { 
    ...BASE_VIEW, 
    borderRadius: 5,
    backgroundColor: "#34C255",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height:0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  } as ViewStyle,
  blue: { 
    ...BASE_VIEW, 
    backgroundColor: "#14BFFF",
    elevation: 5,
    shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  } as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "flex-start",
  } as ViewStyle,
}

export const textPresets = {
  primary: { ...BASE_TEXT, fontSize: 15, color: color.palette.white } as TextStyle,
  default: { ...BASE_TEXT, fontSize: 15, color: color.palette.white } as TextStyle,
  search: { ...BASE_TEXT, fontSize: 15, color: color.palette.white } as TextStyle,
  blue: { ...BASE_TEXT, fontSize: 15, color: color.palette.white } as TextStyle,
  link: {
    ...BASE_TEXT,
    color: color.text,
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as TextStyle,
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets
