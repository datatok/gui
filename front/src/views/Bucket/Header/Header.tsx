import { EuiButton, EuiPageTemplate } from '@elastic/eui';
import React, { FC, ReactNode } from 'react';
import { useNavigateProps, Route, onClick, getRouteURL } from 'services/routing';
import { GuiBrowserObject } from 'types';
import EuiCustomLink from 'components/EuiCustomLink';
import { GuiBucket } from 'types';
import { useNavigate } from 'react-router-dom';
import { BrowserContext } from 'providers/Browser/context';
import { BrowserUtils } from 'utils/BrowserUtils';
import { useSiteMetaContext } from 'providers/site-meta.context';
import { useAuthContext } from 'providers/auth.context';

const Header = () => {

  /**
   * Hooks
   */
  const navigate = useNavigate();

  /**
   * Contexts
   */
  const { title: siteMetaTitle } = useSiteMetaContext()
  const { logout } = useAuthContext()

  const getBreadcrumbs = (selectedBucket: GuiBucket, currentKey: string) => {

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

    

    const breadcrumbs = [
      {
        text: 'Buckets',
        href: '/bucket',
        onClick: onClick(() => {
          navigate('/bucket')
        })
      }
    ]

    if (selectedBucket) {
      breadcrumbs.push(fileToBreadcrumbItem({
        name: selectedBucket.name,
        prefix: "",
        path: "",
        type: "folder",
      }))

      if (currentKey) {
        const keyParts = BrowserUtils.splitKeyPrefixes(currentKey)

        keyParts.filter(key => key).forEach(key => {
          breadcrumbs.push(fileToBreadcrumbItem({
            ...BrowserUtils.extractNamePrefix(key),
            type: 'folder'
          }))
        })
      }
    }

    return breadcrumbs
  }

  return (
    <BrowserContext.Consumer>
    {({bucket: selectedBucket, currentKey}) => (
      <EuiPageTemplate.Header 
        breadcrumbs={getBreadcrumbs(selectedBucket, currentKey)}
        pageTitle={siteMetaTitle}
        rightSideItems={[
          <EuiButton onClick={() => { logout(); navigate('/'); }}>Logout</EuiButton>
        ]}
      />
    )}
    </BrowserContext.Consumer>
  );
};

export default Header;