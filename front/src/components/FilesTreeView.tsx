import { EuiIcon, EuiTreeView } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC, useEffect, useRef } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { GuiBrowserObject, GuiBucket, GuiBrowserObjectNode } from 'types';

interface FilesTreeViewProps {
  rootNode: GuiBrowserObjectNode
  bucket: GuiBucket
}

const FilesTreeView: FC<FilesTreeViewProps> = ({ bucket, rootNode }) => {

  const navigate = useRoutingNavigate()

  const $treeView = useRef<EuiTreeView>()

  /**
   * Recursive function to transform API file to UI node.
   */
  const fileToTreeNode = (node: GuiBrowserObjectNode): Node => {
    const f = node.object
    const r:Node = {
      id: f.path,
      label: f.name || 'root',
      isExpanded: true,
      icon: <EuiIcon type="folderClosed" />,
      iconWhenExpanded: <EuiIcon type="folderOpen" />,
      callback: (): string => {

        navigate(Route.BucketBrowse, {
          bucket: bucket.id,
          path: f.path,
        })

        return ""
      },
      
    }

    if (node.children) {
      const folders = node.children.filter(node => {
        return node.object.path && node.object.type === 'folder'
      })
      if (folders.length > 0) {
        return {
          ...r,
          children: folders
            .map(ff => { return fileToTreeNode(ff) })
        }
      }
    }

    return r
  }

  const treeItems:Node[] = [
    fileToTreeNode(rootNode)
  ]

  React.useEffect(() => {
      $treeView.current.setState({
        openItems: ['']
      })
  }, [treeItems])
  
  return (
    <EuiTreeView items={treeItems} aria-label="files" 
      ref={$treeView}
      display="compressed"
      expandByDefault
      showExpansionArrows
    />
  )
}

export default FilesTreeView