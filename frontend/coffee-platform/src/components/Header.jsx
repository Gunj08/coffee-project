import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coffee } from 'lucide-react';

const Header = ({ onNavClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
    // Only update state if the user data has actually changed to avoid cascading renders
    if (JSON.stringify(user) !== JSON.stringify(parsedUser)) {
      setUser(parsedUser);
    }
  }, [location, user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (window.location.pathname === '/' || window.location.pathname === '/home') {
      if (onNavClick) onNavClick(sectionId);
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 40px',
      height: '80px',
      backgroundColor: '#111111', // Fixed dark coffee background
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 2000,
      boxSizing: 'border-box'
    },
    logoContainer: { display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' },
    logoText: { fontSize: '22px', fontWeight: '800', fontFamily: "'Poppins', sans-serif", color: '#FFFFFF' },
    navLinks: { display: 'flex', gap: '30px', alignItems: 'center' },
    navItem: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#E2D1C3',
      cursor: 'pointer',
      textDecoration: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    btnContainer: { display: 'flex', gap: '15px', alignItems: 'center' },
    loginBtn: {
      padding: '10px 20px',
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600'
    },
    signupBtn: {
      padding: '10px 25px',
      background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
      color: '#000000',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '13px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer} onClick={() => navigate('/')}>
        <Coffee size={24} color="#D4AF37" />
        <span style={styles.logoText}>Bookafé</span>
      </div>

      <nav style={styles.navLinks}>
        {['home', 'about', 'how-it-works', 'contact'].map((id) => (
          <a key={id} href={`#${id}`} style={styles.navItem} onClick={(e) => handleLinkClick(e, id)}>
            {id.replace(/-/g, ' ')}
          </a>
        ))}
      </nav>

      <div style={styles.btnContainer}>
        {user ? (
          <>
            <span 
              style={{color: '#D4AF37', fontWeight: 'bold', cursor: 'pointer'}} 
              onClick={() => {
                const role = user.role ? user.role.toLowerCase() : '';
                if (role === 'chef') navigate('/chef-dashboard');
                else if (role === 'waiter') navigate('/waiter-dashboard');
                else if (role === 'cafeowner') navigate('/owner-profile');
                else navigate('/customer-profile');
              }}
            >
              Hi, {user.firstName}!
            </span>
            <button style={styles.loginBtn} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button style={styles.loginBtn} onClick={() => navigate('/login')}>Login</button>
            <button style={styles.signupBtn} onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;