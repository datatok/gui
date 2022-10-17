import BucketSelect from 'components/BucketSelect'
import FilesTreeView from 'components/FilesTreeView'
import { BucketContext } from 'providers/BucketContext'
import { BrowserContext } from 'providers/BucketBrowserContext'
import { EuiSpacer } from '@elastic/eui'

function Sidebar () {
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
          <FilesTreeView bucket={bucket} objectItems={objects} objectSelectedKey={currentKey} />
        )}
      </BrowserContext.Consumer>
    </>
  )
}

export default Sidebar
