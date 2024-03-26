import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useEffect } from "react";
import { handleInitialData } from "../../../store/actions/shared";
import styles from "./styles";
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// import { deleteAccount } from "../../store/actions/tools";

function Home(props) {
  return (
    <View className={styles.container}>
      <ScrollView
        style={{
          height: "100%",
        }}
      >
        <Text className={styles.title}>Discount Calculater</Text>
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(Home);
