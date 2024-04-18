import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { store, pesistor } from "./redux/store";
import { Provider } from "react-redux";

import "./index.css";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate persistor={pesistor}>
    <Provider store={store}>
      <App />
    </Provider>
  </PersistGate>
);
