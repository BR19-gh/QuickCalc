import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import SweetSFSymbol from "sweet-sfsymbols";
import { lang } from "../../../helpers";
import * as Haptics from "expo-haptics";
import { connect } from "react-redux";
import { useToast } from "react-native-toast-notifications";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import { useNavigation } from "@react-navigation/native";

import { setQuickAccessToolId } from "../../../../_DATA";

import { useRevenueCat } from "../../../providers/RevenueCatProvider";

import { handleFavoriteTools } from "../../../store/actions/tools";

const Header = ({ currentTool, t, tools, theme, dispatch }) => {
  const toast = useToast();
  const text = (text) => "screens.Home.CreatedTool.Header." + text;

  const { user } = useRevenueCat();
  const navigation = useNavigation();

  function getToolByName(link) {
    for (const toolId in tools) {
      if (tools.hasOwnProperty(toolId)) {
        const tool = tools[toolId];
        if (tool.link === link || tool.link === link) {
          return tool;
        }
      }
    }
    return false;
  }

  const [tool, setTool] = useState(getToolByName(currentTool));
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    setTool(getToolByName(currentTool));
    setIsFavorite(tool.isFavorite);
  }, [theme]);

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
    <View className="header-right">
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
                handleFavorite(tool.id);
                if (tool.isFavorite) {
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
                } else if (!tool.isFavorite) {
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
                Alert.alert(
                  lang === "ar"
                    ? tool.name.ar === "حاسبة البقشيش"
                      ? "حاسبة القطة"
                      : tool.name.ar
                    : tool.name.en,
                  lang === "ar"
                    ? tool.description.ar === "احسب بقشيش وجبتك"
                      ? "احسب قطة وجبتك"
                      : tool.description.ar
                    : tool.description.en
                );
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
                if (user.golden) {
                  Haptics.selectionAsync();
                  changeQuickAccess(tool.id);
                } else {
                  navigation.navigate("Paywall");
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
          </MenuOptions>
        </Menu>
      ) : (
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            Alert.alert(
              lang === "ar"
                ? tool.name.ar === "حاسبة البقشيش"
                  ? "حاسبة القطة"
                  : tool.name.ar
                : tool.name.en,
              lang === "ar"
                ? tool.description.ar === "احسب بقشيش وجبتك"
                  ? "احسب قطة وجبتك"
                  : tool.description.ar
                : tool.description.en
            );
          }}
          ß
        >
          <SweetSFSymbol name="info.circle" size={22} colors={["#3B82F6"]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const mapStateToProps = ({ tools }) => ({
  tools,
});

export default connect(mapStateToProps)(Header);
