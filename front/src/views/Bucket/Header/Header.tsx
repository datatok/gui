import { EuiButton, EuiPageTemplate } from '@elastic/eui';
import React, { FC, ReactNode } from 'react';
import { useNavigateProps, Route, onClick, getRouteURL } from 'services/routing';
import { GuiBrowserFile } from 'types';
import EuiCustomLink from 'components/EuiCustomLink';
import { GuiBucket } from 'types';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  browserFile?: GuiBrowserFile
  bucket: GuiBucket
  pageTitle: string
}

const Header: FC<HeaderProps> = ({browserFile, bucket, pageTitle}) => {

  const navigate = useNavigate();

  const breadcrumbs = []
  const fileToBreadcrumbItem = (file: GuiBrowserFile) => {
    const href = getRouteURL(Route.BucketBrowse, {
      bucket: bucket.id,
      path: file.path
    })

    const text = (file.name === '' ? 'root' : file.name)

    return {
      text,
      href,
      onClick: onClick(() => {
        navigate(href)
      })
    }
  }

  if (browserFile) {
    for (let it:GuiBrowserFile|undefined = browserFile; typeof it !== "undefined"; it = it.parent) {
      breadcrumbs.push(fileToBreadcrumbItem(it))
    }
  }

  breadcrumbs.push(fileToBreadcrumbItem({
    name: bucket.name,
    prefix: "",
    path: "",
    type: "folder",
  }))

  breadcrumbs.reverse()

  return (
    <EuiPageTemplate.Header 
      breadcrumbs={breadcrumbs}
      pageTitle={pageTitle}
    />
  );
};

export default Header;