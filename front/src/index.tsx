import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  Route,
  BrowserRouter,
  Routes,
  Navigate,
} from "react-router-dom";
import BucketLayout from 'views/Bucket/BucketLayout/BucketLayout';
import LoginPage from 'views/Auth/Login/LoginPage/LoginPage';
import NotFoundErrorPage from 'views/Error/ErrorPage/NotFoundErrorPage';
import { EuiGlobalToastList, EuiProvider } from '@elastic/eui';

import '@elastic/eui/dist/eui_theme_light.css';

import AuthLayout from 'views/Auth/Layout';
import AnonymousLoginPage from 'views/Auth/AnonymousPage';
import HomeLayout from 'views/Home/Layout';
import SiteProvider from 'providers/Site';
import ProtectedRoute from 'components/ProtectedRoute';
import BrowserPageWrapper from 'views/Bucket/BrowserPage/BrowserPageWrapper';
import UploadPageWrapper from 'views/Bucket/UploadPage/UploadPageWrapper';
import { SiteContext } from 'providers/Site/context';
import { BucketContext } from 'providers/Bucket/context';
import HomePage from 'views/Bucket/HomePage/HomePage';


ReactDOM.render(
  <React.StrictMode>
    <EuiProvider colorMode="light">
      <SiteProvider>
        <BrowserRouter>
          <Routes>
            
            <Route path='' element={
              <SiteContext.Consumer>
              {({apiAccessToken}) => (
                apiAccessToken ? <Navigate to="/bucket" replace />
                : <Navigate to="/auth" replace />
              )}
            </SiteContext.Consumer>} />

            <Route path='auth' element={<AuthLayout />}>
              <Route path='' element={<LoginPage />} />
              <Route path='anonymous' element={
                <SiteContext.Consumer>
                  {({setApiAccessToken}) => (
                    <AnonymousLoginPage setApiAccessToken={setApiAccessToken} />
                  )}
                </SiteContext.Consumer>} />
              <Route path='*' />
            </Route>
              
            <Route path='bucket' element={
              <ProtectedRoute>
                <BucketLayout />
              </ProtectedRoute>
            }>
              <Route path='' element={
                <BucketContext.Consumer>
                  {({buckets}) => (
                    <HomePage buckets={buckets} />
                  )}
                </BucketContext.Consumer>
              } />
              <Route path=':bucket'>
                <Route path='upload' element={<UploadPageWrapper />} />
                <Route path='upload/*' element={<UploadPageWrapper />} />
                <Route id='bucket-browser' path='browse' element={<BrowserPageWrapper />} />
                <Route id='bucket-browser' path='browse/*' element={<BrowserPageWrapper />} />
              </Route>
            </Route>

            <Route path='*' element={<NotFoundErrorPage />} />
          </Routes>
        </BrowserRouter>
      </SiteProvider>
    </EuiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
