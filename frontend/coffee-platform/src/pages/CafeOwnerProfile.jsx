import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  LayoutDashboard, 
  Store, 
  PlusCircle,
  FileText, 
  Users, 
  Table as TableIcon, 
  LogOut,
  Coffee,
  ShoppingBag,
  CalendarCheck,

} from 'lucide-react';

import { Pencil, Trash2, Plus } from 'lucide-react';
import StaffSignup from './StaffSignup';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CafeOwnerProfile = () => {
  const navigate = useNavigate();

 // --- STATE ---
  const [cafes, setCafes] = useState([]);

  
  const [view, setView] = React.useState('dashboard');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [myCafes, setMyCafes] = useState([]);

 //STAFF
const [staffType, setStaffType] = useState(null);
 
 // Menu state
 const handleNextImage = (itemId) => {
  setMenuItems(prev => prev.map(item => {
    if (item.id === itemId) {
      const total = item.photos.length;
      const next = ((item.activeIndex || 0) + 1) % total;
      return { ...item, activeIndex: next };
    }
    return item;
  }));
};

const handlePrevImage = (itemId) => {
  setMenuItems(prev => prev.map(item => {
    if (item.id === itemId) {
      const total = item.photos.length;
      const prevIdx = ((item.activeIndex || 0) - 1 + total) % total;
      return { ...item, activeIndex: prevIdx };
    }
    return item;
  }));
};

const handleEditItem = (item) => {
  console.log("Edit item:", item);
  alert(`Editing ${item.itemName}`);
};

const handleDeleteItem = async (itemId) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    try {
      const response = await fetch(`http://localhost:8080/api/menu/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
};

const carouselArrowStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  color: '#4C3C34',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  zIndex: 10
};

// Carousel Component for multiple images
const SmoothScrollSlider = ({ images }) => {
  const scrollRef = React.useRef(null);

  if (!images || images.length === 0) {
    return (
      <div style={{ height: '100%', backgroundColor: '#fdfbf9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '30px' }}>☕</span>
      </div>
    );
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="slider-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Scrollable Area */}
      <div 
        ref={scrollRef}
        className="no-scrollbar"
        style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          scrollSnapType: 'x mandatory', 
          height: '100%',
          scrollbarWidth: 'none'
        }}
      >
        {images.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt="Slide" 
            style={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'cover', scrollSnapAlign: 'start' }} 
          />
        ))}
      </div>

      {/* Nav Arrows - Positioned Absolutely inside the container */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('left'); }}
            style={{ ...navButtonStyle, left: '5px' }}
            className="nav-button"
          >
            ❮
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('right'); }}
            style={{ ...navButtonStyle, right: '5px' }}
            className="nav-button"
          >
            ❯
          </button>
          
          <div style={badgeStyle}>
             {images.length} Photos
          </div>
        </>
      )}
    </div>
  );
};

// Internal styles for the slider
const navButtonStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0, 0, 0, 0.4)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  zIndex: 2,
  opacity: 0.6,
  transition: 'opacity 0.2s'
};

const badgeStyle = {
  position: 'absolute',
  bottom: '8px',
  right: '8px',
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontSize: '10px',
  fontWeight: 'bold'
};

// Redundant method removed to avoid confusion. Use handleAddMenu instead.

// - Staff state-
// const [staffList, setStaffList] = useState([]); // Removed duplicate declaration
const [showStaffForm, setShowStaffForm] = useState(false);
const [selectedRole, setSelectedRole] = useState("");
const [showStaffList, setShowStaffList] = useState(false);
const [staffCurrentPage, setStaffCurrentPage] = useState(1);
const staffPerPage = 4;

  const [selectedCafe, setSelectedCafe] = useState(null);

  const handleRegisterCafe = async (cafeData) => {
  try {
    const response = await fetch('http://localhost:8080/api/cafes/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cafeData),
    });

    if (response.ok) {
      const savedCafeFromDB = await response.json();
    
      setMyCafes(prev => [...prev, savedCafeFromDB]);

      setSelectedCafe(savedCafeFromDB); 
      
      alert("Cafe Registered! ID: " + savedCafeFromDB.id);
      setActiveSection('my-cafes');
      
      // 3. Reset the form and redirect
      setRegForm({ cafeName: '', city: '', state: '', contactNumber: '', cafeImages: [] });
    } else {
      const errorMsg = await response.text();
      alert("Registration failed: " + errorMsg);
    }
  } catch (error) {
    console.error("Cafe registration error:", error);
    alert("Network error: Could not connect to the server.");
  }
};


  useEffect(() => {
  const fetchStaff = async () => {
    if (selectedCafe?.id && activeSection === 'staff') {
      try {
        const response = await fetch(`http://localhost:8080/api/staff/cafe/${selectedCafe.id}`);
        const data = await response.json();
        setStaffList(data);
      } catch (err) {
        console.error("Failed to fetch staff", err);
      }
    }
  };
  fetchStaff();
}, [selectedCafe, activeSection]);

  useEffect(() => {
    if (myCafes && myCafes.length > 0 && !selectedCafe) {
        setSelectedCafe(myCafes[0]);
    }
}, [myCafes, selectedCafe]);
  useEffect(() => {
  if (activeSection === 'my-cafes') {
    fetch('http://localhost:8080/api/cafes/all')
      .then(res => res.json())
      .then(data => setMyCafes(data)) 
      .catch(err => console.error("Error fetching cafes:", err));
  }
}, [activeSection]);

// STAFF FORM TRIGGER
  const openStaffOnboarding = () => {
    if (!selectedCafe?.id) {
       return alert("System Error: Cafe ID not found. Please register or select a cafe first.");
    }
    setShowStaffForm(true);
  };
const handleLogout = () => {

  localStorage.removeItem('user'); 
  window.location.href = 'http://localhost:5173/';
};

const [tableForm, setTableForm] = useState({ tableNumber: '', capacity: '', price: '' });

// --- Handle Add Table ---

