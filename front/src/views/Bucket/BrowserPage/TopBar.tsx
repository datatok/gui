import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { getRouteURL, onClick, Route } from "services/routing"
import { GuiBrowserObject, GuiBucket, ObjectItemAction } from "types"

interface TopBarProps {
  bucket: GuiBucket
  currentKey: string
  selectedItems: GuiBrowserObject[]
  onItemAction: (action: ObjectItemAction) => void
  onRefresh: () => void
}

const TopBar: FC<TopBarProps> = ({bucket, currentKey, onItemAction, onRefresh, selectedItems}) => {
  const navigate = useNavigate();

  const getSideUploadButton = () => {
    const href = getRouteURL(Route.BucketUpload, {
      bucket: bucket.id,
      path: currentKey
    })
  
    return <EuiButton fill iconType={'exportAction'} href={href} onClick={onClick(() => {
      navigate(href)
    })} key={'upload'} >Upload</EuiButton>
  }

  const getSideNewFolderButton = () => {  
    return <EuiButton iconType={'plus'} onClick={() => onItemAction(ObjectItemAction.NewFolder)} key={'new-dir'} >New folder</EuiButton>
  }

  const refreshButton = () => {
    return <EuiButton onClick={() => onRefresh()} key={'refresh'} iconType={'refresh'}>Refresh</EuiButton>
  }

  return (
    <EuiFlexGroup alignItems="center">
      <EuiFlexItem>

      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFlexGroup wrap gutterSize="s" alignItems="center">
          <EuiFlexItem  grow={false}>
            {refreshButton()}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            {getSideUploadButton()}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            {getSideNewFolderButton()}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton 
              color="danger"
              iconType="trash"
              disabled={selectedItems.length === 0}
              onClick={() => onItemAction(ObjectItemAction.Delete)}
            >
              Delete {selectedItems.length} Items
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default TopBar 