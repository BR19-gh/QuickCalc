import { lang, UNIT_INFO } from "../../../../helpers/index";
import SweetSFSymbol from "sweet-sfsymbols";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const DropdownComponent = ({ theme, text, t, setUnit, unit, measurement }) => {
  const [isFocus, setIsFocus] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "transparent",
    },
    dropdown: {
      backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
      height: 40,
      borderColor: "#283dab88",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });

  const [filteredUnits, setFilteredUnits] = useState([{ units: [{}] }]);

  useEffect(() => {
    setFilteredUnits(
      measurement
        ? UNIT_INFO.map((category) => ({
            ...category,
            units: category.units.filter(
              (unit) => unit.meausrement === measurement
            ),
          })).filter((category) => category.units.length > 0)
        : [{ units: [{}] }]
    );
  }, [measurement]);

  return (
    <Dropdown
      activeColor={theme === "dark" ? "#2F2F2F" : "#D2D2D2"}
      itemContainerStyle={{
        backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
      }}
      itemTextStyle={{
        color: theme === "dark" ? "#fff" : "#151E26",
      }}
      containerStyle={{
        borderColor: theme === "dark" ? "#555555" : "#E9ECEF",
        borderRadius: 8,
        backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
        paddingBottom: 5,
      }}
      style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
      placeholderStyle={{
        fontSize: 14,
        fontWeight: "bold",
        color: theme === "dark" ? "#fff" : "#151E26",
      }}
      selectedTextStyle={{
        fontSize: 14,
        fontWeight: "bold",
        color: theme === "dark" ? "#fff" : "#151E26",
      }}
      inputSearchStyle={{
        height: 40,
        fontSize: 14,
        color: theme === "dark" ? "#fff" : "#151E26",
      }}
      iconStyle={styles.iconStyle}
      data={[...filteredUnits[0].units]}
      search
      maxHeight={300}
      labelField={lang === "ar" ? "ar" : "en"}
      valueField="code"
      placeholder={!isFocus ? t(text("selectUnit")) : "..."}
      searchPlaceholder={t(text("searchUnit"))}
      searchPlaceholderStyle={{
        color: theme === "dark" ? "#fff" : "#151E26",
      }}
      renderRightIcon={() => (
        <SweetSFSymbol
          style={{
            marginRight: 5,
          }}
          name="chevron.down"
          size={10}
          color={theme === "dark" ? "#fff" : "#151E26"}
        />
      )}
      value={unit}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setUnit(item);
        console.log("Unit changed to ", item);
        setIsFocus(false);
      }}
    />
  );
};

export default DropdownComponent;
