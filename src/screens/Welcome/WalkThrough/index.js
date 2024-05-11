import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";

import { Image } from "expo-image";

function WalkThrough(props) {
  return (
    <View>
      <Image source={require("../../../../walkthro_en/home.jpg")} />
      <Image
        style={{
          width: "90%",
          height: "90%",
        }}
        source={require("../../../../walkthro_en/edit.gif")}
      />

      <StatusBar style="auto" />
    </View>
  );
}

export default WalkThrough;
