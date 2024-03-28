import { Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { NativeModules } from "react-native";
import i18n from "../../../lang/i18n";

const Header = ({
  setIsEditing,
  isEditing,
  seIsEditingFavorite,
  isEditingFavorite,
  isShowedFavorite,
}) => {
  const { t } = i18n;
  const text = (text) => "screens.Navi.text." + text;

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
  } else {
    lang = "en";
  }

  return (
    <View
      className={
        "flex-row items-center justify-between" +
        (isEditing ? " w-20" : " w-24")
      }
    >
      {isShowedFavorite ? (
        <>
          <MaterialCommunityIcons
            className="text-3xl text-transparent"
            name="star"
          />
          <TouchableOpacity
            onPress={() => {
              seIsEditingFavorite(!isEditingFavorite);
              console.log(!isEditingFavorite);
            }}
          >
            <Text
              className={
                "text-blue-500" +
                (isEditingFavorite ? " font-semibold text-lg" : " text-lg")
              }
              style={{
                paddingStart: 0,
              }}
            >
              {isEditingFavorite ? t(text("done")) : t(text("edit"))}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text
              className={
                "text-blue-500" +
                (isEditing ? " font-semibold text-lg" : " text-lg")
              }
              style={{
                paddingStart: isEditing ? (lang === "ar" ? 55 : 30) : 0,
              }}
            >
              {isEditing ? t(text("done")) : t(text("edit"))}
            </Text>
          </TouchableOpacity>

          {isEditing ? (
            <MaterialCommunityIcons
              className="text-3xl text-transparent"
              name="plus"
            />
          ) : (
            <TouchableOpacity>
              <MaterialCommunityIcons
                className="text-3xl text-blue-500"
                name="plus"
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default Header;
