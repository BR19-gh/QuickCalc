import { Text, View, TouchableOpacity } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import i18n from "../../../lang/i18n";
import { lang } from "../../../helpers";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const Header = ({}) => {
  const { t } = i18n;
  const text = (text) => "screens.Navi.text." + text;
  const navigation = useNavigation();

  return (
    <View className={"items-center flex-row justify-between"}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Home", { screen: "NewToolViaCode" });
        }}
      >
        <Text className={"text-blue-500 text-lg"}>{t(text("useCode"))}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
