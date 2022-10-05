import { SiteContext } from 'providers/Site/context';
import {
    Navigate,
  } from 'react-router-dom';
  
  const ProtectedRoute = ({ children }) => {  
    return (
      <SiteContext.Consumer>
        {( {apiAccessToken} ) => (
          apiAccessToken
          ? <>{children}</>
          : <Navigate to="/" replace />
        )}
      </SiteContext.Consumer>
    );
  };

export default ProtectedRoute