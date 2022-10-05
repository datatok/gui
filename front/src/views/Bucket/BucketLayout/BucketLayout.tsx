import { EuiLoadingSpinner, EuiModal, EuiPageTemplate, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FC, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import BucketContextProvider from 'providers/Bucket';
import { BucketContext } from 'providers/Bucket/context';
import BrowserStateProvider from 'providers/Browser';
import { SiteContext } from 'providers/Site/context';

const BucketLayout: FC = () => {

  const [refreshBrowseFilesWorkflow, setRefreshBrowseFilesWorkflow] = useState({
    step: "start",
    message: ""
  })

  const onRefreshingWorkflowChange = (step: string, message: string) => {
    setRefreshBrowseFilesWorkflow({
      step,
      message
    })
  }

  const inner = 
    <BucketContext.Consumer>
      {({ current: bucket }) => (
        (bucket) ? (
        <EuiPageTemplate>
        <EuiPageTemplate.Sidebar css={{margin:0,padding:'5px'}}>
          <Sidebar />
        </EuiPageTemplate.Sidebar>
        <Header />
        <EuiPageTemplate.Section>
          {refreshBrowseFilesWorkflow.step === "loading" ? (
            <EuiText textAlign='center'>
              <EuiSpacer size='l' />
              <h2>Loading files</h2>
              <EuiSpacer size='m' />
              <EuiLoadingSpinner size='xxl' />
            <EuiSpacer size='l' />
          </EuiText>
          ) : <Outlet />}
        </EuiPageTemplate.Section>
      </EuiPageTemplate>
      ) : <></>
      )}
    </BucketContext.Consumer>
    

  return (
    <SiteContext.Consumer>
      {({ apiAccessToken }) => (
      <BucketContextProvider apiAccessToken={apiAccessToken}>
        <BucketContext.Consumer>
          {({ current: selectedBucket }) => (
          <BrowserStateProvider selectedBucket={selectedBucket} onRefreshingWorkflowChange={onRefreshingWorkflowChange}>
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