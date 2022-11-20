import { EuiSpacer } from '@elastic/eui'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { GuiBrowserObject, ObjectItemAction } from 'types'
import DeleteConfirmModal from './modals/DeleteConfirmModal'
import Grid from './Grid'
import RenameModal from './modals/MoveModal'
import TopBar from './TopBar'
import NewFolderModal from './modals/NewFolderModal'
import { BrowserUtils } from 'utils/BrowserUtils'
import { useSetSiteMetaTitle } from 'providers/SiteMetaContext'
import { useBrowserContext } from 'providers/BucketBrowserContext'
import { useBucketContext } from 'providers/BucketContext'
import { If, Then } from 'react-if'
import CopyModal from './modals/CopyModal'

let selectionFromSingle = false

const BrowserPage: FC = () => {
  /**
   * Contexts
   */
  const setSiteTitle = useSetSiteMetaTitle()

  const {
    refresh: browserRefreshObjects,
    currentNode,
    objects: browserObjects
  } = useBrowserContext()

  const {
    current: selectedBucket
  } = useBucketContext()

  enum ModalType {
    None = 1,
    Delete,
    Move,
    Copy,
    NewFolder,
  }

  const browserSelectedObjectChildren = BrowserUtils.getObjectChildren(browserObjects, currentNode?.path)

  /**
   * State
   */
  const [currentModal, setCurrentModal] = useState(ModalType.None)
  const [selectedItems, setSelectedItems] = useState<GuiBrowserObject[]>([])

  useEffect(() => {
    setSiteTitle('Browse')
  }, [setSiteTitle])

  const getModal = useCallback((modal: ModalType) => {
    if (selectedBucket === null) {
      return <></>
    }

    switch (modal) {
      case ModalType.Delete:
        return (
          <DeleteConfirmModal
            key={'delete-modal'}
            bucket={selectedBucket}
            selectedItems={selectedItems}
            onClose={closeModal}
          />
        )
      case ModalType.Move:
        return (
          <RenameModal
            key={'rename-modal'}
            bucket={selectedBucket}
            selectedItem={selectedItems[0]}
            onClose={closeModal}
          />
        )
      case ModalType.Copy:
        return (
          <CopyModal
            key={'copy-modal'}
            bucket={selectedBucket}
            selectedItem={selectedItems[0]}
            onClose={closeModal}
          />
        )
      case ModalType.NewFolder:
        return (
          <NewFolderModal
            key={'new-folder-modal'}
            bucket={selectedBucket}
            targetKey={currentNode.path}
            onClose={closeModal}
          />
        )
    }
  }, [selectedBucket, currentNode.path, selectedItems])

  if (typeof selectedBucket === 'undefined' || selectedBucket === null) {
    return <></>
  }

  const onItemAction = (action: ObjectItemAction, item?: GuiBrowserObject): void => {
    const actionToModal = {
      [ObjectItemAction.Delete]: ModalType.Delete,
      [ObjectItemAction.Copy]: ModalType.Copy,
      [ObjectItemAction.NewFolder]: ModalType.NewFolder,
      [ObjectItemAction.Move]: ModalType.Move,
      [ObjectItemAction.Share]: ModalType.Delete
    }

    if (action !== ObjectItemAction.Download) {
      setCurrentModal(actionToModal[action])

      if (typeof item !== 'undefined') {
        setSelectedItems([item])
        selectionFromSingle = true
      }
    }
  }

  const onSelectionChange = (files: GuiBrowserObject[]): void => {
    selectionFromSingle = false
    setSelectedItems(files)
  }

  const closeModal = (): void => {
    setCurrentModal(ModalType.None)

    if (selectionFromSingle) {
      setSelectedItems([])
    }

    browserRefreshObjects()
  }

  return (
    <>
      <TopBar
        bucket={selectedBucket}
        currentNode={currentNode}
        onItemAction={onItemAction}
        onRefresh={browserRefreshObjects}
        selectedItems={selectedItems}
      />

      <EuiSpacer size="l" />

      <Grid
        bucket={selectedBucket}
        listObjects={browserSelectedObjectChildren}
        onSelectionChange={onSelectionChange}
        onItemAction={onItemAction}
      />

      <If condition={currentModal !== ModalType.None}>
        <Then>
          {getModal(currentModal)}
        </Then>
      </If>
    </>
  )
}

export default BrowserPage
