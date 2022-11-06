import { MouseEvent } from 'react'
import { NavigateOptions, useNavigate } from 'react-router-dom'

interface Args { [key: string]: string }

export enum Route {
  Home = 1,
  BucketHome,
  BucketBrowse,
  BucketUpload,
  AuthAnonymous,
  AuthHome,
}

const isModifiedEvent = (event: MouseEvent): boolean =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const isLeftClickEvent = (event): boolean => event.button === 0

const isTargetBlank = (event): boolean => {
  const target = event.target.getAttribute('target')
  return target !== null && target !== '_self'
}

export const getRouteURL = (route: Route, args?: Args): string => {
  args = { ...args }

  switch (route) {
    case Route.Home:
      return '/'
    case Route.BucketHome:
      return '/bucket'
    case Route.BucketBrowse:
      return `/bucket/${args.bucket}/browse/${args.path}`
    case Route.BucketUpload:
      if (args.path !== null) {
        return `/bucket/${args.bucket}/upload/${args.path}`
      }

      return `/bucket/${args.bucket}/upload`
    case Route.AuthAnonymous:
      return '/auth/anonymous'
    case Route.AuthHome:
      return '/auth'
  }

  return '/404'
}

/**
 * Navigate to route
 */
export const useRoutingNavigate = (): (route: Route, args?: Args, options?: NavigateOptions) => void => {
  const navigate = useNavigate()

  return (route: Route, args?: Args, options?: NavigateOptions) => {
    const URL = getRouteURL(route, args)

    navigate(URL, options)
  }
}

//  navigate(to, toArgs);
export const onClick = (targetFct) => (event: MouseEvent) => {
  if (event.defaultPrevented) {
    return
  }

  // Let the browser handle links that open new tabs/windows
  if (isModifiedEvent(event) || !isLeftClickEvent(event) || isTargetBlank(event)) {
    return
  }

  // Prevent regular link behavior, which causes a browser refresh.
  event.preventDefault()

  // Push the route to the history.
  targetFct()
}

export const useNavigateProps = (): (to: Route, toArgs) => any => {
  const navigate = useRoutingNavigate()

  return (to: Route, toArgs) => {
    const fullURL = getRouteURL(to, toArgs)
    const toClick = onClick(() => {
      navigate(to, toArgs)
    })

    // Generate the correct link href (with basename accounted for)
    const href = fullURL

    return { href, onClick: toClick }
  }
}
