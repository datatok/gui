import { EuiPageTemplate, EuiTreeView } from '@elastic/eui';

import React, { FC } from 'react';
import { GuiBrowserFile } from 'types';
import BucketSelect from 'components/BucketSelect';
import { GuiBucket } from 'types';
import FilesTreeView from 'components/FilesTreeView';

interface SidebarProps {
  bucket: GuiBucket
  buckets: GuiBucket[]
  browserItems: GuiBrowserFile[]
}

const Sidebar: FC<SidebarProps> = ({ bucket, buckets, browserItems }) => {
  return (
    <>
      <BucketSelect bucket={bucket} buckets={buckets} />
      {browserItems ? <FilesTreeView bucket={bucket} browserItems={browserItems} /> : <></>}
    </>
  );
};

export default Sidebar;