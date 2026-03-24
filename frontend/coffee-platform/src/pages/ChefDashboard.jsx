import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  CheckCircle, 
  Map, 
  ClipboardList, 
  BarChart3, 
  User, 
  LogOut,
  Coffee
} from 'lucide-react';
import '../responsive.css';

const ChefDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('live');
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileData, setProfileData] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    });
    const [cafeDetails, setCafeDetails] = useState(null);
    const [cafeMenuItems, setCafeMenuItems] = useState([]);
    const [cafeTables, setCafeTables] = useState([]);

    const colors = {
        coffee: '#4b2c20',
        sidebarBg: '#2b1d19', // Dark Roasted Coffee
        sidebarText: '#fdfbf9', // Cream
        sidebarActive: '#a27c5c', // Bronze Accent
        latte: '#cbbcb2',
        cream: '#fdfbf9',
        white: '#ffffff',
        accent: '#8d6e63',
        highlight: '#b6a291'
    };

    const styles = {
        container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8f5f2', fontFamily: "'Poppins', sans-serif" },
        sidebar: {
            backgroundColor: colors.sidebarBg, 
            color: colors.sidebarText,
            boxShadow: '4px 0 15px rgba(0,0,0,0.15)'
        },
        sidebarHeader: {
            padding: '40px 30px', fontSize: '22px', fontWeight: 'bold',
            borderBottom: '1px solid rgba(255,255,255,0.1)', color: colors.sidebarText
        },
        navItem: (active) => ({
            display: 'flex', alignItems: 'center', gap: '15px',
            padding: '15px 25px', cursor: 'pointer',
            backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
            transition: '0.3s',
            borderLeft: active ? `5px solid ${colors.sidebarActive}` : '5px solid transparent',
            color: active ? colors.sidebarActive : colors.sidebarText, 
            fontWeight: active ? '700' : '500',
            fontSize: '15px'
        }),
        content: { padding: '40px 60px', overflowY: 'auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        title: { fontSize: '24px', color: colors.coffee, fontWeight: '700' },
        cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
        orderCard: {
            backgroundColor: colors.white, borderRadius: '16px', padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f0ebe6',
            transition: 'transform 0.2s'
        },
        statusBadge: (status) => ({
            padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
            backgroundColor: status === 'PENDING' ? '#FFEFC7' : (status === 'PREPARING' ? '#E1F5FE' : '#C8E6C9'),
            color: status === 'PENDING' ? '#FFAB00' : (status === 'PREPARING' ? '#0288D1' : '#2E7D32'),
            display: 'inline-block', marginBottom: '10px'
        }),
        button: (type) => ({
            padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s', marginTop: '15px', width: '100%',
            backgroundColor: type === 'primary' ? colors.coffee : colors.accent,
            color: 'white'
        }),
        menuTable: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
        tableRow: { backgroundColor: colors.white, borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' },
        tableCell: { padding: '15px', border: 'none' },
        toggle: (active) => ({
            width: '45px', height: '24px', borderRadius: '12px',
            backgroundColor: active ? '#4CAF50' : '#ccc',
            position: 'relative', cursor: 'pointer', transition: '0.3s'
        }),
        toggleCircle: (active) => ({
            width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white',
            position: 'absolute', top: '3px', left: active ? '24px' : '3px', transition: '0.3s'
        }),
        card: {
            backgroundColor: colors.white, borderRadius: '16px', padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '20px'
        },
        label: { fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' },
        input: {
            padding: '10px', borderRadius: '8px', border: '1px solid #ddd',
            outline: 'none', width: '100%', boxSizing: 'border-box', fontSize: '14px'
        },
        actionBtn: {
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            backgroundColor: colors.coffee, color: 'white', fontWeight: 'bold',
            cursor: 'pointer', width: '100%'
        },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', justifyItems: 'center' },
        tableNode: (status) => ({
            width: '120px', height: '120px', borderRadius: '50%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            backgroundColor: status === 'Occupied' ? colors.latte : colors.white,
            border: `3px solid ${status === 'Occupied' ? colors.accent : '#E0E0E0'}`,
            color: colors.coffee, cursor: 'default',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s'
        })
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        const loadInitialData = () => {
            if (activeTab === 'live') fetchOrders(['PENDING', 'PREPARING']);
            else if (activeTab === 'ready') fetchOrders(['READY']);
            else if (activeTab === 'history') fetchOrders(['SERVED', 'COMPLETED']);
            else if (activeTab === 'menu') fetchMenu();
            else if (activeTab === 'map') fetchTables();
            // No fetch needed for 'profile' tab
        };

        loadInitialData();

        // Polling for live/ready orders every 10 seconds
        let intervalId = null;
        if (activeTab === 'live' || activeTab === 'ready') {
            intervalId = setInterval(() => {
                const statuses = activeTab === 'live' ? ['PENDING', 'PREPARING'] : ['READY'];
                fetchOrders(statuses);
            }, 10000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [activeTab, profileData]);

    useEffect(() => {
        const syncProfile = async () => {
            const currentCafe = profileData?.cafeName || profileData?.cafe?.cafeName || profileData?.cafe;
            if (profileData?.email && (!currentCafe || currentCafe === 'na' || currentCafe === 'undefined')) {
                console.log("Chef Dashboard: Profile missing cafe link. Attempting to sync...");
                try {
                    const res = await fetch(`http://localhost:8080/api/dashboard/sync-profile?email=${encodeURIComponent(profileData.email)}`);
                    if (res.ok) {
                        const freshUser = await res.json();
                        if (JSON.stringify(freshUser) !== JSON.stringify(profileData)) {
                          console.log("Chef Dashboard: Profile synced successfully:", freshUser);
                          setProfileData(freshUser);
                          localStorage.setItem('user', JSON.stringify(freshUser));
                        } else {
                          console.log("Chef Dashboard: Synced data is identical, skipping state update.");
                        }
                    }
                } catch (err) {
                    console.error("Chef Dashboard: Sync failed:", err);
                }
            }
        };
        syncProfile();
        fetchCafeDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileData]);

    const fetchCafeDetails = async () => {
        const cafeId = profileData?.cafe?.id || profileData?.cafeId || (typeof profileData?.cafe === 'number' ? profileData.cafe : null);
        if (!cafeId) return;
        try {
            const [cafeRes, menuRes, tableRes] = await Promise.all([
                fetch(`http://localhost:8080/api/cafes/${cafeId}`),
                fetch(`http://localhost:8080/api/menu/cafe/${cafeId}`),
                fetch(`http://localhost:8080/api/cafes/tables/${cafeId}`)
            ]);
            if (cafeRes.ok) setCafeDetails(await cafeRes.json());
            if (menuRes.ok) setCafeMenuItems(await menuRes.json());
            if (tableRes.ok) setCafeTables(await tableRes.json());
        } catch (error) {
            console.error('Chef Dashboard: Error fetching cafe details:', error);
        }
    };

    const fetchOrders = async (statuses) => {
        console.log("Chef Dashboard: fetchOrders triggered for statuses:", statuses);
        console.log("Chef Dashboard: profileData state:", profileData);
        
        const cafeId = profileData?.cafe?.id || profileData?.cafeId || (typeof profileData?.cafe === 'number' ? profileData.cafe : null);
        const cafeNameFromProfile = profileData?.cafeName || profileData?.cafe?.cafeName || profileData?.companyName;

        console.log(`Chef Dashboard: Identified Cafe ID: ${cafeId}, Cafe Name: ${cafeNameFromProfile}`);

        if (!cafeId && !cafeNameFromProfile) {
            console.error("Chef Dashboard: CRITICAL - Both Cafe ID and Cafe Name are missing. Cannot fetch orders.");
            setLoading(false); // Ensure loading stops
            return;
        }

        setLoading(true);
        try {
            const statusParams = statuses.map(s => `status=${s}`).join('&');
            let url = '';
            
            if (cafeId) {
                url = `http://localhost:8080/api/orders/cafe/id/${cafeId}/status?${statusParams}`;
                console.log(`Chef Dashboard: Attempting fetch via Cafe ID: ${url}`);
            } else {
                url = `http://localhost:8080/api/orders/cafe/${encodeURIComponent(cafeNameFromProfile)}/status?${statusParams}`;
                console.log(`Chef Dashboard: Attempting fetch via Cafe Name: ${url}`);
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`Chef Dashboard: Successfully fetched ${data.length} orders`);
            setOrders(data);
        } catch (error) {
            console.error("Chef Dashboard: Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async () => {
        const cafeId = profileData?.cafe?.id || profileData?.cafeId || (typeof profileData?.cafe === 'number' ? profileData.cafe : null);
        if (!cafeId) {
            console.warn("Chef Dashboard: Cafe ID missing for menu fetch");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/menu/cafe/${cafeId}`);
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error("Chef Dashboard: Error fetching menu:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTables = async () => {
        const cafeId = profileData?.cafe?.id || profileData?.cafeId || (typeof profileData?.cafe === 'number' ? profileData.cafe : null);
        if (!cafeId) return;
        setLoading(true);
        try {
            const url = `http://localhost:8080/api/tables/cafe/${cafeId}`;
            console.log(`Chef Dashboard: Fetching tables from ${url}`);
            const response = await fetch(url);
            if (response.ok) setCafeTables(await response.json());
        } catch (error) {
            console.error("Chef Dashboard: Error fetching tables:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, { method: 'POST' });
            if (response.ok) {
                setOrders(orders.filter(o => o.id !== orderId));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const toggleAvailability = async (itemId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/menu/${itemId}/availability?available=${!currentStatus}`, { method: 'POST' });
            if (response.ok) {
                setMenuItems(menuItems.map(item => item.id === itemId ? { ...item, available: !currentStatus } : item));
            }
        } catch (error) {
            console.error("Error toggling availability:", error);
        }
    };


    if (!profileData) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><h3>Syncing kitchen data...</h3></div>;

    if (profileData.status !== 'ACTIVE') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#FFF8F0', fontFamily: "'Poppins', sans-serif", textAlign: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
                    <h2 style={{ color: '#4B2C20', marginBottom: '20px' }}>Kitchen Activation Required</h2>
                    <p style={{ color: '#6F4E37', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
                        Welcome Chef <strong>{profileData.firstName}</strong>! Your account is approved, but you must set a permanent password before accessing the kitchen dashboard.
                    </p>
                    <button 
                        onClick={() => navigate(`/set-password?email=${profileData.email}`)}
                        style={{ ...styles.button('primary'), padding: '15px' }}
                    >
                        Go to Password Setup
                    </button>
                    <p style={{ marginTop: '20px', fontSize: '13px', color: '#888' }}>
                        After setting your password, please log in again to activate your workspace.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Mobile hamburger toggle */}
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
                {sidebarOpen ? '✕' : '☰'}
            </button>
            {/* Overlay */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} style={styles.sidebar}>
                <div style={{ ...styles.sidebarHeader, display: 'flex', alignItems: 'center' }}>
                    <div style={{ padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', marginRight: '12px' }}>
                        <Coffee size={24} color={colors.sidebarActive} />
                    </div>
                    Chef Central
                </div>
                <nav style={{ flex: 1, marginTop: '10px' }}>
                    <div style={styles.navItem(activeTab === 'live')} onClick={() => { setActiveTab('live'); setSidebarOpen(false); }}>
                        <ChefHat size={20} /> Active Queue
                    </div>
                    <div style={styles.navItem(activeTab === 'ready')} onClick={() => { setActiveTab('ready'); setSidebarOpen(false); }}>
                        <CheckCircle size={20} /> Ready for Pickup
                    </div>
                    <div style={styles.navItem(activeTab === 'map')} onClick={() => { setActiveTab('map'); setSidebarOpen(false); fetchTables(); }}>
                        <Map size={20} /> Floor Plan
                    </div>
                    <div style={styles.navItem(activeTab === 'menu')} onClick={() => { setActiveTab('menu'); setSidebarOpen(false); }}>
                        <ClipboardList size={20} /> Menu Control
                    </div>
                    <div style={styles.navItem(activeTab === 'history')} onClick={() => { setActiveTab('history'); setSidebarOpen(false); }}>
                        <BarChart3 size={20} /> Analytics
                    </div>
                    <div style={styles.navItem(activeTab === 'profile')} onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}>
                        <User size={20} /> Profile Settings
                    </div>
                </nav>
                <div style={{ ...styles.navItem(false), marginBottom: '20px' }} onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                }}>
                    <LogOut size={20} /> Logout
                </div>
            </aside>

            <div className="dashboard-main" style={styles.content}>
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h1 style={styles.title}>
                            {activeTab === 'live' && 'Active Cooking Queue'}
                            {activeTab === 'ready' && 'Ready for Pickup'}
                            {activeTab === 'map' && 'Floor Plan Overview'}
                            {activeTab === 'menu' && 'Menu Management'}
                            {activeTab === 'history' && 'Order History'}
                            {activeTab === 'profile' && 'My Profile'}
                        </h1>
                        {cafeDetails && (
                            <div style={{ paddingLeft: '20px', borderLeft: '2px solid #ddd', color: colors.accent, fontWeight: '600' }}>
                                ☕ {cafeDetails.cafeName} | 📍 {cafeDetails.city}
                            </div>
                        )}
                    </div>
                    <div style={{ color: '#4B2C20', fontWeight: '500' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '100px', color: '#6F4E37' }}>Brewing data...</div>
                ) : (
                    activeTab === 'menu' ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={styles.menuTable}>
                                <thead>
                                    <tr style={{ color: '#6F4E37', fontSize: '14px' }}>
                                        <th style={{ textAlign: 'left', padding: '15px' }}>ITEM NAME</th>
                                        <th style={{ textAlign: 'left', padding: '15px' }}>CATEGORY</th>
                                        <th style={{ textAlign: 'left', padding: '15px' }}>PRICE</th>
                                        <th style={{ textAlign: 'center', padding: '15px' }}>AVAILABILITY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.map(item => (
                                        <tr key={item.id} style={styles.tableRow}>
                                            <td style={{ ...styles.tableCell, fontWeight: '600' }}>{item.itemName}</td>
                                            <td style={styles.tableCell}>{item.category}</td>
                                            <td style={styles.tableCell}>₹{item.price}</td>
                                            <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: '600', color: item.available ? '#4CAF50' : '#F44336' }}>
                                                        {item.available ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                    <div style={styles.toggle(item.available)} onClick={() => toggleAvailability(item.id, item.available)}>
                                                        <div style={styles.toggleCircle(item.available)} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === 'map' ? (
                        <div style={styles.grid}>
                            {cafeTables && cafeTables.length > 0 ? (
                                cafeTables.map(table => (
                                    <div key={table.id} style={{ textAlign: 'center' }}>
                                        <div style={styles.tableNode(table.status)}>
                                            <span style={{ fontSize: '12px', fontWeight: '600' }}>TABLE</span>
                                            <span style={{ fontSize: '24px', fontWeight: '800' }}>{table.tableNumber}</span>
                                            <span style={{ fontSize: '10px' }}>{table.capacity} Seats</span>
                                        </div>
                                        <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: '700', color: table.status === 'Occupied' ? '#A67B5B' : '#999' }}>
                                            {table.status.toUpperCase()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#A67B5B', backgroundColor: 'white', borderRadius: '15px', width: '100%' }}>
                                    No tables registered for this cafe.
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'profile' ? (
                        <div style={styles.card}>
                            <h2 style={{ color: colors.coffee, marginBottom: '20px' }}>Chef Information</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <span style={styles.label}>FULL NAME</span>
                                    <div style={{ fontWeight: '600', color: colors.coffee }}>{profileData.firstName} {profileData.lastName}</div>
                                </div>
                                <div>
                                    <span style={styles.label}>EMAIL ADDRESS</span>
                                    <div style={{ fontWeight: '600', color: colors.coffee }}>{profileData.email}</div>
                                </div>
                                <div>
                                    <span style={styles.label}>PHONE NUMBER</span>
                                    <div style={{ fontWeight: '600', color: colors.coffee }}>{profileData.phoneNumber}</div>
                                </div>
                                <div>
                                    <span style={styles.label}>ROLE</span>
                                    <div style={{ fontWeight: '600', color: colors.coffee }}>{profileData.role}</div>
                                </div>
                                {cafeDetails && (
                                    <>
                                        <div>
                                            <span style={styles.label}>ASSIGNED CAFE</span>
                                            <div style={{ fontWeight: '600', color: colors.coffee }}>{cafeDetails.cafeName}</div>
                                        </div>
                                        <div>
                                            <span style={styles.label}>LOCATION</span>
                                            <div style={{ fontWeight: '600', color: colors.coffee }}>{cafeDetails.city}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={styles.cardGrid}>
                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#A67B5B', backgroundColor: 'white', borderRadius: '15px' }}>
                                    No orders found in this category.
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} style={styles.orderCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={styles.statusBadge(order.status)}>{order.status}</div>
                                            <span style={{ fontSize: '12px', color: '#999' }}>#{order.id}</span>
                                        </div>
                                        <h3 style={{ margin: '10px 0 5px 0', color: '#4B2C20' }}>Table {order.tableNumber || 'Takeaway'}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Customer: {order.customerName}</p>
                                            <span style={{ fontSize: '12px', color: colors.accent, fontWeight: '600' }}>{formatTime(order.orderDate)}</span>
                                        </div>
                                        
                                        <div style={{ borderTop: '1px dashed #eee', paddingTop: '15px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Items:</div>
                                            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#444' }}>
                                                {order.items?.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>

                                        {order.status === 'PENDING' && (
                                            <button style={styles.button('primary')} onClick={() => updateStatus(order.id, 'PREPARING')}>Start Preparing</button>
                                        )}
                                        {order.status === 'PREPARING' && (
                                            <button style={styles.button('secondary')} onClick={() => updateStatus(order.id, 'READY')}>Mark as Ready</button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ChefDashboard;
