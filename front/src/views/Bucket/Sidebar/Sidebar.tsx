import { EuiPageTemplate, EuiTreeView } from '@elastic/eui';
import { Node } from '@elastic/eui/src/components/tree_view/tree_view';
import React, { FC } from 'react';
import { GuiBrowserFile } from 'types';
import BucketSelect from 'components/BucketSelect';
import { Route, useRoutingNavigate } from 'services/routing';
import { GuiBucket } from 'types';

interface SidebarProps {
  bucket: GuiBucket
  buckets: GuiBucket[]
  browserItems: GuiBrowserFile[]
}

const Sidebar: FC<SidebarProps> = ({ bucket, buckets, browserItems }) => {

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
    <>
      <BucketSelect bucket={bucket} buckets={buckets} />
      <EuiTreeView items={treeItems} aria-label="files" showExpansionArrows={true} />
    </>
  );
};

export default Sidebar;