import { EuiPageTemplate } from '@elastic/eui'
import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import { useBucketContext } from 'providers/BucketContext'
import BrowserStateProvider, { BrowserContext } from 'providers/BucketBrowserContext'
import { If, Then } from 'react-if'

const BucketLayout: FC = () => {
  const bucketContext = useBucketContext()
  const bucket = bucketContext.current

  if (bucket === null) {
    return <></>
  }

  const inner =
    <EuiPageTemplate>
      <EuiPageTemplate.Sidebar css={{ margin: 0, padding: '5px' }}>
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

  return (
    <BrowserStateProvider selectedBucket={bucket}>
      <BrowserContext.Consumer>
        {({ bucket, currentKey }) => (
          <If condition={bucket !== null && currentKey !== null}>
            <Then>
              {inner}
            </Then>
          </If>
        )}
      </BrowserContext.Consumer>
    </BrowserStateProvider>
  )
}

export default BucketLayout
