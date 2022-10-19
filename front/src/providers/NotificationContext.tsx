import { EuiGlobalToastList, EuiText } from '@elastic/eui'
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list'
import React, { ReactChild, ReactNode, FC, useCallback, useMemo } from 'react'
import Utils from 'utils/Utils'

interface INotificationState {
  toasts: MyToast[]
}

interface INotificationContext extends INotificationState {
  addSiteToast: (toast: MyToast) => void
  warning: (title: string, text: string) => void
}

interface MyToast {
  id?: string
  text?: ReactChild
  toastLifeTimeMs?: number
  title?: ReactNode
  color?: any
  iconType?: string
  onClose?: () => void
}

/**
 * Export context
 */
export const NotificationContext = React.createContext<INotificationContext>({
  toasts: [],
  addSiteToast: (toast: MyToast) => {},
  warning: (title: string, text: string) => {}
})

/**
 * Export helpers
 */
export const useNotificationContext = (): INotificationContext => {
  // get the context
  const context = React.useContext(NotificationContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useUserContext was used outside of its Provider')
  }

  return context
}

/**
 * Export context provider
 */
export const NotificationProvider: FC = ({ children }) => {
  const [state, setState] = React.useState<INotificationState>({
    toasts: []
  })

  const addSiteToast = useCallback((toast: MyToast): void => {
    setState({
      ...state,
      toasts: [...state.toasts, {
        id: `t-${state.toasts.length + 1}`,
        ...toast
      }]
    })
  }, [])

  const actions = {
    addSiteToast,

    warning: (title: string, text: string) => {
      addSiteToast({
        title,
        text,
        color: 'warning'
      })
    }
  }

  const copyToats: Toast[] = state.toasts.map(t => {
    return {
      ...t,
      id: Utils.defaultTo(t.id, ''),
      text: <EuiText><p>{t.text}</p></EuiText>
    }
  })

  const removeToast = ({ id }: { id: string }): void => {
    setState({
      ...state,
      toasts: state.toasts.filter((toast) => toast.id !== id)
    })
  }

  // We dont want to refresh children
  const fixChildren = useMemo(() => { return children }, [])

  return (
    <NotificationContext.Provider value={{ ...state, ...actions }}>
      {fixChildren}
      <EuiGlobalToastList
          toasts={copyToats}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
    </NotificationContext.Provider>
  )
}
