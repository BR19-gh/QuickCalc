import Home from "../screens/Home";
import HeaderRightHome from "../components/Home/HeaderRightHome";
import HeaderLeftHome from "../components/Home/HeaderLeftHome";
import DiscountCal from "../screens/Home/DiscountCal";
import UnitsCon from "../screens/Home/UnitsCon";
import TipCal from "../screens/Home/TipCal";
import CurrencyCon from "../screens/Home/CurrencyCon";
import CalendarCon from "../screens/Home/CalendarCon";
import NewTool from "../screens/Home/NewTool";
import EditTool from "../screens/Home/EditTool";

import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatedTool from "../screens/Home/CreatedTool";
import Header from "../components/Home/CreatedTool/Header";
import HeaderTools from "../components/Home/Header";

const Stack = createNativeStackNavigator();

const HomeNavi = ({ isEditing, setIsEditing, theme }) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;
  const DiscountCaltext = (text) => "screens.Home.DiscountCal." + text;
  const TipCaltext = (text) => "screens.Home.TipCal." + text;
  const CurrencyConText = (text) => "screens.Home.CurrencyCon." + text;
  const UnitsConText = (text) => "screens.Home.UnitsCon." + text;
  const CalendarConText = (text) => "screens.Home.CalendarCon." + text;
  const NewTooltext = (text) => "screens.Home.NewTool." + text;
  const CreatedToolText = (text) => "screens.Home.CreatedTool." + text;

  const [currentTool, setCurrentTool] = useState({});
  const searchBarRef = useRef(null);
  const [isShowedFavorite, setIsShowedFavorite] = useState(false);
  const [isEditingFavorite, seIsEditingFavorite] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <Stack.Navigator
      screenOptions={{
        headerBlurEffect: theme,
        headerTransparent: true,
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
          title: t(NewTooltext("title")),
        }}
        name="NewTool"
        children={() => <NewTool theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(NewTooltext("titleEdit")),
        }}
        name="EditTool"
        children={(props) => <EditTool {...props} theme={theme} />}
      />

      <Stack.Screen
        options={{
          title: currentTool.name,
          headerRight: () => <Header currentTool={currentTool} t={t} />,
        }}
        name="CreatedTool"
        children={(props) => (
          <CreatedTool
            {...props}
            theme={theme}
            setCurrentTool={setCurrentTool}
          />
        )}
      />
      <Stack.Screen
        options={{
          title: t(DiscountCaltext("title")),
          headerRight: () => <HeaderTools currentTool={"DiscountCal"} t={t} />,
        }}
        name="DiscountCal"
        children={() => <DiscountCal theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(UnitsConText("title")),
          headerRight: () => <HeaderTools currentTool={"UnitsCon"} t={t} />,
        }}
        name="UnitsCon"
        children={() => <UnitsCon theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(TipCaltext("title")),
          headerRight: () => <HeaderTools currentTool={"TipCal"} t={t} />,
        }}
        name="TipCal"
        children={() => <TipCal theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(CurrencyConText("title")),
          headerRight: () => <HeaderTools currentTool={"CurrencyCon"} t={t} />,
        }}
        name="CurrencyCon"
        children={() => <CurrencyCon theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(CalendarConText("title")),
          headerRight: () => <HeaderTools currentTool={"CalendarCon"} t={t} />,
        }}
        name="CalendarCon"
        children={() => <CalendarCon theme={theme} />}
      />
    </Stack.Navigator>
  );
};
export default HomeNavi;
