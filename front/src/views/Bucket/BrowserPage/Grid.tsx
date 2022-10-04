import { EuiBasicTable, EuiIcon } from '@elastic/eui';
import { EuiTableSelectionType } from '@elastic/eui/src/components/basic_table';
import EuiCustomLink from 'components/EuiCustomLink';
import React, { FC, useRef, useState } from 'react';
import { Route } from 'services/routing';
import { GuiBrowserFile, GuiBucket } from 'types';

interface GridProps {
  bucket: GuiBucket,
  browseFile: GuiBrowserFile
  browseFiles: GuiBrowserFile[]
  onDeleteItem: (item:GuiBrowserFile) => void
  onEditRenameItem: (item:GuiBrowserFile) => void
  onSelectionChange: (items:GuiBrowserFile[]) => void
}

const Grid: FC<GridProps> = ({bucket, browseFile, browseFiles, onDeleteItem, onSelectionChange, onEditRenameItem}) => {

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);

  const tableRef = useRef<EuiBasicTable>()

  const sorting: any = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const resolveIcon = ({name, type}) => {

    if (type === 'file') {
      return 'document'
    }

    return 'folderClosed'
  }

  const columns: any[] = [
    {
      field: 'name',
      name: 'name',
      sortable: true,
      truncateText: true,
      render: (name, {path, type}) => {
        return (
          <>
          <EuiIcon type={resolveIcon({name, type})} />&nbsp;
          <EuiCustomLink to={Route.BucketBrowse} toArgs={{bucket: bucket.id, path}}>
           {name}
          </EuiCustomLink>
          </>
        )
      }
    },
    {
      field: 'type',
      name: 'type',
      sortable: true,
    },
    {
      field: 'size',
      name: 'size',
      sortable: true,
    },
    {
      field: 'editDate',
      name: 'editDate',
      sortable: true,
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
      //setSelectedItems(selectedItems);
      console.log(selectedItems)

      onSelectionChange(selectedItems)
    },
  };

  return (
    <EuiBasicTable
      ref={tableRef}
      tableCaption="Folder children"
      items={browseFiles}
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