import { EuiButton, EuiConfirmModal, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import React, { FC, useContext, useState } from 'react';
import { BrowserContext } from 'store/browser/context';
import { GuiBrowserFile } from 'store/browser/types';
import { useSnapshot } from 'valtio';
import DeleteConfirmModal from './DeleteConfirmModal';
import Grid from './Grid';
import RenameModal from './RenameModal';

let selectionFromSingle = false

const BrowserPage: FC = () => {

  const [currentModal, setCurrentModal] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);


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

  /** 
   * Delete stuff 
   */
  let modal;

  const showDeleteConfirm = () => {
    setCurrentModal("delete-confirm")
  }

  const closeModal = () => {
    setCurrentModal("")

    if (selectionFromSingle) {
      setSelectedItems([])
    }
  }

  const doDeleteSelection = () => {
    closeModal()
  }

  if (currentModal !== "") {
    switch (currentModal) {
      case "delete-confirm":
        modal = (
          <DeleteConfirmModal 
            selectedItems={selectedItems} 
            onConfirm={doDeleteSelection}
            onCancel={closeModal} 
          />
        );
        break
      case "edit-rename":
        modal = (
          <RenameModal 
            selectedItem={selectedItems[0]} 
            onConfirm={doDeleteSelection}
            onCancel={closeModal} 
          />
        );
    }
    
  }

  return (
    <>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>

        </EuiFlexItem>
        <EuiFlexItem />
        <EuiButton color="danger" iconType="trash" disabled={selectedItems.length === 0} onClick={showDeleteConfirm}>
          Delete {selectedItems.length} Items
        </EuiButton>
      </EuiFlexGroup>

      <EuiSpacer size="l" />

      <Grid 
        onDeleteItem={onDeleteItemAskConfirmation} 
        onSelectionChange={onSelectionChange} 
        onEditRenameItem={onEditRenameItemAsk}
      />

      {modal}
    </>
  );
};

export default BrowserPage;