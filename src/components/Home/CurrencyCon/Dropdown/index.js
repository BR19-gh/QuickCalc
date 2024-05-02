// import SelectDropdown from "react-native-select-dropdown";
import { lang, CURRENCY_INFO } from "../../../../helpers/index";
import SweetSFSymbol from "sweet-sfsymbols";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

CURRENCY_INFO.sort((a, b) =>
  lang === "ar"
    ? a.arabic_name.localeCompare(b.arabic_name)
    : a.name.localeCompare(b.name)
);

const DropdownComponent = ({ theme, text, t, setCurrency, currency }) => {
  const [isFocus, setIsFocus] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "transparent",
    },
    dropdown: {
      backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
      height: 40,
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
      data={[...CURRENCY_INFO]}
      search
      maxHeight={300}
      labelField={lang === "ar" ? "arabic_name" : "name"}
      valueField="code"
      placeholder={!isFocus ? t(text("selectCurrency")) : "..."}
      searchPlaceholder={t(text("searchCurrency"))}
      searchPlaceholderStyle={{
        color: theme === "dark" ? "#fff" : "#151E26",
      }}
      renderRightIcon={() =>
        lang === "ar" ? null : (
          <SweetSFSymbol
            style={{
              marginRight: 5,
            }}
            name={isFocus ? "chevron.down" : "chevron.up"}
            size={10}
            colors={theme === "dark" ? "#fff" : "#151E26"}
          />
        )
      }
      renderLeftIcon={() =>
        lang === "ar" ? (
          <SweetSFSymbol
            style={{
              marginRight: 5,
            }}
            name={isFocus ? "chevron.down" : "chevron.up"}
            size={10}
            colors={theme === "dark" ? "#fff" : "#151E26"}
          />
        ) : null
      }
      value={currency}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        Haptics.selectionAsync();
        setCurrency(item);
        console.log("Currency changed to ", item);
        setIsFocus(false);
      }}
    />
  );
};

export default DropdownComponent;
