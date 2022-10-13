import { EuiLoadingSpinner, EuiModal, EuiPageTemplate, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FC, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import BucketContextProvider from 'providers/BucketContext';
import { BucketContext } from 'providers/BucketContext';
import BrowserStateProvider, { BrowserContext } from 'providers/BucketBrowserContext';
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
    <BucketContext.Consumer>
      {({ current: selectedBucket }) => (
        <If condition={selectedBucket && selectedBucket !== null}>
          <Then>
            <BrowserStateProvider selectedBucket={selectedBucket}>
              <BrowserContext.Consumer>
              {({ bucket, currentKey }) => (
                <If condition={bucket && bucket !== null && currentKey !== null}>
                  <Then>
                    {inner}
                  </Then>
                </If>
              )}
              </BrowserContext.Consumer>
            </BrowserStateProvider>
          </Then>
        </If>
      
      )}
    </BucketContext.Consumer>
  );
};

export default BucketLayout;