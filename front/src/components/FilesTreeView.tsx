import { EuiIcon, EuiTreeView } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC, useEffect, useRef } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { GuiBrowserFile, GuiBucket } from 'types';

interface FilesTreeViewProps {
  rootNode: GuiBrowserFile
  bucket: GuiBucket
}

const FilesTreeView: FC<FilesTreeViewProps> = ({ bucket, rootNode }) => {

  const navigate = useRoutingNavigate()

  const $treeView = useRef<EuiTreeView>()

  /**
   * Recursive function to transform API file to UI node.
   */
  const fileToTreeNode = (f: GuiBrowserFile): Node => {
    const r:Node = {
      id: f.path || 'root',
      label: f.name || 'root',
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

    if (f.children) {
      const folders = f.children.filter(f => f.type === 'folder')
      if (folders.length > 0) {
        return {
          ...r,
          children: f.children
            .filter(f => f.type === 'folder')
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
        openItems: ['root']
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