import { EuiBasicTable, EuiIcon, EuiLink } from '@elastic/eui'
import { EuiTableSelectionType } from '@elastic/eui/src/components/basic_table'
import moment from 'moment'
import React, { FC, useState } from 'react'
import { Route, useNavigateProps } from 'services/routing'
import { GuiBrowserObject, GuiBucket, ObjectItemAction } from 'types'
import { StringUtils } from 'utils/StringUtils'

interface GridProps {
  bucket: GuiBucket
  listObjects: GuiBrowserObject[]
  onItemAction: (action: ObjectItemAction, item: GuiBrowserObject) => void
  onSelectionChange: (items: GuiBrowserObject[]) => void
}

const Grid: FC<GridProps> = ({ bucket, listObjects, onItemAction, onSelectionChange }) => {
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const navProps = useNavigateProps()

  const sorting: any = {
    sort: {
      field: sortField,
      direction: sortDirection
    }
  }

  const resolveIcon = ({ type }): string => {
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
      width: '50%',
      render: (name, { downloadLink, path, type }) => {
        let np
        if (type === 'file') {
          np = { href: downloadLink }
        } else {
          np = navProps(Route.BucketBrowse, { bucket: bucket.id, path })
        }
        return (
          <>
          <EuiIcon type={resolveIcon({ type })} />&nbsp;
          <EuiLink {...np}>
           {name}
          </EuiLink>
          </>
        )
      },
      footer: ({ items }: { items: GuiBucket[] }) => (
        `${items.length} files`
      )
    },
    {
      field: 'size',
      name: 'size',
      sortable: true,
      render: (size: number) => size === undefined ? '' : StringUtils.formatBytes(size, 2),
      footer: ({ items }: { items: GuiBucket[] }) => {
        const s = items.reduce((result: number, current: any) => {
          return result + ((current.size ?? 0) as number)
        }, 0)

        return s > 0 ? StringUtils.formatBytes(s, 2) : ''
      }
    },
    {
      field: 'editDate',
      name: 'editDate',
      sortable: true,
      render: (date: string) => {
        if (date !== undefined && date !== '') {
          return moment(date).fromNow()
        }
        return ''
      }
    },
    {
      name: 'Actions',
      actions: [
        {
          name: 'Remove',
          description: 'Remove file',
          icon: 'trash',
          color: 'danger',
          type: 'icon',
          isPrimary: true,
          enabled: ({ verbs }: GuiBrowserObject) => {
            return verbs.includes('delete')
          },
          onClick: (item: GuiBrowserObject) => {
            onItemAction(ObjectItemAction.Delete, item)
          },
          'data-test-subj': 'action-delete'
        },
        {
          name: 'Move',
          isPrimary: true,
          description: 'Edit (rename, meta)',
          icon: 'pencil',
          type: 'icon',
          enabled: ({ verbs }: GuiBrowserObject) => {
            return verbs.includes('edit')
          },
          onClick: (item: GuiBrowserObject) => {
            onItemAction(ObjectItemAction.Move, item)
          },
          'data-test-subj': 'action-edit'
        },
        {
          name: 'Copy',
          isPrimary: true,
          description: 'Full copy',
          icon: 'copy',
          type: 'icon',
          enabled: ({ verbs }: GuiBrowserObject) => {
            return verbs.includes('edit')
          },
          onClick: (item: GuiBrowserObject) => {
            onItemAction(ObjectItemAction.Copy, item)
          },
          'data-test-subj': 'action-copy'
        }
      ]
    }
  ]

  const onTableChange = ({ sort }: any): void => {
    const { field: sortField, direction: sortDirection } = sort

    setSortField(sortField)
    setSortDirection(sortDirection)
  }

  const selection: EuiTableSelectionType<GuiBrowserObject> = {
    selectable: (n: any) => true,
    selectableMessage: (selectable: boolean, item: GuiBrowserObject) => '',
    onSelectionChange: (selectedItems: GuiBrowserObject[]) => {
      // setSelectedItems(selectedItems);
      const deletableItems = selectedItems.filter(i => i.verbs.includes('delete'))

      onSelectionChange(deletableItems)
    }
  }

  return (
    <EuiBasicTable
      tableCaption="Folder children"
      items={listObjects}
      itemId="path"
      columns={columns}
      sorting={sorting}
      onChange={onTableChange}
      isSelectable={true}
      selection={selection}
    />
  )
}

export default Grid
