import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { useListCustomers } from "../../hooks";
// import ShowCustomer from "../Show";
// import Button from "../../../../components/Button";

import styles from "./styles";

const List = (props) => {
  const { navigate } = useNavigation();
  //   const customers = useListCustomers();

  return (
    <View className={styles.container}>
      <Text>Customers List</Text>
      <Text>{props.region}</Text>
      <TouchableOpacity
        className={styles.button}
        onPress={() => {
          navigation.navigate("New Customer", { region: props.item.name });
        }}
      >
        <Text className={styles.btnText}>Create Customer</Text>
      </TouchableOpacity>
      {/* {customers && customers.length > 0 ? (
        <FlatList
          data={customers || []}
          renderItem={(props) => <ShowCustomer {...props} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <>
          <Text>{"No Customers"}</Text>
          <Button
            text="Add Customer"
            onPress={() => {
              navigate("New Customer");
            }}
          />
        </>
      )} */}
    </View>
  );
};

export default List;
