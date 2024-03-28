import { Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useToast } from "react-native-toast-notifications";
// import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../lang/i18n";
import { handleInitialData } from "../../../store/actions/shared";
import { connect } from "react-redux";

const Header = ({
  isShowedFavorite,
  setIsShowedFavorite,
  seIsEditingFavorite,
  setIsEditing,
  dispatch,
}) => {
  const navigation = useNavigation();

  const { t } = i18n;
  const text = (text) => "screens.Navi.text." + text;

  const toast = useToast();

  return (
    <>
      <TouchableOpacity
        className="items-start w-14"
        onPress={() => {
          let refreshToast = toast.show(t(text("refreshing")), {
            placement: "top",
          });
          dispatch(handleInitialData());
          setTimeout(() => {
            toast.update(refreshToast, t(text("refreshComplated")), {
              type: "success",
              duration: 1000,
              placement: "top",
            });
          }, 1500);
        }}
      >
        <MaterialCommunityIcons
          name={"refresh"}
          className="text-3xl text-blue-500"
        />
      </TouchableOpacity>
      <TouchableOpacity
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
    </>
  );
};

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(Header);
