module.exports = {
  assets: ["./app/theme/fonts/"],
  dependencies: {
    "react-native-code-push": {
      platforms: {
        android: null // disable Android platform, other platforms will still autolink if provided
      }
    }
  }
}
