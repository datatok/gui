import { EuiLoadingSpinner, EuiModal, EuiPageTemplate, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FC, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import BucketContextProvider from 'providers/Bucket';
import { BucketContext } from 'providers/Bucket/context';
import BrowserStateProvider from 'providers/Browser';
import { SiteContext } from 'providers/Site/context';
import { Fallback, If, Then } from 'react-if';

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
    <SiteContext.Consumer>
      {({ apiAccessToken }) => (
      <BucketContextProvider apiAccessToken={apiAccessToken}>
        <BucketContext.Consumer>
          {({ current: selectedBucket }) => (
          <BrowserStateProvider selectedBucket={selectedBucket}>
            {inner}
          </BrowserStateProvider>
          )}
        </BucketContext.Consumer>
      </BucketContextProvider>
      )}
    </SiteContext.Consumer>
  );
};

export default BucketLayout;