import Home from "../screens/Home";
import HeaderRightHome from "../components/Home/HeaderRightHome";
import HeaderLeft from "../components/Home/HeaderLeft";
import HeaderLeftHome from "../components/Home/HeaderLeftHome";
import DiscountCal from "../screens/Home/DiscountCal";
import UnitsCon from "../screens/Home/UnitsCon";
import TipCal from "../screens/Home/TipCal";
import CurrencyCon from "../screens/Home/CurrencyCon";

import { useTranslation } from "react-i18next";
import { useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const HomeNavi = ({ isEditing, setIsEditing, theme }) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;
  const DiscountCaltext = (text) => "screens.Home.DiscountCal." + text;
  const TipCaltext = (text) => "screens.Home.TipCal." + text;

  const [isShowedFavorite, setIsShowedFavorite] = useState(false);
  const [isEditingFavorite, seIsEditingFavorite] = useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTranslucent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerHideShadow: true,
        headerTitleStyle: {
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        options={{
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
        }}
        name="HomeNavi"
        children={() => (
          <Home
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
          headerLeft: () => <HeaderLeft />,
          title: t(DiscountCaltext("title")),
        }}
        name="DiscountCal"
        children={() => <DiscountCal theme={theme} />}
      />
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeft />,
        }}
        name="UnitsCon"
        component={UnitsCon}
      />
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeft />,
          title: t(TipCaltext("title")),
        }}
        name="TipCal"
        children={() => <TipCal theme={theme} />}
      />
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeft />,
        }}
        name="CurrencyCon"
        component={CurrencyCon}
      />
    </Stack.Navigator>
  );
};

export default HomeNavi;
