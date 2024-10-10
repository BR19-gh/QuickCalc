import { TouchableOpacity } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import * as Haptics from "expo-haptics";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";

const Header = ({ isEditing }) => {
  const navigation = useNavigation();
  const { user } = useRevenueCat();

  return (
    <>
      <TouchableOpacity
        className="items-start w-12"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (user.golden) {
            navigation.navigate("user");
          } else {
            navigation.navigate("Paywall");
          }
        }}
      >
        {
          <SweetSFSymbol
            name={user.golden ? "crown.fill" : "crown"}
            size={22}
            colors={["gold"]}
          />
        }
      </TouchableOpacity>
      <TouchableOpacity className="items-start w-12 mr-9">
        {isEditing ? null : (
          <SweetSFSymbol
            name={"star"}
            size={22}
            colors={[
              //"#3B82F6"
              "transparent",
            ]}
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