const handleAddTable = async (e) => {
  if (e) e.preventDefault();

  if (!selectedCafe?.id) {
    alert("Error: No cafe selected. Please select a cafe first.");
    return;
  }
  const tableData = {
    tableNumber: newTable.tableNumber,
    capacity: Number(newTable.capacity),
    price: Number(newTable.price),
    description: newTable.description,
    amenities: newTable.amenities,
    status: newTable.status || 'Available',
    images: newTable.images,
    cafe: { 
      id: selectedCafe.id 
    }
  };

  try {
    const response = await fetch('http://localhost:8080/api/cafes/tables/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tableData)
    });

    if (response.ok) {
      const savedTable = await response.json();
      setTables(prev => [...prev, savedTable]);
      
      alert("Table added successfully!");
      setNewTable({ 
        tableNumber: '', 
        capacity: '', 
        price: '', 
        description: '', 
        amenities: '', 
        status: 'Available', 
        images: [] 
      });
      setShowTableForm(false);
    } else {
      const msg = await response.text();
      alert("Failed to add table: " + msg);
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("An error occurred while saving the table.");
  }
};

// --- 1. Handle Delete ---
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to remove this cafe? This action cannot be undone.")) {
    try {
      const response = await fetch(`http://localhost:8080/api/cafes/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Cafe removed successfully");
        
        setMyCafes(prev => prev.filter(cafe => cafe.id !== id));
      } else {
        alert("Failed to delete the cafe.");
      }
    } catch (error) {
      console.error("Error deleting cafe:", error);
    }
  }
};

// --- 2. Handle Edit ---
const handleEdit = (cafe) => {
  setRegForm(cafe);
  setIsEditing(true); 
  setActiveSection('register');
};

const handleNavigateToRegister = () => {
  setIsEditing(false); 
  setRegForm({});      
  setActiveSection('register');
};
  
 
  const [isEditing, setIsEditing] = useState(false);

  const [showTableForm, setShowTableForm] = useState(false);
const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: '',
    price: '',
    description: '', 
    amenities: '', 
    status: 'Available',
    images: []
});

  // 1. Fetch tables from DB when the section is active
  useEffect(() => {
  if (activeSection === 'tables' && selectedCafe?.id) {
    fetchTables(selectedCafe.id);
  }
}, [activeSection, selectedCafe]);

  const fetchTables = async (cafeId) => {
  if (!cafeId) return; 

  try {
    const response = await fetch(`http://localhost:8080/api/cafes/tables/${cafeId}`);
    const data = await response.json();
    console.log("Fetched Tables Data:", data);
    if (Array.isArray(data)) {
      setTables(data);
    } else if (data && typeof data === 'object') {
      setTables([data]); 
    } else {
      setTables([]); 
    }
  } catch (error) {
    console.error("Error fetching tables:", error);
    setTables([]); 
  }
};
  

  // 3. Handle Remove Table from DB
  const handleRemoveTable = async (id) => {
    if (window.confirm("Remove this table from inventory?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/cafes/tables/delete/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setTables(prev => prev.filter(t => t.id !== id));
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // --- STAFF MANAGEMENT STATE ---

const [staffForm, setStaffForm] = useState({
  fullName: '', contactNumber: '', email: '', 
  password: '', salary: '', govtId: '', 
  address: '', joiningDate: ''
});
  // --- MENU FORM STATE ---
 const [newItem, setNewItem] = useState({ 
  itemName: '', 
  price: '', 
  category: '', 
  description: '', 
  photos: [] // Updated to match MenuItem entity's List<String>
}); 

  // --- REGISTRATION FORM STATE ---
  const [regForm, setRegForm] = useState({
    cafeName: '', ownerName: '', contactNumber: '', email: '',
    openingTime: '', closingTime: '', street: '', city: '',
    state: '', pincode: '', businessType: 'Proprietorship',
    fssaiLicenseNumber: '', gstNumber: '',
    accountHolderName: '', accountNumber: '', ifscCode: '', upiId: '',
    hasHomeDelivery: false, hasTakeaway: false, hasDineIn: false,
    cafeImages: [],
    cafeLicense: null,
    district: '',
    country: '',
    panNumber: '',
  });

  // --- THEME COLORS ---
  const colors = {
    sidebarBg: '#2b1d19', // Dark Roasted Coffee
    sidebarText: '#fdfbf9', // Cream
    sidebarActive: '#a27c5c', // Bronze Accent
    cream: '#f4eee8',
    latte: '#cbbcb2',
    coffee: '#4c3c34',
    accent: '#a27c5c',
    white: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.6)'
  };

  // --- STYLES OBJECT ---
  const styles = {
    iconOverlay: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
  },
  miniBtn: (type) => ({
    backgroundColor: type === 'edit' ? '#fff' : '#ff4d4d',
    color: type === 'edit' ? colors.coffee : '#fff',
    border: 'none',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: '0.2s transform',
  }),
    container: { display: 'flex', minHeight: '100vh', backgroundColor: colors.cream, color: colors.coffee, fontFamily: "'Poppins', sans-serif" },
    sidebar: { width: '280px', backgroundColor: colors.sidebarBg, color: colors.sidebarText, height: '100vh', position: 'fixed', left: 0, top: 0, boxShadow: '4px 0 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', zIndex: 100, },
    logoArea: { padding: '10px 30px 20px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '24px', fontWeight: 'bold' },
    nav: { marginTop: '20px', flex: 1 },
    main: { marginLeft: '280px', flex: 1, padding: '60px', overflowY: 'auto' },
    card: { backgroundColor: colors.glass, padding: '30px', borderRadius: '24px', border: `1px solid ${colors.white}`, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
    input: { padding: '15px', backgroundColor: '#fdfbf9', border: `1px solid ${colors.latte}`, borderRadius: '12px', outline: 'none', width: '100%', boxSizing: 'border-box' },
    buttonPrimary: { backgroundColor: colors.coffee, color: colors.white, padding: '15px 30px', border: 'none', borderRadius: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', width: '100%' },
    headerLabel: { fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', color: colors.accent, marginBottom: '8px' },
    formSection: { marginBottom: '40px', borderBottom: `1px solid ${colors.latte}`, paddingBottom: '20px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' },
    menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginTop: '40px' },
    menuCard: { backgroundColor: colors.white, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative' },
    itemImage: { width: '100%', height: '180px', objectFit: 'cover' },
    deleteBtn: { position: 'absolute', top: '10px', right: '10px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    staffRoleBox: { flex: 1, padding: '40px', backgroundColor: colors.white, borderRadius: '24px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${colors.latte}`, transition: '0.3s' },
    staffCard: { backgroundColor: colors.white, padding: '25px', borderRadius: '20px', borderLeft: `5px solid ${colors.accent}`, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
    revokeBtn: { marginTop: '15px', padding: '10px', backgroundColor: '#fff0f0', color: '#cc0000', border: '1px solid #ffcccc', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', width: '100%' },
    // New Table Styles
    tableGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px', marginTop: '30px' },
    tableImgPreview: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px' }
  };

  // --- TABLE HANDLERS ---

const handleMultipleCafeFiles = (e) => {
  const files = Array.from(e.target.files);
  const readers = files.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readers).then(results => {
    setRegForm(prev => ({
      ...prev,
      cafeImages: [...(prev.cafeImages || []), ...results] 
    }));
  });
};

const handleMultipleTableImages = (e) => {
  const files = Array.from(e.target.files);
  const readers = files.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  });
  Promise.all(readers).then(results => {
    setNewTable(prev => ({
      ...prev,
      images: [...(prev.images || []), ...results]
    }));
  });
};


  const fetchCafes = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/cafes/all');
    setCafes(response.data);
  } catch (error) {
    console.error("Error fetching cafes:", error);
  }
};

useEffect(() => {
    fetchCafes();
}, []);


  const OrdersManagement = () => (
  <div style={{ padding: '30px' }}>
    <h2 style={{ marginBottom: '20px', color: '#4a3728' }}>Live Orders</h2>
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f0f0f0', fontSize: '12px', color: '#888' }}>
            <th style={{ padding: '15px' }}>ORDER ID</th>
            <th>CUSTOMER</th>
            <th>ITEMS</th>
            <th>TOTAL</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {/* Example Data Row */}
          <tr style={{ borderBottom: '1px solid #f9f9f9', fontSize: '14px' }}>
            <td style={{ padding: '15px', fontWeight: 'bold' }}>#BK-8821</td>
            <td>John Doe</td>
            <td>Cappuccino (x2), Blueberry Muffin</td>
            <td>₹540</td>
            <td><span style={{ backgroundColor: '#fff4e6', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>Preparing</span></td>
            <td><button style={{ background: '#6F4E37', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>Complete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const BookingsManagement = () => (
  <div style={{ padding: '30px' }}>
    <h2 style={{ marginBottom: '20px', color: '#4a3728' }}>Table Reservations</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
      {/* Example Booking Card */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Table 01</span>
          <span style={{ color: '#27ae60', fontSize: '12px', fontWeight: 'bold' }}>● CONFIRMED</span>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>Customer:</strong> Sarah Smith</p>
          <p><strong>Guests:</strong> 2 Persons</p>
          <p><strong>Time:</strong> Today, 7:00 PM</p>
        </div>
        <button style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Mark Arrived
        </button>
      </div>
    </div>
  </div>
);
  

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    const url = isEditing 
        ? `http://localhost:8080/api/cafes/update/${regForm.id}` 
        : 'http://localhost:8080/api/cafes/register';
        
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regForm)
        });

        if (response.ok) {
            alert(isEditing ? "Cafe Updated Successfully!" : "Business Registered Successfully!");
            setIsEditing(false); // Reset mode
            setActiveSection('my-cafes'); 
        } else {
            const errorData = await response.text();
            alert("Action failed: " + errorData);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to the backend server.");
    }
};

  // --- MENU HANDLERS ---
  // --- REFINED MENU HANDLERS ---

  // 1. Fetch menu from DB
  const fetchMenuItems = async (cafeId) => {
  if (!cafeId) return; 
  try {
    const response = await axios.get(`http://localhost:8080/api/menu/cafe/${cafeId}`);
    setMenuItems(response.data);
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};

useEffect(() => {
  if (selectedCafe && selectedCafe.id) {
    console.log("Fetching menu for Cafe ID:", selectedCafe.id);
    fetchMenuItems(selectedCafe.id);
  } else {
    setMenuItems([]);
  }
}, [selectedCafe]);

  // 2. Fetch items when the section becomes active
  useEffect(() => {
    if (activeSection === 'menu') {
      fetchMenuItems();
    }
  }, [activeSection]);

  // 3. Handle Image Upload & Preview
  const handleMenuImage = (e) => {
  const files = Array.from(e.target.files);
  
  const readers = files.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readers).then(results => {
    // We update 'photos' (plural) to match your new List<String> in Java
    setNewItem({ ...newItem, photos: results });
  });
};

  // 4. Save to Database - UPDATED
const handleAddMenu = async (e) => {
  e.preventDefault();
  
  if (!selectedCafe?.id) {
    alert("Please select a cafe first!");
    return;
  }

  try {
    // 1. Prepare the data matching your MenuItem entity
    const menuData = {
      itemName: newItem.itemName,
      price: Number(newItem.price), // Ensure price is sent as a number
      description: newItem.description,
      category: newItem.category,
      photos: newItem.photos || [] // Array of base64 strings
    };

    // 2. Call the specific MenuItemController endpoint with the cafeId in the URL
    const response = await axios.post(
      `http://localhost:8080/api/menu/add/${selectedCafe.id}`, 
      menuData
    );

    setMenuItems(prev => [...prev, response.data]);
    
    // 3. Reset form
    setNewItem({ itemName: '', price: '', description: '', category: '', photos: [] });
    alert("Item added successfully!");
  } catch (error) {
    console.error("Error saving menu:", error);
    const errorMsg = error.response?.data?.message || error.response?.data || "Failed to save menu item.";
    alert(`Error: ${errorMsg}. Check console for details.`);
  }
};


// 5. Delete from Database - UPDATED
const handleDeleteMenu = async (id) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    try {
      // Point to the correct DELETE endpoint
      const response = await fetch(`http://localhost:8080/api/menu/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  }
};


//--Image carousel--
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Images</div>;
  }

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderRadius: '12px' }}>
      {/* The Image */}
      <img 
        src={images[currentIndex]} 
        alt="Preview" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }} 
      />

      {/* Navigation Buttons (Only show if more than 1 image) */}
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} style={carouselButtonStyle.left}>❮</button>
          <button onClick={nextSlide} style={carouselButtonStyle.right}>❯</button>
          
          {/* Dots Indicator */}
          <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'center', gap: '5px' }}>
            {images.map((_, i) => (
              <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const carouselButtonStyle = {
  left: { position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' },
  right: { position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }
};

  //--STAFF HANDLERS--
  
const handleStaffFormChange = (e) => {
  setStaffFormData({ ...staffFormData, [e.target.name]: e.target.value });
};
useEffect(() => {
  if (activeSection === 'staff' && selectedCafe?.id) {
    fetch(`http://localhost:8080/api/staff/cafe/${selectedCafe.id}`)
      .then(res => res.json())
      .then(data => setStaffList(data))
      .catch(err => console.log("Error fetching staff:", err));
  }
}, [activeSection, selectedCafe]);
const handleAddStaff = async (e) => {
  e.preventDefault();

  // 1. Validation: Stop the process if cafeId is missing
  const currentCafeId = selectedCafe?.id; 
  if (!currentCafeId) {
    alert("Error: No cafe selected. Please select a cafe first.");
    return;
  }

  // 2. Use FormData because your backend needs to receive a File (Multipart)
  const data = new FormData();

  // 3. Append all text fields from your staffFormData
  Object.keys(staffFormData).forEach(key => {
    if (key !== 'govtProof') {
      data.append(key, staffFormData[key]);
    }
  });

  // 4. Append the specific fields required by the backend
  data.append('role', selectedRole);
  data.append('cafeId', currentCafeId);

  // 5. Append the file if it exists
  if (staffFormData.govtProof) {
    data.append('govtProof', staffFormData.govtProof);
  }

  try {
    const response = await fetch('http://localhost:8080/api/staff/register', {
      method: 'POST',
      // IMPORTANT: Do NOT set 'Content-Type' header when sending FormData
      // The browser will automatically set it to 'multipart/form-data' with the correct boundary
      body: data, 
    });

    if (response.ok) {
      const newStaff = await response.json();
      setStaffList([...staffList, newStaff]);
      setShowStaffForm(false);
      alert(`${selectedRole} onboarded successfully!`);
      
      // Reset form data after success
      setStaffFormData({}); 
    } else {
      const errorText = await response.text();
      alert("Registration failed: " + errorText);
    }
  } catch (error) {
    console.error("Error onboarding staff:", error);
    alert("Network error. Check if backend is running.");
  }
};

const handleRevokeStaff = async (staffId) => {
  // Confirmation dialog to prevent accidental clicks
  if (window.confirm("Are you sure you want to revoke access for this staff member? This action cannot be undone.")) {
    try {
      const response = await fetch(`http://localhost:8080/api/staff/${staffId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the local state to remove the revoked staff member
        setStaffList(prevList => prevList.filter(staff => staff.id !== staffId));
        alert("Staff access revoked successfully.");
      } else {
        const errorMsg = await response.text();
        alert("Failed to revoke access: " + errorMsg);
      }
    } catch (error) {
      console.error("Error revoking staff:", error);
      alert("Network error. Please check your backend connection.");
    }
  }
};
  const SidebarItem = ({ id, label, icon }) => (
    <div 
      onClick={() => { setActiveSection(id); setShowStaffForm(false); setShowTableForm(false); }}
      style={{
        padding: '20px 40px', cursor: 'pointer', transition: '0.3s',
        backgroundColor: activeSection === id ? 'rgba(255,255,255,0.1)' : 'transparent',
        borderLeft: `4px solid ${activeSection === id ? colors.sidebarActive : 'transparent'}`,
        display: 'flex', alignItems: 'center', gap: '15px',
        color: activeSection === id ? colors.sidebarActive : colors.sidebarText
      }}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>{label}</span>
    </div>
  );
  

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
  <div style={{...styles.logoArea, display: 'flex', alignItems: 'center', gap: '10px'}}>
    <Coffee size={20} color="#6F4E37" /> Bookafé
  </div>
  
  <nav style={styles.nav}>
    <SidebarItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} />
    
    {/* Use the component here too for consistency */}
    <SidebarItem id="my-cafes" label="My Cafes" icon={<Store size={18} />} />
    
    <SidebarItem id="register" label="Register Cafe" icon={<PlusCircle size={18} />} />
    <SidebarItem id="menu" label="Menu" icon={<FileText size={18} />} />
    <SidebarItem id="tables" label="Add Tables" icon={<TableIcon size={18} />} />
    <SidebarItem id="staff" label="Staff" icon={<Users size={18} />} />
    <SidebarItem id="orders" label="Orders" icon={<ShoppingBag size={18} />} />
    <SidebarItem id="bookings" label="Table Bookings" icon={<CalendarCheck size={18} />} />
    <div 
  onClick={handleLogout}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '18px 30px',
    cursor: 'pointer',
    marginTop: 'auto', // This pushes the logout to the bottom
    color: colors.sidebarText,
    opacity: 0.8,
    transition: '0.3s',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  }}
  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
  onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
>
  
  <LogOut size={20} />
  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
    Logout
  </span>
</div>
</nav>

  <button 
    onClick={() => navigate('/')} 
    style={{ 
      background: 'none', 
      border: 'none', 
      padding: '40px', 
      fontSize: '10px', 
      fontWeight: 'bold', 
      cursor: 'pointer', 
      opacity: 0.6, 
      color: colors.sidebarActive,
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    <LogOut size={14} /> EXIT PORTAL
  </button>
</aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        
        {activeSection === 'dashboard' && (
          <div>
            
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
              {[
                { label: 'Total Orders', val: '128', icon: '📦' },
                { label: 'Booked Tables', val: tables.length, icon: '🪑' },
                { label: 'Revenue', val: '₹42,500', icon: '💰' }
              ].map((stat, i) => (
                <div key={i} style={{ 
                  backgroundColor: '#fff', 
                  padding: '30px', 
                  borderRadius: '15px', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Label Style */}
        <span style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: '#8c7e74'
        }}>
          {stat.label}
        </span>
        <span style={{ fontSize: '24px' }}>{stat.icon}</span>
      </div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stat.val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
              <div style={{ ...styles.card, backgroundColor: colors.white }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '12px', textTransform: 'uppercase' }}>Weekly Sales</h4>
                <Bar 
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{ label: 'Orders', data: [12, 19, 15, 22, 30, 45, 38], backgroundColor: colors.coffee, borderRadius: 8 }]
                  }} 
                />
              </div>
              <div style={{ ...styles.card, backgroundColor: colors.white, textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '12px', textTransform: 'uppercase' }}>Occupancy</h4>
                <div style={{ width: '200px', margin: '0 auto' }}>
                  <Pie 
                    data={{
                      labels: ['Booked', 'Free'],
                      datasets: [{ data: [3, 7], backgroundColor: [colors.accent, colors.latte], borderWidth: 0 }]
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {view === 'register-cafe' && (
        <RegisterCafeForm onSubmit={handleRegisterCafe} />
      )}

      {view === 'staff' && (
        <StaffSignup 
           cafeId={selectedCafe?.id} // Now this won't be undefined!
           onBack={() => setView('dashboard')} 
        />
      )}
        {activeSection === 'orders' && <OrdersManagement />}
        {activeSection === 'bookings' && <BookingsManagement />}

        {activeSection === 'register' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Cafe Registration</h2>
            <div style={{ ...styles.card, backgroundColor: colors.white, padding: '40px' }}>
              <form onSubmit={handleRegistration}>
                <div style={styles.formSection}>
                  <div style={styles.headerLabel}>Step 01: Basic Information</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                    <input style={styles.input} required name="cafeName" value={regForm.cafeName} onChange={handleInputChange} placeholder="Cafe Name *" />
                    <input style={styles.input} required name="ownerName" value={regForm.ownerName} onChange={handleInputChange} placeholder="Owner Full Name *" />
                    <input style={styles.input} required name="contactNumber" value={regForm.contactNumber} onChange={handleInputChange} placeholder="Contact Number *" />
                    <input style={styles.input} required type="email" name="email" value={regForm.email} onChange={handleInputChange} placeholder="Email Address *" />
                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                        <span style={{fontSize:'12px'}}>Opens:</span>
                        <input style={styles.input} required type="time" name="openingTime" value={regForm.openingTime} onChange={handleInputChange} />
                    </div>
                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                        <span style={{fontSize:'12px'}}>Closes:</span>
                        <input style={styles.input} required type="time" name="closingTime" value={regForm.closingTime} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
                <div style={styles.formSection}>
                  <div style={styles.headerLabel}>Step 02: Address</div>
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '20px', 
    marginTop: '15px' 
  }}>
    {/* Row 1 */}
    <input 
      style={styles.input} 
      required 
      name="street" 
      value={regForm.street} 
      onChange={handleInputChange} 
      placeholder="Street / Landmark *" 
    />
    <input 
      style={styles.input} 
      required 
      name="district" 
      value={regForm.district} 
      onChange={handleInputChange} 
      placeholder="District / Area *" 
    />

    {/* Row 2 */}
    <input 
      style={styles.input} 
      required 
      name="city" 
      value={regForm.city} 
      onChange={handleInputChange} 
      placeholder="City *" 
    />
    <input 
      style={styles.input} 
      required 
      name="state" 
      value={regForm.state} 
      onChange={handleInputChange} 
      placeholder="State *" 
    />

    {/* Row 3 */}
    <input 
      style={styles.input} 
      required 
      name="pincode" 
      value={regForm.pincode} 
      onChange={handleInputChange} 
      placeholder="Pincode *" 
    />
    <input 
      style={styles.input} 
      required 
      name="country" 
      value={regForm.country} 
      onChange={handleInputChange} 
      placeholder="Country *" 
    />
  </div>
  </div>
 <div style={styles.formSection}>
  <div style={styles.headerLabel}>Step 03: Business Compliance & Media</div>
  
  {/* Row 1 & 2: 4 Evenly spaced text fields */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
    <select style={styles.input} name="businessType" value={regForm.businessType} onChange={handleInputChange}>
        <option>Proprietorship</option>
        <option>Partnership</option>
        <option>Private Limited</option>
    </select>
    
    <input style={styles.input} required name="fssaiLicenseNumber" value={regForm.fssaiLicenseNumber} onChange={handleInputChange} placeholder="FSSAI License No *" />
    
    <input style={styles.input} name="gstNumber" value={regForm.gstNumber} onChange={handleInputChange} placeholder="GST Number (Optional)" />
    
    <input style={styles.input} required name="panNumber" value={regForm.panNumber} onChange={handleInputChange} placeholder="PAN Card Number *" />
  </div>

  {/* Bottom Row: File Uploads moved down */}
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '20px', 
    marginTop: '25px', 
    borderTop: '1px solid #eee', 
    paddingTop: '20px' 
  }}>
    <div>
      <label style={{ fontSize: '10px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>CAFE PHOTOS</label>
      <input 
    type="file" 
    multiple
    onChange={handleMultipleCafeFiles} 
    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} 
  />
      {regForm.cafeImages?.map((img, index) => (
      <img key={index} src={img} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
    ))}
    </div>

    <div>
      <label style={{ fontSize: '10px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>UPLOAD LICENSE (PDF/IMG)</label>
      <input 
  type="file" 
  multiple // Added this for multiple images
  onChange={handleMultipleCafeFiles} // Use the new name we created
  accept="image/*"
  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} 
/>
      {regForm.cafeLicense && <p style={{ fontSize: '10px', color: '#2ecc71', marginTop: '8px', fontWeight: '600' }}>✓ Document attached</p>}
    </div>
  </div>
</div>
                <div style={styles.formSection}>
                  <div style={styles.headerLabel}>Step 04: Payment & Bank</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                    <input style={styles.input} name="accountHolderName" value={regForm.accountHolderName} onChange={handleInputChange} placeholder="Account Holder Name" />
                    <input style={styles.input} name="accountNumber" value={regForm.accountNumber} onChange={handleInputChange} placeholder="Account Number" />
                    <input style={styles.input} name="ifscCode" value={regForm.ifscCode} onChange={handleInputChange} placeholder="IFSC Code" />
                    <input style={{...styles.input, border: `2px solid ${colors.accent}`}} name="upiId" value={regForm.upiId} onChange={handleInputChange} placeholder="OR UPI ID (e.g. cafe@upi)" />
                  </div>
                </div>
                <div style={styles.formSection}>
                  <div style={styles.headerLabel}>Step 05: Service Features</div>
                  <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
                    <label style={styles.checkboxLabel}><input type="checkbox" name="hasHomeDelivery" checked={regForm.hasHomeDelivery} onChange={handleInputChange} /> Home Delivery</label>
                    <label style={styles.checkboxLabel}><input type="checkbox" name="hasTakeaway" checked={regForm.hasTakeaway} onChange={handleInputChange} /> Takeaway</label>
                    <label style={styles.checkboxLabel}><input type="checkbox" name="hasDineIn" checked={regForm.hasDineIn} onChange={handleInputChange} /> Dine-In</label>
                  </div>
                </div>
               <button type="submit" style={styles.buttonPrimary}>
                {isEditing ? "UPDATE CAFE DETAILS" : "REGISTER BUSINESS"}
              </button>

              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(false); setRegForm({}); setActiveSection('my-cafes'); }}
                  style={{ ...styles.buttonPrimary, backgroundColor: '#7f8c8d', marginTop: '10px' }}
                >
                  CANCEL EDIT
                </button>
)}
              </form>
            </div>
          </div>
        )}

        {activeSection === 'my-cafes' && (
  <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <h2 style={{ fontSize: '32px', margin: 0, color: '#4c3c34', fontFamily: "'Playfair Display', serif" }}>My Registered Cafes</h2>
      
      <button 
        onClick={() => {
          setIsEditing(false); 
          setRegForm({});      
          setActiveSection('register');
        }}
        style={{ 
          ...styles.buttonPrimary, 
          width: 'auto', 
          padding: '12px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          borderRadius: '8px' 
        }}
      >
        <PlusCircle size={18} /> REGISTER NEW
      </button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '25px' }}>
      {myCafes.length > 0 ? (
  myCafes.map((cafe) => (
    <div 
      key={cafe.id} 
      style={{ 
        ...styles.card, 
        backgroundColor: '#fff', 
        padding: '24px', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
        transition: 'all 0.3s ease',
        // Highlights the card if it's the currently selected cafe
        border: selectedCafe?.id === cafe.id ? `2px solid #4c3c34` : '1px solid #eee' 
      }}
      onClick={() => {
      setSelectedCafe(cafe); 
      setActiveSection('menu'); 
    }}
    >
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
        
        {/* Cafe Image Container */}
        <div style={{ width: '150px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4eee8', flexShrink: 0 }}>
  <SmoothScrollSlider images={cafe.cafeImages} />
</div>
        
        {/* Text Details */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#4c3c34', fontWeight: 'bold' }}>{cafe.cafeName}</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>{cafe.city}, {cafe.state}</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#999' }}>{cafe.contactNumber}</p>
        </div>

        {/* Profile Action Icons (Edit/Delete) */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleEdit(cafe); }}
            title="Edit Cafe Details"
            style={{ padding: '8px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(cafe.id); }}
            title="Delete Cafe"
            style={{ padding: '8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* QUICK ACTION MANAGEMENT BAR (Your new Requirement) */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        borderTop: '1px solid #f5f5f5', 
        paddingTop: '16px' 
      }}>
        {/* MANAGE MENU BUTTON */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCafe(cafe); 
            setNewItem({ itemName: '', price: '', category: '', description: '', photos: [] }); 

            setActiveSection('menu'); 
          }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            backgroundColor: '#fdfbf9',
            border: '1px solid #eaddd0',
            borderRadius: '10px',
            color: '#4c3c34',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4eee8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fdfbf9'}
        >
          <Coffee size={18} /> Manage Menu
        </button>

        {/* MANAGE TABLES BUTTON */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCafe(cafe);
            setNewTable({ 
            tableNumber: '', 
            capacity: '', 
            price: '', 
            status: 'Available', 
            images: [],
            cafeId: cafe.id 
          });
            fetchTables(cafe.id);
            setActiveSection('tables');
            setView('dashboard'); 
          }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            backgroundColor: '#fdfbf9',
            border: '1px solid #eaddd0',
            borderRadius: '10px',
            color: '#4c3c34',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4eee8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fdfbf9'}
        >
          <TableIcon size={18} /> Manage Tables
        </button>

        {/* MANAGE STAFF BUTTON */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCafe(cafe); 
            setNewTable({ 
            tableNumber: '', 
            capacity: '', 
            price: '', 
            status: 'Available', 
            image: null,
            cafeId: cafe.id
          });
            
            setSelectedCafe(cafe);  
            setActiveSection('staff');
            setShowStaffForm(false);
          }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            backgroundColor: '#fdfbf9',
            border: '1px solid #eaddd0',
            borderRadius: '10px',
            color: '#4c3c34',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4eee8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fdfbf9'}
        >
          <Users size={18} /> Manage Staff
        </button>
      </div>
    </div>
  ))
) : (
  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '20px', border: '2px dashed #e0e0e0' }}>
    <p style={{ color: '#999', fontSize: '18px', marginBottom: '15px' }}>No cafes registered yet.</p>
    <button 
      onClick={() => setActiveSection('register-cafe')}
      style={{ color: '#4c3c34', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', textDecoration: 'underline' }}
    >
      Start your journey by adding your first cafe
    </button>
  </div>
)}
    </div>
  </div>
)}

        {activeSection === 'menu' && (
  <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
    <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>
      Manage Menu {selectedCafe ? `for ${selectedCafe.cafeName}` : ''}
    </h2>
    
    <div style={{ ...styles.card, backgroundColor: colors.white }}>
      <form onSubmit={handleAddMenu} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            style={styles.input} 
            required 
            placeholder="Item Name" 
            value={newItem.itemName} 
            onChange={(e) => setNewItem({...newItem, itemName: e.target.value})} 
          />
          
          {/* CATEGORY SELECT - Fixed to ensure value maps to 'category' field */}
          <select
            style={styles.input}
            required
            value={newItem.category || ""} 
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
          >
            <option value="">Select Category</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Desserts">Desserts</option>
            <option value="Main Course">Main Course</option>
          </select>

          <input 
            style={styles.input} 
            required 
            type="number" 
            placeholder="Price (₹)" 
            value={newItem.price} 
            onChange={(e) => setNewItem({...newItem, price: e.target.value})} 
          />
          <textarea 
            style={{ ...styles.input, height: '100px', resize: 'none' }} 
            placeholder="Description" 
            value={newItem.description} 
            onChange={(e) => setNewItem({...newItem, description: e.target.value})} 
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          {/* MULTIPLE IMAGE PREVIEW */}
          <div style={{ 
            width: '100%', 
            minHeight: '150px', 
            border: `2px dashed ${colors.latte}`, 
            borderRadius: '12px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px', 
            padding: '10px',
            justifyContent: 'center',
            overflowY: 'auto' 
          }}>
            {newItem.photos && newItem.photos.length > 0 ? (
              newItem.photos.map((photo, index) => (
                <img key={index} src={photo} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
              ))
            ) : (
              <span style={{ opacity: 0.5, alignSelf: 'center' }}>Image Previews</span>
            )}
          </div>

          {/* MULTIPLE FILE INPUT */}
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleMenuImage} 
            style={{ fontSize: '12px' }} 
          />
          <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>You can select multiple photos</p>
          
          <button type="submit" style={styles.buttonPrimary}>Save to Menu</button>
        </div>
      </form>
    </div>

    {/* MENU DISPLAY GRID */}
<div style={styles.menuGrid}>
  {menuItems.map((item) => {
    // Local index for the carousel
    const currentIndex = item.activeIndex || 0;

    return (
      <div key={item.id} style={styles.menuCard}>
        {/* AESTHETIC EDIT/DELETE OVERLAY */}
  <div style={styles.iconOverlay}>
    <button 
      onClick={(e) => { e.stopPropagation(); handleEditItem(item); }} 
      style={styles.miniBtn('edit')}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Pencil size={16} />
    </button>
    <button 
      onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} 
      style={styles.miniBtn('delete')}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Trash2 size={16} />
    </button>
  </div>
        <button onClick={() => handleDeleteMenu(item.id)} style={styles.deleteBtn}>✕</button>
        
        {/* CAROUSEL CONTAINER */}
        <div style={{ 
          height: '200px', 
          backgroundColor: '#eee', 
          position: 'relative', 
          overflow: 'hidden',
          borderRadius: '12px 12px 0 0' 
        }}>
          {item.photos && item.photos.length > 0 ? (
            <>
              {/* SLIDING TRACK */}
              <div style={{ 
                display: 'flex', 
                height: '100%',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
                transform: `translateX(-${currentIndex * 100}%)` 
              }}>
                {item.photos.map((photo, i) => (
                  <img 
                    key={i} 
                    src={photo} 
                    alt={`${item.itemName} ${i}`} 
                    style={{ minWidth: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ))}
              </div>

              {/* ARROWS - Only show if more than 1 photo exists */}
              {item.photos.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.preventDefault(); handlePrevImage(item.id); }}
                    style={{ ...carouselArrowStyle, left: '10px' }}
                  > ‹ </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleNextImage(item.id); }}
                    style={{ ...carouselArrowStyle, right: '10px' }}
                  > › </button>
                  
                  {/* INDICATOR DOTS */}
                  <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    {item.photos.map((_, i) => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                        transition: '0.3s'
                      }} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              No Image Available
            </div>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{item.itemName}</h3>
            <span style={{ fontWeight: 'bold', color: colors.accent }}>₹{item.price}</span>
          </div>
          <p style={{ fontSize: '12px', color: colors.coffee, fontWeight: 'bold', marginBottom: '10px' }}>{item.category}</p>
          <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>{item.description}</p>
        </div>
      </div>
    );
  })}
</div>
  </div>
)}

        {activeSection === 'staff' && (
  <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
    <h2 style={{ fontSize: '32px', marginBottom: '30px', color: '#4c3c34', fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>
      Staff Management
    </h2>

    {!selectedCafe ? (
      <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '15px', color: '#8c7e74' }}>
        <h3>No Cafe Selected</h3>
        <p>Please select a cafe from "My Cafes" to manage its staff.</p>
        <button onClick={() => setActiveSection('my-cafes')} style={{...styles.buttonPrimary, width: 'auto', marginTop: '15px'}}>Go to My Cafes</button>
      </div>
    ) : (
      <>
        {showStaffForm ? (
      /* VIEW 1: THE SIGNUP FORM */
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease-in' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' }}>
          <button 
            onClick={() => { setShowStaffForm(false); setSelectedRole(""); }}
            style={{ backgroundColor: '#f5f0eb', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#4c3c34' }}
          >
            ← Back to Selection
          </button>
          <h3 style={{ margin: 0, color: '#4c3c34' }}>Registering: {selectedRole}</h3>
        </div>
        <StaffSignup 
          onBack={() => setShowStaffForm(false)} 
          cafeId={selectedCafe?.id} 
          role={selectedRole}
          onSuccess={(newStaff) => {
            setStaffList([...staffList, newStaff]);
            setShowStaffForm(false);
            setSelectedRole("");
          }}
        />
      </div>
    ) : showStaffList ? (
      /* VIEW 2: PAGINATED STAFF LIST */
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <button 
            onClick={() => setShowStaffList(false)}
            style={{ backgroundColor: '#f5f0eb', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#4c3c34' }}
          >
            ← Back to Selection
          </button>
          <h3 style={{ margin: 0, color: '#4c3c34' }}>Registered Staff Inventory</h3>
        </div>

        {staffList.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {staffList
                  .slice((staffCurrentPage - 1) * staffPerPage, staffCurrentPage * staffPerPage)
                  .map((staff) => (
                    <div key={staff.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '12px', position: 'relative', backgroundColor: '#fff' }}>
                      <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px' }}>
                        {staff.role === 'Chef' ? '👨‍🍳' : '🤵'}
                      </div>
                      
                      <h4 style={{ margin: '0 0 5px 0', color: '#4c3c34' }}>{staff.firstName} {staff.lastName}</h4>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: '#f5f0eb', color: '#4c3c34', padding: '3px 8px', borderRadius: '4px' }}>
                        {staff.role?.toUpperCase()}
                      </span>

                      <div style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
                        <p style={{ margin: '4px 0' }}>📧 {staff.email}</p>
                        <p style={{ margin: '4px 0' }}>📞 {staff.phone}</p>
                      </div>

                      {/* THE REVOKE BUTTON */}
                      <button 
                        onClick={() => handleRevokeStaff(staff.id)}
                        style={{
                          marginTop: '15px',
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e74c3c',
                          backgroundColor: 'transparent',
                          color: '#e74c3c',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e74c3c';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#e74c3c';
                        }}
                      >
                        REVOKE ACCESS
                      </button>
                    </div>
                ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
              <button 
                disabled={staffCurrentPage === 1}
                onClick={() => setStaffCurrentPage(p => p - 1)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', cursor: staffCurrentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: staffCurrentPage === 1 ? '#f9f9f9' : '#fff' }}
              >
                Previous
              </button>
              <span style={{ fontWeight: 'bold', color: '#4c3c34' }}>Page {staffCurrentPage}</span>
              <button 
                disabled={staffCurrentPage * staffPerPage >= staffList.length}
                onClick={() => setStaffCurrentPage(p => p + 1)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', cursor: staffCurrentPage * staffPerPage >= staffList.length ? 'not-allowed' : 'pointer', backgroundColor: staffCurrentPage * staffPerPage >= staffList.length ? '#f9f9f9' : '#fff' }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#8c7e74', fontStyle: 'italic' }}>No staff members registered yet.</p>
        )}
      </div>
    ) : (
      /* VIEW 3: SELECTION BOXES (Default) */
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#8c7e74', marginBottom: '30px' }}>Select a role to manage or add new staff</p>
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '40px' }}>
          {[
            { role: 'Chef', emoji: '👨‍🍳', description: 'Kitchen & Menu Management' },
            { role: 'Waiter', emoji: '🤵', description: 'Service & Table Management' },
          ].map((item) => (
            <div 
              key={item.role}
              onClick={() => { setSelectedRole(item.role); setShowStaffForm(true); }}
              style={{ backgroundColor: '#fff', padding: '50px 30px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', width: '280px', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #eee' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = '#f39c12'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#eee'; }}
            >
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>{item.emoji}</div>
              <h3 style={{ letterSpacing: '1px', marginBottom: '10px', color: '#4c3c34' }}>{item.role}</h3>
              <p style={{ fontSize: '14px', color: '#8c7e74', lineHeight: '1.5' }}>Click to register a new {item.role}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowStaffList(true)}
          style={{ background: 'none', border: 'none', color: '#8c7e74', textDecoration: 'underline', cursor: 'pointer', fontSize: '16px' }}
        >
          View Registered Staff List ({staffList.length})
        </button>
      </div>
    )}
    </>
    )}
  </div>
)}

        {/* INTEGRATED TABLE MANAGEMENT SECTION */}
      {activeSection === 'tables' && (
  <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ backgroundColor: '#4c3c34', padding: '10px', borderRadius: '12px', display: 'flex' }}>
          <TableIcon size={28} color="#fff" />
        </div>
        <h2 style={{ fontSize: '32px', margin: 0, color: '#4c3c34' }}>Inventory</h2>
      </div>

      {!showTableForm && (
        <button onClick={() => setShowTableForm(true)} style={{ ...styles.buttonPrimary, width: 'auto' }}>
          + Add New Table
        </button>
      )}
    </div>

    {showTableForm && (
      <div style={{ ...styles.card, backgroundColor: colors.white, marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>New Table Details</h3>
        
        <form onSubmit={handleAddTable}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <input 
              style={styles.input} required type="number" placeholder="Table Number" 
              value={newTable.tableNumber} 
              onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})} 
            />
            <input 
              style={styles.input} required type="number" placeholder="Capacity (Persons)" 
              value={newTable.capacity} 
              onChange={(e) => setNewTable({...newTable, capacity: e.target.value})} 
            />
            <input 
              style={styles.input} required type="number" placeholder="Price Per Hour (₹)" 
              value={newTable.price} 
              onChange={(e) => setNewTable({...newTable, price: e.target.value})} 
            />
            
            {/* New Description Field */}
            <textarea 
              style={{ ...styles.input, gridColumn: 'span 3', height: '80px', resize: 'none' }}
              placeholder="Table Description (e.g., Window side, Quiet corner...)"
              value={newTable.description}
              onChange={(e) => setNewTable({...newTable, description: e.target.value})}
            />

            {/* New Amenities Field */}
            <input 
              style={{ ...styles.input, gridColumn: 'span 3' }}
              placeholder="Amenities (e.g., Power Socket, AC, Near WiFi - separate with commas)"
              value={newTable.amenities}
              onChange={(e) => setNewTable({...newTable, amenities: e.target.value})}
            />
            
            <div style={{ gridColumn: 'span 3', padding: '20px', border: `2px dashed ${colors.latte}`, borderRadius: '12px', textAlign: 'center', backgroundColor: '#fdfbf9' }}>
              {newTable.image && (
                <div style={{ marginBottom: '15px' }}>
                  <img src={newTable.image} alt="Preview" style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }} />
                </div>
              )}
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '10px', color: colors.accent, fontWeight: 'bold' }}>UPLOAD TABLE IMAGE</label>
              <input 
                type="file" 
                multiple 
                onChange={handleMultipleTableImages} 
                style={{ fontSize: '12px' }} 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
    {newTable.images?.map((img, index) => (
      <img key={index} src={img} alt="Table Preview" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
    ))}
  </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '25px', alignItems: 'center' }}>
            <button type="submit" style={{ backgroundColor: '#4c3c34', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              ADD TABLE
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowTableForm(false);
                setNewTable({ tableNumber: '', capacity: '', price: '', description: '', amenities: '', image: null });
              }} 
              style={{ background: 'none', border: `1px solid ${colors.latte}`, color: colors.coffee, padding: '11px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    <div style={styles.tableGrid}>
  {(!tables || tables.length === 0) ? (
    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', opacity: 0.5 }}>
      No tables in inventory. Click "+ Add New Table" to start.
    </div>
  ) : (
    tables.map((table) => (
      <div key={table.id} style={{ ...styles.menuCard, position: 'relative', overflow: 'hidden' }}>
        
        {/* IMAGE SECTION */}
        {table.images && table.images.length > 0 ? (
          <ImageCarousel images={table.images} />
        ) : (
          <div style={{ ...styles.itemImage, backgroundColor: colors.latte, height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '40px' }}>🪑</span>
          </div>
        )}
        
        {/* DETAILS SECTION */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: colors.coffee }}>Table {table.tableNumber}</h3>
            <span style={{ fontWeight: 'bold', color: colors.accent }}>₹{table.price}/hr</span>
          </div>
          
          <p style={{ fontSize: '14px', opacity: 0.7, margin: '10px 0' }}>
            Capacity: {table.capacity} Persons
          </p>
          
          {table.description && (
            <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginBottom: '10px' }}>
              {table.description}
            </p>
          )}

          {table.amenities && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
              {table.amenities.split(',').map((tag, idx) => (
                <span key={idx} style={{ fontSize: '10px', backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', color: '#4c3c34' }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          
          {/* ACTIONS SECTION */}
          <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <button 
              onClick={() => { 
                setNewTable(table); 
                setShowTableForm(true); 
              }}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#f39c12', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => handleRemoveTable(table.id)} 
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#e74c3c', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>
  </div>
)}

      </main>
    </div>
  );
};

export default CafeOwnerProfile;