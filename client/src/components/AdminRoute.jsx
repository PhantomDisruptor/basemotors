import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
};