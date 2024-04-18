// import SelectDropdown from "react-native-select-dropdown";
import {
  lang,
  CALENDAR_INFO,
  CALENDAR_INFO_LIMITED,
  CALENDAR_INFO_UNLIMITED,
} from "../../../../helpers";
import SweetSFSymbol from "sweet-sfsymbols";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const DropdownComponent = ({
  theme,
  text,
  t,
  setCalendar,
  calendar,
  selectCalendar,
  isFrom,
  isLimited,
  setIsLimited,
}) => {
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
      data={
        isFrom
          ? [...CALENDAR_INFO_LIMITED]
          : isLimited
          ? [...CALENDAR_INFO_LIMITED]
          : [...CALENDAR_INFO]
      }
      search
      maxHeight={300}
      labelField={lang === "ar" ? "ar" : "en"}
      valueField="value"
      placeholder={!isFocus ? t(text(selectCalendar)) : "..."}
      searchPlaceholder={t(text("searchCalendar"))}
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
      value={calendar}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (isFrom) {
          if (item.value !== "gregorian") {
            setIsLimited(true);
          } else {
            setIsLimited(false);
          }
        }
        setCalendar(item);
        setIsFocus(false);
      }}
    />
  );
};

export default DropdownComponent;
