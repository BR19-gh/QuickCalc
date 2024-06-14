import { Text, View, TouchableOpacity } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import i18n from "../../../lang/i18n";
import { lang } from "../../../helpers";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const Header = ({
  setIsEditing,
  isEditing,
  setIsEditingFavorite,
  isEditingFavorite,
  isShowedFavorite,
  moving,
  setMoving,
}) => {
  const { t } = i18n;
  const text = (text) => "screens.Navi.text." + text;

  const navigation = useNavigation();

  useEffect(() => {
    if (isEditing === false) setMoving(false);
    else setMoving(true);
  }, [isEditing]);

  return (
    <View
      className={
        "items-center " +
        "flex-row justify-between" +
        (isEditing ? " w-20" : " w-24")
      }
    >
      {isShowedFavorite ? (
        <>
          <SweetSFSymbol name={"plus"} size={22} colors={["transparent"]} />
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsEditingFavorite(!isEditingFavorite);
            }}
          >
            <Text
              className={
                "text-blue-500" +
                (isEditingFavorite ? " font-semibold text-lg" : " text-lg")
              }
              style={{
                paddingEnd: 8.5,
              }}
            >
              {isEditingFavorite ? t(text("done")) : t(text("edit"))}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
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
                navigation.navigate("NewTool");
              }}
            >
              <SweetSFSymbol name={"plus"} size={22} colors={["#3B82F6"]} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default Header;
