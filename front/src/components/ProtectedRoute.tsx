import { AuthContext } from 'providers/AuthContext'
import React, { FC } from 'react'
import {
  Navigate
} from 'react-router-dom'

const ProtectedRoute: FC = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {({ apiAccessToken }) => (
        apiAccessToken === ''
          ? <>{children}</>
          : <Navigate to="/" replace />
      )}
    </AuthContext.Consumer>
  )
}

export default ProtectedRoute
