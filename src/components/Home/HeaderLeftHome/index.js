import { Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SweetSFSymbol from "sweet-sfsymbols";
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
              duration: 500,
              placement: "top",
            });
          }, 1000);
        }}
      >
        <SweetSFSymbol
          name={"arrow.clockwise"}
          size={22}
          colors={["#3B82F6"]}
          style={{ marginTop: 2 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setIsShowedFavorite(!isShowedFavorite);
          seIsEditingFavorite(false);
          setIsEditing(false);
        }}
      >
        <SweetSFSymbol
          name={isShowedFavorite ? "star.fill" : "star"}
          size={22}
          colors={["#3B82F6"]}
          style={{ marginTop: 2 }}
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
