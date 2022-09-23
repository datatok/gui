import { EuiBasicTable, EuiButton, EuiConfirmModal, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import { Criteria, EuiTableSelectionType } from '@elastic/eui/src/components/basic_table';
import React, { FC, useContext, useRef, useState } from 'react';
import { BrowserContext } from 'store/browser/context';
import { GuiBrowserFile, GuiBrowserFileReadonly } from 'store/browser/types';
import { useSnapshot } from 'valtio';

interface GridProps {
  onDeleteItem: (item:GuiBrowserFile) => void
  onEditRenameItem: (item:GuiBrowserFile) => void
  onSelectionChange: (items:GuiBrowserFile[]) => void
}

const Grid: FC<GridProps> = ({onDeleteItem, onSelectionChange, onEditRenameItem}) => {

  const state = useContext(BrowserContext)
  const snap = useSnapshot(state)

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);

  const sorting: any = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const columns: any[] = [
    {
      field: 'name',
      name: 'name',
      sortable: true,
      truncateText: true,
    },
    {
      name: 'Actions',
      actions : [
        {
          name: 'Remove',
          description: 'Remove file',
          icon: 'trash',
          color: 'danger',
          type: 'icon',
          isPrimary: true,
          onClick: (item:GuiBrowserFile) => {
            onDeleteItem(item)
          },
          'data-test-subj': 'action-delete',
        },
        {
          name: 'Edit',
          isPrimary: true,
          description: 'Edit (rename, meta)',
          icon: 'pencil',
          type: 'icon',
          onClick: (item:GuiBrowserFile) => {
            onEditRenameItem(item)
          },
          'data-test-subj': 'action-edit',
        },
        {
          name: 'Share',
          isPrimary: true,
          description: 'Share this user',
          icon: 'share',
          type: 'icon',
          onClick: () => {},
          'data-test-subj': 'action-share',
        },
        {
          name: 'Elastic.co',
          description: 'Go to elastic.co',
          icon: 'logoElastic',
          type: 'icon',
          href: 'https://elastic.co',
          target: '_blank',
          'data-test-subj': 'action-outboundlink',
        },
      ]
    },
  ];

  const onTableChange = ({ sort }: any) => {
    const { field: sortField, direction: sortDirection } = sort;

    setSortField(sortField);
    setSortDirection(sortDirection);
  };

  const selection: EuiTableSelectionType<GuiBrowserFile> = {
    selectable: (n:any) => true,
    selectableMessage: (selectable:boolean, item:GuiBrowserFile) => "",
    onSelectionChange: (selectedItems: GuiBrowserFile[]) => {
      setSelectedItems(selectedItems);

      onSelectionChange(selectedItems)
    },
  };

  const items:GuiBrowserFileReadonly[] = (snap.current && snap.current.children) ? [...snap.current.children] : []

  return (
    <EuiBasicTable
    tableCaption="Folder children"
    items={items}
    itemId="path"
    columns={columns}
    sorting={sorting}
    onChange={onTableChange}
    isSelectable={true}
    selection={selection}
    />
  );
};

export default Grid;