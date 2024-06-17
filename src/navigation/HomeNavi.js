import Home from "../screens/Home";
import HeaderRightHome from "../components/Home/HeaderRightHome";
import HeaderRightNewTool from "../components/Home/HeaderRightNewTool";
import HeaderLeftHome from "../components/Home/HeaderLeftHome";
import DiscountCal from "../screens/Home/DiscountCal";
import UnitsCon from "../screens/Home/UnitsCon";
import TipCal from "../screens/Home/TipCal";
import CurrencyCon from "../screens/Home/CurrencyCon";
import CalendarCon from "../screens/Home/CalendarCon";
import NewTool from "../screens/Home/NewTool";
import NewToolViaCode from "../screens/Home/NewToolViaCode";
import EditTool from "../screens/Home/EditTool";

import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { connect } from "react-redux";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatedTool from "../screens/Home/CreatedTool";
import Header from "../components/Home/CreatedTool/Header";
import HeaderTools from "../components/Home/Header";

import { useNavigation } from "@react-navigation/native";
import { useQuickActionCallback } from "expo-quick-actions/hooks";

import { getQuickAccessToolId } from "../../_DATA";
import { Alert } from "react-native";

const Stack = createNativeStackNavigator();

const HomeNavi = ({ isEditing, setIsEditing, theme, tools }) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;
  const textQA = (text) => "screens.QuickAction." + text;
  const DiscountCaltext = (text) => "screens.Home.DiscountCal." + text;
  const TipCaltext = (text) => "screens.Home.TipCal." + text;
  const CurrencyConText = (text) => "screens.Home.CurrencyCon." + text;
  const UnitsConText = (text) => "screens.Home.UnitsCon." + text;
  const CalendarConText = (text) => "screens.Home.CalendarCon." + text;
  const NewTooltext = (text) => "screens.Home.NewTool." + text;

  const [currentTool, setCurrentTool] = useState({});
  const searchBarRef = useRef(null);
  const [isShowedFavorite, setIsShowedFavorite] = useState(false);
  const [isEditingFavorite, setIsEditingFavorite] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [moving, setMoving] = useState(false);
  const [currentTools, setCurrentTools] = useState([]);

  const navigation = useNavigation();

  useQuickActionCallback(async (action) => {
    navigation.navigate("HomeNavi");
    if (action.id === "search") {
      setTimeout(() => {
        searchBarRef.current.clearText();
        searchBarRef.current.blur();
        searchBarRef.current.focus();
      }, 1000);
    }

    if (action.id === "createTool") {
      setIsEditing(false);
      setIsEditingFavorite(false);
      setIsShowedFavorite(false);

      navigation.navigate("NewTool");
    }

    if (action.id === "favorite") {
      setIsEditing(false);
      setIsEditingFavorite(false);
      setIsShowedFavorite(true);
    }

    if (action.id === "quickAccess") {
      const toolId = await getQuickAccessToolId();
      if (toolId === null) {
        Alert.alert(
          t(textQA("quickAccessAlertTitle")),
          t(textQA("quickAccessAlertMsg")),
          [
            {
              text: t(text("gotIt")),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      } else {
        let tool = {};
        for (let key in currentTools) {
          if (currentTools[key].id == toolId) {
            tool = currentTools[key];
          }
        }

        if (tool.link === "CreatedTool") {
          navigation.navigate("CreatedTool", { tool });
        } else {
          navigation.navigate(tool.link);
        }
      }
    }
  });

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
              setIsEditingFavorite={setIsEditingFavorite}
              isEditingFavorite={isEditingFavorite}
              isShowedFavorite={isShowedFavorite}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setMoving={setMoving}
              moving={moving}
            />
          ),
          headerLeft: () => (
            <HeaderLeftHome
              setIsEditing={setIsEditing}
              setIsEditingFavorite={setIsEditingFavorite}
              isShowedFavorite={isShowedFavorite}
              isEditing={isEditing}
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
            currentTools={currentTools}
            setCurrentTools={setCurrentTools}
            searchBarRef={searchBarRef}
            setSearchText={setSearchText}
            searchText={searchText}
            theme={theme}
            isEditingFavorite={isEditingFavorite}
            isShowedFavorite={isShowedFavorite}
            setIsShowedFavorite={setIsShowedFavorite}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            moving={moving}
            setMoving={setMoving}
          />
        )}
      />

      <Stack.Screen
        options={{
          title: t(NewTooltext("title")),
          headerRight: () => <HeaderRightNewTool />,
        }}
        name="NewTool"
        children={() => <NewTool theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(NewTooltext("title2")),
        }}
        name="NewToolViaCode"
        children={() => <NewToolViaCode theme={theme} />}
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
          headerRight: () => (
            <Header theme={theme} currentTool={currentTool} t={t} />
          ),
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
          headerRight: () => (
            <HeaderTools theme={theme} currentTool={"DiscountCal"} t={t} />
          ),
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
          headerRight: () => (
            <HeaderTools theme={theme} currentTool={"TipCal"} t={t} />
          ),
        }}
        name="TipCal"
        children={() => <TipCal theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(CurrencyConText("title")),
          headerRight: () => (
            <HeaderTools theme={theme} currentTool={"CurrencyCon"} t={t} />
          ),
        }}
        name="CurrencyCon"
        children={() => <CurrencyCon theme={theme} />}
      />
      <Stack.Screen
        options={{
          title: t(CalendarConText("title")),
          headerRight: () => (
            <HeaderTools theme={theme} currentTool={"CalendarCon"} t={t} />
          ),
        }}
        name="CalendarCon"
        children={() => <CalendarCon theme={theme} />}
      />
    </Stack.Navigator>
  );
};
const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(HomeNavi);
