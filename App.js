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
import { isFirstTimeLaunch } from "./_DATA";

const App = () => {
  const store = createStore(reducer, middleware);
  const [getStartedBtnPressed, setGetStartedBtnPressed] = useState(false);
  const [isFirstTimeState, setIsFirstTimeState] = useState(false);
  const [theme, setTheme] = useState(null);
  const [isThemeChanged, setIsThemeChanged] = useState(false);

  useEffect(() => {
    const checkFirstTimeLaunch = async () => {
      const isFirstTime = await isFirstTimeLaunch();
      if (isFirstTime) {
        setIsFirstTimeState(true);
      }
    };
    checkFirstTimeLaunch();
  }, []);
  return (
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
  );
};

export default App;
