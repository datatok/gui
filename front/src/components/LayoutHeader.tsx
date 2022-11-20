import { EuiAvatar, EuiFlexGroup, EuiFlexItem, EuiHeader, EuiHeaderLogo, EuiHeaderSection, EuiHeaderSectionItem, EuiHeaderSectionItemButton, EuiPopover, EuiSpacer, EuiSwitch, EuiSwitchEvent, EuiText, useGeneratedHtmlId, EuiHeaderLink } from '@elastic/eui'
import { useNavigate } from 'react-router-dom'
import { useSiteMetaContext } from 'providers/SiteMetaContext'
import { useAuthContext } from 'providers/AuthContext'
import React, { FC, useMemo, useState } from 'react'
import { If, Then } from 'react-if'

import logoSVG from '../logo.svg'

interface UMProps {
  username: string
}

const HeaderUserMenu: FC<UMProps> = ({ username }: { username: string }) => {
  const headerUserPopoverId = useGeneratedHtmlId({
    prefix: 'headerUserPopover'
  })
  const [isOpen, setIsOpen] = useState(false)

  const onMenuButtonClick = (): void => {
    setIsOpen(!isOpen)
  }

  const closeMenu = (): void => {
    setIsOpen(false)
  }

  if (username !== '') {
    return (
      <EuiHeaderSectionItemButton>
        <EuiAvatar name="?" size="s" />
      </EuiHeaderSectionItemButton>
    )
  }

  const button = (
    <EuiHeaderLink
      aria-controls={headerUserPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={onMenuButtonClick}
    >
      <EuiAvatar name={username} size="s" />
    </EuiHeaderLink>
  )

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
            <EuiAvatar name={username} size="xl" />
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiText>
              <p>{username}</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </EuiPopover>
  )
}

const HeaderAboutMenu: FC = () => {
  const headerUserPopoverId = useGeneratedHtmlId({
    prefix: 'headerAboutPopover'
  })
  const [isOpen, setIsOpen] = useState(false)

  const onMenuButtonClick = (): void => {
    setIsOpen(!isOpen)
  }

  const closeMenu = (): void => {
    setIsOpen(false)
  }

  const button = (
    <EuiHeaderLink
      aria-controls={headerUserPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={onMenuButtonClick}
      iconType='help'
    >About</EuiHeaderLink>
  )

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
          <a href='https://github.com/datatok/gui' target={'_blank'} rel="noreferrer">https://github.com/datatok/gui</a>
          <h3>Tech stack</h3>
          <ul>
            <li>Front: React / elasticEUI</li>
            <li>Back: nestJS</li>
          </ul>

          <h3>Copyrights</h3>
          <ul>
            <li><a href="https://www.flaticon.com/free-icons/mistletoe" title="mistletoe icons" target={'_blank'} rel="noreferrer">Mistletoe icons created by Freepik - Flaticon</a></li>
          </ul>
        </EuiText>
      </div>
    </EuiPopover>
  )
}

interface SMProps {
  theme: string
  setTheme: (theme: string) => void
}

interface SwitchEvent extends EuiSwitchEvent {
  checked: boolean
}

const HeaderSettingsMenu: FC<SMProps> = ({ theme, setTheme }) => {
  const headerUserPopoverId = useGeneratedHtmlId({
    prefix: 'headerSettingsPopover'
  })
  const [isOpen, setIsOpen] = useState(false)

  const onMenuButtonClick = (): void => {
    setIsOpen(!isOpen)
  }

  const closeMenu = (): void => {
    setIsOpen(false)
  }

  const button = (
    <EuiHeaderLink
      aria-controls={headerUserPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={onMenuButtonClick}
      iconType='menu'
    >
      Settings
    </EuiHeaderLink>
  )

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
        <EuiSwitch
          showLabel={true}
          label="Dark theme"
          onChange={(event: SwitchEvent) => { setTheme(theme === 'dark' ? 'light' : 'dark') }}
          checked={theme === 'dark'}
        />
      </div>
    </EuiPopover>
  )
}

const LayoutHeader: FC = () => {
  /**
   * Hooks
   */
  const navigate = useNavigate()

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
  , [])

  const userMenu = useMemo(() =>
    <HeaderUserMenu username={authContext.username} />
  , [authContext.username])

  const aboutMenu = useMemo(() =>
    <HeaderAboutMenu />
  , [])

  const settingsMenu = <HeaderSettingsMenu
    theme={siteMetaContext.theme}
    setTheme={siteMetaContext.setTheme}
  />

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

      <EuiHeaderSection side="right">
        <EuiHeaderSectionItem>{settingsMenu}</EuiHeaderSectionItem>
        <EuiHeaderSectionItem>{aboutMenu}</EuiHeaderSectionItem>
        <EuiHeaderSectionItem>{userMenu}</EuiHeaderSectionItem>
        <If condition={authContext.apiAccessToken !== ''}>
          <Then>
            <EuiHeaderSectionItem>
              <EuiHeaderLink onClick={() => { authContext.logout(); navigate('/') }}>Log out</EuiHeaderLink>
            </EuiHeaderSectionItem>
          </Then>
        </If>
      </EuiHeaderSection>

    </EuiHeader>
  )
}

export default LayoutHeader
