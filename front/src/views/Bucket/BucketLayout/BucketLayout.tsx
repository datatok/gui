import { EuiLoadingSpinner, EuiModal, EuiPageTemplate, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FC, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import BucketContextProvider from 'providers/BucketContext';
import { BucketContext } from 'providers/BucketContext';
import BrowserStateProvider from 'providers/BucketBrowserContext';
import { Else, Fallback, If, Then } from 'react-if';

const BucketLayout: FC = () => {

  const inner = 
    <BucketContext.Consumer>
      {({ current: bucket }) => (
        <EuiPageTemplate>
          <EuiPageTemplate.Sidebar css={{margin:0,padding:'5px'}}>
          <If condition={bucket !== null}>
            <Then>
              <Sidebar />
            </Then>
          </If>
          </EuiPageTemplate.Sidebar>
        <Header />
        <EuiPageTemplate.Section>
          <Outlet />
        </EuiPageTemplate.Section>
      </EuiPageTemplate>
      )}
    </BucketContext.Consumer>
    

  return (
    <BucketContextProvider>
      <BucketContext.Consumer>
        {({ current: selectedBucket }) => (
          <If condition={selectedBucket !== null}>
            <Then>
              <BrowserStateProvider selectedBucket={selectedBucket}>
                {inner}
              </BrowserStateProvider>
            </Then>
            <Else>
              <>{inner}</>
            </Else>
          </If>
        
        )}
      </BucketContext.Consumer>
    </BucketContextProvider>
  );
};

export default BucketLayout;