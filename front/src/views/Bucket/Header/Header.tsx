import { EuiButton, EuiPageTemplate } from '@elastic/eui';
import React, { FC, ReactNode } from 'react';
import { useNavigateProps, Route, onClick, getRouteURL } from 'services/routing';
import { GuiBrowserObject } from 'types';
import EuiCustomLink from 'components/EuiCustomLink';
import { GuiBucket } from 'types';
import { useNavigate } from 'react-router-dom';
import { BrowserContext } from 'providers/Browser/context';
import { SiteContext } from 'providers/Site/context';
import { BrowserUtils } from 'utils/BrowserUtils';

const Header = () => {

  const navigate = useNavigate();

  const getBreadcrumbs = (selectedBucket: GuiBucket, currentKey: string) => {

    if (!selectedBucket || !currentKey) {
      return []
    }

    const fileToBreadcrumbItem = (file: GuiBrowserObject) => {
      const href = getRouteURL(Route.BucketBrowse, {
        bucket: selectedBucket.id,
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

    const keyParts = BrowserUtils.splitKeyPrefixes(currentKey)

    const breadcrumbs = [
      fileToBreadcrumbItem({
        name: 'root',
        prefix: "",
        path: "",
        type: "folder",
      }),
      ...keyParts.map(key => fileToBreadcrumbItem({
        ...BrowserUtils.extractNamePrefix(key),
        type: 'folder'
      }))
    ]

    return breadcrumbs
  }

  return (
    <BrowserContext.Consumer>
    {({bucket: selectedBucket, currentKey}) => (
      <SiteContext.Consumer>
        {({title}) => (
          <EuiPageTemplate.Header 
            breadcrumbs={getBreadcrumbs(selectedBucket, currentKey)}
            pageTitle={title}
          />
      )}
      </SiteContext.Consumer>
    )}
    </BrowserContext.Consumer>
  );
};

export default Header;