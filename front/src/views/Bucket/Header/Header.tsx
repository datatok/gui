import { EuiPageTemplate } from '@elastic/eui'
import { useSiteMetaContext } from 'providers/SiteMetaContext'

function Header () {
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
