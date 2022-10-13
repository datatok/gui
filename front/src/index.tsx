import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  Route,
  BrowserRouter,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import BucketLayout from 'views/Bucket/BucketLayout/BucketLayout';
import LoginPage from 'views/Auth/Login/LoginPage/LoginPage';
import NotFoundErrorPage from 'views/Error/ErrorPage/NotFoundErrorPage';
import { EuiGlobalToastList, EuiPageTemplate, EuiProvider } from '@elastic/eui';

//import '@elastic/eui/dist/eui_theme_light.css';
import '@elastic/eui/dist/eui_theme_dark.css';

import AnonymousLoginPage from 'views/Auth/AnonymousPage';
import HomeLayout from 'views/Home/Layout';
import ProtectedRoute from 'components/ProtectedRoute';
import BucketContextProvider, { BucketContext } from 'providers/BucketContext';
import HomePage from 'views/Bucket/HomePage/HomePage';
import DetailsPage from 'views/Bucket/DetailsPage/DetailsPage';
import { If, Then } from 'react-if';
import { SiteMetaContextProvider } from 'providers/SiteMetaContext';
import { AuthContext, AuthContextProvider } from 'providers/AuthContext';
import BrowserPage from 'views/Bucket/BrowserPage/BrowserPage';
import { NotificationProvider } from 'providers/NotificationContext';
import UploadPage from 'views/Bucket/UploadPage/UploadPage';
import Header from 'views/Bucket/Header/Header';
import Sidebar from 'views/Bucket/Sidebar/Sidebar';


ReactDOM.render(
  <React.StrictMode>
    <EuiProvider colorMode="DARK">
      <NotificationProvider>
        <SiteMetaContextProvider>
          <AuthContextProvider>
            <BrowserRouter>
              <BucketContextProvider>
                
                  <Routes>
                    
                    <Route path='' element={
                      <AuthContext.Consumer>
                      {({apiAccessToken}) => (
                        apiAccessToken ? <Navigate to="/bucket" replace />
                        : <Navigate to="/auth" replace />
                      )}
                    </AuthContext.Consumer>} />

                    <Route path='auth' element={
                      <EuiPageTemplate>
                        <Header />
                        <EuiPageTemplate.Section>
                          <Outlet />
                        </EuiPageTemplate.Section>
                      </EuiPageTemplate>
                    }>
                      <Route path='' element={<LoginPage />} />
                      <Route path='anonymous' element={<AnonymousLoginPage />} />
                      <Route path='*' />
                    </Route>
                      
                    <Route path='bucket'>

                      <Route path='' element={
                        <ProtectedRoute>
                          <EuiPageTemplate>
                            <Header />
                            <EuiPageTemplate.Section>
                              <HomePage />
                            </EuiPageTemplate.Section>
                          </EuiPageTemplate>
                          
                        </ProtectedRoute>
                      }/>

                      <Route path=':bucket' element={
                        <ProtectedRoute>
                          <BucketLayout />
                        </ProtectedRoute>
                      }>
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
                        <Route path='upload' element={<UploadPage />} />
                        <Route path='upload/*' element={<UploadPage />} />
                        <Route id='bucket-browser' path='browse' element={<BrowserPage />} />
                        <Route id='bucket-browser' path='browse/*' element={<BrowserPage />} />
                      </Route>
                    </Route>

                    <Route path='*' element={<NotFoundErrorPage />} />
                  </Routes>

              </BucketContextProvider>
            </BrowserRouter>
          </AuthContextProvider>
        </SiteMetaContextProvider>
      </NotificationProvider>
    </EuiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
