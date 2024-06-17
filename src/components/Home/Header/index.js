import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
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

import {
  isDontShowAgain,
  setDontShowAgain,
  setQuickAccessToolId,
} from "../../../../_DATA";

const Header = ({ currentTool, t, tools, dispatch, theme }) => {
  const toast = useToast();
  const text = (text) => "screens.Home.CreatedTool.Header." + text;

  function getToolByName(link) {
    for (const toolId in tools) {
      if (tools.hasOwnProperty(toolId)) {
        const tool = tools[toolId];
        if (tool.link === link || tool.link === link) {
          return tool;
        }
      }
    }
    return null;
  }

  const tool = getToolByName(currentTool);

  const changeQuickAccess = async (id) => {
    await setQuickAccessToolId(id);
    toast.show(t(text("toolAssigned")), {
      duration: 1000,
      type: "success",
      placement: "top",
    });
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
              <View
                style={{
                  marginTop: 10,
                  borderBottomColor: theme === "dark" ? "#333333" : "#CCCCCC",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  alignSelf: "stretch",
                }}
              />
            </MenuOption>

            <MenuOption
              onSelect={() => {
                {
                  Haptics.selectionAsync();
                  changeQuickAccess(tool.id);
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
