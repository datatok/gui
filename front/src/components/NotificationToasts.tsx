import { EuiGlobalToastList, EuiText } from '@elastic/eui'
import React, { FC } from 'react'
import { notifyToastRemove, useNotificationStore } from 'stores/NotificationStore'
import Utils from 'utils/Utils'

interface MyProps {
  toasts: any[]
}

const MyNotificationToasts: FC<MyProps> = ({ toasts }) => {
  const items = toasts.map(t => {
    return {
      ...t,
      id: Utils.defaultTo(t.id, ''),
      text: <EuiText><p>{t.text}</p></EuiText>
    }
  })

  return (<EuiGlobalToastList
    toasts={items}
    dismissToast={notifyToastRemove}
    toastLifeTimeMs={6000}
  />)
}

export const NotificationToasts: FC = () => {
  const snapshot = useNotificationStore()

  return (<MyNotificationToasts toasts={snapshot.toasts} />)
}
