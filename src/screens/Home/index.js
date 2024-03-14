import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { connect } from "react-redux";
import { deleteAccount } from "../../store/actions/tools";

function Home(props) {
  const navigation = useNavigation();

  return (
    <View className={styles.container}>
      <Text className={styles.title}>Tools</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled={true}
        alwaysBounceVertical={false}
      >
        <FlatList
          contentContainerStyle={{ alignSelf: "flex-start" }}
          numColumns={Math.ceil(Object.values(props.tools) || [].length / 2)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={Object.values(props.tools) || []}
          renderItem={(renderProps) => (
            <TouchableOpacity
              className={styles.button}
              onPress={() => {
                //Todo: navigate to tools
              }}
            >
              <Text className={styles.btnText}>
                {renderProps.item.name + "/" + renderProps.item.id}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
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
