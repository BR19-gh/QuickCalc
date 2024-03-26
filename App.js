import "react-native-gesture-handler";
import { Provider } from "react-redux";
import middleware from "./src/store/middleware";
import reducer from "./src/store/reducers";
import Navigation from "./src/navigation/";
import { createStore } from "redux";
import Welcome from "./src/screens/Welcome";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  const store = createStore(reducer, middleware);
  const [getStartedBtnPressed, setGetStartedBtnPressed] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {getStartedBtnPressed ? (
          <Navigation />
        ) : (
          <Welcome setGetStartedBtnPressed={setGetStartedBtnPressed} />
        )}
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
