import { EuiSpacer } from '@elastic/eui';
import React, { FC, useEffect, useState } from 'react';
import { GuiBrowserObject, GuiBucket } from 'types';
import DeleteConfirmModal from './DeleteConfirmModal';
import Grid from './Grid';
import RenameModal from './RenameModal';
import TopBar from './TopBar';
import NewFolderModal from './NewFolderModal';
import DeleteObjectCommand from 'services/api/commands/DeleteObjectCommand';
import { CreateFolderCommand, useAPI } from 'services/api';
import { BrowserUtils } from 'utils/BrowserUtils';
import { StringUtils } from 'utils/StringUtils';
import { useSetSiteMetaTitle } from 'providers/site-meta.context';
import { useBrowserContext } from 'providers/Browser';
import { useBucketContext } from 'providers/Bucket';
import { useNotificationContext } from 'providers/notification.context';

let selectionFromSingle = false

const BrowserPage: FC = () => {

  /**
   * Contexts
   */
  const setSiteTitle = useSetSiteMetaTitle()
  
  const apiCreateFolder = useAPI(CreateFolderCommand)
  const apiDeleteObject = useAPI(DeleteObjectCommand)

  const { 
    refresh: browserRefreshObjects,
    currentKey: browserCurrentKey,
    objects: browserObjects
  } = useBrowserContext()

  const {
    current: selectedBucket
  } = useBucketContext()

  const {
    addSiteToast
  } = useNotificationContext()

  const browserSelectedObjectChildren = BrowserUtils.getObjectChildren(browserObjects, browserCurrentKey)

  /**
   * State
   */
  const [currentModal, setCurrentModal] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteAPIWorkflow, setDeleteAPIWorkflow] = useState({
    step: "",
    message: ""
  })

  useEffect(() => {
    setSiteTitle("Browse")
  }, [])

  if (typeof selectedBucket === 'undefined' || selectedBucket === null) {
    return <></>
  }

  const onDeleteItemAskConfirmation = (file: GuiBrowserObject) => {
    setSelectedItems([file])
    setCurrentModal("delete-confirm")
    selectionFromSingle = true
  }

  const onEditRenameItemAsk = (file: GuiBrowserObject) => {
    setSelectedItems([file])
    setCurrentModal("edit-rename")
  }

  const onSelectionChange = (files: GuiBrowserObject[]) => {
    selectionFromSingle = false
    setSelectedItems(files)
  }

  const onNewFolderClick = (file?: GuiBrowserObject) => {
    setCurrentModal("new-folder")
  }

  /** 
   * Delete stuff 
   */
  let modal;

  const onShowModal = (modal:string) => {
    setCurrentModal(modal)
  }

  const closeModal = () => {
    setCurrentModal("")

    if (selectionFromSingle) {
      setSelectedItems([])
    }
  }

  const doCreateFolder = (formData: any) => {
    setDeleteAPIWorkflow({ step: 'doing', message: ''})

    apiCreateFolder(selectedBucket, StringUtils.pathJoin(formData.path, formData.name))
      .then(response => {
        setDeleteAPIWorkflow({ step: 'done', message: ''})
        closeModal()
        browserRefreshObjects()
      })
  }

  const doDeleteSelection = () => {
    setDeleteAPIWorkflow({ step: 'doing', message: ''})

    apiDeleteObject(selectedBucket, selectedItems)
      .then(response => {
        
        setDeleteAPIWorkflow({ step: 'done', message: ''})
        
        setSelectedItems([])
        
        addSiteToast({
          title: 'Success',
          color: 'success',
          iconType: 'help',
          text: "File deleted!",
        })

        browserRefreshObjects()
      })
      .catch(err => {
        setDeleteAPIWorkflow({ step: 'error', message: err.message})
        addSiteToast({
            title: 'Oops, there was an error',
            color: 'danger',
            iconType: 'help',
            text: `${err.message}`,
        })
      })

    closeModal()
  }

  if (currentModal !== "") {
    switch (currentModal) {
      case "delete-confirm":
        modal = (
          <DeleteConfirmModal
            key={"delete-modal"}
            selectedItems={selectedItems}
            onConfirm={doDeleteSelection}
            onCancel={closeModal}
          />
        );
        break
      case "edit-rename":
        modal = (
          <RenameModal
            key={"rename-modal"}
            selectedItem={selectedItems[0]}
            onConfirm={doDeleteSelection}
            onCancel={closeModal} 
          />
        );
        break
      case "new-folder":
        modal = (
          <NewFolderModal
            key={"new-folder-modal"}
            bucket={selectedBucket}
            targetKey={browserCurrentKey}
            onConfirm={doCreateFolder}
            onCancel={closeModal} 
          />
        )
    }
    
  }

  return (
    <>
      <TopBar 
        bucket={selectedBucket}
        currentKey={browserCurrentKey}
        onShowModal={onShowModal}
        onRefresh={browserRefreshObjects}
        selectedItems={selectedItems}
      />

      <EuiSpacer size="l" />

      <Grid
        bucket={selectedBucket}
        listObjects={browserSelectedObjectChildren}
        onDeleteItem={onDeleteItemAskConfirmation} 
        onSelectionChange={onSelectionChange} 
        onEditRenameItem={onEditRenameItemAsk}
      />

      {modal}
    </>
  );
};

export default BrowserPage;