import { Text, View, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { LinearGradient } from "expo-linear-gradient";

import { NativeModules } from "react-native";

import SweetSFSymbol from "sweet-sfsymbols";

import * as Haptics from "expo-haptics";

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

const Card = ({
  tool,
  changeVis,
  handleFavorite,
  isEditing,
  navigation,
  drag,
  isActive,
  t,
  text,
  lang,
  theme,
  isShowedFavorite,
  isEditingFavorite,
}) => (
  <LinearGradient
    key={tool.id}
    colors={[...tool.colors]}
    style={{
      marginStart: "4%",
      opacity: isEditingFavorite
        ? !tool.isFavorite
          ? 0.2
          : 0.7
        : isEditing
        ? tool.isHidden
          ? 0.2
          : 0.7
        : 1,

      borderWidth: isEditingFavorite || isEditing ? 3.5 : 0,
      borderColor: theme === "dark" ? "gray" : "black",
      width: "92%",
    }}
    className="mb-1 mt-1 h-36 rounded-lg"
  >
    <TouchableOpacity
      key={tool.id}
      className={"h-full w-full flex-row flex-wrap justify-center"}
      onPress={() => {
        if (isEditing) {
          changeVis(tool.id);
        } else if (isEditingFavorite) {
          handleFavorite(tool.id);
        } else {
          navigation.navigate(tool.link);
        }
      }}
      onLongPress={() => {
        if (tool.isHidden) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert(
            t(text("unableToMove")),
            t(text("youCannotMoveHidenTools")),
            [
              {
                text: t(text("gotIt")),
                onPress: () => null,
                style: "Ok",
              },
            ]
          );
        } else if (isShowedFavorite || isEditingFavorite) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert(
            t(text("unableToMove")),
            t(text("youCannotMoveToolsInFavorite")),
            [
              {
                text: t(text("gotIt")),
                onPress: () => null,
                style: "Ok",
              },
            ]
          );
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          drag();
        }
      }}
      disabled={isActive}
    >
      <View className={"w-full justify-start flex-row-reverse"}>
        {/* <MaterialCommunityIcons
          className={styles.icon}
          name={tool.icon}
          size={24}
          color="white"
          style={{
            width: "11%",
          }}
        /> */}
        <SweetSFSymbol
          name={tool.icon}
          size={24}
          colors={["white"]}
          style={{
            margin: 16,
          }}
        />

        <Text
          className={styles.btnText}
          style={{
            width: "80%",
          }}
        >
          {lang === "en" ? tool.name.en : tool.name.ar}
        </Text>
      </View>
    </TouchableOpacity>
  </LinearGradient>
);

export default Card;
