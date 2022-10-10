import { EuiBasicTable, EuiIcon } from '@elastic/eui';
import { EuiTableSelectionType } from '@elastic/eui/src/components/basic_table';
import EuiCustomLink from 'components/EuiCustomLink';
import moment from 'moment';
import React, { FC, useRef, useState } from 'react';
import { Route } from 'services/routing';
import { GuiBrowserObject, GuiBucket } from 'types';
import { StringUtils } from 'utils/StringUtils';

interface GridProps {
  bucket: GuiBucket
  listObjects: GuiBrowserObject[]
  onDeleteItem: (item:GuiBrowserObject) => void
  onEditRenameItem: (item:GuiBrowserObject) => void
  onSelectionChange: (items:GuiBrowserObject[]) => void
}

const Grid: FC<GridProps> = ({bucket, listObjects, onDeleteItem, onSelectionChange, onEditRenameItem}) => {

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);

  const tableRef = useRef<EuiBasicTable>()

  const sorting: any = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  }

  const [refreshBrowseFilesWorkflow, setRefreshBrowseFilesWorkflow] = useState({
    step: "start",
    message: ""
  })

  const onRefreshingWorkflowChange = (step: string, message: string) => {
    setRefreshBrowseFilesWorkflow({
      step,
      message
    })
  }

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
      truncateText: false,
      width: '40%',
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
      field: 'size',
      name: 'size',
      sortable: true,
      render: (size: number) => size && StringUtils.formatBytes(size, 2)
    },
    {
      field: 'editDate',
      name: 'editDate',
      sortable: true,
      render: (date: string) => date && moment(date).fromNow()
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
          onClick: (item:GuiBrowserObject) => {
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
          onClick: (item:GuiBrowserObject) => {
            onEditRenameItem(item)
          },
          'data-test-subj': 'action-edit',
        },
      ]
    },
  ];

  const onTableChange = ({ sort }: any) => {
    const { field: sortField, direction: sortDirection } = sort;

    setSortField(sortField);
    setSortDirection(sortDirection);
  };

  const selection: EuiTableSelectionType<GuiBrowserObject> = {
    selectable: (n:any) => true,
    selectableMessage: (selectable:boolean, item:GuiBrowserObject) => "",
    onSelectionChange: (selectedItems: GuiBrowserObject[]) => {
      //setSelectedItems(selectedItems);

      onSelectionChange(selectedItems)
    },
  };

  return (
    <EuiBasicTable
      ref={tableRef}
      tableCaption="Folder children"
      items={listObjects}
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