import React, { useContext } from "react";
import { Text, TouchableOpacity, NativeModules } from "react-native";

import createStyles from "../../../../node_modules/react-native-settings-ui/src/components/SettingsButton/settingsbutton.style";
import { SettingsContext } from "../../../../node_modules/react-native-settings-ui/src/contexts/SettingsContext";

import { lang } from "../../../helpers";

import SweetSFSymbol from "sweet-sfsymbols";

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
              <SweetSFSymbol
                name={"chevron.left"}
                size={14}
                weight="semibold"
                colors="gray"
              />
              {` ${statusText}`}
            </Text>
          ) : (
            <Text style={[styles.arrow, arrow]}>
              {`${statusText} `}
              <SweetSFSymbol
                name={"chevron.right"}
                size={14}
                weight="semibold"
                colors="gray"
              />
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default SettingsButton;
