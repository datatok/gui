import { NavigateOptions, useNavigate } from "react-router-dom"

export enum Route {
  Home = 1,
  BucketHome,
  BucketBrowse,
  BucketUpload,
  AuthAnonymous,
  AuthHome,
}

export const getRouteURL = (route: Route, args?: {[key:string]: string}): string => {
  switch(route) {
    case Route.Home:
      return `/`
    case Route.BucketHome:
      return `/bucket/${args.bucket}`
    case Route.BucketBrowse:
      return `/bucket/${args.bucket}/browse/${args.path}`
    case Route.BucketUpload:
      if (args.hasOwnProperty('path')) {
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