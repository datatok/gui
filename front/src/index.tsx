import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import BrowserLayout from 'views/Browser/BrowserLayout/BrowserLayout';
import LoginPage from 'views/Login/LoginPage/LoginPage';
import NotFoundErrorPage from 'views/Error/ErrorPage/NotFoundErrorPage';
import { EuiProvider } from '@elastic/eui';

import '@elastic/eui/dist/eui_theme_light.css';


ReactDOM.render(
  <React.StrictMode>
    <EuiProvider colorMode="light">
    <BrowserRouter>
      <Routes>
        <Route path='/browse/*' element={<BrowserLayout />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='*' element={<NotFoundErrorPage />} />
      </Routes>
    </BrowserRouter>
    </EuiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
