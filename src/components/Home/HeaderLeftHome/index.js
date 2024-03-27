import { Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../lang/i18n";

const Header = ({
  isShowedFavorite,
  setIsShowedFavorite,
  seIsEditingFavorite,
  setIsEditing,
}) => {
  const navigation = useNavigation();

  const { t } = i18n;
  const text = (text) => "screens.Navi.text." + text;

  return (
    <TouchableOpacity
      className="flex-row items-center w-20 justify-between"
      onPress={() => {
        setIsShowedFavorite(!isShowedFavorite);
        seIsEditingFavorite(false);
        setIsEditing(false);
      }}
    >
      <MaterialCommunityIcons
        name={isShowedFavorite ? "star" : "star-outline"}
        className="text-3xl text-blue-500"
      />
    </TouchableOpacity>
  );
};

export default Header;
