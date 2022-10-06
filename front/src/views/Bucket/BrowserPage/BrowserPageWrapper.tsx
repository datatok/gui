import { BrowserContext } from "providers/Browser/context"
import { SiteContext } from "providers/Site/context"
import { BrowserUtils } from "utils/BrowserUtils"
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
        {({ bucket, objects, currentKey }) => (
          (currentKey) ? 
          <BrowserPage 
            setSiteTitle={setTitle}
            addSiteToast={addSiteToast}
            selectedBucket={bucket}
            browserCurrentKey={currentKey}
            browserSelectedObjectChildren={BrowserUtils.getObjectChildren(objects, currentKey)}
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