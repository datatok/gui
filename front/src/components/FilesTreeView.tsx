import { EuiIcon, EuiTreeView } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC, useEffect, useRef } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { GuiBrowserObject, GuiBucket, GuiBrowserObjectNode, GuiObjects } from 'types';
import { BrowserUtils } from 'utils/BrowserUtils';
import * as R from 'ramda'

interface FilesTreeViewProps {
  objectItems: GuiObjects 
  objectSelectedKey: string
  bucket: GuiBucket
}

const FilesTreeView: FC<FilesTreeViewProps> = ({ bucket, objectItems, objectSelectedKey }) => {

  const navigate = useRoutingNavigate()

  const $treeView = useRef<EuiTreeView>()

  const rootNode = BrowserUtils.getHierarchy(objectItems)

  /**
   * Recursive function to transform API file to UI node.
   */
  const fileToTreeNode = (node: GuiBrowserObjectNode): Node => {
    const r:Node = {
      id: node.path,
      label: node.name || 'root',
      isExpanded: true,
      icon: <EuiIcon type="folderClosed" />,
      iconWhenExpanded: <EuiIcon type="folderOpen" />,
      callback: (): string => {

        navigate(Route.BucketBrowse, {
          bucket: bucket.id,
          path: node.path,
        })

        return ""
      },
      
    }

    if (node.children) {
      return {
        ...r,
        children: Object.values(node.children).map( (v: GuiBrowserObjectNode) => fileToTreeNode(v) )
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