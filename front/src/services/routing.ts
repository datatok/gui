import { NavigateOptions, useHref, useNavigate } from "react-router-dom"

export enum Route {
  Home = 1,
  BucketHome,
  BucketBrowse,
  BucketUpload,
  AuthAnonymous,
  AuthHome,
}

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const isLeftClickEvent = (event) => event.button === 0;

const isTargetBlank = (event) => {
  const target = event.target.getAttribute('target');
  return target && target !== '_self';
};

export const getRouteURL = (route: Route, args?: {[key:string]: string}): string => {
  switch(route) {
    case Route.Home:
      return `/`
    case Route.BucketHome:
      return `/bucket/${args.bucket}`
    case Route.BucketBrowse:
      return `/bucket/${args.bucket}/browse/${args.path}`
    case Route.BucketUpload:
      if (args.path) {
        return `/bucket/${args.bucket}/upload/${args.path}`
      }

      return `/bucket/${args.bucket}/upload`
    case Route.AuthAnonymous:
      return `/auth/anonymous`
    case Route.AuthHome:
      return `/auth`
  }

  return '/404'
}

export const useRoutingNavigate = () => {
  const navigate = useNavigate()

  return (route: Route, args?: {[key:string]: string}, options?: NavigateOptions) => {
    const URL = getRouteURL(route, args)

    navigate(URL, options)  
  }
}

//  navigate(to, toArgs);
export const onClick = (targetFct) => (event) => {
  if (event.defaultPrevented) {
    return;
  }

  // Let the browser handle links that open new tabs/windows
  if (isModifiedEvent(event) || !isLeftClickEvent(event) || isTargetBlank(event)) {
    return;
  }

  // Prevent regular link behavior, which causes a browser refresh.
  event.preventDefault();

  // Push the route to the history.
 targetFct();
}

export const useNavigateProps = (to: Route, toArgs) => {
  const navigate = useRoutingNavigate();
  const fullURL = getRouteURL(to, toArgs)
  const toClick = onClick(() => {
    navigate(to, toArgs);
  })

  // Generate the correct link href (with basename accounted for)
  const href = useHref(fullURL);

  return { href, onClick: toClick };
}

