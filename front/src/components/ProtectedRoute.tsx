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
          ? <Navigate to="/" replace />
          : <>{ children }</>
      )}
    </AuthContext.Consumer>
  )
}

export default ProtectedRoute
