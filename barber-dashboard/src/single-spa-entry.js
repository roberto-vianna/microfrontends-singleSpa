import React from "react";
import ReactDOM from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css';

const lifecycles = singleSpaReact({
  React,
  ReactDOM: ReactDOM,
  rootComponent: (props) => (
    <BrowserRouter basename="/barbeiro"> {} <App {...props} /> </BrowserRouter>
  ),
  domElementGetter: () => document.getElementById("barber-dashboard"),
});

export const { bootstrap, mount, unmount } = lifecycles;