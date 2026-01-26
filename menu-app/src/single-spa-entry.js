import React from 'react';
import ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';
import './index.css';

const lifecycles = singleSpaReact({
  React,
  ReactDOM: ReactDOM,
  rootComponent: App,
  domElementGetter: () => document.getElementById('menu')
});

export const { bootstrap, mount, unmount } = lifecycles;