import { AuthContext } from 'providers/AuthContext'
import {
  Navigate
} from 'react-router-dom'

function ProtectedRoute ({ children }) {
  return (
    <AuthContext.Consumer>
      {({ apiAccessToken }) => (
        apiAccessToken
          ? <>{children}</>
          : <Navigate to="/" replace />
      )}
    </AuthContext.Consumer>
  )
}

export default ProtectedRoute
