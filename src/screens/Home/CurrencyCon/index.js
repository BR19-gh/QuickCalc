import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { handleInitialData } from "../../../store/actions/shared";
import styles from "./styles";
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// import { deleteAccount } from "../../store/actions/tools";

function Home(props) {
  const navigation = useNavigation();

  return (
    <View className={styles.container}>
      <Text className={styles.title}>Currency Converter</Text>

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
