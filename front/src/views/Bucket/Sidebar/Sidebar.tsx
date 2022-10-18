import React, { FC } from 'react'
import BucketSelect from 'components/BucketSelect'
import FilesTreeView from 'components/FilesTreeView'
import { BucketContext } from 'providers/BucketContext'
import { BrowserContext } from 'providers/BucketBrowserContext'
import { EuiSpacer } from '@elastic/eui'

const Sidebar: FC = () => {
  return (
    <>
      <BucketContext.Consumer>
        {({ buckets, current: bucket }) => (
          <BucketSelect bucket={bucket} buckets={buckets} />
        )}
      </BucketContext.Consumer>
      <EuiSpacer />
      <BrowserContext.Consumer>
        {({ bucket, objects, currentKey }) => (
          bucket === null ? <></> : <FilesTreeView bucket={bucket} objectItems={objects} objectSelectedKey={currentKey} />
        )}
      </BrowserContext.Consumer>
    </>
  )
}

export default Sidebar
