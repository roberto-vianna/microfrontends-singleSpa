import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';

if (!document.getElementById('barber-dashboard')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <BrowserRouter basename="/barbeiro"> <App /> </BrowserRouter>
  );
}