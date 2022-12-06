import * as React from "react"
import { Text } from "react-native"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { translate } from "../../i18n"
import { mergeAll, flatten } from "ramda"
import { color, layout } from "@theme"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Status(props: TextProps) {
  // grab the props
  const { preset = "default", tx, txOptions, text, children, style: styleOverride, slug, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const style = mergeAll(flatten([presets[preset] || presets.default, styleOverride]))

  _renderTaskStatus = (slug) => {
    var stat = [];

    switch(slug){
      case "incomplete":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>Akan Dilakukan</Text>
      break;
      case "pending":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>Pending</Text>
      break;
      case "in_progress":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Dalam Proses</Text>
      break;
      case "in progress":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Dalam Proses</Text>
      break;
      case "onprogress":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.warning }}>Dalam Proses</Text>
      break;
      case "in_review":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.info }}>Dalam Peninjauan</Text>
      break;
      case "completed":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.primary }}>Selesai</Text>
      break;
      case "done":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.primary }}>Selesai</Text>
      break;
      case "resolved":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.primary }}>Selesai</Text>
      break;
      case "accepted":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.primary }}>Disetujui</Text>
      break;
      case "rejected":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>Ditolak</Text>
      break;
      case "":
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>Tidak diketahui</Text>
      break;
      default:
        stat = <Text style={{ ...layout.label.wrapper, ...layout.label.error }}>{slug}</Text>
      break;
    }

    return stat;
  }

  return _renderTaskStatus(slug)

  // return (
  //   <ReactNativeText {...rest} allowFontScaling={false} style={style}>
  //     {content}
  //   </ReactNativeText>
  // )
}
