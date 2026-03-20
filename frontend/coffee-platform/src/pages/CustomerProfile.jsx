import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../responsive.css';

import {
  Store,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  ChevronRight,
  CreditCard,
  Wallet,
  Banknote,
  ChevronLeft
} from 'lucide-react';

const SmoothCarousel = ({ images, height = '200px', colors }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photoList = Array.isArray(images) ? images : (images ? [images] : []);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photoList.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  if (photoList.length === 0) {
    return (
      <div style={{ height, backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
        ☕
      </div>
    );
  }

  return (
    <div style={{ height, position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
      {/* The Image */}
      <img
        src={photoList[currentIndex]}
        alt="carousel-item"
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' }}
      />

      {/* Navigation Arrows */}
      {photoList.length > 1 && (
        <>
          <button onClick={prevSlide} style={carouselArrowStyle(colors, 'left')}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} style={carouselArrowStyle(colors, 'right')}>
            <ChevronRight size={20} />
          </button>

          {/* Dot Indicators */}
          <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'center', gap: '5px' }}>
            {photoList.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: '0.3s'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const carouselArrowStyle = (colors, side) => ({
  position: 'absolute',
  top: '50%',
  [side]: '10px',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.7)',
  border: 'none',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  color: colors.coffee,
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
});
// --- NEW SUB-COMPONENT FOR INDIVIDUAL MENU ITEMS ---

// This handles the local state for image swapping for each card

const MenuCardItem = ({ item, bag, handleAddToBag, handleRemoveFromBag, colors, styles }) => {

  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const photos = item.photos || [];

  const hasMultipleImages = photos.length > 1;



  const nextImage = (e) => {

    e.stopPropagation();

    setCurrentImgIdx((prev) => (prev + 1) % photos.length);

  };



  const prevImage = (e) => {

    e.stopPropagation();

    setCurrentImgIdx((prev) => (prev - 1 + photos.length) % photos.length);

  };



  const bagItem = bag.find(b => b.id === item.id);

  const quantity = bagItem ? bagItem.quantity : 0;



  return (

    <div style={styles.card}>

      {/* IMAGE CONTAINER WITH ARROWS */}

      <div style={{

        height: '200px',

        borderRadius: '12px',

        overflow: 'hidden',

        marginBottom: '15px',

        backgroundColor: '#f9f9f9',

        position: 'relative',

      }}>

        <img

          src={photos.length > 0 ? photos[currentImgIdx] : 'https://via.placeholder.com/300x200?text=No+Image'}

          style={{

            width: '100%',

            height: '100%',

            objectFit: 'cover',

            transition: 'opacity 0.3s ease-in-out' // Smooth swap effect

          }}

          alt={item.itemName}

          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'; }}

        />



        {hasMultipleImages && (

          <>

            {/* Left Arrow */}

            <button

              onClick={prevImage}

              style={{

                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',

                backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',

                width: '30px', height: '30px', cursor: 'pointer', display: 'flex',

                alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',

                zIndex: 2

              }}

            >

              <ChevronLeft size={18} color={colors.coffee} />

            </button>



            {/* Right Arrow */}

            <button

              onClick={nextImage}

              style={{

                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',

                backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',

                width: '30px', height: '30px', cursor: 'pointer', display: 'flex',

                alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',

                zIndex: 2

              }}

            >

              <ChevronRight size={18} color={colors.coffee} />

            </button>



            {/* DOT INDICATORS */}

            <div style={{

              position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',

              display: 'flex', gap: '5px', zIndex: 2

            }}>

              {photos.map((_, idx) => (

                <div key={idx} style={{

                  width: '6px', height: '6px', borderRadius: '50%',

                  backgroundColor: idx === currentImgIdx ? colors.coffee : 'rgba(255,255,255,0.5)',

                  transition: '0.3s'

                }} />

              ))}

            </div>

          </>

        )}

      </div>



      <h3 style={{ margin: '0 0 5px 0', color: colors.coffee }}>{item.itemName}</h3>

      <p style={{ fontSize: '14px', color: '#777', height: '40px', overflow: 'hidden', marginBottom: '15px' }}>{item.description}</p>



      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <span style={{ fontWeight: 'bold', fontSize: '18px', color: colors.coffee }}>₹{item.price}</span>



        {quantity > 0 ? (

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.coffee, color: '#fff', padding: '6px 14px', borderRadius: '8px' }}>

            <button

              onClick={() => handleRemoveFromBag(item.id)}

              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}

            > − </button>

            <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>

            <button

              onClick={() => handleAddToBag(item)}

              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}

            > + </button>

          </div>

        ) : (

          <button

            onClick={() => handleAddToBag(item)}

            style={{ ...styles.actionBtn, padding: '8px 24px', borderRadius: '8px' }}

          >

            + Add

          </button>

        )}

      </div>

    </div>

  );

};



const CustomerProfile = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('cafe-list');
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [bag, setBag] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedOrderType, setSelectedOrderType] = useState('Dine-In (Book a Table)');

  const [selectedTable, setSelectedTable] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('GPay');

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [editUserData, setEditUserData] = useState({});

  const [tableSearchQuery, setTableSearchQuery] = useState('');

  const [menuItems, setMenuItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [lastOrder, setLastOrder] = useState(null);
  const pageSize = 5;
// Search & Filter States
const [searchQuery, setSearchQuery] = useState('');
const [filters, setFilters] = useState({
  rating: false,
  minPrice: '',
  maxPrice: '',
  hasDineIn: false,
  hasHomeDelivery: false,
  openNow: false
});


const filteredCafes = cafes.filter(cafe => {
  // 1. Search Logic (Name, City, Area, or Menu Item)
  const matchesSearch = 
    cafe.cafeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cafe.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cafe.area && cafe.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (cafe.menuItems && cafe.menuItems.some(item => 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    ));

  // 2. Filter: Rating (4+ stars)
  if (filters.rating && cafe.rating < 4) return false;

  // 3. Filter: Price Range
  const cafeMinPrice = cafe.minPrice || 0;
  if (filters.minPrice && cafeMinPrice < Number(filters.minPrice)) return false;
  if (filters.maxPrice && cafeMinPrice > Number(filters.maxPrice)) return false;

  // 4. Filter: Dine-In / Delivery
  if (filters.hasDineIn && !cafe.hasDineIn) return false;
  if (filters.hasHomeDelivery && !cafe.hasHomeDelivery) return false;

  // 5. Filter: Open Now
  if (filters.openNow) {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes(); // e.g., 14:30 -> 1430
    const openTime = parseInt(cafe.openingTime?.replace(':', '')) || 0;
    const closeTime = parseInt(cafe.closingTime?.replace(':', '')) || 2359;
    if (currentTime < openTime || currentTime > closeTime) return false;
  }

  return matchesSearch;
});
  const filteredTables = availableTables.filter(table =>

    table.tableNumber.toString().toLowerCase().includes(tableSearchQuery.toLowerCase()) ||

    table.capacity.toString().includes(tableSearchQuery)

  );



  const calculateMenuTotal = () => bag.reduce((sum, item) => sum + Number(item.price * item.quantity), 0);



  const calculateGrandTotal = () => {

    const menuTotal = calculateMenuTotal();

    const tablePrice = (selectedOrderType.includes("Dine-In") && selectedTable) ? Number(selectedTable.price) : 0;

    return menuTotal + tablePrice;

  };



  useEffect(() => {

    const fetchTables = async () => {

      if (view === 'booking' && selectedCafe?.id) {

        try {

          const response = await fetch(`http://localhost:8080/api/tables/cafe/${selectedCafe.id}`);

          if (response.ok) {

            const data = await response.json();

            setAvailableTables(data);

          }

        } catch (error) {

          console.error("Error fetching tables:", error);

        }

      }

    };

    fetchTables();

  }, [view, selectedCafe]);



  useEffect(() => {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      setEditUserData(parsedUser);

      fetchCafes();

    } else {

      navigate('/login');

    }

  }, [navigate]);



  useEffect(() => {

    const fetchMenu = async () => {

      if (view === 'menu' && selectedCafe?.id) {

        try {

          const response = await fetch(`http://localhost:8080/api/menu/cafe/${selectedCafe.id}`);

          if (response.ok) {

            const data = await response.json();

            setMenuItems(data);

          }

        } catch (error) {

          console.error("Error fetching menu:", error);

        }

      }

    };

    fetchMenu();

  }, [view, selectedCafe]);



  const fetchCafes = async () => {

    try {

      const response = await fetch('http://localhost:8080/api/cafes/all');

      const data = await response.json();

      setCafes(data);

    } catch (error) {

      console.error("Error fetching cafes:", error);

    }

  };



  const fetchOrderHistory = async (page = 0) => {
  try {
    const response = await fetch(`http://localhost:8080/api/orders/customer/${user.id}?page=${page}&size=5`);
    const data = await response.json();
    setOrderHistory(data.content);
    setCurrentPage(page);
  } catch (error) {
    console.error("Error fetching history:", error);
  }
};



  const handleAddToBag = (item) => {

    setBag(prevBag => {

      const existing = prevBag.find(b => b.id === item.id);

      if (existing) {

        return prevBag.map(b => b.id === item.id ? { ...b, quantity: b.quantity + 1 } : b);

      }

      return [...prevBag, { ...item, quantity: 1 }];

    });

  };



  const handleRemoveFromBag = (itemId) => {

    setBag(prevBag => {

      const existing = prevBag.find(b => b.id === itemId);

      if (!existing) return prevBag;

      if (existing.quantity > 1) {

        return prevBag.map(b => b.id === itemId ? { ...b, quantity: b.quantity - 1 } : b);

      }

      return prevBag.filter(b => b.id !== itemId);

    });

  };



  const handleConfirmOrder = async () => {

    if (bag.length === 0) {

      alert("Your bag is empty!");

      return;

    }

    if (selectedOrderType.includes("Dine-In") && !selectedTable) {

      alert("Please select a table.");

      return;

    }



    const totalAmount = calculateGrandTotal();

    const orderData = {

      customerId: user.id,

      customerName: `${user.firstName} ${user.lastName}`,

      cafeId: selectedCafe.id,

      cafeName: selectedCafe.cafeName,

      totalAmount: totalAmount,

      orderType: selectedOrderType,

      tableNumber: selectedOrderType.includes("Dine-In") ? selectedTable.tableNumber : "N/A",

      paymentMethod: paymentMethod,

      items: bag.map(item => `${item.itemName} (x${item.quantity})`)

    };



    try {

      const response = await fetch('http://localhost:8080/api/orders/place', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(orderData)

      });



      if (response.ok) {
        const savedOrder = await response.json();
        alert(`Order Placed Successfully! Total: ₹${totalAmount}`);
        setLastOrder(savedOrder);
        setBag([]);
        setSelectedTable(null);
        fetchOrderHistory();
        setView('receipt');
      }

    } catch (error) {

      console.error("Order Error:", error);

    }

  };



  const colors = { 
    sidebarBg: '#2b1d19', // Dark Roasted Coffee
    sidebarText: '#fdfbf9', // Cream
    sidebarActive: '#a27c5c', // Bronze Accent
    coffee: '#4c3c34', 
    latte: '#cbbcb2', 
    cream: '#fdfbf9', 
    white: '#ffffff', 
    accent: '#a27c5c' 
  };

  const styles = {

    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8f5f2', fontFamily: "'Poppins', sans-serif" },

    sidebar: { backgroundColor: colors.sidebarBg, color: colors.sidebarText, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 15px rgba(0,0,0,0.15)' },

    sidebarHeader: { padding: '40px 30px', fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', color: colors.sidebarText },

    navItem: (active) => ({

      display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 30px', cursor: 'pointer',

      backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',

      transition: '0.3s', borderLeft: active ? `4px solid ${colors.sidebarActive}` : '4px solid transparent',

      color: active ? colors.sidebarActive : colors.sidebarText

    }),

    mainContent: { flex: 1, padding: '40px 60px' },

    card: { backgroundColor: colors.white, borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '20px' },

    actionBtn: { backgroundColor: colors.coffee, color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },

    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' },

    paymentOption: (active) => ({

      display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', borderRadius: '10px',

      border: active ? `2px solid ${colors.coffee}` : '1px solid #ddd',

      cursor: 'pointer', backgroundColor: active ? '#f5f0eb' : '#fff', flex: 1, transition: '0.2s'

    })

  };



  if (!user) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><h3>Loading profile...</h3></div>;



  return (

    <div style={styles.container}>
      <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
        {sidebarOpen ? '✕' : '☰'}
      </button>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} style={styles.sidebar}>

        <div style={styles.sidebarHeader}>☕ Bookafé</div>

        <nav style={{ flex: 1, marginTop: '20px' }}>

          <div style={styles.navItem(view === 'cafe-list' || view === 'menu' || view === 'booking')} onClick={() => setView('cafe-list')}>

            <Store size={20} /> Cafes

          </div>

          <div style={styles.navItem(view === 'orders')} onClick={() => { setView('orders'); fetchOrderHistory(); }}>

            <ShoppingBag size={20} /> My Orders

          </div>

          <div style={styles.navItem(view === 'personal')} onClick={() => setView('personal')}>

            <UserIcon size={20} /> Profile

          </div>

        </nav>

        <div style={{ ...styles.navItem(false), marginTop: 'auto', marginBottom: '20px' }} onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>

          <LogOut size={20} /> Logout

        </div>

      </aside>



      <main className="dashboard-main" style={styles.mainContent}>

        {view === 'cafe-list' && (
  <>
    <h1 style={{ marginBottom: '10px', color: colors.coffee }}>Welcome, {user.firstName}</h1>
    
    {/* SEARCH & FILTER SECTION */}
    <div style={{ ...styles.card, padding: ' 30px 50px', marginBottom: '30px' }}>
      <input
        type="text"
        placeholder="Search by name, city, area, or coffee type..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.input}
      />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.rating} onChange={(e) => setFilters({...filters, rating: e.target.checked})} />
          4★ & above
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="number" placeholder="Min ₹" 
            style={{ ...styles.input, marginBottom: 0, width: '80px', padding: '8px' }}
            value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          />
          <span>-</span>
          <input 
            type="number" placeholder="Max ₹" 
            style={{ ...styles.input, marginBottom: 0, width: '80px', padding: '8px' }}
            value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.hasDineIn} onChange={(e) => setFilters({...filters, hasDineIn: e.target.checked})} />
          Dine-In
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.hasHomeDelivery} onChange={(e) => setFilters({...filters, hasHomeDelivery: e.target.checked})} />
          Home Delivery
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.openNow} onChange={(e) => setFilters({...filters, openNow: e.target.checked})} />
          Open Now
        </label>

        <button 
          onClick={() => {setSearchQuery(''); setFilters({rating: false, minPrice: '', maxPrice: '', hasDineIn: false, hasHomeDelivery: false, openNow: false})}}
          style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Reset
        </button>
      </div>
    </div>

    <p style={{ color: '#666', marginBottom: '20px' }}>Showing {filteredCafes.length} cafes</p>

    <div className="cafe-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
      {filteredCafes.map(cafe => (
        <div key={cafe.id} style={styles.card}>
           <div style={{ marginBottom: '20px' }}>
            <SmoothCarousel images={cafe.cafeImages} height="180px" colors={colors} />
          </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <h3 style={{ margin: '0 0 8px 0', color: colors.coffee }}>{cafe.cafeName}</h3>
             <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
               {cafe.rating} ★
             </span>
           </div>
           <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px' }}>{cafe.area ? `${cafe.area}, ` : ''}{cafe.city}, {cafe.state}</p>
           <button
            onClick={() => { setSelectedCafe(cafe); setView('menu'); }}
            style={{ ...styles.actionBtn, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Browse Menu <ChevronRight size={16} />
          </button>
        </div>
      ))}
    </div>
  </>
)}

