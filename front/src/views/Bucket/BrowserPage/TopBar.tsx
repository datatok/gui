import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { getRouteURL, onClick, Route } from "services/routing"
import { GuiBrowserObject, GuiBucket } from "types"

interface TopBarProps {
  bucket: GuiBucket
  currentKey: string
  selectedItems: GuiBrowserObject[]
  onShowModal: (modal: string) => void
}

const TopBar: FC<TopBarProps> = ({bucket, currentKey, onShowModal, selectedItems}) => {
  const navigate = useNavigate();

  const getSideUploadButton = () => {
    const href = getRouteURL(Route.BucketUpload, {
      bucket: bucket.id,
      path: currentKey
    })
  
    return <EuiButton href={href} onClick={onClick(() => {
      navigate(href)
    })} key={'upload'} >Upload</EuiButton>
  }

  const getSideNewFolderButton = () => {  
    return <EuiButton onClick={() => onShowModal("new-folder")} key={'new-dir'} >New folder</EuiButton>
  }

  return (
    <EuiFlexGroup alignItems="center">
      <EuiFlexItem grow={false}>

      </EuiFlexItem>
      <EuiFlexItem>
        {getSideUploadButton()}
        {getSideNewFolderButton()}
        <EuiButton 
          color="danger"
          iconType="trash"
          disabled={selectedItems.length === 0}
          onClick={() => onShowModal("delete-confirm")}
        >
          Delete {selectedItems.length} Items
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default TopBar 