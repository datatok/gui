import { EuiButton, EuiConfirmModal, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import React, { FC, useEffect, useState } from 'react';
import { GuiBrowserFile } from 'types';
import { addSiteToast, setSiteTitle } from 'providers/Site';
import DeleteConfirmModal from './DeleteConfirmModal';
import Grid from './Grid';
import RenameModal from './RenameModal';
import { browserStateActions, useBrowserStateSnapshot } from 'providers/Browser'
import TopBar from './TopBar';
import NewFolderModal from './NewFolderModal';
import DeleteObjectCommand from 'services/api/commands/DeleteObjectCommand';
import { CreateFolderCommand } from 'services/api';
import { BrowserUtils } from 'utils/BrowserUtils';
import { StringUtils } from 'utils/StringUtils';

let selectionFromSingle = false

const BrowserPage: FC = () => {

  const {
    currentNode: browseFile,
    currentFolderFiles: browseFiles,
    bucket
  } = useBrowserStateSnapshot()

  const [currentModal, setCurrentModal] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteAPIWorkflow, setDeleteAPIWorkflow] = useState({
    step: "",
    message: ""
  })

  useEffect(() => {
    setSiteTitle("Browse")
  })

  const onDeleteItemAskConfirmation = (file: GuiBrowserFile) => {
    setSelectedItems([file])
    setCurrentModal("delete-confirm")
    selectionFromSingle = true
  }

  const onEditRenameItemAsk = (file: GuiBrowserFile) => {
    setSelectedItems([file])
    setCurrentModal("edit-rename")
  }

  const onSelectionChange = (files: GuiBrowserFile[]) => {
    selectionFromSingle = false
    setSelectedItems(files)
  }

  const onNewFolderClick = (file?: GuiBrowserFile) => {
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

    CreateFolderCommand(bucket, StringUtils.pathJoin(formData.path, formData.name))
      .then(response => {
        setDeleteAPIWorkflow({ step: 'done', message: ''})
        closeModal()
      })
  }

  const doDeleteSelection = () => {
    setDeleteAPIWorkflow({ step: 'doing', message: ''})

    DeleteObjectCommand(bucket, selectedItems)
      .then(response => {
        
        selectedItems.forEach(file => {
          browserStateActions.deleteFile(file)
        })

        setDeleteAPIWorkflow({ step: 'done', message: ''})
        
        setSelectedItems([])
        
        addSiteToast({
          title: 'Success',
          color: 'success',
          iconType: 'help',
          text: "File deleted!",
        })
        console.log("ok")
      })
      .catch(err => {
        setDeleteAPIWorkflow({ step: 'error', message: err.message})
        addSiteToast({
            title: 'Oops, there was an error',
            color: 'danger',
            iconType: 'help',
            text: `${err.message}`,
        })
        console.log("error")
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
            bucket={bucket}
            selectedItem={browseFile}
            onConfirm={doCreateFolder}
            onCancel={closeModal} 
          />
        )
    }
    
  }

  

  return (
    <>
      <TopBar 
        bucket={bucket}
        browserFile={browseFile}
        onShowModal={onShowModal}
        selectedItems={selectedItems}
      />

      <EuiSpacer size="l" />

      <Grid
        bucket={bucket}
        browseFile={browseFile}
        browseFiles={browseFiles}
        onDeleteItem={onDeleteItemAskConfirmation} 
        onSelectionChange={onSelectionChange} 
        onEditRenameItem={onEditRenameItemAsk}
      />

      {modal}
    </>
  );
};

export default BrowserPage;