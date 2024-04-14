import Home from "../screens/Home";
import HeaderRightHome from "../components/Home/HeaderRightHome";
import HeaderLeft from "../components/Home/HeaderLeft";
import HeaderLeftHome from "../components/Home/HeaderLeftHome";
import DiscountCal from "../screens/Home/DiscountCal";
import UnitsCon from "../screens/Home/UnitsCon";
import TipCal from "../screens/Home/TipCal";
import CurrencyCon from "../screens/Home/CurrencyCon";

import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const HomeNavi = ({ isEditing, setIsEditing, theme }) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;
  const DiscountCaltext = (text) => "screens.Home.DiscountCal." + text;
  const TipCaltext = (text) => "screens.Home.TipCal." + text;
  const CurrencyConText = (text) => "screens.Home.CurrencyCon." + text;
  const UnitsConText = (text) => "screens.Home.UnitsCon." + text;

  const searchBarRef = useRef(null);

  const [isShowedFavorite, setIsShowedFavorite] = useState(false);
  const [isEditingFavorite, seIsEditingFavorite] = useState(false);

  const [searchText, setSearchText] = useState("");

  return (
    <Stack.Navigator
      screenOptions={{
        headerBlurEffect: theme,
        headerTransparent: true,
        headerTitleStyle: {
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerRight: () => (
            <HeaderRightHome
              seIsEditingFavorite={seIsEditingFavorite}
              isEditingFavorite={isEditingFavorite}
              isShowedFavorite={isShowedFavorite}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          ),
          headerLeft: () => (
            <HeaderLeftHome
              setIsEditing={setIsEditing}
              seIsEditingFavorite={seIsEditingFavorite}
              isShowedFavorite={isShowedFavorite}
              setIsShowedFavorite={setIsShowedFavorite}
            />
          ),
          title: isShowedFavorite
            ? isEditingFavorite
              ? t(text("selectToFavor"))
              : t(text("favorite"))
            : isEditing
            ? t(text("selectToHideOrToMove"))
            : t(text("home")),
          headerSearchBarOptions: {
            ref: searchBarRef,
            placeholder: isShowedFavorite
              ? t(text("searchFavorite"))
              : t(text("search")),
            value: searchText,
            onChangeText: (text) => {
              setSearchText(text.nativeEvent.text);
            },
            onCancelButtonPress: () => setSearchText(""),
          },
        }}
        name="HomeNavi"
        children={() => (
          <Home
            searchBarRef={searchBarRef}
            setSearchText={setSearchText}
            searchText={searchText}
            theme={theme}
            isEditingFavorite={isEditingFavorite}
            isShowedFavorite={isShowedFavorite}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
          />
        )}
      />
      <Stack.Screen
        options={{
          title: t(DiscountCaltext("title")),
        }}
        name="DiscountCal"
        children={() => <DiscountCal theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(UnitsConText("title")),
        }}
        name="UnitsCon"
        children={() => <UnitsCon theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(TipCaltext("title")),
        }}
        name="TipCal"
        children={() => <TipCal theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(CurrencyConText("title")),
        }}
        name="CurrencyCon"
        children={() => <CurrencyCon theme={theme} />}
      />
    </Stack.Navigator>
  );
};
export default HomeNavi;
