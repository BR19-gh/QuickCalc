import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { setFirstTimeLaunch } from "../../../_DATA";

function Welcome(props) {
  const auto = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    const getTheme = async () => {
      try {
        const value = await AsyncStorage.getItem("theme");
        if (value !== null) {
          props.setTheme(value);
        } else {
          props.setTheme(auto);
        }
        console.log("Current theme is: ", props.theme);
      } catch (error) {
        console.error("Error getting theme from storage", error);
      }
    };

    getTheme();
  }, [auto, props.isThemeChanged]);

  const { t } = useTranslation();
  const text = (text) => "screens.Welcome.text." + text;
  const windowHight = Dimensions.get("window").height;
  return (
    <View
      style={{
        marginTop: windowHight > 667 ? (windowHight > 852 ? 470 : 170) : 85,
      }}
      className={
        "h-full items-center flex-1" +
        (props.theme === "dark" && " bg-black") +
        (windowHight > 667
          ? windowHight > 852
            ? " scale-150"
            : " scale-100"
          : " scale-100")
      }
    >
      <Text
        className={"text-6xl mb-4 font-normal font-sans"}
        style={{
          color: "#4844B2",
        }}
      >
        QuickCalc
      </Text>
      <View
        style={{
          width: 128,
          height: 128,
        }}
      >
        <Image
          source={require("../../../assets/symbol.png")}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
      <Text
        className={styles.paragraph + (props.theme === "dark" && " text-white")}
      >
        {t(text("introParagraph"))}
      </Text>
      <TouchableOpacity
        className={styles.button1}
        style={{
          backgroundColor: "#4844B2",
        }}
        onPress={async () => {
          props.setGetStartedBtnPressed(true);
          await setFirstTimeLaunch();
        }}
      >
        <Text className={styles.btnText}>{t(text("btnText1"))}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={styles.button2}
        style={{
          backgroundColor: "#38377C",
        }}
        onPress={() => {
          navigation.navigate("WalkThrough");
        }}
      >
        <Text className={styles.btnText}>{t(text("btnText2"))}</Text>
      </TouchableOpacity>
      <Text className="text-center text-gray-500 text-sm mt-5">
        {t("screens.versionNum") + (Platform.isPad ? "(desktop)" : "")}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default Welcome;
