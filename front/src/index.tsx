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
  EuiPageTemplate, EuiProvider
} from '@elastic/eui'

import AnonymousLoginPage from 'views/Auth/AnonymousPage'
import ProtectedRoute from 'components/ProtectedRoute'
import BucketContextProvider from 'providers/BucketContext'
import HomePage from 'views/Bucket/HomePage/HomePage'
import DetailsPage from 'views/Bucket/DetailsPage/DetailsPage'
import { SiteContext, SiteMetaContextProvider } from 'providers/SiteMetaContext'
import { AuthContext, AuthContextProvider } from 'providers/AuthContext'
import BrowserPage from 'views/Bucket/BrowserPage/BrowserPage'
import UploadPage from 'views/Bucket/UploadPage/UploadPage'
import LayoutHeader from 'components/LayoutHeader'
import { ConfigContextProvider } from 'providers/ConfigContext'
import { NotificationToasts } from 'components/NotificationToasts'

ReactDOM.render(
  <React.StrictMode>
    <ConfigContextProvider>
      <SiteMetaContextProvider>
        <SiteContext.Consumer>
          {({ theme }) => (
            <EuiProvider colorMode={theme === 'dark' ? 'DARK' : 'LIGHT'}>
              <AuthContextProvider>
                <BrowserRouter>

                  <LayoutHeader />

                  <Routes>

                    <Route
                      path=""
                      element={(
                        <AuthContext.Consumer>
                          {({ apiAccessToken }) => (
                            apiAccessToken !== ''
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
                          element={<DetailsPage />}
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
              <NotificationToasts />
            </EuiProvider>
          )}
      </SiteContext.Consumer>
      </SiteMetaContextProvider>
    </ConfigContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
