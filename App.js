import { Provider } from "react-redux";
import middleware from "./src/store/middleware";
import reducer from "./src/store/reducers";
import Navigation from "./src/navigation/";
import { createStore } from "redux";
import Welcome from "./src/screens/Welcome";
import { useState } from "react";

const App = () => {
  const store = createStore(reducer, middleware);
  const [getStartedBtnPressed, setGetStartedBtnPressed] = useState(false);

  return (
    <Provider store={store}>
      {getStartedBtnPressed ? (
        <Navigation />
      ) : (
        <Welcome setGetStartedBtnPressed={setGetStartedBtnPressed} />
      )}
    </Provider>
  );
};

export default App;
