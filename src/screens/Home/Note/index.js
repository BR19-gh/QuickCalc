import {
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Communications from "react-native-communications";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { lang } from "../../../helpers";
import SweetSFSymbol from "sweet-sfsymbols";

import * as Haptics from "expo-haptics";

function Note({ route, theme }) {
  const { note } = route.params;
  console.log("Note parameter: ", note);
  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const text = (text) => "screens.Note." + text;
  return (
    <ScrollView className={"h-full"}>
      <View className={"w-full flex-row justify-end"}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          className={
            "w-7 h-7 bg-white m-5 z-10 rounded-full flex items-center justify-center"
          }
        >
          <SweetSFSymbol
            name={"multiply.circle.fill"}
            size={32}
            colors={[isDark("#5450D4", "#38377C")]}
          />
        </TouchableOpacity>
      </View>
      <View
        className={
          "flex flex-col items-center " +
          (Dimensions.get("window").width < 376 ? "mt-0" : "mt-10")
        }
      >
        <View className="w-72 items-center">
          <View className={"w-32 h-32 mb-10"}>
            <SweetSFSymbol
              name={lang === "ar" ? note.ar.icon.name : note.en.icon.name}
              size={128}
              colors={[note.ar.icon.color]}
            ></SweetSFSymbol>
          </View>

          <Text
            className={
              "text-4xl text-center font-bold " +
              isDark("text-white", "text-black")
            }
          >
            {lang === "ar" ? note.ar.headerOne : note.en.headerOne}
          </Text>
          <View className="mb-4"></View>
          <Text
            className={
              "text-center text-2xl font-semibold " +
              isDark("text-white", "text-black")
            }
          >
            {lang === "ar" ? note.ar.headerTwo : note.en.headerTwo}
          </Text>
          <View className="mb-1"></View>
          <Text
            className={
              "text-center text-2xl font-bold " +
              isDark("text-white", "text-black")
            }
          >
            {lang === "ar" ? note.ar.headerThree : note.en.headerThree}
          </Text>
          <View className="mb-6"></View>
          <Text
            className={
              "text-center text-sm " + isDark("text-white", "text-black")
            }
          >
            {lang === "ar" ? note.ar.content : note.en.content}
          </Text>
        </View>
        <View className={"flex-col p-5 rounded-lg"}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              note.en.button.type === "link"
                ? Communications.web(note.en.button.link)
                : navigation.navigate(note.en.button.action);
            }}
            className={
              "mt-3 h-14 rounded-md items-center flex-row justify-center"
            }
            style={{
              width: 180,
              backgroundColor: isDark("#5450D4", "#38377C"),
            }}
          >
            <Text className={"text-lg font-bold text-white"}>
              {lang === "ar" ? note.ar.button.text : note.en.button.text}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default Note;
