import { BrowserContext } from "providers/Browser/context"
import { SiteContext } from "providers/Site/context"
import BrowserPage from "./BrowserPage"

const Debug = ({bucket, currentNode}) => {
  console.log(bucket, currentNode)

  return <></>
}

const BrowserPageWrapper = () => {
  return (
    <SiteContext.Consumer>
      {({ setTitle, addSiteToast }) => (
        <BrowserContext.Consumer>
        {({ bucket, currentNode }) => (
          (currentNode) ? 
          <BrowserPage 
            setSiteTitle={setTitle}
            addSiteToast={addSiteToast}
            selectedBucket={bucket}
            selectedBrowsingObject={currentNode}
            deleteObjects={() => {}}
          />
          :
          <></>
        )}
      </BrowserContext.Consumer>
    )}
    </SiteContext.Consumer>
  )
}

export default BrowserPageWrapper