import { NativeModules, Platform } from "react-native";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";
import { I18nManager } from "react-native";
import { getLocales } from "expo-localization";

const deviceLanguage = getLocales()[0].languageCode;

let lang;
lang = deviceLanguage;

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
