import { EuiTreeView } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { GuiBrowserFile, GuiBucket } from 'types';

interface FilesTreeViewProps {
  browserItems: GuiBrowserFile[]
  bucket: GuiBucket
}

const FilesTreeView: FC<FilesTreeViewProps> = ({ bucket, browserItems }) => {

  const navigate = useRoutingNavigate()

  /**
   * Recursive function to transform API file to UI node.
   */
  const fileToTreeNode = (f: GuiBrowserFile): Node => {
    const r:Node = {
      id: f.name,
      label: f.name,
      callback: (): string => {

        navigate(Route.BucketBrowse, {
          bucket: bucket.id,
          path: f.path,
        })

        return ""
      },
      
    }

    if (f.children) {
      return {
        ...r,
        children: f.children.map(ff => { return fileToTreeNode(ff) })
      }
    }

    return r
  }

  const treeItems:Node[] = browserItems.map(i => {
    return fileToTreeNode(i)
  })

  return (
    <EuiTreeView items={treeItems} aria-label="files" showExpansionArrows={true} />
  )
}

export default FilesTreeView