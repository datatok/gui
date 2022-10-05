import { EuiButton, EuiPageTemplate } from '@elastic/eui';
import React, { FC, ReactNode } from 'react';
import { useNavigateProps, Route, onClick, getRouteURL } from 'services/routing';
import { GuiBrowserFile } from 'types';
import EuiCustomLink from 'components/EuiCustomLink';
import { GuiBucket } from 'types';
import { useNavigate } from 'react-router-dom';
import { BrowserContext } from 'providers/Browser/context';
import { SiteContext } from 'providers/Site/context';

const Header = () => {

  const navigate = useNavigate();

  const getBreadcrumbs = (selectedBucket: GuiBucket, selectedObject: GuiBrowserFile) => {

    if (!selectedBucket || !selectedObject) {
      return []
    }

    const breadcrumbs = []

    const fileToBreadcrumbItem = (file: GuiBrowserFile) => {
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

    if (selectedObject) {
      for (let it:GuiBrowserFile|undefined = selectedObject; typeof it !== "undefined"; it = it.parent) {
        breadcrumbs.push(fileToBreadcrumbItem(it))
      }
    }

    breadcrumbs.push(fileToBreadcrumbItem({
      name: selectedBucket.name,
      prefix: "",
      path: "",
      type: "folder",
    }))

    breadcrumbs.reverse()

    return breadcrumbs
  }

  return (
    <BrowserContext.Consumer>
    {({bucket: selectedBucket, currentNode: selectedObject}) => (
      <SiteContext.Consumer>
        {({title}) => (
          <EuiPageTemplate.Header 
            breadcrumbs={getBreadcrumbs(selectedBucket, selectedObject)}
            pageTitle={title}
          />
      )}
      </SiteContext.Consumer>
    )}
    </BrowserContext.Consumer>
  );
};

export default Header;