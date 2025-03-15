import "react-native-gesture-handler";
import { Provider } from "react-redux";
import middleware from "./src/store/middleware";
import reducer from "./src/store/reducers";
import Navigation from "./src/navigation/";
import NavigationWelcome from "./src/navigation/NavigationWelcome";
import { createStore } from "redux";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";
import { MenuProvider } from "react-native-popup-menu";
import { getTools, isFirstTimeLaunch, storeTools } from "./_DATA";
import * as QuickActions from "expo-quick-actions";
import { useTranslation } from "react-i18next";
import mobileAds from "react-native-google-mobile-ads";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { setTrackingStat } from "./_DATA";
import { RevenueCatProvider } from "./src/providers/RevenueCatProvider";
import * as SplashScreen from "expo-splash-screen";

const App = () => {
  const store = createStore(reducer, middleware);
  const [getStartedBtnPressed, setGetStartedBtnPressed] = useState(false);
  const [isFirstTimeState, setIsFirstTimeState] = useState(false);
  const [theme, setTheme] = useState(null);
  const [isThemeChanged, setIsThemeChanged] = useState(false);

  const { t } = useTranslation();
  const text = (text) => "screens.QuickAction." + text;

  SplashScreen.setOptions({
    duration: 1000,
    fade: true,
  });

  useEffect(() => {
    (async () => {
      // Google AdMob will show any messages here that you just set up on the AdMob Privacy & Messaging page
      const { status: trackingStatus } =
        await requestTrackingPermissionsAsync();
      if (trackingStatus !== "granted") {
        await setTrackingStat(false);
      } else {
        await setTrackingStat(true);
      }

      // Initialize the ads
      await mobileAds().initialize();
    })();
  }, []);

  useEffect(() => {
    const checkFirstTimeLaunch = async () => {
      const isFirstTime = await isFirstTimeLaunch();
      if (isFirstTime) {
        setIsFirstTimeState(true);
      }
    };
    checkFirstTimeLaunch();
  }, []);

  useEffect(() => {
    QuickActions.setItems([
      {
        title: t(text("search")),
        icon: "symbol:magnifyingglass",
        id: "search",
      },
      {
        title: t(text("createTool")),
        icon: "symbol:plus",
        id: "createTool",
      },
      {
        title: t(text("favorite")),
        icon: "symbol:star",
        id: "favorite",
      },
      {
        title: t(text("quickAccess")),
        subtitle: t(text("quickAccessSub")),
        icon: "symbol:arrow.forward.to.line.circle",
        id: "quickAccess",
      },
    ]);
  }, []);

  return (
    <RevenueCatProvider>
      <MenuProvider>
        <ToastProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
              {getStartedBtnPressed || !isFirstTimeState ? (
                <Navigation
                  theme={theme}
                  setTheme={setTheme}
                  isThemeChanged={isThemeChanged}
                  setIsThemeChanged={setIsThemeChanged}
                />
              ) : (
                <NavigationWelcome
                  isThemeChanged={isThemeChanged}
                  setIsThemeChanged={setIsThemeChanged}
                  theme={theme}
                  setTheme={setTheme}
                  setGetStartedBtnPressed={setGetStartedBtnPressed}
                />
              )}
            </Provider>
          </GestureHandlerRootView>
        </ToastProvider>
      </MenuProvider>
    </RevenueCatProvider>
  );
};

export default App;
