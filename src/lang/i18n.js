import { Alert, NativeModules } from "react-native";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";
import { I18nManager } from "react-native";

const deviceLanguage =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

let lang;
let str = deviceLanguage;
let match = str.match(/^([a-z]{2})/i);
if (match) {
  lang = match[0];
  if (lang == "ar") {
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  }
} else {
  Alert.alert(
    "Your Language is Not Supported",
    "English will be used instead, contact the developer to add your language to the app, you can find developer socials in the Settings tab.",
    [
      {
        text: "Got it",
        onPress: () => null,
        style: "Ok",
      },
    ]
  );
  console.warn("Locale not found");
}

const resources = {
  en: en,
  ar: ar,
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3", //To make it work for Android devices, add this line.
    resources,
    lng: lang, // default language to use.
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
