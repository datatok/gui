import React, { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BucketBrowseCommand, useAPI } from 'services/api'
import { BrowserUtils } from 'utils/BrowserUtils'
import { GuiBucketUtils } from 'utils/GuiBucketUtils'
import * as R from 'ramda'
import { GuiBrowserObject, GuiBucket, GuiObjects } from 'types'
import { Route, useNavigateProps } from 'services/routing'
import { useSiteMetaContext } from './SiteMetaContext'

interface LoadingStatus {
  status: string
  message?: string
  data?: any
}

interface Breadcrumb {
  text: string
  href: string
}

export interface IBrowserState {
  /**
   * The selected bucket
   */
  bucket: GuiBucket | null

  /**
   * raw list
   */
  objects: GuiObjects

  /**
   * current path
   */
  currentKey: string

  /**
   * current selected (folder or file)
   */
  currentNode?: GuiBrowserObject

  /**
   * loading files status (loading / done)
   */
  loadingStatus: LoadingStatus | null
}

export interface IBrowserContext extends IBrowserState {
  getByPath: (path: string) => GuiBrowserObject | undefined
  refresh: () => void
}

const defaultData: IBrowserContext = {
  bucket: null,
  objects: {},
  currentKey: '',
  loadingStatus: null,
  getByPath: (path: string): GuiBrowserObject | undefined => { return undefined },
  refresh: () => {}
}

export const BrowserContext = React.createContext<IBrowserContext>(defaultData)

interface BrowserStateProviderProps {
  selectedBucket: GuiBucket
}

/**
 * Export helpers
 */
export const useBrowserContext = (): IBrowserContext => {
  // get the context
  const context = React.useContext(BrowserContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useUserContext was used outside of its Provider')
  }

  return context
}

/**
 * Export context provider
 */
const BrowserStateProvider: FC<BrowserStateProviderProps> = ({ selectedBucket, children }) => {
  /**
   * Contexts
   */
  const apiBucketBrowse = useAPI(BucketBrowseCommand)

  const siteMetaContext = useSiteMetaContext()

  const navigateProps = useNavigateProps()

  const browseFetchPointer = React.useRef({ status: '', cancelToken: null })

  const [state, setState] = useState<IBrowserState>({
    bucket: null,
    objects: {},
    currentKey: '',
    loadingStatus: null
  })

  /**
   * State Actions
   */
  const actions = {
    refresh: () => {
      getObjectChildren(state.currentKey)
    },

    getByPath: (path: string): GuiBrowserObject | undefined => {
      return state.objects[path]
    }
  }

  const setBucket = (bucket: GuiBucket, rootFiles: GuiBrowserObject[]): void => {
    setState({
      ...state,
      bucket,
      currentNode: undefined
    })
  }

  const objectToBreadcrumbItem = (bucket: GuiBucket, file: GuiBrowserObject): Breadcrumb => {
    const text = (file.name === '' ? 'root' : file.name)

    return {
      text,
      ...navigateProps(Route.BucketBrowse, {
        bucket: bucket.id,
        path: file.path
      })
    }
  }

  /**
   * Set current view
   */
  const setFiles = (fromPath: string, files: GuiBrowserObject[]): void => {
    const currentNode = {
      ...BrowserUtils.extractNamePrefix(fromPath),
      type: 'folder',
      children: files
    }

    const newObjects = BrowserUtils.mergeObjects(
      fromPath,
      state.objects,
      R.indexBy(R.prop('path'), files)
    )

    setState({
      ...state,
      objects: {
        [currentNode.path]: currentNode,
        ...newObjects
      },
      currentKey: fromPath,
      currentNode,
      loadingStatus: { status: 'done' }
    })
  }

  const getObjectChildren = (key: string): void => {
    /* setState({
      ...state,
      loadingStatus: { status: 'loading' }
    }) */

    if (browseFetchPointer.current.status === 'progress') {
      return
    }

    browseFetchPointer.current = { status: 'progress', cancelToken: null }

    apiBucketBrowse(selectedBucket, key)
      .then(({ files }) => {
        browseFetchPointer.current = { status: 'success', cancelToken: null }

        setFiles(key, files)
      })
      .catch(err => {
        browseFetchPointer.current = { status: 'error', cancelToken: null }

        if (err.response.status === 404) {
          setFiles(key, [])
        }

        /* setState({
          ...state,
          loadingStatus: { status: 'error', message: err.message }
        }) */
      })
  }

  /**
   * Render
   */

  const routeParams = useParams()

  console.log('browser provider: refresh')

  React.useEffect(() => {
    if (!GuiBucketUtils.equals(selectedBucket, state.bucket)) {
      setBucket(selectedBucket, [])
    }
  }, [selectedBucket])

  React.useEffect(() => {
    const bucketFromRoute = routeParams.bucket ?? ''

    if (bucketFromRoute !== '' && state.bucket !== null && GuiBucketUtils.equals(selectedBucket, state.bucket)) {
      const paramBrowsePath: string = routeParams['*'] ?? ''
      console.log(state.bucket)
      getObjectChildren(paramBrowsePath)
    }
  }, [state.bucket, routeParams])

  /**
   * Update breadcrumbs
   */
  React.useEffect(() => {
    const breadcrumbs = [
      {
        text: 'Buckets',
        href: '/bucket'
        /* onClick: onClick(() => {
          navigate('/bucket')
        }) */
      }
    ]

    if (state.bucket !== null) {
      const b = state.bucket

      breadcrumbs.push(objectToBreadcrumbItem(state.bucket, {
        name: state.bucket.title,
        prefix: '',
        path: '',
        type: 'folder'
      }))

      if (state.currentKey !== '') {
        const keyParts = BrowserUtils.splitKeyPrefixes(state.currentKey)

        keyParts.filter(key => key).forEach(key => {
          breadcrumbs.push(objectToBreadcrumbItem(b, {
            ...BrowserUtils.extractNamePrefix(key),
            type: 'folder'
          }))
        })
      }
    }

    siteMetaContext.setBreadcrumbs(breadcrumbs)
  }, [state.bucket, state.currentKey])

  return (
    <BrowserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </BrowserContext.Provider>
  )
}

export default BrowserStateProvider
