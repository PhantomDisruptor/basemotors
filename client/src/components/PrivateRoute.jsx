import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
    }
    
    return isAuthenticated ? children : <Navigate to="/" replace />;
};