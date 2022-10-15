import { EuiPageTemplate } from '@elastic/eui';
import { useSiteMetaContext } from 'providers/SiteMetaContext';

const Header = () => {

  /**
   * Contexts
   */
  const siteMetaContext = useSiteMetaContext()

  return (
    <EuiPageTemplate.Header 
      breadcrumbs={siteMetaContext.breadcrumbs}
    />
  );
};

export default Header;