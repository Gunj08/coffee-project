import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Map, 
  Activity, 
  ClipboardList, 
  User, 
  LogOut,
  Coffee
} from 'lucide-react';
import "../responsive.css";

const WaiterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ready");
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  const [cafeDetails, setCafeDetails] = useState(null);
  const [cafeMenuItems, setCafeMenuItems] = useState([]);
  const [cafeTables, setCafeTables] = useState([]);

  const colors = {
    coffee: "#4b2c20",
    sidebarBg: '#2b1d19', // Dark Roasted Coffee
    sidebarText: '#fdfbf9', // Cream
    sidebarActive: '#a27c5c', // Bronze Accent
    latte: "#cbbcb2",
    cream: "#fdfbf9",
    white: "#ffffff",
    accent: "#8d6e63",
    highlight: "#b6a291",
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f8f5f2",
      fontFamily: "'Poppins', sans-serif",
    },
    sidebar: {
      backgroundColor: colors.sidebarBg,
      color: colors.sidebarText,
      boxShadow: "4px 0 15px rgba(0,0,0,0.15)",
    },
    sidebarHeader: {
      padding: "40px 30px",
      fontSize: "22px",
      fontWeight: "bold",
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      color: colors.sidebarText,
    },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px 25px",
      cursor: "pointer",
      backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      transition: "0.3s",
      borderLeft: active
        ? `5px solid ${colors.sidebarActive}`
        : "5px solid transparent",
      color: active ? colors.sidebarActive : colors.sidebarText,
      fontWeight: active ? "700" : "500",
      fontSize: "15px",
    }),
    content: { padding: "40px 60px", overflowY: "auto" },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    title: { fontSize: "24px", color: colors.coffee, fontWeight: "700" },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      border: "1px solid #f0ebe6",
    },
    tableNode: (status) => ({
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: status === "Occupied" ? colors.latte : colors.white,
      border: `3px solid ${status === "Occupied" ? colors.accent : "#E0E0E0"}`,
      color: colors.coffee,
      cursor: "default",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      transition: "all 0.3s",
    }),
    badge: (status) => ({
      padding: "4px 10px",
      borderRadius: "15px",
      fontSize: "11px",
      fontWeight: "700",
      backgroundColor: status === "READY" ? "#C8E6C9" : "#E1F5FE",
      color: status === "READY" ? "#2E7D32" : "#0288D1",
      textTransform: "uppercase",
    }),
    actionBtn: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: colors.coffee,
      color: "white",
      fontWeight: "600",
      marginTop: "15px",
      cursor: "pointer",
    },
    label: {
      fontSize: "12px",
      color: "#666",
      display: "block",
      marginBottom: "4px",
    },
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const loadInitialData = () => {
      if (activeTab === "ready") fetchOrders(["READY"]);
      else if (activeTab === "map") fetchTables();
      else if (activeTab === "active") fetchOrders(["DELIVERED", "SERVED"]);
      else if (activeTab === "history") fetchOrders(["COMPLETED"]);
      // No fetch needed for 'profile' tab
    };

    loadInitialData();

    // Polling for ready/active orders every 10 seconds
    let intervalId = null;
    if (activeTab === "ready" || activeTab === "active") {
      intervalId = setInterval(() => {
        const statuses =
          activeTab === "ready" ? ["READY"] : ["DELIVERED", "SERVED"];
        fetchOrders(statuses);
      }, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab, profileData]);

  useEffect(() => {
    const syncProfile = async () => {
      const currentCafe =
        profileData?.cafeName ||
        profileData?.cafe?.cafeName ||
        profileData?.cafe;
      if (
        profileData?.email &&
        (!currentCafe || currentCafe === "na" || currentCafe === "undefined")
      ) {
        console.log(
          "Waiter Dashboard: Profile missing cafe link. Attempting to sync...",
        );
        try {
          console.log(
            `Waiter Dashboard: Syncing profile for ${profileData.email}...`,
          );
          const res = await fetch(
            `http://localhost:8080/api/dashboard/sync-profile?email=${encodeURIComponent(profileData.email)}`,
          );
          if (res.ok) {
            const freshUser = await res.json();
            console.log(
              "Waiter Dashboard: Profile synced successfully:",
              freshUser,
            );
            setProfileData(freshUser);
            localStorage.setItem("user", JSON.stringify(freshUser));
          } else {
            console.error(
              `Waiter Dashboard: Sync failed with status ${res.status}`,
            );
          }
        } catch (err) {
          console.error(
            "Waiter Dashboard: Sync failed due to network error:",
            err,
          );
        }
      }
    };
    syncProfile();
    fetchCafeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const fetchCafeDetails = async () => {
    const cafeId =
      profileData?.cafe?.id ||
      profileData?.cafeId ||
      (typeof profileData?.cafe === "number" ? profileData.cafe : null);
    if (!cafeId) return;
    try {
      const [cafeRes, menuRes, tableRes] = await Promise.all([
        fetch(`http://localhost:8080/api/cafes/${cafeId}`),
        fetch(`http://localhost:8080/api/menu/cafe/${cafeId}`),
        fetch(`http://localhost:8080/api/cafes/tables/${cafeId}`),
      ]);
      if (cafeRes.ok) setCafeDetails(await cafeRes.json());
      if (menuRes.ok) setCafeMenuItems(await menuRes.json());
      if (tableRes.ok) setCafeTables(await tableRes.json());
    } catch (error) {
      console.error("Waiter Dashboard: Error fetching cafe details:", error);
    }
  };

  const fetchOrders = async (statuses) => {
    console.log("Waiter Dashboard profileData:", profileData);

    const cafeId =
      profileData?.cafe?.id ||
      profileData?.cafeId ||
      (typeof profileData?.cafe === "number" ? profileData.cafe : null);
    const cafeName =
      profileData?.cafeName ||
      profileData?.cafe?.cafeName ||
      profileData?.companyName;

    if (!cafeId && !cafeName) {
      console.warn(
        "Waiter Dashboard: Both Cafe ID and Cafe Name are missing from profileData",
      );
      return;
    }

    setLoading(true);
    try {
      const statusParams = statuses.map((s) => `status=${s}`).join("&");
      let url = "";

      if (cafeId) {
        url = `http://localhost:8080/api/orders/cafe/id/${cafeId}/status?${statusParams}`;
      } else {
        url = `http://localhost:8080/api/orders/cafe/${encodeURIComponent(cafeName)}/status?${statusParams}`;
      }

      console.log(`Waiter Dashboard: Fetching orders from ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch orders: ${response.status} - ${errorBody}`,
        );
      }
      const data = await response.json();
      console.log(
        `Waiter Dashboard: Successfully fetched ${data.length} orders`,
      );
      setOrders(data);
    } catch (error) {
      console.error("Waiter Dashboard: Error in fetchOrders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    const cafeId =
      profileData?.cafe?.id ||
      profileData?.cafeId ||
      (typeof profileData?.cafe === "number" ? profileData.cafe : null);
    if (!cafeId) {
      console.warn("Waiter Dashboard: Cafe ID missing for table map fetch");
      return;
    }
    setLoading(true);
    try {
      const url = `http://localhost:8080/api/tables/cafe/${cafeId}`;
      console.log(`Waiter Dashboard: Fetching tables from ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error("Waiter Dashboard: Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`,
        { method: "POST" },
      );
      if (response.ok) {
        setOrders(orders.filter((o) => o.id !== orderId));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!profileData)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#6F4E37",
        }}
      >
        Syncing service data...
      </div>
    );

  if (profileData.status !== "ACTIVE") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#FFF8F0",
          fontFamily: "'Poppins', sans-serif",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            maxWidth: "500px",
          }}
        >
          <h2 style={{ color: "#4B2C20", marginBottom: "20px" }}>
            Service Activation Required
          </h2>
          <p
            style={{
              color: "#6F4E37",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            Welcome Waiter <strong>{profileData.firstName}</strong>! Your
            account is approved, but you must set a permanent password before
            accessing the hospitality dashboard.
          </p>
          <button
            onClick={() => navigate(`/set-password?email=${profileData.email}`)}
            style={{ ...styles.actionBtn, padding: "15px" }}
          >
            Go to Password Setup
          </button>
          <p style={{ marginTop: "20px", fontSize: "13px", color: "#888" }}>
            After setting your password, please log in again to activate your
            workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Mobile hamburger toggle */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}
        style={styles.sidebar}
      >
        <div
          style={{
            ...styles.sidebarHeader,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              marginRight: "12px",
            }}
          >
            <Coffee size={24} color={colors.sidebarActive} />
          </div>
          Waiter Flow
        </div>
        <nav style={{ flex: 1, marginTop: "10px" }}>
          <div
            style={styles.navItem(activeTab === "ready")}
            onClick={() => {
              setActiveTab("ready");
              setSidebarOpen(false);
            }}
          >
            <Bell size={20} /> Service Ready
          </div>
          <div
            style={styles.navItem(activeTab === "map")}
            onClick={() => {
              setActiveTab("map");
              setSidebarOpen(false);
            }}
          >
            <Map size={20} /> Floor Plan
          </div>
          <div
            style={styles.navItem(activeTab === "active")}
            onClick={() => {
              setActiveTab("active");
              setSidebarOpen(false);
            }}
          >
            <Activity size={20} /> Active Tasks
          </div>
          <div
            style={styles.navItem(activeTab === "history")}
            onClick={() => {
              setActiveTab("history");
              setSidebarOpen(false);
            }}
          >
            <ClipboardList size={20} /> Shift Log
          </div>
          <div
            style={styles.navItem(activeTab === "profile")}
            onClick={() => {
              setActiveTab("profile");
              setSidebarOpen(false);
            }}
          >
            <User size={20} /> My Profile
          </div>
        </nav>
        <div
          style={{ ...styles.navItem(false), marginBottom: "20px" }}
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <LogOut size={20} /> Logout
        </div>
      </aside>

      <div className="dashboard-main" style={styles.content}>
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h1 style={styles.title}>
              {activeTab === "ready" && "Ready for Service"}
              {activeTab === "map" && "Floor Plan Overview"}
              {activeTab === "active" && "Tables Currently in Service"}
              {activeTab === "history" && "Completed Tasks"}
              {activeTab === "profile" && "My Profile"}
            </h1>
            {cafeDetails && (
              <div
                style={{
                  paddingLeft: "20px",
                  borderLeft: "2px solid #ddd",
                  color: colors.accent,
                  fontWeight: "600",
                }}
              >
                ☕ {cafeDetails.cafeName} | 📍 {cafeDetails.city}
              </div>
            )}
          </div>
          <div style={{ color: "#4B2C20", fontWeight: "600" }}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
              color: "#6F4E37",
            }}
          >
            Syncing service data...
          </div>
        ) : activeTab === "map" ? (
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              justifyItems: "center",
            }}
          >
            {tables.map((table) => (
              <div key={table.id} style={{ textAlign: "center" }}>
                <div style={styles.tableNode(table.status)}>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>
                    TABLE
                  </span>
                  <span style={{ fontSize: "24px", fontWeight: "800" }}>
                    {table.tableNumber}
                  </span>
                  <span style={{ fontSize: "10px" }}>
                    {table.capacity} Seats
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: table.status === "Occupied" ? "#A67B5B" : "#999",
                  }}
                >
                  {table.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "profile" ? (
          <div style={styles.card}>
            <h2 style={{ color: colors.coffee, marginBottom: "20px" }}>
              Staff Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <span style={styles.label}>FULL NAME</span>
                <div style={{ fontWeight: "600", color: colors.coffee }}>
                  {profileData.firstName} {profileData.lastName}
                </div>
              </div>
              <div>
                <span style={styles.label}>EMAIL ADDRESS</span>
                <div style={{ fontWeight: "600", color: colors.coffee }}>
                  {profileData.email}
                </div>
              </div>
              <div>
                <span style={styles.label}>PHONE NUMBER</span>
                <div style={{ fontWeight: "600", color: colors.coffee }}>
                  {profileData.phoneNumber}
                </div>
              </div>
              <div>
                <span style={styles.label}>ROLE</span>
                <div style={{ fontWeight: "600", color: colors.coffee }}>
                  {profileData.role}
                </div>
              </div>
              {cafeDetails && (
                <>
                  <div>
                    <span style={styles.label}>ASSIGNED CAFE</span>
                    <div style={{ fontWeight: "600", color: colors.coffee }}>
                      {cafeDetails.cafeName}
                    </div>
                  </div>
                  <div>
                    <span style={styles.label}>LOCATION</span>
                    <div style={{ fontWeight: "600", color: colors.coffee }}>
                      {cafeDetails.city}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.grid}>
            {orders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  gridColumn: "1/-1",
                  padding: "50px",
                  color: "#A67B5B",
                  backgroundColor: "white",
                  borderRadius: "15px",
                }}
              >
                All clear! No pending tasks in this section.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} style={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "15px",
                    }}
                  >
                    <span style={styles.badge(order.status)}>
                      {order.status}
                    </span>
                    <span style={{ color: "#A67B5B", fontWeight: "600" }}>
                      Table {order.tableNumber}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <strong>Customer:</strong> {order.customerName}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: colors.accent,
                        fontWeight: "600",
                      }}
                    >
                      {formatTime(order.orderDate)}
                    </span>
                  </div>
                  <div
                    style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}
                  >
                    <ul
                      style={{
                        paddingLeft: "20px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      {order.items?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {order.status === "READY" && (
                    <button
                      style={styles.actionBtn}
                      onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                    >
                      Pick Up Order
                    </button>
                  )}
                  {order.status === "DELIVERED" && (
                    <button
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: "#2E7D32",
                      }}
                      onClick={() => updateOrderStatus(order.id, "SERVED")}
                    >
                      Mark as Served
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterDashboard;
