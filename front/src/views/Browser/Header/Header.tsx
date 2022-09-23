import { EuiButton, EuiLink, EuiPageTemplate } from '@elastic/eui';
import React, { FC, ReactNode, useContext } from 'react';
import { GuiBrowserFile } from 'store/browser/types';
import { useSnapshot } from 'valtio';
import EuiCustomLink from '../../../components/EuiCustomLink';
import { BrowserContext } from '../../../store/browser/context';

interface HeaderProps {
  
}

const Header: FC<HeaderProps> = () => {

  const state = useContext(BrowserContext)
  const snap = useSnapshot(state)

  const sideItems:ReactNode = [
    <EuiCustomLink to={"/browse/upload"} key={'upload'} >Upload</EuiCustomLink>
  ]

  const breadcrumbs = []

  if (state.current) {
    for (let it:GuiBrowserFile|undefined = state.current; typeof it !== "undefined"; it = it.parent) {
      breadcrumbs.push({
        text: it.name || ""
      })
    }

    breadcrumbs.reverse()
  }


  return (
    <EuiPageTemplate.Header 
      breadcrumbs={breadcrumbs}
      rightSideItems={[sideItems]}
    />
  );
};

export default Header;