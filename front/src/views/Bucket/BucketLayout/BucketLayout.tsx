import { EuiLoadingSpinner, EuiModal, EuiPageTemplate, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FC, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';


import { BucketProvider, bucketActions, useBucketStateSnapshot } from 'providers/Bucket';
import { useSiteStateSnapshot } from 'providers/Site';
import { browserStateActions, BrowserStateProvider, useBrowserStateSnapshot } from 'providers/Browser';

const BucketLayout: FC = () => {

  const { 
    bucket: browserBucket,
    rootNode,
    currentNode,
  } = useBrowserStateSnapshot()

  const {
    current: bucket,
    buckets
  } = useBucketStateSnapshot()

  const {
    title: pageTitle
  } = useSiteStateSnapshot()

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

  const inner = (bucket) ? (
      <EuiPageTemplate>
        <EuiPageTemplate.Sidebar css={{margin:0,padding:'5px'}}>
          <Sidebar bucket={bucket} buckets={buckets} rootNode={rootNode} />
        </EuiPageTemplate.Sidebar>
        <Header bucket={bucket} browserFile={currentNode} pageTitle={pageTitle} />
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

  return (
    <BucketProvider>
      <BrowserStateProvider onRefreshingWorkflowChange={onRefreshingWorkflowChange}>
        {inner}
      </BrowserStateProvider>
    </BucketProvider>
  );
};

export default BucketLayout;