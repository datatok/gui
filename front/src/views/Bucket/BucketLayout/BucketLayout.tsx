import { EuiPageTemplate } from '@elastic/eui';
import React, { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';


import { BucketProvider, bucketActions, useBucketStateSnapshot } from 'providers/Bucket';
import { useSiteStateSnapshot } from 'providers/Site';
import { browserStateActions, BrowserStateProvider, useBrowserStateSnapshot } from 'providers/Browser';

const BucketLayout: FC = () => {

  let routeParams = useParams()

  const { 
    bucket: browserBucket,
    items: browserItems,
    current: browserSelectedFile
  } = useBrowserStateSnapshot()

  const {
    current: bucket,
    buckets
  } = useBucketStateSnapshot()

  const {
    title: pageTitle
  } = useSiteStateSnapshot()

  React.useEffect(() => {
    if (browserBucket?.id !== bucket?.id) {
      browserStateActions.setBucket(bucket)


    }
  }, [bucket])

  React.useEffect(() => {
    const params = routeParams

    const paramBrowsePath: string | undefined = params['*']
    const URLBucketID: string | undefined = params.bucket

    if (URLBucketID) {
      bucketActions.setCurrentByID(URLBucketID)
    }

    if (paramBrowsePath) {
      browserStateActions.setCurrentByPath(paramBrowsePath)
    } else {
      browserStateActions.setCurrentByPath('/')
    }
  }, [routeParams]);

  if (bucket && browserBucket) {
    return (
      <BucketProvider>
        <BrowserStateProvider>
          <EuiPageTemplate>
            <EuiPageTemplate.Sidebar css={{margin:0,padding:'5px'}}>
              <Sidebar bucket={bucket} buckets={buckets} browserItems={browserItems} />
            </EuiPageTemplate.Sidebar>
              <Header bucket={bucket} browserFile={browserSelectedFile} pageTitle={pageTitle} />
              <EuiPageTemplate.Section>
                <Outlet />
              </EuiPageTemplate.Section>
          </EuiPageTemplate>
        </BrowserStateProvider>
      </BucketProvider>
    );
  }

  return <></>
};

export default BucketLayout;