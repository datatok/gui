import { EuiIcon } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { GuiBrowserObject, GuiBucket, GuiBrowserObjectNode, GuiObjects } from 'types';
import { BrowserUtils } from 'utils/BrowserUtils';
import * as R from 'ramda'
import { EuiTreeView } from './MyEuiTreeView';

interface FilesTreeViewProps {
  objectItems: GuiObjects 
  objectSelectedKey: string
  bucket: GuiBucket
}

const FilesTreeView: FC<FilesTreeViewProps> = ({ bucket, objectItems, objectSelectedKey }) => {

  const navigate = useRoutingNavigate()

  const $treeView = useRef<EuiTreeView>()

  const rootNode = useMemo(() => BrowserUtils.getHierarchy(objectItems), [objectItems])

  const pathParts = useMemo(() => ['', ...BrowserUtils.splitKeyPrefixes(objectSelectedKey)], [objectSelectedKey])

  /**
   * Recursive function to transform API file to UI node.
   */
  const fileToTreeNode = (node: GuiBrowserObjectNode): Node => {
    const r:Node = {
      id: node.path,
      label: node.name || 'root',
      isExpanded: R.indexOf(node.path, pathParts) !== -1,
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
        children: 
          Object.values(node.children)
          .sort( (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
          .map( (v: GuiBrowserObjectNode) => fileToTreeNode(v) )
      }
    }

    return r
  }

  const treeItems:Node[] = [
    fileToTreeNode(rootNode)
  ]

  const openItems = pathParts
  
  return (
    <EuiTreeView items={treeItems} aria-label="files" 
      ref={$treeView}
      openItems={openItems}
      activeItem={objectSelectedKey}
      display="compressed"
      showExpansionArrows
    />
  )
}

export default FilesTreeView