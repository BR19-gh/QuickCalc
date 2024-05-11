import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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
        marginTop: windowHight > 667 ? "60%" : "40%",
      }}
      className={
        "h-full items-center flex-1" + (props.theme === "dark" && " bg-black")
      }
    >
      <Text
        className={styles.icon + (props.theme === "dark" && " text-blue-500")}
      >
        myTools
        {/* <SweetSFSymbol
          name="wrench.and.screwdriver"
          size={45}
          color={props.theme ? "#2d5ba0" : "#294d7f"}
        /> */}
      </Text>
      <Text
        className={styles.paragraph + (props.theme === "dark" && " text-white")}
      >
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
      <TouchableOpacity
        className={styles.button2}
        onPress={() => {
          navigation.navigate("WalkThrough");
        }}
      >
        <Text className={styles.btnText}>{t(text("btnText2"))}</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default Welcome;
