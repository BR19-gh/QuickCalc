import React, { useContext } from "react";
import {
  Text,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  NativeModules,
} from "react-native";

import createStyles from "../../../../node_modules/react-native-settings-ui/src/components/SettingsButton/settingsbutton.style";
import { SettingsContext } from "../../../../node_modules/react-native-settings-ui/src/contexts/SettingsContext";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsButton = ({
  title,
  onPress,
  type = "default",
  statusText = "",
  buttonTitle,
  arrow,
}) => {
  const { theme } = useContext(SettingsContext);
  const styles = createStyles(theme);

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
      style={styles.container}
      onPress={onPress}
      activeOpacity={theme === "light" ? 0.3 : 0.7}
    >
      <Text style={[styles.buttonTitle, buttonTitle]}> {title} </Text>
      {type === "newpage" && (
        <>
          {lang === "ar" ? (
            <Text style={[styles.arrow, arrow]}>
              <MaterialCommunityIcons
                name={"chevron-left"}
                size={22}
                color="gray"
              />
              {` ${statusText}`}
            </Text>
          ) : (
            <Text style={[styles.arrow, arrow]}>
              {`${statusText} `}
              <MaterialCommunityIcons
                name={"chevron-right"}
                size={24}
                color="gray"
              />
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default SettingsButton;
