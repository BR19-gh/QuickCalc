import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import i18n from "../../../lang/i18n";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import ContextMenu from "react-native-context-menu-view";

const Header = ({ setIsEditing, isEditing, setMoving, tools, theme }) => {
  const { t } = i18n;
  const text = (text) => "screens.Navi.text." + text;

  const navigation = useNavigation();

  useEffect(() => {
    if (isEditing === false) setMoving(false);
    else setMoving(true);
  }, [isEditing]);

  const { user } = useRevenueCat();

  return (
    <View>
      {isEditing ? (
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsEditing(!isEditing);
          }}
        >
          <Text
            className={"text-blue-500 font-semibold"}
            style={{
              fontSize: 16,
            }}
          >
            {t(text("done"))}
          </Text>
        </TouchableOpacity>
      ) : Platform.isPad ? (
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
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (
                  Object.values(tools).filter(
                    (tool) => tool.link === "CreatedTool"
                  ).length >= 1 &&
                  user.golden === false
                ) {
                  return Alert.alert(
                    t(text("maxToolsAlertTitle")),
                    t(text("maxToolsAlert")),
                    [
                      {
                        text: t(text("gotIt")),
                        style: "default",
                        onPress: () => {
                          navigation.navigate("Home", { screen: "Paywall" });
                        },
                      },
                    ]
                  );
                }

                navigation.navigate("Home", { screen: "NewTool" });
              }}
              value={1}
            >
              <View className="flex-row justify-between p-1">
                <Text
                  style={{
                    color: theme === "dark" ? "#fff" : "#151E26",
                  }}
                >
                  {t(text("add"))}
                </Text>
                <SweetSFSymbol
                  name="plus"
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
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsEditing(!isEditing);
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
          </MenuOptions>
        </Menu>
      ) : (
        <ContextMenu
          dropdownMenuMode={true}
          actions={[
            {
              title: t(text("add")),
              systemIcon: "plus",
            },
            {
              title: t(text("edit")),
              systemIcon: "square.and.pencil",
            },
          ]}
          onPress={(e) => {
            if (e.nativeEvent.name === t(text("add"))) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (
                Object.values(tools).filter(
                  (tool) => tool.link === "CreatedTool"
                ).length >= 1 &&
                user.golden === false
              ) {
                return Alert.alert(
                  t(text("maxToolsAlertTitle")),
                  t(text("maxToolsAlert")),
                  [
                    {
                      text: t(text("gotIt")),
                      style: "default",
                      onPress: () => {
                        navigation.navigate("Home", { screen: "Paywall" });
                      },
                    },
                  ]
                );
              }

              navigation.navigate("Home", { screen: "NewTool" });
            } else if (e.nativeEvent.name === t(text("edit"))) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsEditing(!isEditing);
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

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(Header);
