import BucketSelect from 'components/BucketSelect';
import FilesTreeView from 'components/FilesTreeView';
import { BucketContext } from 'providers/Bucket/context';
import { BrowserContext } from 'providers/Browser/context';
import { BrowserUtils } from 'utils/BrowserUtils';

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
          (objects && currentKey) ? <FilesTreeView bucket={bucket} rootNode={BrowserUtils.getHierarchy(objects, currentKey)} /> : <></>
        )}
      </BrowserContext.Consumer>
    </>
  )
}

export default Sidebar