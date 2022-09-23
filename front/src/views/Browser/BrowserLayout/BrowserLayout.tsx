import { EuiPageTemplate } from '@elastic/eui';
import React, { FC, createContext, useContext, useRef  } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BrowserPage from '../BrowserPage/BrowserPage';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import UploadPage from '../UploadPage/UploadPage';

import { BrowserContext, state, actions } from 'store/browser/context';


const BrowserLayout: FC = () => {

  let routerLocation = useLocation();

  React.useEffect(() => {
    const route = routerLocation.pathname
    const routeComponent = route.substring("/browse/".length)

    actions.setCurrentByPath(routeComponent)
  }, [routerLocation]);

  return (
    <BrowserContext.Provider value={state}>
      <EuiPageTemplate>
        <EuiPageTemplate.Sidebar>
          <Sidebar />
        </EuiPageTemplate.Sidebar>
          <Header />
          <EuiPageTemplate.Section>
            <Routes>
              <Route path='upload' element={<UploadPage />} />
              <Route path='*' element={<BrowserPage />} />
            </Routes>
          </EuiPageTemplate.Section>
      </EuiPageTemplate>
    </BrowserContext.Provider>
  );
};

export default BrowserLayout;