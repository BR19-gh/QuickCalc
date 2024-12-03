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
import Note from "../screens/Home/Note";

import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { connect } from "react-redux";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatedTool from "../screens/Home/CreatedTool";
import Header from "../components/Home/CreatedTool/Header";
import HeaderTools from "../components/Home/Header";

import Paywall from "../screens/Settings/Paywall";
import { TermsOfUse } from "../screens/Settings/Paywall/TermsOfUse";
import User from "../components/Settings/User";

import { useNavigation } from "@react-navigation/native";
import {
  useQuickActionCallback,
  useQuickAction,
} from "expo-quick-actions/hooks";

import { getQuickAccessToolId } from "../../_DATA";
import { Alert, Platform } from "react-native";

import Purchases from "react-native-purchases";
import { useRevenueCat } from "../providers/RevenueCatProvider";
import GPACal from "../screens/Home/GPACal";

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
  const GPACalText = (text) => "screens.Home.GPACal." + text;
  const NewTooltext = (text) => "screens.Home.NewTool." + text;

  const [currentTool, setCurrentTool] = useState({});
  const searchBarRef = useRef(null);
  const [isShowedFavorite, setIsShowedFavorite] = useState(false);
  const [isEditingFavorite, setIsEditingFavorite] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [moving, setMoving] = useState(false);
  const [currentTools, setCurrentTools] = useState([]);

  const navigation = useNavigation();

  const { user } = useRevenueCat();

  const [yourToolsDisplayes, setYourToolsDisplayes] = useState(false);
  const [builtinToolsDisplayes, setBuiltinToolsDisplayes] = useState(false);

  useQuickActionCallback(async (action) => {
    navigation.navigate("Home");
    if (action.id === "search") {
      setTimeout(() => {
        setIsEditing(false);
        setIsShowedFavorite(false);
        setYourToolsDisplayes(false);
        setBuiltinToolsDisplayes(false);
        searchBarRef.current.clearText();
        searchBarRef.current.blur();
        searchBarRef.current.focus();
      }, 1000);
    }

    if (action.id === "createTool") {
      setIsEditing(false);
      setIsEditingFavorite(false);
      setIsShowedFavorite(false);

      const textNavi = (text) => "screens.Navi.text." + text;

      if (
        Object.values(tools).filter((tool) => tool.link === "CreatedTool")
          .length >= 1 &&
        user.golden === false
      ) {
        return Alert.alert(
          t(textNavi("maxToolsAlertTitle")),
          t(textNavi("maxToolsAlert")),
          [
            {
              text: t(textNavi("gotIt")),
              style: "default",
              onPress: () => {
                navigation.navigate("Home", { screen: "Paywall" });
              },
            },
          ]
        );
      }

      navigation.navigate("Home", { screen: "NewTool" });
    }

    if (action.id === "favorite") {
      setIsEditing(false);
      setIsShowedFavorite(true);
      setYourToolsDisplayes(false);
      setBuiltinToolsDisplayes(false);
    }

    if (action.id === "quickAccess") {
      const customerInfo = await Purchases.getCustomerInfo();
      if (user.golden === false) {
        navigation.navigate("Home", { screen: "Paywall" });
        return;
      }
      const toolId = await getQuickAccessToolId();
      if (toolId === null) {
        Alert.alert(
          t(textQA("quickAccessAlertTitle")),
          Platform.isPad
            ? t(textQA("quickAccessAlertMsgDisktop"))
            : t(textQA("quickAccessAlertMsg")),
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
          navigation.navigate("Home", {
            screen: "CreatedTool",
            params: {
              tool,
            },
          });
        } else {
          navigation.navigate("Home", {
            screen: tool.link,
          });
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
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setMoving={setMoving}
              moving={moving}
            />
          ),
          headerLeft: () => (
            <HeaderLeftHome setIsEditing={setIsEditing} isEditing={isEditing} />
          ),
          title: isEditing ? t(text("selectToHideOrToMove")) : t(text("home")),
          headerSearchBarOptions: {
            ref: searchBarRef,
            placeholder: isShowedFavorite
              ? t(text("searchFavorite"))
              : yourToolsDisplayes
              ? t(text("searchCreated"))
              : builtinToolsDisplayes
              ? t(text("searchBuiltin"))
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
            yourToolsDisplayes={yourToolsDisplayes}
            setYourToolsDisplayes={setYourToolsDisplayes}
            builtinToolsDisplayes={builtinToolsDisplayes}
            setBuiltinToolsDisplayes={setBuiltinToolsDisplayes}
            setIsEditingFavorite={setIsEditingFavorite}
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
          headerRight: () => (
            <HeaderTools theme={theme} currentTool={"UnitsCon"} t={t} />
          ),
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
      <Stack.Screen
        options={{
          title: t(GPACalText("title")),
          headerRight: () => (
            <HeaderTools theme={theme} currentTool={"GPACal"} t={t} />
          ),
        }}
        name="GPACal"
        children={() => <GPACal theme={theme} />}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          header: () => null,
        }}
        name="Note"
        children={(props) => <Note {...props} theme={theme} />}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          header: () => null,
        }}
        name="Paywall"
        children={() => <Paywall theme={theme} />}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: t(text("termsOfUse")),
        }}
        name="termsOfUse"
        children={() => <TermsOfUse theme={theme} />}
      />

      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: t(text("currentPlan")),
        }}
        name="user"
        children={() => <User theme={theme} />}
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
