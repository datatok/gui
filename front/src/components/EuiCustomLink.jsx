// File name: "EuiCustomLink.js".
import React from 'react';
import { EuiLink } from '@elastic/eui';
import { useNavigate, useHref } from 'react-router';
import { getRouteURL, useNavigateProps, useRoutingNavigate } from 'services/routing';



export default function EuiCustomLink({ to, toArgs, ...rest }) {
  const props = {...useNavigateProps({to, toArgs}), rest}
  
  return <EuiLink {...props} />;
}