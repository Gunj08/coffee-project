import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  CheckCircle, 
  Users, 
  Settings, 
  LayoutDashboard,
  Store,
  FileText,
  ShoppingBag,
  LogOut,
  Coffee
} from 'lucide-react';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#F9F6F2',
            fontFamily: "'Poppins', sans-serif",
        },
        sidebar: {
            width: '260px',
            backgroundColor: '#2b1d19', // Dark Roasted Coffee
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 0',
            boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        },
        logoSection: {
            padding: '0 25px 40px 25px',
            fontSize: '28px',
            fontWeight: '800',
            fontFamily: "'Poppins', sans-serif",
            color: '#a27c5c',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        navGroup: {
            flex: 1,
        },
        navItem: (isActive) => ({
            padding: '14px 25px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            color: isActive ? '#FFFFFF' : '#A0A0A0',
            backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: isActive ? '5px solid #a27c5c' : '5px solid transparent',
        }),
        mainContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        },
        header: {
            height: '70px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
        breadcrumb: {
            color: '#7F8C8D',
            fontSize: '14px',
        },
        userMenu: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
        },
        logoutBtn: {
            padding: '8px 20px',
            borderRadius: '8px',
            border: '1.5px solid #4B2C20',
            backgroundColor: 'transparent',
            color: '#4B2C20',
            fontWeight: '600',
            cursor: 'pointer',
            transition: '0.3s',
        },
        contentBody: {
            padding: '40px',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '25px',
            marginBottom: '40px',
        },
        statCard: {
            backgroundColor: '#FFFFFF',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        },
        statLabel: {
            color: '#95A5A6',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '800',
            color: '#4B2C20',
        },
        timeCard: {
            backgroundColor: '#4B2C20',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(75, 44, 32, 0.2)',
        },
        chartGrid: {
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '25px',
        },
        card: {
            backgroundColor: '#FFFFFF',
            padding: '25px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        },
        bar: (height, color) => ({
            width: '30px',
            height: `${height}px`,
            backgroundColor: color,
            borderRadius: '5px 5px 0 0',
            transition: '0.5s ease',
        })
    };

    // --- ADDED 'Admin Approval' TO THIS ARRAY ---
    const navItems = ['Dashboard', 'Admin Approval', 'Users', 'Cafes', 'Orders', 'Reports', 'Settings'];

    const handleNavClick = (item) => {
        if (item === 'Admin Approval') {
            navigate('/admin'); // Redirects to http://localhost:5173/admin
        } else {
            setActiveTab(item);
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logoSection} onClick={() => navigate('/')}>
                    <Coffee size={28} /> Bookafé
                </div>
                
                <nav style={styles.navGroup}>
                    {navItems.map((item) => (
                        <div 
                            key={item} 
                            style={styles.navItem(activeTab === item)}
                            onClick={() => handleNavClick(item)}
                        >
                            <span>
                                {item === 'Dashboard' ? <BarChart3 size={20} /> : 
                                 item === 'Admin Approval' ? <CheckCircle size={20} /> : 
                                 item === 'Users' ? <Users size={20} /> : 
                                 item === 'Cafes' ? <Store size={20} /> :
                                 item === 'Orders' ? <ShoppingBag size={20} /> :
                                 item === 'Reports' ? <FileText size={20} /> :
                                 <Settings size={20} />}
                            </span>
                            {item}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <div style={styles.breadcrumb}>
                        Home / <b style={{color: '#4B2C20'}}>{activeTab}</b>
                    </div>
                    <div style={styles.userMenu}>
                        <span style={{fontSize: '14px', fontWeight: '600'}}>Admin User</span>
                        <button 
                            style={styles.logoutBtn}
                            onMouseOver={(e) => {e.target.style.backgroundColor = '#4B2C20'; e.target.style.color = 'white'}}
                            onMouseOut={(e) => {e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#4B2C20'}}
                            onClick={() => navigate('/login')}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div style={styles.contentBody}>
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>TOTAL VISITORS</span>
                            <div style={styles.statValue}>10,245</div>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>NEW MESSAGES</span>
                            <div style={styles.statValue}>12</div>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>REGISTERED USERS</span>
                            <div style={styles.statValue}>850</div>
                        </div>
                        <div style={styles.timeCard}>
                            <div style={{color: '#D4A373', fontSize: '12px', fontWeight: 'bold'}}>LOCAL TIME</div>
                            <div style={{fontSize: '32px', fontWeight: '800', margin: '5px 0'}}>17:08</div>
                            <div style={{fontSize: '13px', opacity: 0.8}}>Sunday, 15 Feb 2026</div>
                        </div>
                    </div>

                    <div style={styles.chartGrid}>
                        <div style={styles.card}>
                            <h3 style={{color: '#4B2C20', marginBottom: '25px'}}>Users Activity</h3>
                            <div style={{display: 'flex', alignItems: 'flex-end', gap: '15px', height: '200px', paddingBottom: '20px'}}>
                                <div style={styles.bar(80, '#2C2420')}></div>
                                <div style={styles.bar(120, '#4B2C20')}></div>
                                <div style={styles.bar(150, '#D4A373')}></div>
                                <div style={styles.bar(90, '#2C2420')}></div>
                                <div style={styles.bar(180, '#4B2C20')}></div>
                                <div style={styles.bar(110, '#D4A373')}></div>
                                <div style={styles.bar(140, '#4B2C20')}></div>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h3 style={{color: '#4B2C20', marginBottom: '25px'}}>Returning Visitors</h3>
                            <div style={{display: 'flex', justifyContent: 'center', padding: '20px'}}>
                                <div style={{
                                    width: '140px', 
                                    height: '140px', 
                                    borderRadius: '50%', 
                                    border: '18px solid #4B2C20', 
                                    borderTopColor: '#D4A373',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#4B2C20'
                                }}>
                                    75%
                                </div>
                            </div>
                            <p style={{textAlign: 'center', color: '#7F8C8D', fontSize: '14px'}}>Growth since last month</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Admin;