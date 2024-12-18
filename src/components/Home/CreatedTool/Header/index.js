import { Text, View, Platform, Alert, StyleSheet, Share } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import ContextMenu from "react-native-context-menu-view";

import {
  handleDeleteTool,
  handleFavoriteTools,
} from "../../../../store/actions/tools";

import { connect } from "react-redux";

import { useEffect, useState } from "react";

import { useToast } from "react-native-toast-notifications";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import {
  isDontShowAgain,
  setDontShowAgain,
  setQuickAccessToolId,
} from "../../../../../_DATA";

import { useRevenueCat } from "../../../../providers/RevenueCatProvider";

const Header = ({ currentTool, t, tools, dispatch, theme }) => {
  const text = (text) => "screens.Home.CreatedTool.Header." + text;

  const toast = useToast();

  const { user } = useRevenueCat();
  const navigation = useNavigation();

  const handleDelete = (id) => {
    const newData = [...Object.values(tools)];
    const oldData = [...Object.values(tools)];

    newData.forEach((item, index) => {
      if (item.id === id) {
        newData.splice(index, 1);
      }
    });

    try {
      let refreshToast = toast.show(t(text("deletingTool")), {
        placement: "top",
        type: "normal",
      });
      dispatch(handleDeleteTool(newData, oldData));

      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        toast.update(refreshToast, t(text("toolHasBeenDeleted")), {
          type: "success",
          duration: 4000,
          placement: "top",
        });

        navigation.navigate("HomeNavi");
      }, 1000);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t(text("errorTitle")),
        error.message + "\n\n" + t(text("pleaseShareError"))
      );
    }
  };

  const shareText = async (code) => {
    if (await isDontShowAgain()) {
      try {
        await Share.share({
          message: code,
        });
      } catch (error) {
        alert("Error while sharing: " + error.message);
      }
    } else {
      Alert.alert(
        `${t(text("toolHasBeenShared"))}`,
        t(text("toolHasBeenSharedMsg")),
        [
          {
            text: t(text("gotIt")),
            style: "default",
            onPress: async () => {
              try {
                await Share.share({
                  message: code,
                });
              } catch (error) {
                alert("Error while sharing: " + error.message);
              }
            },
          },
          {
            text: t(text("dontShowAgain")),
            style: "cancel",
            onPress: async () => {
              await setDontShowAgain();
              shareText(code);
            },
          },
        ]
      );
    }
  };

  const [isFavorite, setIsFavorite] = useState(currentTool.isFavorite);

  useEffect(() => {
    if (currentTool.isFavorite) {
      setIsFavorite(true);
    }
  }, [currentTool]);

  const changeQuickAccess = async (id) => {
    await setQuickAccessToolId(id);
    toast.show(t(text("toolAssigned")), {
      duration: 1000,
      type: "success",
      placement: "top",
    });
  };

  const handleFavorite = (id) => {
    const newData = [...Object.values(tools)];
    const oldData = [...Object.values(tools)];
    let changedIndex = -1;

    newData.forEach((item, index) => {
      if (item.id === id) {
        item.isFavorite = !item.isFavorite;
        setIsFavorite(item.isFavorite);
        if (item.isFavorite === true) {
          item.isHidden = false;
        }
        changedIndex = index;
      }
    });

    dispatch(handleFavoriteTools(newData, oldData));
  };

  return (
    <View>
      {Platform.isPad ? (
        <Menu>
          <MenuTrigger
            children={
              <SweetSFSymbol
                name="ellipsis.circle"
                size={22}
                variableValue={100}
                colors={["#3B82F6"]}
              />
            }
          />
          <MenuOptions
            optionsContainerStyle={{
              width: 250,
              borderRadius: 10,
              marginTop: 30,
              marginEnd: 20,
              backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,
            }}
          >
            <MenuOption
              onSelect={() => {
                Haptics.selectionAsync();

                handleFavorite(currentTool.id);
                if (currentTool.isFavorite) {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                  toast.show(t(text("toolHasbeenFavored")), {
                    type: "success",
                    placement: "top",
                    duration: 1000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                } else if (!currentTool.isFavorite) {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                  toast.show(t(text("toolHasbeenUnFavored")), {
                    type: "success",
                    placement: "top",
                    duration: 1000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                } else {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                  );
                  toast.show(t(text("errorFavoriting")), {
                    type: "warning",
                    placement: "top",
                    duration: 4000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                }
              }}
              value={1}
            >
              <View className="flex-row justify-between p-1">
                <Text
                  style={{
                    color: theme === "dark" ? "#fff" : "#151E26",
                  }}
                >
                  {isFavorite ? t(text("unfavorite")) : t(text("favorite"))}
                </Text>
                <SweetSFSymbol
                  name={isFavorite ? "star.slash" : "star"}
                  size={18}
                  colors={[theme === "dark" ? "#fff" : "#151E26"]}
                />
              </View>
            </MenuOption>
            <View
              style={{
                borderBottomColor: theme === "dark" ? "#333333" : "#CCCCCC",
                borderBottomWidth: StyleSheet.hairlineWidth,
                alignSelf: "stretch",
              }}
            />
            <MenuOption
              onSelect={() => {
                Haptics.selectionAsync();
                Alert.alert(currentTool.name, currentTool.description);
              }}
              value={1}
            >
              <View className="flex-row justify-between p-1">
                <Text
                  style={{
                    color: theme === "dark" ? "#fff" : "#151E26",
                  }}
                >
                  {t(text("details"))}
                </Text>
                <SweetSFSymbol
                  name="info.circle"
                  size={18}
                  colors={[theme === "dark" ? "#fff" : "#151E26"]}
                />
              </View>
            </MenuOption>
            <View
              style={{
                borderBottomColor: theme === "dark" ? "#333333" : "#CCCCCC",
                borderBottomWidth: StyleSheet.hairlineWidth,
                alignSelf: "stretch",
              }}
            />
            <MenuOption
              onSelect={() => {
                if (
                  user.golden ||
                  Object.values(tools).filter(
                    (tool) => tool.link === "CreatedTool"
                  ).length <= 1
                ) {
                  Haptics.selectionAsync();

                  navigation.navigate("Home", {
                    screen: "EditTool",
                    params: {
                      tool: currentTool,
                    },
                  });
                } else {
                  navigation.navigate("Home", { screen: "Paywall" });
                }
              }}
              value={2}
            >
              <View className="flex-row justify-between p-1">
                <Text
                  style={{
                    color: theme === "dark" ? "#fff" : "#151E26",
                  }}
                >
                  {t(text("edit"))}
                </Text>
                <SweetSFSymbol
                  name="square.and.pencil"
                  size={18}
                  colors={[theme === "dark" ? "#fff" : "#151E26"]}
                />
              </View>
            </MenuOption>
            <View
              style={{
                borderBottomColor: theme === "dark" ? "#333333" : "#CCCCCC",
                borderBottomWidth: StyleSheet.hairlineWidth,
                alignSelf: "stretch",
              }}
            />
            <MenuOption
              onSelect={() => {
                {
                  Haptics.selectionAsync();
                  shareText(JSON.stringify(currentTool));
                }
              }}
              value={2}
            >
              <View className="flex-row justify-between p-1">
                <Text
                  style={{
                    color: theme === "dark" ? "#fff" : "#151E26",
                  }}
                >
                  {t(text("share"))}
                </Text>
                <SweetSFSymbol
                  name="square.and.arrow.up"
                  size={18}
                  colors={[theme === "dark" ? "#fff" : "#151E26"]}
                />
              </View>
            </MenuOption>
            <View
              style={{
                borderBottomColor: theme === "dark" ? "#333333" : "#CCCCCC",
                borderBottomWidth: StyleSheet.hairlineWidth,
                alignSelf: "stretch",
              }}
            />
            <MenuOption
              onSelect={() => {
                if (user.golden) {
                  Haptics.selectionAsync();
                  changeQuickAccess(currentTool.id);
                } else {
                  navigation.navigate("Home", { screen: "Paywall" });
                }
              }}
              value={2}
            >
              <View className="flex-row justify-between p-1">
                <Text
                  style={{
                    color: theme === "dark" ? "#fff" : "#151E26",
                  }}
                >
                  {t(text("enableQuickAccess"))}
                </Text>
                <SweetSFSymbol
                  name="arrow.forward.to.line.circle"
                  size={18}
                  colors={[theme === "dark" ? "#fff" : "#151E26"]}
                />
              </View>
            </MenuOption>
            <View
              style={{
                borderBottomColor: theme === "dark" ? "#333333" : "#CCCCCC",
                borderBottomWidth: StyleSheet.hairlineWidth,
                alignSelf: "stretch",
              }}
            />
            <MenuOption
              onSelect={() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Warning
                );
                Alert.alert(
                  t(text("deleteConfirmTitle")),
                  t(text("deleteConfirmMessage"), currentTool.name),
                  [
                    {
                      text: t(text("cancel")),
                      style: "cancel",
                      onPress: () => null,
                    },
                    {
                      text: t(text("delete")),
                      style: "destructive",
                      onPress: () => handleDelete(currentTool.id),
                    },
                  ]
                );
              }}
              value={3}
            >
              <View className="flex-row justify-between p-1">
                <Text
                  style={{
                    color: "red",
                  }}
                >
                  {t(text("delete"))}
                </Text>
                <SweetSFSymbol name="trash" size={18} colors={["red"]} />
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ) : (
        <ContextMenu
          dropdownMenuMode={true}
          actions={[
            {
              title: t(text("details")),
              systemIcon: "info.circle",
            },
            {
              title: t(text("edit")),
              systemIcon: "square.and.pencil",
            },
            {
              title: t(text("delete")),
              systemIcon: "trash",
              destructive: true,
            },
          ]}
          onPress={(e) => {
            if (e.nativeEvent.name === t(text("details"))) {
              Haptics.selectionAsync();
              Alert.alert(currentTool.name, currentTool.description);
            } else if (e.nativeEvent.name === t(text("edit"))) {
              if (
                user.golden ||
                Object.values(tools).filter(
                  (tool) => tool.link === "CreatedTool"
                ).length <= 1
              ) {
                Haptics.selectionAsync();

                navigation.navigate("Home", {
                  screen: "EditTool",
                  params: {
                    tool: currentTool,
                  },
                });
              } else {
                navigation.navigate("Home", { screen: "Paywall" });
              }
            } else if (e.nativeEvent.name === t(text("delete"))) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              Alert.alert(
                t(text("deleteConfirmTitle")),
                t(text("deleteConfirmMessage"), currentTool.name),
                [
                  {
                    text: t(text("cancel")),
                    style: "cancel",
                    onPress: () => null,
                  },
                  {
                    text: t(text("delete")),
                    style: "destructive",
                    onPress: () => handleDelete(currentTool.id),
                  },
                ]
              );
            }
          }}
        >
          <SweetSFSymbol
            name="ellipsis.circle"
            size={22}
            variableValue={100}
            colors={["#3B82F6"]}
          />
        </ContextMenu>
      )}
    </View>
  );
};

const mapStateToProps = ({ tools }) => ({
  tools,
});

export default connect(mapStateToProps)(Header);
