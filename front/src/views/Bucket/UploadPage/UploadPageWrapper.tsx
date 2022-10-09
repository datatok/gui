import { BrowserContext } from "providers/Browser/context"
import { SiteContext } from "providers/Site/context"
import UploadPage from "./UploadPage"
import BrowserPage from "./UploadPage"

const UploadPageWrapper = () => {
  return (
      <BrowserContext.Consumer>
      {({ bucket, currentKey }) => (
        bucket ?
        <UploadPage 
          selectedBucket={bucket}
          targetKey={currentKey}
        />
        : <></>
      )}
      </BrowserContext.Consumer>
  )
}

export default UploadPageWrapper