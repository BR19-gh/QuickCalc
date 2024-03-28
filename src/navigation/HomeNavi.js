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

const HomeNavi = ({ isEditing, setIsEditing }) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;

  const [isShowedFavorite, setIsShowedFavorite] = useState(false);
  const [isEditingFavorite, seIsEditingFavorite] = useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerTranslucent: true,
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
            ? t(text("selectToHide"))
            : t(text("home")),
        }}
        name="HomeNavi"
        children={() => (
          <Home
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
        }}
        name="DiscountCal"
        children={() => <DiscountCal />}
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
        }}
        name="TipCal"
        component={TipCal}
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
