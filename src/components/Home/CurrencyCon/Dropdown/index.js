import SelectDropdown from "react-native-select-dropdown";
import { View, Text } from "react-native";
import { lang, CURRENCY_INFO } from "../../../../helpers/index";
import SweetSFSymbol from "sweet-sfsymbols";

import * as Haptics from "expo-haptics";

CURRENCY_INFO.sort((a, b) =>
  lang === "ar"
    ? a.arabic_name.localeCompare(b.arabic_name)
    : a.name.localeCompare(b.name)
);

const Dropdown = ({ theme, text, t, setCurrency, currency }) => (
  <SelectDropdown
    renderSearchInputLeftIcon={() => (
      <SweetSFSymbol
        name="magnifyingglass"
        size={15}
        color={theme === "dark" ? "#ffffff55" : "#151E2655"}
      />
    )}
    searchPlaceHolderColor={theme === "dark" ? "#ffffff55" : "#151E2655"}
    searchPlaceHolder={t(text("searchCurrency"))}
    searchInputTxtColor={theme === "dark" ? "#fff" : "#151E26"}
    searchInputStyle={{
      backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
      paddingHorizontal: 12,
      alignItems: "center",
    }}
    search
    data={[...CURRENCY_INFO]}
    onSelect={(selectedItem, index) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      setCurrency(selectedItem);
    }}
    renderButton={(selectedItem, isOpened) => {
      return (
        <View
          style={{
            height: 30,
            marginBottom: 15,
            backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: theme === "dark" ? "#fff" : "#151E26",
              flex: 1,
              fontSize: 13,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {currency
              ? lang === "ar"
                ? currency.arabic_name
                : currency.name
              : t(text("selectCurrency"))}
          </Text>
        </View>
      );
    }}
    renderItem={(item, index, isSelected) => {
      return (
        <View
          style={{
            ...{
              width: "100%",
              flexDirection: "row",
              paddingHorizontal: 12,

              paddingVertical: 8,
            },
            ...(isSelected && {
              backgroundColor: theme === "dark" ? "#333333" : "#D2D9DF",
            }),
          }}
        >
          <Text
            className="text-center"
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: "500",
              color: theme === "dark" ? "#fff" : "#151E26",
            }}
          >
            {lang === "ar" ? item.arabic_name : item.name}
          </Text>
        </View>
      );
    }}
    showsVerticalScrollIndicator={false}
    dropdownStyle={{
      backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
      borderRadius: 8,
    }}
  />
);

export default Dropdown;
