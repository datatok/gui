import { EuiAvatar, EuiButton, EuiButtonEmpty, EuiFlexGroup, EuiFlexItem, EuiHeader, EuiHeaderLogo, EuiHeaderSection, EuiHeaderSectionItem, EuiHeaderSectionItemButton, EuiIcon, EuiLink, EuiPageTemplate, EuiPopover, EuiSpacer, EuiText, useGeneratedHtmlId } from '@elastic/eui';
import { useNavigate } from 'react-router-dom';
import { useSiteMetaContext } from 'providers/SiteMetaContext';
import { useAuthContext } from 'providers/AuthContext';
import { useMemo, useState } from 'react';
import { If, Then } from 'react-if';

import logoSVG from '../logo.svg'

const HeaderUserMenu = () => {
  const headerUserPopoverId = useGeneratedHtmlId({
    prefix: 'headerUserPopover',
  });
  const [isOpen, setIsOpen] = useState(false);

  const onMenuButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const button = (
    <EuiHeaderSectionItemButton
      aria-controls={headerUserPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={onMenuButtonClick}
    >
      <EuiAvatar name="John Username" size="s" />
    </EuiHeaderSectionItemButton>
  );

  return (
    <EuiPopover
      id={headerUserPopoverId}
      button={button}
      isOpen={isOpen}
      anchorPosition="downRight"
      closePopover={closeMenu}
      panelPaddingSize="none"
    >
      <div style={{ width: 320 }}>
        <EuiFlexGroup
          gutterSize="m"
          className="euiHeaderProfile"
          responsive={false}
        >
          <EuiFlexItem grow={false}>
            <EuiAvatar name="John Username" size="xl" />
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiText>
              <p>John Username</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </EuiPopover>
  );
};


const HeaderAboutMenu = () => {
  const headerUserPopoverId = useGeneratedHtmlId({
    prefix: 'headerAboutPopover',
  });
  const [isOpen, setIsOpen] = useState(false);

  const onMenuButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const button = (
    <EuiButtonEmpty
      aria-controls={headerUserPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={onMenuButtonClick}
      iconType='help'
    >
    </EuiButtonEmpty>
  );

  return (
    <EuiPopover
      id={headerUserPopoverId}
      button={button}
      isOpen={isOpen}
      anchorPosition="downRight"
      closePopover={closeMenu}
      panelPaddingSize="none"
    >
      <div style={{ width: 320, padding: '20px' }}>
        <EuiText textAlign='center'>
          <EuiAvatar imageUrl={logoSVG} name='gui' size='xl' color="plain" />
        </EuiText>
        <EuiSpacer />
        <EuiText>
        <h3>Tech stack</h3>
        <ul>
          <li>Front: React / elasticEUI</li>
          <li>Back: nestJS</li>
        </ul>

        <h3>Copyrights</h3>
        <ul>
          <li><a href="https://www.flaticon.com/free-icons/mistletoe" title="mistletoe icons">Mistletoe icons created by Freepik - Flaticon</a></li>
        </ul>
        </EuiText>
      </div>
    </EuiPopover>
  );
};

const LayoutHeader = () => {

  /**
   * Hooks
   */
  const navigate = useNavigate();

  /**
   * Contexts
   */
  const siteMetaContext = useSiteMetaContext()
  const authContext = useAuthContext()

  const logo = useMemo(() => 
    <EuiHeaderLogo
      iconType={logoSVG}
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-label="Go to home page"
    />
  , []);

  const userMenu = useMemo(() =>
    <HeaderUserMenu />
  , []);

  const aboutMenu = useMemo(() => 
    <HeaderAboutMenu />
  , [])

  return (
    <EuiHeader
      title={siteMetaContext.title}
      position={'fixed'}
    >
      <EuiHeaderSection grow={false}>
        <EuiHeaderSectionItem border="right">
          {logo}
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem>
          GUI / {siteMetaContext.title}
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      <If condition={authContext.apiAccessToken !== ''}>
        <Then>
          <EuiHeaderSection side="right">
            <EuiHeaderSectionItem>{aboutMenu}</EuiHeaderSectionItem>
            <EuiHeaderSectionItem>{userMenu}</EuiHeaderSectionItem>
            <EuiHeaderSectionItem>
              <EuiLink onClick={() => { authContext.logout(); navigate('/')}}>Log out</EuiLink>
            </EuiHeaderSectionItem>
          </EuiHeaderSection>
        </Then>
      </If>
    </EuiHeader>
  );
};

export default LayoutHeader;