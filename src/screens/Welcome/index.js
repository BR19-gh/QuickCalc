import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

function Welcome(props) {
  const theme = useColorScheme();

  const { t } = useTranslation();
  const text = (text) => "screens.Welcome.text." + text;

  return (
    <View
      className={
        "pt-60 items-center flex-1" + (theme === "dark" && " bg-black")
      }
    >
      <Text className={styles.icon + (theme === "dark" && " text-blue-500")}>
        myTools
        <MaterialCommunityIcons
          name="tools"
          size={60}
          color={theme ? "#2d5ba0" : "#294d7f"}
        />
      </Text>
      <Text className={styles.paragraph + (theme === "dark" && " text-white")}>
        {t(text("introParagraph"))}
      </Text>
      <TouchableOpacity
        className={styles.button1}
        onPress={() => {
          props.setGetStartedBtnPressed(true);
        }}
      >
        <Text className={styles.btnText}>{t(text("btnText1"))}</Text>
      </TouchableOpacity>
      <TouchableOpacity className={styles.button2}>
        <Text className={styles.btnText}>{t(text("btnText2"))}</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default Welcome;
