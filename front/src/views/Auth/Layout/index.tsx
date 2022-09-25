import React, { FC } from 'react';
import {
  EuiPageTemplate,
  EuiButton,
  EuiTitle,
  EuiLink,
  EuiImage,
  EuiListGroup,
  EuiListGroupItemProps,
} from '@elastic/eui';
import { Outlet } from 'react-router-dom';

const AuthLayout: FC = () => {

    return (
      <EuiPageTemplate minHeight="0" panelled={true} restrictWidth={'75%'}>
        <EuiPageTemplate.Header pageTitle="Authentication">
        </EuiPageTemplate.Header>
        <Outlet />
      </EuiPageTemplate>
    )

}

export default AuthLayout