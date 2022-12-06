import * as RNLocalize from "react-native-localize"
import i18n from "i18n-js"

const en = require("./en")
const id = require("./id")
const ja = require("./ja")

i18n.fallbacks = true
i18n.translations = { id, en }

const fallback = { languageTag: "id", isRTL: false }
const { languageTag } =
  RNLocalize.findBestAvailableLanguage(Object.keys(i18n.translations)) || fallback
// i18n.locale = languageTag
i18n.locale = "id"
