import { TouchableOpacity } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { useToast } from "react-native-toast-notifications";
// import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../lang/i18n";
import { handleInitialData } from "../../../store/actions/shared";
import { connect } from "react-redux";
import * as Haptics from "expo-haptics";

const Header = ({
  isShowedFavorite,
  setIsShowedFavorite,
  setIsEditingFavorite,
  setIsEditing,
  isEditing,
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
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          let refreshToast = toast.show(t(text("refreshing")), {
            placement: "top",
          });
          dispatch(handleInitialData());
          setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setIsShowedFavorite(!isShowedFavorite);
          setIsEditingFavorite(false);
          setIsEditing(false);
        }}
      >
        {isEditing ? null : (
          <SweetSFSymbol
            name={isShowedFavorite ? "star.fill" : "star"}
            size={22}
            colors={["#3B82F6"]}
          />
        )}
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