{view === 'orders' && (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ color: colors.coffee, marginBottom: '30px' }}>Your Order History</h1>
    
    {(orderHistory && Array.isArray(orderHistory) && orderHistory.length > 0) ? (
      <>
        {orderHistory.map((order) => (
  <div key={order.id} style={styles.card}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      <h3 style={{ color: colors.coffee }}>{order.cafeName}</h3>
      <span style={{ fontSize: '12px', color: '#888' }}>
        {new Date(order.orderDate).toLocaleString()} 
      </span>
    </div>
    
    <div style={{ marginBottom: '10px' }}>
      <p><strong>Order Type:</strong> {order.orderType}</p>
      {order.tableNumber !== "N/A" && <p><strong>Table:</strong> {order.tableNumber}</p>}
      <p><strong>Items:</strong></p>
      <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
        {order.items.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '10px' }}>
      <span>Method: **{order.paymentMethod}**</span>
      <span style={{ fontWeight: 'bold', color: colors.coffee, fontSize: '18px' }}>
        Total: ₹{order.totalAmount}
      </span>
    </div>
  </div>
))}

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
          <button 
            disabled={currentPage === 0}
            onClick={() => fetchOrderHistory(currentPage - 1)}
            style={{ ...styles.actionBtn, opacity: currentPage === 0 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span style={{ alignSelf: 'center' }}>Page {currentPage + 1} of {totalPages}</span>
          <button 
            disabled={currentPage >= totalPages - 1}
            onClick={() => fetchOrderHistory(currentPage + 1)}
            style={{ ...styles.actionBtn, opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      </>
    ) : (
      <div style={styles.card}>No orders found. Time to grab a coffee!</div>
    )}
  </div>
)}

{view === 'personal' && (
  <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2 style={{ color: '#4a322d' }}>My Profile Details</h2>
      <button 
        onClick={() => setIsEditingProfile(!isEditingProfile)}
        style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#4a322d', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {isEditingProfile ? 'Cancel' : 'Edit Profile'}
      </button>
    </div>

    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      
      {/* SECTION 1: ACCOUNT */}
      <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#8d6e63' }}>Account & Contact</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>First Name</label>
          {isEditingProfile ? 
            <input style={{ width: '100%', padding: '8px', marginTop: '5px' }} value={editUserData.firstName} onChange={(e) => setEditUserData({...editUserData, firstName: e.target.value})} /> 
            : <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{user.firstName}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>Last Name</label>
          {isEditingProfile ? 
            <input style={{ width: '100%', padding: '8px', marginTop: '5px' }} value={editUserData.lastName} onChange={(e) => setEditUserData({...editUserData, lastName: e.target.value})} /> 
            : <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{user.lastName}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>Email</label>
          <p style={{ margin: '5px 0', color: '#999' }}>{user.email}</p>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>Phone</label>
          {isEditingProfile ? 
            <input style={{ width: '100%', padding: '8px', marginTop: '5px' }} value={editUserData.phoneNumber} onChange={(e) => setEditUserData({...editUserData, phoneNumber: e.target.value})} /> 
            : <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{user.phoneNumber}</p>}
        </div>
      </div>

      {/* SECTION 2: ADDRESS */}
      <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#8d6e63' }}>Address</h4>
      <div style={{ marginTop: '10px', marginBottom: '20px' }}>
        <p style={{ margin: '5px 0' }}><strong>Location:</strong> {user.plotNo}, {user.area}</p>
        <p style={{ margin: '5px 0' }}><strong>City:</strong> {user.city} - {user.pincode}</p>
      </div>

      {/* SECTION 3: ACADEMIC */}
      <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#8d6e63' }}>Education</h4>
      <div style={{ marginTop: '10px', marginBottom: '20px' }}>
        <p style={{ margin: '5px 0' }}><strong>Institution:</strong> {user.institution}</p>
        <p style={{ margin: '5px 0' }}><strong>Degree:</strong> {user.degree} ({user.passingYear})</p>
      </div >

      {/* SECTION 4: WORK */}
      <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#8d6e63' }}>Work Experience</h4>
      <div style={{ marginTop: '10px' }}>
        <p style={{ margin: '5px 0' }}><strong>Current Job:</strong> {user.jobTitle} at {user.companyName}</p>
        <p style={{ margin: '5px 0' }}><strong>Type:</strong> {user.employmentType} ({user.totalYears} Years)</p>
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Responsibilities:</label>
          <p style={{ fontSize: '14px', margin: '5px 0' }}>{user.responsibilities || 'None'}</p>
        </div>
      </div>

      {isEditingProfile && (
        <button 
          onClick={handleUpdateProfile}
          style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Save Changes
        </button>
      )}
    </div>
  </div>
)}


        {view === 'menu' && (

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            <button onClick={() => setView('cafe-list')} style={{ background: 'none', border: 'none', color: colors.coffee, cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>

              ← Back to Cafes

            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

              <h1 style={{ color: colors.coffee, margin: 0 }}>{selectedCafe.cafeName}</h1>

            </div>



            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px',}}>

              <input

                type="text"

                placeholder="Search menu..."

                value={menuSearchQuery}

                onChange={(e) => setMenuSearchQuery(e.target.value)}

                style={{ ...styles.input, marginBottom: '15px' }}

              />

              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>

                {['All', 'Beverages', 'Snacks', 'Desserts', 'Main Course'].map(cat => (

                  <button

                    key={cat}

                    onClick={() => setActiveCategory(cat)}

                    style={{

                      padding: '8px 20px', borderRadius: '20px', border: 'none',

                      backgroundColor: activeCategory === cat ? colors.coffee : '#f0f0f0',

                      color: activeCategory === cat ? '#fff' : '#666', cursor: 'pointer'

                    }}

                  >{cat}</button>

                ))}

              </div>

            </div>



            <div className="menu-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginBottom: '100px' }}>

              {menuItems

                .filter(item => (activeCategory === 'All' || item.category === activeCategory) && item.itemName.toLowerCase().includes(menuSearchQuery.toLowerCase()))

                .map((item) => (

                  <MenuCardItem

                    key={item.id}

                    item={item}

                    bag={bag}

                    handleAddToBag={handleAddToBag}

                    handleRemoveFromBag={handleRemoveFromBag}

                    colors={colors}

                    styles={styles}

                  />

                ))}

            </div>



            {bag.length > 0 && (

              <button

                onClick={() => setView('booking')}

                style={{

                  position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',

                  backgroundColor: '#D4A373', color: '#fff', padding: '16px 45px', borderRadius: '50px',

                  border: 'none', fontWeight: 'bold', fontSize: '17px', cursor: 'pointer',

                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)', zIndex: 1000

                }}

              >

                Proceed to Booking ({bag.reduce((acc, curr) => acc + curr.quantity, 0)} items)

              </button>

            )}

          </div>

        )}



        {view === 'booking' && (

          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

            <button onClick={() => setView('menu')} style={{ background: 'none', border: 'none', color: colors.coffee, cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>← Back to Menu</button>

            <h1 style={{ marginBottom: '10px', color: colors.coffee }}>Choose Your Spot</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>

              <input type="text" placeholder="Search tables..." value={tableSearchQuery} onChange={(e) => setTableSearchQuery(e.target.value)} style={{ ...styles.input, marginBottom: 0, flex: 2 }} />

              <select style={{ ...styles.input, marginBottom: 0, flex: 1 }} value={selectedOrderType} onChange={(e) => setSelectedOrderType(e.target.value)}>

                <option value="Dine-In (Book a Table)">Dine-In</option>

                <option value="Takeaway">Takeaway</option>

                <option value="Home Delivery">Home Delivery</option>

              </select>

            </div>



            {selectedOrderType.includes("Dine-In") && (

              <div className="cafe-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>

                {filteredTables.map((table) => {

                  const isSelected = selectedTable?.id === table.id;

                  return (

                    <div key={table.id} style={{ ...styles.card, border: isSelected ? `3px solid ${colors.coffee}` : '3px solid transparent', cursor: 'pointer' }} onClick={() => setSelectedTable(isSelected ? null : table)}>

                      <div style={{ marginBottom: '15px' }}>
                      <SmoothCarousel 
                        images={table.images} // Note: Ensure backend uses 'images' plural for tables
                        height="180px" 
                        colors={colors} 
                      />
                    </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        <div><h3 style={{ margin: 0 }}>Table {table.tableNumber}</h3><p>{table.capacity} Seater</p></div>

                        <div style={{ textAlign: 'right' }}><span style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{table.price}</span></div>

                      </div>

                      <button style={{ width: '100%', marginTop: '15px', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: isSelected ? colors.coffee : '#f5f0eb', color: isSelected ? '#fff' : colors.coffee }}>

                        {isSelected ? '✓ SELECTED' : 'SELECT TABLE'}

                      </button>

                    </div>

                  );

                })}

              </div>

            )}



            {(selectedTable || !selectedOrderType.includes("Dine-In")) && (

              <div style={{ textAlign: 'center', padding: '30px', borderTop: '1px solid #eee' }}>

                <button onClick={() => setView('payment')} style={{ ...styles.actionBtn, padding: '18px 80px' }}>Proceed to Payment →</button>

              </div>

            )}

          </div>

        )}



        {view === 'payment' && (

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>

            <button onClick={() => setView('booking')} style={{ background: 'none', border: 'none', color: colors.coffee, cursor: 'pointer', marginBottom: '20px' }}>← Back</button>

            <div style={styles.card}>

              <h3>Order Summary</h3>

              {bag.map((item, i) => (

                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>

                  <span>{item.itemName} (x{item.quantity})</span><span>₹{item.price * item.quantity}</span>

                </div>

              ))}

              {selectedOrderType.includes("Dine-In") && (

                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.accent, fontWeight: 'bold' }}>

                  <span>Table {selectedTable?.tableNumber} Booking</span><span>₹{selectedTable?.price}</span>

                </div>

              )}

              <div style={{ borderTop: '2px solid #eee', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>

                <span>Grand Total</span><span>₹{calculateGrandTotal()}</span>

              </div>

            </div>

            <div style={styles.card}>

              <h3>Payment Method</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div style={styles.paymentOption(paymentMethod === 'GPay')} onClick={() => setPaymentMethod('GPay')}><Wallet size={20} /> GPay / UPI</div>

                {paymentMethod === 'GPay' && selectedCafe && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    textAlign: 'center',
                    border: '1px solid #eee',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                  }}>
                    <p style={{ marginBottom: '15px', color: colors.coffee, fontWeight: 'bold' }}>Scan to Pay</p>
                    <div style={{ 
                      backgroundColor: '#fff', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      display: 'inline-block',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
                    }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${selectedCafe.upiId || 'test@upi'}&pn=${selectedCafe.cafeName}&am=${calculateGrandTotal()}&cu=INR`)}`}
                        alt="Payment QR Code"
                        style={{ width: '180px', height: '180px' }}
                      />
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>UPI ID: {selectedCafe.upiId || 'test@upi'}</p>
                  </div>
                )}

                <div style={styles.paymentOption(paymentMethod === 'Card')} onClick={() => setPaymentMethod('Card')}><CreditCard size={20} /> Credit/Debit Card</div>

                <div style={styles.paymentOption(paymentMethod === 'Cash')} onClick={() => setPaymentMethod('Cash')}><Banknote size={20} /> Pay at Counter</div>

              </div>

            </div>

            <button onClick={handleConfirmOrder} style={{ ...styles.actionBtn, width: '100%', marginTop: '20px', padding: '20px' }}>COMPLETE TRANSACTION</button>

          </div>
        )}

        {view === 'receipt' && lastOrder && (
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div id="receipt-content" style={{ 
              backgroundColor: '#fff', 
              padding: '40px', 
              borderRadius: '8px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'left',
              fontFamily: 'monospace',
              color: '#333'
            }}>
              <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>☕ {lastOrder.cafeName}</h2>
              <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '20px' }}>Order Receipt</p>
              
              <div style={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '15px 0', marginBottom: '20px' }}>
                <p><strong>Order ID:</strong> #{lastOrder.id}</p>
                <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Customer:</strong> {lastOrder.customerName}</p>
                <p><strong>Order Type:</strong> {lastOrder.orderType}</p>
                {lastOrder.tableNumber !== "N/A" && <p><strong>Table:</strong> {lastOrder.tableNumber}</p>}
              </div>

              <table style={{ width: '100%', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: '5px 0' }}>Item</th>
                    <th style={{ textAlign: 'right', padding: '5px 0' }}>Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {lastOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '5px 0' }}>{item}</td>
                      <td style={{ textAlign: 'right', padding: '5px 0' }}>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                  <span>Grand Total</span>
                  <span>₹{lastOrder.totalAmount}</span>
                </div>
                <p style={{ fontSize: '12px', marginTop: '5px' }}>Paid via: {lastOrder.paymentMethod}</p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#888' }}>
                <p>Thank you for visiting {lastOrder.cafeName}!</p>
                <p>Please visit again soon.</p>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }} className="no-print">
              <button 
                onClick={() => window.print()}
                style={{ ...styles.actionBtn, padding: '12px 30px', backgroundColor: colors.accent }}
              >
                Print Receipt
              </button>
              <button 
                onClick={() => setView('cafe-list')}
                style={{ ...styles.actionBtn, padding: '12px 30px' }}
              >
                Back to Home
              </button>
            </div>
            
            <style>
              {`
                @media print {
                  body * { visibility: hidden; }
                  #receipt-content, #receipt-content * { visibility: visible; }
                  #receipt-content { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; }
                  .no-print { display: none !important; }
                }
              `}
            </style>
          </div>
        )}
      </main>
 </div>
  );
};
export default CustomerProfile;