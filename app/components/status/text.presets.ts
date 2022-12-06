import { TextStyle } from "react-native"
import { color, palette, typography } from "../../theme"

/**
 * All text will start off looking like this.
 */
const BASE: TextStyle = {
  fontFamily: typography.primary,
  color: color.gray_header,
  fontSize: 15,
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const presets = {
  /**
   * The default text styles.
   */
  default: BASE,

  /**
   * A bold version of the default text.
   */
  bold: { ...BASE, fontWeight: "bold" } as TextStyle,

  /**
   * Large headers.
   */
  header: { ...BASE, fontSize: 20, fontWeight: "bold" } as TextStyle,

  /**
   * Field labels that appear on forms above the inputs.
   */
  fieldLabel: { ...BASE, fontSize: 13, color: color.dim } as TextStyle,

  /**
   * A smaller piece of secondard information.
   */
  secondary: { ...BASE, fontSize: 9, color: color.dim } as TextStyle,

  important: { ...BASE, color: color.important },

  link: { ...BASE, fontWeight: "bold", color: color.important } as TextStyle,

  slide_header: { ...BASE, fontSize: 18, color: color.palette.white, fontWeight: "bold" },
  slide_more: { ...BASE, fontSize: 12, color: color.palette.white },
  menu: { ...BASE, fontSize: 9 },
  header_title: { ...BASE, fontSize: 20, fontWeight: "bold" },
  header_filter: { ...BASE, fontSize: 25, fontWeight: "bold" },
  title_page: { ...BASE, fontSize: 20, color: color.palette.white, fontWeight: "bold", marginBottom: 20 }
}

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets
