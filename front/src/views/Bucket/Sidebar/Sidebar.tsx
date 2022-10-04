import { EuiPageTemplate, EuiTreeView } from '@elastic/eui';

import React, { FC } from 'react';
import { GuiBrowserFile } from 'types';
import BucketSelect from 'components/BucketSelect';
import { GuiBucket } from 'types';
import FilesTreeView from 'components/FilesTreeView';

interface SidebarProps {
  bucket: GuiBucket
  buckets: GuiBucket[]
  rootNode: GuiBrowserFile
}

const Sidebar: FC<SidebarProps> = ({ bucket, buckets, rootNode }) => {
  return (
    <>
      <BucketSelect bucket={bucket} buckets={buckets} />
      {rootNode ? <FilesTreeView bucket={bucket} rootNode={rootNode} /> : <></>}
    </>
  );
};

export default Sidebar;