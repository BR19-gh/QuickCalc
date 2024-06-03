import { Text, View, TouchableOpacity, Alert } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { lang } from "../../../helpers";
import * as Haptics from "expo-haptics";
import { connect } from "react-redux";

const Header = ({ currentTool, t, tools, dispatch }) => {
  function getToolByName(link) {
    for (const toolId in tools) {
      if (tools.hasOwnProperty(toolId)) {
        const tool = tools[toolId];
        if (tool.link === link || tool.link === link) {
          return tool;
        }
      }
    }
    return null;
  }

  const tool = getToolByName(currentTool);

  return (
    <View
      className="
      header-right
    "
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.selectionAsync();
          Alert.alert(
            lang === "ar"
              ? tool.name.ar === "حاسبة البقشيش"
                ? "حاسبة القطة"
                : tool.name.ar
              : tool.name.en,
            lang === "ar"
              ? tool.description.ar === "احسب بقشيش وجبتك"
                ? "احسب قطة وجبتك"
                : tool.description.ar
              : tool.description.en
          );
        }}
        ß
      >
        <SweetSFSymbol name="info.circle" size={22} colors={["#3B82F6"]} />
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = ({ tools }) => ({
  tools,
});

export default connect(mapStateToProps)(Header);
