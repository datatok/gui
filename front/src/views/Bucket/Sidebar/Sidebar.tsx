import BucketSelect from 'components/BucketSelect';
import FilesTreeView from 'components/FilesTreeView';
import { BucketContext } from 'providers/BucketContext';
import { BrowserContext } from 'providers/BucketBrowserContext'

const Sidebar = () => {
  return (
    <>
      <BucketContext.Consumer>
        {({ buckets, current: bucket }) => (
          <BucketSelect bucket={bucket} buckets={buckets} />
        )}
      </BucketContext.Consumer>
      <BrowserContext.Consumer>
        {({ bucket, objects, currentKey }) => (
          (objects && currentKey !== null) ? <FilesTreeView bucket={bucket} objectItems={objects} objectSelectedKey={currentKey} /> : <></>
        )}
      </BrowserContext.Consumer>
    </>
  )
}

export default Sidebar