import { AuthContext } from 'providers/auth.context';
import {
    Navigate,
  } from 'react-router-dom';
  
  const ProtectedRoute = ({ children }) => {  
    return (
      <AuthContext.Consumer>
        {( {apiAccessToken} ) => (
          apiAccessToken
          ? <>{children}</>
          : <Navigate to="/" replace />
        )}
      </AuthContext.Consumer>
    );
  };

export default ProtectedRoute