import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import styles from "./styles";

import { LinearGradient } from "expo-linear-gradient";

import SweetSFSymbol from "sweet-sfsymbols";

import * as Haptics from "expo-haptics";

import { MotiView } from "moti";

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
  handleDelete,
  index,
}) => {
  const RANDOMS = [0.004, -0.004];
  const isEven = (n) => n % 2 === 0;
  return (
    <MotiView
      animate={{
        rotate: !isActive
          ? isEditing
            ? isEven(index)
              ? [`${RANDOMS[0]}` + " deg", `${RANDOMS[1]}` + " deg"]
              : [`${RANDOMS[1]}` + " deg", `${RANDOMS[0]}` + " deg"]
            : "0 deg"
          : "0 deg",
        translateY: !isActive
          ? isEditing
            ? [Math.random(0) * 1, Math.random(-1) * 0]
            : 0
          : 0,
      }}
      transition={{
        type: "timing",
        duration: 150,
        loop: true,
      }}
      style={{
        marginTop: tool.isHidden ? 0 : isEditing ? (isActive ? -10 : 15) : 5,
        borderRadius: 8,
      }}
    >
      <MotiView
        style={
          Platform.isPad
            ? {
                width: isEditing ? "%100" : "92%",
                alignSelf: "center",
                marginBottom: 5,
              }
            : {}
        }
        animate={{
          opacity: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }}
        transition={{
          type: "timing",
          duration: 10,
        }}
      >
        {isEditing ? (
          tool.isHidden ? (
            <View
              style={{
                width: 24,
                height: 0,
                position: "relative",
                top: -10,
                left: -8,
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 100,
                  backgroundColor: theme === "dark" ? "black" : "#888888",
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  changeVis(tool.id);
                }}
              >
                <SweetSFSymbol
                  name={"plus.circle.fill"}
                  size={24}
                  style={{
                    opacity: tool.isHidden ? 0.45 : 0.7,
                  }}
                  colors={[
                    theme === "dark"
                      ? "gray"
                      : tool.isHidden
                      ? "#FFFFFF"
                      : "#DDDDDD",
                  ]}
                />
              </TouchableOpacity>
            </View>
          ) : isActive ? (
            <SweetSFSymbol
              name={"minus.circle.fill"}
              size={24}
              colors={["transparent"]}
              style={{
                width: 24,
                height: 0,
                position: "relative",
                top: -10,
                left: -8,
                zIndex: 1,
              }}
            />
          ) : (
            <MotiView
              style={{
                width: 24,
                height: 0,
                position: "relative",
                top: -10,
                left: -8,
                zIndex: 1,
              }}
              animate={{
                opacity: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
              }}
              transition={{
                type: "timing",
                duration: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 100,
                  backgroundColor: "black",
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  tool.link === "CreatedTool"
                    ? Alert.alert(
                        t(text("deleteOrHide")),
                        t(text("deleteOrHideConfirmation")),
                        [
                          {
                            text: t(text("cancel")),
                            style: "cancel",
                          },

                          {
                            text: t(text("hide")),
                            onPress: () => {
                              changeVis(tool.id);
                            },
                          },
                          {
                            text: t(text("delete")),
                            onPress: () => {
                              handleDelete(tool.id);
                            },
                            style: "destructive",
                          },
                        ]
                      )
                    : changeVis(tool.id);
                }}
              >
                <SweetSFSymbol
                  name={"minus.circle.fill"}
                  size={24}
                  colors={[theme === "dark" ? "gray" : "#CCCCCC"]}
                />
              </TouchableOpacity>
            </MotiView>
          )
        ) : null}
        <LinearGradient
          key={tool.id}
          colors={[...tool.colors]}
          style={{
            opacity: isEditing ? (tool.isHidden ? 0.2 : 0.7) : 1,
            borderColor: theme === "dark" ? "gray" : "black",
            width: "100%",
          }}
          className="h-32 rounded-lg"
        >
          <TouchableOpacity
            key={tool.id}
            className={"h-full w-full flex-row flex-wrap justify-center"}
            activeOpacity={1}
            onPress={() => {
              if (tool.isHidden) {
                if (isEditing) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  changeVis(tool.id);
                } else {
                  return;
                }
              } else {
                return;
              }
            }}
            onLongPress={() => {
              if (tool.isHidden) {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Error
                );
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
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Error
                );
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
                    if (tool.link === "CreatedTool") {
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
      </MotiView>
    </MotiView>
  );
};

export default Card;
