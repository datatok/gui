import { BrowserContext } from "providers/Browser/context"
import { SiteContext } from "providers/Site/context"
import BrowserPage from "./UploadPage"

const UploadPageWrapper = () => {
  return (
    <SiteContext.Consumer>
    {({ setTitle }) => (
      <BrowserContext.Consumer>
      {({ bucket, currentNode }) => (
        <BrowserPage 
          selectedBucket={bucket}
          selectedObject={currentNode}
          setSiteTitle={setTitle}
        />
      )}
      </BrowserContext.Consumer>
    )}
    </SiteContext.Consumer>
  )
}

export default UploadPageWrapper