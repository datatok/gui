import { ReactChild, ReactNode } from 'react'
import { proxy, useSnapshot } from 'valtio'

interface INotificationState {
  toasts: MyToast[]
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

export const state = proxy<INotificationState>({
  toasts: []
})

export const useNotificationStore = (): INotificationState => {
  return useSnapshot<INotificationState>(state) as INotificationState
}

export const notifyToastAdd = (toast: MyToast): void => {
  state.toasts = [...state.toasts, {
    id: `t-${state.toasts.length + 1}`,
    ...toast
  }]
}

export const notifyToastRemove = ({ id }: { id: string }): void => {
  state.toasts = state.toasts.filter((toast) => toast.id !== id)
}

export const notifyWarning = (title: string, text: string): void => {
  notifyToastAdd({
    title,
    text,
    color: 'warning'
  })
}
