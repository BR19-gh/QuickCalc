import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { connect } from "react-redux";
import { handleInitialData } from "../../store/actions/shared";
import { useEffect, useState } from "react";
function Welcome(props) {
  useEffect(() => {
    console.log("Welcome useEfect");
    props.dispatch(handleInitialData());
  }, []);

  return (
    <View className={styles.container}>
      <Text className={styles.title}>Welcome to</Text>
      <Text className={styles.icon}>myTools 👋</Text>
      <Text className={styles.paragraph}>
        Simple tools for your daily mathematical tasks
      </Text>
      <TouchableOpacity
        className={styles.button}
        style={{
          backgroundColor: props.colors ? props.colors[10].color : "white",
        }}
        onPress={() => {
          props.setGetStartedBtnPressed(true);
        }}
      >
        <Text className={styles.btnText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={styles.button}
        style={{
          backgroundColor: props.colors ? props.colors[7].color : "white",
        }}
      >
        <Text className={styles.btnText}>Walk Through</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const mapStateToProps = ({ colors }) => {
  return {
    colors,
  };
};

export default connect(mapStateToProps)(Welcome);
