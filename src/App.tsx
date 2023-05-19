import React from "react";

import "./index.css";
import "./firebase.ts";

import AppRouter from "./router";
import AuthGuard from "./AuthGuard";


const App = (): JSX.Element => {
  return (
    <AuthGuard>
      <AppRouter />
    </AuthGuard>
  );
};


export default App;
