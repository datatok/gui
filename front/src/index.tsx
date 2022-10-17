import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {
  Route,
  BrowserRouter,
  Routes,
  Navigate,
  Outlet
} from 'react-router-dom'
import BucketLayout from 'views/Bucket/BucketLayout/BucketLayout'
import LoginPage from 'views/Auth/Login/LoginPage/LoginPage'
import NotFoundErrorPage from 'views/Error/ErrorPage/NotFoundErrorPage'
import {
  EuiGlobalToastList, EuiHeader, EuiPageTemplate, EuiProvider
} from '@elastic/eui'

// import '@elastic/eui/dist/eui_theme_light.css';
import '@elastic/eui/dist/eui_theme_dark.css'

import AnonymousLoginPage from 'views/Auth/AnonymousPage'
import HomeLayout from 'views/Home/Layout'
import ProtectedRoute from 'components/ProtectedRoute'
import BucketContextProvider, { BucketContext } from 'providers/BucketContext'
import HomePage from 'views/Bucket/HomePage/HomePage'
import DetailsPage from 'views/Bucket/DetailsPage/DetailsPage'
import { If, Then } from 'react-if'
import { SiteMetaContextProvider } from 'providers/SiteMetaContext'
import { AuthContext, AuthContextProvider } from 'providers/AuthContext'
import BrowserPage from 'views/Bucket/BrowserPage/BrowserPage'
import { NotificationProvider } from 'providers/NotificationContext'
import UploadPage from 'views/Bucket/UploadPage/UploadPage'
import Header from 'views/Bucket/Header/Header'
import Sidebar from 'views/Bucket/Sidebar/Sidebar'
import LayoutHeader from 'components/LayoutHeader'
import { ConfigContextProvider } from 'providers/ConfigContext'

ReactDOM.render(
  <React.StrictMode>
    <ConfigContextProvider>
      <EuiProvider colorMode="DARK">
        <NotificationProvider>
          <SiteMetaContextProvider>
            <AuthContextProvider>
              <BrowserRouter>

                <LayoutHeader />

                <Routes>

                  <Route
                    path=""
                    element={(
                      <AuthContext.Consumer>
                        {({ apiAccessToken }) => (
                          apiAccessToken
                            ? <Navigate to="/bucket" replace />
                            : <Navigate to="/auth" replace />
                        )}
                      </AuthContext.Consumer>
                    )}
                  />

                  <Route
                    path="auth"
                    element={(
                      <EuiPageTemplate>
                        <EuiPageTemplate.Section>
                        <Outlet />
                      </EuiPageTemplate.Section>
                      </EuiPageTemplate>
                    )}
                  >
                    <Route path="" element={<LoginPage />} />
                    <Route path="anonymous" element={<AnonymousLoginPage />} />
                    <Route path="*" />
                  </Route>

                  <Route
                    path="bucket"
                    element={(
                      <ProtectedRoute>
                        <BucketContextProvider>
                        <Outlet />
                      </BucketContextProvider>
                      </ProtectedRoute>
                    )}
                  >

                    <Route
                      path=""
                      element={(
                        <ProtectedRoute>
                        <EuiPageTemplate>
                          <EuiPageTemplate.Section>
                            <HomePage />
                          </EuiPageTemplate.Section>
                        </EuiPageTemplate>

                      </ProtectedRoute>
                      )}
                    />

                    <Route path=":bucket" element={<BucketLayout />}>
                      <Route
                        path=""
                        element={(
                        <BucketContext.Consumer>
                          {({ current }) => (
                            <If condition={current !== null}>
                              <Then>
                                <DetailsPage bucket={current} />
                              </Then>
                            </If>
                          )}
                        </BucketContext.Consumer>
                        )}
                      />
                      <Route path="upload" element={<UploadPage />} />
                      <Route path="upload/*" element={<UploadPage />} />
                      <Route id="bucket-browser" path="browse" element={<BrowserPage />} />
                      <Route id="bucket-browser" path="browse/*" element={<BrowserPage />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFoundErrorPage />} />
                </Routes>

              </BrowserRouter>
            </AuthContextProvider>
          </SiteMetaContextProvider>
        </NotificationProvider>
      </EuiProvider>
    </ConfigContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
