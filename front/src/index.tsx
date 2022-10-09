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
import DetailsPage from 'views/Bucket/DetailsPage/DetailsPage';
import { If, Then } from 'react-if';
import { SiteMetaContextProvider } from 'providers/site-meta.context';
import { AuthContext } from 'providers/auth.context';


ReactDOM.render(
  <React.StrictMode>
    <EuiProvider colorMode="light">
      <SiteProvider>
        <SiteMetaContextProvider>
        <BrowserRouter>
          <Routes>
            
            <Route path='' element={
              <AuthContext.Consumer>
              {({apiAccessToken}) => (
                apiAccessToken ? <Navigate to="/bucket" replace />
                : <Navigate to="/auth" replace />
              )}
            </AuthContext.Consumer>} />

            <Route path='auth' element={<AuthLayout />}>
              <Route path='' element={<LoginPage />} />
              <Route path='anonymous' element={<AnonymousLoginPage />} />
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
                <Route path='' element={
                <BucketContext.Consumer>
                  {({current}) => (
                    <If condition={current !== null}>
                      <Then>
                        <DetailsPage bucket={current} />
                      </Then>
                    </If>
                  )}
                </BucketContext.Consumer>
              } />
                <Route path='upload' element={<UploadPageWrapper />} />
                <Route path='upload/*' element={<UploadPageWrapper />} />
                <Route id='bucket-browser' path='browse' element={<BrowserPageWrapper />} />
                <Route id='bucket-browser' path='browse/*' element={<BrowserPageWrapper />} />
              </Route>
            </Route>

            <Route path='*' element={<NotFoundErrorPage />} />
          </Routes>
        </BrowserRouter>
        </SiteMetaContextProvider>
      </SiteProvider>
    </EuiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
