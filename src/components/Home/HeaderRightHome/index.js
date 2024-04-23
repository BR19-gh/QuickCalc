import { Text, View, TouchableOpacity } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { NativeModules } from "react-native";
import i18n from "../../../lang/i18n";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

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

  const navigation = useNavigation();

  return (
    <View
      className={
        "items-center " +
        "flex-row justify-between" +
        (isEditing ? " w-20" : " w-24")
      }
    >
      {isShowedFavorite ? (
        <>
          <SweetSFSymbol name={"plus"} size={22} colors={["transparent"]} />
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              seIsEditingFavorite(!isEditingFavorite);
            }}
          >
            <Text
              className={
                "text-blue-500" +
                (isEditingFavorite ? " font-semibold text-lg" : " text-lg")
              }
              style={{
                paddingEnd: 8.5,
              }}
            >
              {isEditingFavorite ? t(text("done")) : t(text("edit"))}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsEditing(!isEditing);
            }}
          >
            <Text
              className={
                "text-blue-500" +
                (isEditing ? " font-semibold text-lg" : " text-lg")
              }
              style={{
                paddingStart: isEditing ? (lang === "ar" ? 55 : 36) : 0,
              }}
            >
              {isEditing ? t(text("done")) : t(text("edit"))}
            </Text>
          </TouchableOpacity>

          {isEditing ? (
            <SweetSFSymbol name={"plus"} size={22} colors={["transparent"]} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate("NewTool");
              }}
            >
              <SweetSFSymbol name={"plus"} size={22} colors={["#3B82F6"]} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default Header;
