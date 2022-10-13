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

const LoginPage: FC = () => {

  const authLinks:EuiListGroupItemProps[] = [
    {
      label: 'Gitlab Oauth',
      href: '/auth/gitlab',
      iconType: 'link',
      size: 's',
    },
    {
      label: 'Name and password',
      href: '/auth/name-password',
      iconType: 'link',
      size: 's',
    },
    {
      label: 'Anonymous',
      href: '/auth/anonymous',
      iconType: 'glasses',
      size: 's',
    },
  ]

  return (
    <EuiPageTemplate.EmptyPrompt
      title={<h2>Login to GUI</h2>}
      color="plain"
      layout="horizontal"
      body={
        <>
          <p>
            Please select an authentication method:
          </p>
        </>
      }
      actions={
        <EuiListGroup listItems={authLinks} />
      }
    />
  );
};

export default LoginPage;