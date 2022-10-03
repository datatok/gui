// File name: "EuiCustomLink.js".
import React from 'react';
import { EuiLink } from '@elastic/eui';
import { useNavigateProps } from 'services/routing';

export default function EuiCustomLink({to, toArgs, ...rest }) {
  const props = {...useNavigateProps(to, toArgs), ...rest}
  
  return <EuiLink {...props} />;
}