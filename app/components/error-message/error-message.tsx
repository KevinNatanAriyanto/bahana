import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle, View, Image, ImageStyle, TextStyle } from "react-native"
import { Text, Screen, Button, Checkbox, FormRow, Header, Icon, Switch, Wallpaper } from "@components"
import { color, layout } from "@theme"
import { NavigationScreenProps } from "react-navigation"

export interface ErrorMessageProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function ErrorMessage(props: ErrorMessageProps) {
  // grab the props
  const { tx, text, style, errors, ...rest } = props
  const textStyle = { }

  const renderErrorMsg = (errors) => {
    var result = null;

    if(errors){
        var arr = [];
      Object.keys(errors).map((key, i) => {
          arr.push(
            <Text key={i} style={{ ...layout.notif.msg, ...layout.notif.error }} text={errors[key]} />
        );
        });

        result = (
        <View style={{ ...layout.notif.wrapper }}>
          {arr}
        </View>
        )
    }
      return result;
  }

  return (
    <View style={style} {...rest}>
      {renderErrorMsg(props.errors)}
    </View>
  )
}
