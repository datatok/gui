import { EuiPageTemplate } from '@elastic/eui'
import { useSiteMetaContext } from 'providers/SiteMetaContext'
import React, { FC } from 'react'

const Header: FC = () => {
  /**
   * Contexts
   */
  const siteMetaContext = useSiteMetaContext()

  return (
    <EuiPageTemplate.Header
      breadcrumbs={siteMetaContext.breadcrumbs}
    />
  )
}

export default Header
