import { EuiGlobalToastList, EuiText } from "@elastic/eui";
import { Toast } from "@elastic/eui/src/components/toast/global_toast_list";
import React, { ReactChild, ReactNode } from "react";

interface INotificationState {
  toasts: MyToast[],
}

interface INotificationContext extends INotificationState {
  addSiteToast: (toast: MyToast) => void
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
  addSiteToast: (toast: MyToast) => {}
});

/**
 * Export helpers
 */
export const useNotificationContext = () => {
  // get the context
  const context = React.useContext(NotificationContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  return context;
}

/**
 * Export context provider
 */
export const NotificationProvider = ({children}) => {

  const [ state, setState] = React.useState<INotificationState>({
    toasts: [],
  })

  const actions = {
    addSiteToast: (toast: MyToast) => {
      setState({
        ...state,
        toasts: [...state.toasts, {
          id: "t-" + state.toasts.length + 1,
          ...toast
        }]
      })
    },
  }

  const copyToats:Toast[] = state.toasts.map(t => {
    return {
      ...t,
      id: t.id || '',
      text: <EuiText><p>{t.text}</p></EuiText>
    }
  })

  const removeToast = (removedToast) => {
    setState({
      ...state,
      toasts: state.toasts.filter((toast) => toast.id !== removedToast.id)
    })
  }

  return (
    <NotificationContext.Provider value={{...state, ...actions}}>
      {children}
      <EuiGlobalToastList
          toasts={copyToats}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
    </NotificationContext.Provider>
  )
}
