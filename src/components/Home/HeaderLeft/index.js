import { Text, View, TouchableOpacity, NativeModules } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../lang/i18n";
import * as Haptics from "expo-haptics";

const Header = ({ setIsEditing, isEditing }) => {
  const navigation = useNavigation();

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
    <TouchableOpacity
      className="flex-row items-center w-20 justify-between"
      onPress={() => navigation.goBack()}
    >
      <MaterialCommunityIcons
        name={lang === "ar" ? "chevron-right" : "chevron-left"}
        className="text-3xl text-blue-500"
      />
      <Text className="text-lg text-blue-500">{t(text("home"))}</Text>
    </TouchableOpacity>
  );
};

export default Header;
