import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import BucketLayout from 'views/Bucket/BucketLayout/BucketLayout';
import LoginPage from 'views/Auth/Login/LoginPage/LoginPage';
import NotFoundErrorPage from 'views/Error/ErrorPage/NotFoundErrorPage';
import { EuiGlobalToastList, EuiProvider } from '@elastic/eui';

import '@elastic/eui/dist/eui_theme_light.css';
import UploadPage from 'views/Bucket/UploadPage/UploadPage';
import BrowserPage from 'views/Bucket/BrowserPage/BrowserPage';
import AuthLayout from 'views/Auth/Layout';
import AnonymousLoginPage from 'views/Auth/AnonymousPage';
import HomeLayout from 'views/Home/Layout';
import { SiteProvider } from 'providers/Site';
import ProtectedRoute from 'components/ProtectedRoute';


ReactDOM.render(
  <React.StrictMode>
    <EuiProvider colorMode="light">
      <SiteProvider>
        <BrowserRouter>
          <Routes>
            <Route path='' element={<HomeLayout />} />

            <Route path='auth' element={<AuthLayout />}>
              <Route path='' element={<LoginPage />} />
              <Route path='anonymous' element={<AnonymousLoginPage />} />
              <Route path='*' />
            </Route>

            <Route path='bucket/:bucket' element={
              <ProtectedRoute>
                <BucketLayout />
              </ProtectedRoute>
            }>
              <Route path='upload' element={<UploadPage />} />
              <Route path='upload/*' element={<UploadPage />} />
              <Route id='bucket-browser' path='browse' element={<BrowserPage />} />
              <Route id='bucket-browser' path='browse/*' element={<BrowserPage />} />
            </Route>

            <Route path='*' element={<NotFoundErrorPage />} />
          </Routes>
        </BrowserRouter>
      </SiteProvider>
    </EuiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
