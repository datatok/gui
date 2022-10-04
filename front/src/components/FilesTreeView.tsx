import { EuiTreeView } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { GuiBrowserFile, GuiBucket } from 'types';

interface FilesTreeViewProps {
  rootNode: GuiBrowserFile
  bucket: GuiBucket
}

const FilesTreeView: FC<FilesTreeViewProps> = ({ bucket, rootNode }) => {

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
        children: f.children
          .filter(f => f.type === 'folder')
          .map(ff => { return fileToTreeNode(ff) })
      }
    }

    return r
  }

  const treeItems:Node[] = [
    fileToTreeNode(rootNode)
  ]
  
  return (
    <EuiTreeView items={treeItems} aria-label="files" showExpansionArrows={true} />
  )
}

export default FilesTreeView