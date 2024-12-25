import { TouchableOpacity, View } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import * as Haptics from "expo-haptics";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";

const Header = ({ isEditing }) => {
  const navigation = useNavigation();
  const { user } = useRevenueCat();

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (user.golden) {
            navigation.navigate("Home", { screen: "user" });
          } else {
            navigation.navigate("Home", { screen: "Paywall" });
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
    </View>
  );
};

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(Header);
