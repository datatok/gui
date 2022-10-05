import BucketSelect from 'components/BucketSelect';
import FilesTreeView from 'components/FilesTreeView';
import { BucketContext } from 'providers/Bucket/context';
import { BrowserContext } from 'providers/Browser/context';

const Sidebar = () => {
  return (
    <BucketContext.Consumer>
      {({ buckets, current: bucket }) => (
        <BrowserContext.Consumer>
        {({ rootNode }) => (
        <>
          <BucketSelect bucket={bucket} buckets={buckets} />
          {rootNode ? <FilesTreeView bucket={bucket} rootNode={rootNode} /> : <></>}
        </>
        )}
        </BrowserContext.Consumer>
      )}
    </BucketContext.Consumer>
  )
}

export default Sidebar