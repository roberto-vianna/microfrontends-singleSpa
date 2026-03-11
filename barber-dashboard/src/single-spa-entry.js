import React from "react";
import ReactDOM from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: (props) => (
    <BrowserRouter basename="/barbeiro">
      <App {...props} />
    </BrowserRouter>
  ),
  domElementGetter: () => document.getElementById("barber-dashboard"),
  errorBoundary(err, info, props) {
    return React.createElement(
      "div",
      { style: { padding: "16px" } },
      "Erro ao carregar o dashboard do barbeiro."
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;