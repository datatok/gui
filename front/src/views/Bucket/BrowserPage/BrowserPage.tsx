import { EuiSpacer } from '@elastic/eui';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { GuiBrowserObject, GuiBucket, ObjectItemAction } from 'types';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import Grid from './Grid';
import RenameModal from './modals/MoveModal';
import TopBar from './TopBar';
import NewFolderModal from './modals/NewFolderModal';
import { BrowserUtils } from 'utils/BrowserUtils';
import { useSetSiteMetaTitle } from 'providers/SiteMetaContext';
import { useBrowserContext } from 'providers/BucketBrowserContext';
import { useBucketContext } from 'providers/BucketContext';
import { If, Then } from 'react-if';
import CopyModal from './modals/CopyModal';

let selectionFromSingle = false

const BrowserPage: FC = () => {

  /**
   * Contexts
   */
  const setSiteTitle = useSetSiteMetaTitle()
  
  const { 
    refresh: browserRefreshObjects,
    currentKey: browserCurrentKey,
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

  const browserSelectedObjectChildren = BrowserUtils.getObjectChildren(browserObjects, browserCurrentKey)

  /**
   * State
   */
  const [currentModal, setCurrentModal] = useState(ModalType.None);
  const [selectedItems, setSelectedItems] = useState([]);
  
  useEffect(() => {
    setSiteTitle("Browse")
  }, [])

  const getModal = useCallback( (modal: ModalType) => {
    switch (modal) {
      case ModalType.Delete:
        return (
          <DeleteConfirmModal
            key={"delete-modal"}
            bucket={selectedBucket}
            selectedItems={selectedItems}
            onClose={closeModal}
          />
        )
      case ModalType.Move:
        return (
          <RenameModal
            key={"rename-modal"}
            bucket={selectedBucket}
            selectedItem={selectedItems[0]}
            onClose={closeModal} 
          />
        )
      case ModalType.Copy:
        return (
          <CopyModal
            key={"copy-modal"}
            bucket={selectedBucket}
            selectedItem={selectedItems[0]}
            onClose={closeModal} 
          />
        )
      case ModalType.NewFolder:
        return (
          <NewFolderModal
            key={"new-folder-modal"}
            bucket={selectedBucket}
            targetKey={browserCurrentKey}
            onClose={closeModal} 
          />
        )
    }
  }, [selectedBucket, browserCurrentKey, selectedItems])

  if (typeof selectedBucket === 'undefined' || selectedBucket === null) {
    return <></>
  }

  const onItemAction = (action: ObjectItemAction, item?: GuiBrowserObject) => {
    const actionToModal = {
      [ObjectItemAction.Delete]: ModalType.Delete,
      [ObjectItemAction.Copy]: ModalType.Copy,
      [ObjectItemAction.Download]: ModalType.Delete,
      [ObjectItemAction.NewFolder]: ModalType.NewFolder,
      [ObjectItemAction.Move]: ModalType.Move,
      [ObjectItemAction.Share]: ModalType.Delete,
    }
    
    setCurrentModal(actionToModal[action])

    if (item) {
      setSelectedItems([item])
      selectionFromSingle = true
    }
  }

  const onSelectionChange = (files: GuiBrowserObject[]) => {
    selectionFromSingle = false
    setSelectedItems(files)
  }

  const closeModal = () => {
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
        currentKey={browserCurrentKey}
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
  );
};

export default BrowserPage;