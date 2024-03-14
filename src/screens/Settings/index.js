import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
const REGIONS = [
  {
    id: 1,
    name: "North West",
  },
  {
    id: 2,
    name: "Mid West",
  },
  {
    id: 3,
    name: "South West",
  },
  {
    id: 4,
    name: "South East",
  },
  {
    id: 5,
    name: "North East",
  },
];
export default function ListOfRegions() {
  const navigation = useNavigation();

  return (
    <View className={styles.container}>
      <TouchableOpacity
        className={styles.button}
        onPress={() => {
          navigation.navigate("New Customer", { region: props.item.name });
        }}
      >
        <Text className={styles.btnText}>Create Customer</Text>
      </TouchableOpacity>
      <Text className={styles.title}>List of Regions</Text>
      <FlatList
        data={REGIONS || []}
        renderItem={(props) => (
          <TouchableOpacity
            className={styles.button}
            onPress={() => {
              navigation.navigate("List by Region", {
                region: props.item.name,
              });
            }}
          >
            <Text className={styles.btnText}>{props.item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      <StatusBar style="auto" />
    </View>
  );
}
