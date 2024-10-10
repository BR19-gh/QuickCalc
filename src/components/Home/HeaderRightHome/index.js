import { Text, View, TouchableOpacity, Alert } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import i18n from "../../../lang/i18n";
import { lang } from "../../../helpers";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";

const Header = ({ setIsEditing, isEditing, setMoving, tools }) => {
  const { t } = i18n;
  const text = (text) => "screens.Navi.text." + text;

  const navigation = useNavigation();

  useEffect(() => {
    if (isEditing === false) setMoving(false);
    else setMoving(true);
  }, [isEditing]);

  const { user } = useRevenueCat();

  return (
    <View
      className={
        "items-center " +
        "flex-row justify-between ml-9" +
        (isEditing ? " w-20" : " w-20")
      }
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setIsEditing(!isEditing);
        }}
      >
        <Text
          className={
            "text-blue-500" +
            (isEditing ? " font-semibold text-lg" : " text-lg")
          }
          style={{
            paddingStart: isEditing ? (lang === "ar" ? 55 : 36) : 0,
          }}
        >
          {isEditing ? t(text("done")) : t(text("edit"))}
        </Text>
      </TouchableOpacity>

      {isEditing ? (
        <SweetSFSymbol name={"plus"} size={22} colors={["transparent"]} />
      ) : (
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (
              Object.values(tools).filter((tool) => tool.link === "CreatedTool")
                .length >= 1 &&
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
                      navigation.navigate("Paywall");
                    },
                  },
                ]
              );
            }

            navigation.navigate("NewTool");
          }}
        >
          <SweetSFSymbol name={"plus"} size={22} colors={["#3B82F6"]} />
        </TouchableOpacity>
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
