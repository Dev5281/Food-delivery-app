import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from "@material-tailwind/react";
import { CartProvider } from './components/ContextReducer';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <ThemeProvider> 
     <CartProvider>
    <App />
    </CartProvider>
    </ThemeProvider> 
  </React.StrictMode>
);


reportWebVitals();
