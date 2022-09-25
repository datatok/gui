import { useAuth } from 'providers/Site';
import {
    Routes,
    Route,
    NavLink,
    Navigate,
    useNavigate,
  } from 'react-router-dom';
  
  const ProtectedRoute = ({ children }) => {
    const { apiAccessToken } = useAuth();
  
    if (!apiAccessToken) {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };

export default ProtectedRoute