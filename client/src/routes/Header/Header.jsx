import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { LoginModal } from '../../components/LoginModal.jsx';
import { RegisterModal } from '../../components/RegisterModal.jsx';
import './Header.css';

export function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // Состояние для dropdown
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowDropdown(false); // Закрываем dropdown после выхода
    };

    // Закрываем dropdown при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigation = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setShowDropdown(false); // Закрываем dropdown после навигации
    };

    const handleAllCars = () => {
        navigate('/cars');
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>
            <header>
                <Link to="/" onClick={() => setShowDropdown(false)}>
                    <img className='asd' src="https://basemotors-api.onrender.com/api/images/logo.svg" alt="BaseMotors" />
                </Link>
                <div className='div1'>
                    <button onClick={handleAllCars} className='header-btn'>Автомобили</button>
                    <button onClick={() => handleNavigation('about')} className='header-btn'>О компании</button>
                    <button onClick={() => handleNavigation('contacts')} className='header-btn'>Контакты</button>
                    
                    {isAuthenticated ? (
                        <div className="user-menu" ref={dropdownRef}>
                            <button 
                                className="user-name-btn"
                                onClick={toggleDropdown}
                            >
                                {user?.first_name} {user?.last_name} 
                                <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
                            </button>
                            
                            {showDropdown && (
                                <div className="dropdown">
                                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                                        👤 Личный кабинет
                                    </Link>
                                    <Link to="/my-orders" onClick={() => setShowDropdown(false)}>
                                        📋 Мои заявки
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setShowDropdown(false)}>
                                            ⚙️ Админ-панель
                                        </Link>
                                    )}
                                    <button onClick={handleLogout}>
                                        🚪 Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="login-btn">Войти</button>
                    )}
                </div>
            </header>
            
            <LoginModal 
                isOpen={showLogin} 
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
            />
            
            <RegisterModal 
                isOpen={showRegister} 
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
        </>
    );
}