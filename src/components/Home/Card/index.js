import { Text, View, TouchableOpacity, Alert, Platform } from "react-native";
import styles from "./styles";

import { LinearGradient } from "expo-linear-gradient";

import SweetSFSymbol from "sweet-sfsymbols";

import * as Haptics from "expo-haptics";

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
  isEditingFavorite,
  searchTextLength,
  moving,
}) => {
  return (
    <LinearGradient
      key={tool.id}
      colors={[...tool.colors]}
      style={{
        marginStart: "4%",
        opacity: isEditing ? (tool.isHidden ? 0.2 : 0.7) : 1,

        borderWidth: isEditing ? 3.5 : 0,
        borderColor: theme === "dark" ? "gray" : "black",
        width: "92%",
      }}
      className="mb-3 h-32 rounded-lg"
    >
      <TouchableOpacity
        key={tool.id}
        className={"h-full w-full flex-row flex-wrap justify-center"}
        activeOpacity={1}
        onPress={() => {
          if (isEditing) {
            changeVis(tool.id);
          } else {
            return;
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
          } else if (searchTextLength > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
              t(text("unableToMove")),
              t(text("youCannotMoveWhileSearching")),
              [
                {
                  text: t(text("gotIt")),
                  onPress: () => null,
                  style: "Ok",
                },
              ]
            );
          } else if (moving) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            drag();
          }
        }}
        disabled={isActive}
      >
        <View className={"w-full flex-col"}>
          <View className={"w-full justify-start flex-row-reverse"}>
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
              {tool.name.en
                ? lang === "en"
                  ? tool.name.en
                  : tool.name.ar === "حاسبة البقشيش"
                  ? "حاسبة القطة"
                  : tool.name.ar
                : tool.name}
            </Text>
          </View>
          <View className={"w-full flex-row justify-end"}>
            <TouchableOpacity
              disabled={isEditing}
              className={"w-10 h-14 flex-row flex-wrap justify-end"}
              onPress={() => {
                if (isEditing) {
                  changeVis(tool.id);
                } else if (isEditingFavorite) {
                  handleFavorite(tool.id);
                } else if (tool.link === "CreatedTool") {
                  navigation.navigate("CreatedTool", { tool });
                } else {
                  navigation.navigate(tool.link);
                }
              }}
            >
              <LinearGradient
                key={tool.id}
                colors={[...tool.colors]}
                style={{
                  width: 40,
                  height: 56,
                  marginRight: 8,
                  borderRadius: 9999,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#5450D4",
                }}
                className="mb-3 h-32 rounded-lg"
              >
                <SweetSFSymbol
                  name={"chevron.forward"}
                  size={24}
                  colors={["white"]}
                  style={{
                    margin: 16,
                  }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Card;
