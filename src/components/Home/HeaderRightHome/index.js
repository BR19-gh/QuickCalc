import { Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SweetSFSymbol from "sweet-sfsymbols";
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
        "items-center " +
        (lang === "ar"
          ? "flex-row justify-between"
          : isShowedFavorite
          ? "flex-row justify-between"
          : "flex-row-reverse justify-around") +
        (isEditing ? " w-20" : " w-24")
      }
    >
      {isShowedFavorite ? (
        <>
          <SweetSFSymbol
            name={"plus"}
            size={22}
            colors={["transparent"]}
            style={{ marginBottom: 4 }}
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
                paddingEnd: lang === "ar" ? 0 : 8.5,
                marginBottom: 6,
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
                paddingStart: isEditing ? (lang === "ar" ? 55 : 36) : 0,
                marginBottom: 6,
              }}
            >
              {isEditing ? t(text("done")) : t(text("edit"))}
            </Text>
          </TouchableOpacity>

          {isEditing ? (
            <SweetSFSymbol
              name={"plus"}
              size={22}
              colors={["transparent"]}
              style={{ marginBottom: 4 }}
            />
          ) : (
            <TouchableOpacity>
              {/* <MaterialCommunityIcons
                className="text-3xl text-blue-500"
                name="plus"
              /> */}
              <SweetSFSymbol
                name={"plus"}
                size={22}
                colors={["#3B82F6"]}
                style={{ marginBottom: 4 }}
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default Header;
