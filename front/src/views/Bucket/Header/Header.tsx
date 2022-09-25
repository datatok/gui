import { EuiPageTemplate } from '@elastic/eui';
import React, { FC, ReactNode } from 'react';
import { Route } from 'services/routing';
import { GuiBrowserFile } from 'types';
import EuiCustomLink from 'components/EuiCustomLink';
import { GuiBucket } from 'types';

interface HeaderProps {
  browserFile?: GuiBrowserFile
  bucket: GuiBucket
  pageTitle: string
}

const Header: FC<HeaderProps> = ({browserFile, bucket, pageTitle}) => {

  const sideItems:ReactNode = [
    <EuiCustomLink to={Route.BucketUpload} toArgs={{bucket: bucket.id}} key={'upload'} >Upload</EuiCustomLink>
  ]

  const breadcrumbs = []

  if (browserFile) {
    for (let it:GuiBrowserFile|undefined = browserFile; typeof it !== "undefined"; it = it.parent) {
      breadcrumbs.push({
        text: it.name || ""
      })
    }
  }

  breadcrumbs.push({
    text: bucket.name
  })

  breadcrumbs.reverse()

  return (
    <EuiPageTemplate.Header 
      breadcrumbs={breadcrumbs}
      pageTitle={pageTitle}
      rightSideItems={[sideItems]}
    />
  );
};

export default Header;