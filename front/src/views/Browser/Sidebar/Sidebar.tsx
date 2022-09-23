import { EuiPageTemplate, EuiTreeView } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC, useContext, useRef } from 'react';
import { useNavigate, useHref } from 'react-router';
import { useSnapshot } from 'valtio';
import { BrowserContext } from '../../../store/browser/context';
import { GuiBrowserFile } from '../../../store/browser/types';
import BrowserLayout from '../BrowserLayout/BrowserLayout';

interface SidebarProps {
  
}

const Sidebar: FC<SidebarProps> = () => {

  const state = useContext(BrowserContext)
  const items = state.items

  const navigate = useNavigate()

  /**
   * Recursive function to transform API file to UI node.
   */
  const fileToTreeNode = (f: GuiBrowserFile): Node => {
    const r:Node = {
      id: f.name,
      label: f.name,
      callback: (): string => {
        navigate(`/browse/${f.path}`)
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

  const treeItems:Node[] = items.map(i => {
    return fileToTreeNode(i)
  })

  return (
    <EuiTreeView items={treeItems} aria-label="files" showExpansionArrows={true} />
  );
};

export default Sidebar;