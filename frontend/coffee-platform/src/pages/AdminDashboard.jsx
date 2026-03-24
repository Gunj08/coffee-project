import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // For Detail Modal

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      // Updated endpoint to match the status-based fetch in UserService
      const response = await fetch('http://localhost:8080/users/status/PENDING');
      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);
    if (!confirmAction) return;

    try {
      // This calls the specific approveUser logic we updated in the backend
      const endpoint = action === 'Approved' 
        ? `http://localhost:8080/users/approve/${userId}` 
        : `http://localhost:8080/users/deny/${userId}`;

      const response = await fetch(endpoint, { method: 'POST' });

      if (response.ok) {
        alert(`User ${action} successfully. Email notification sent.`);
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
        setSelectedUser(null);
      } else {
        alert("Action failed. Please check server logs.");
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  const viewDocument = (fileName) => {
    if (!fileName) return alert("No document available.");
    window.open(`http://localhost:8080/uploads/proofs/${fileName}`, '_blank');
  };

  const styles = {
    container: { backgroundColor: '#FFF8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Poppins', sans-serif" },
    content: { padding: '100px 40px', flex: 1 },
    title: { color: '#4B2C20', borderBottom: '2px solid #A67B5B', paddingBottom: '10px', marginBottom: '30px' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' },
    th: { backgroundColor: '#4B2C20', color: 'white', textAlign: 'left', padding: '15px' },
    td: { padding: '15px', borderBottom: '1px solid #eee' },
    actionBtn: { padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '5px' },
    modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 1000, maxWidth: '500px', width: '90%' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },

    logo: {
            position: 'absolute',
            top: '30px',
            left: '40px',
            fontSize: '32px',
            fontWeight: '800',
            fontFamily: "'Playfair Display', serif",
            color: '#4B2C20',
            cursor: 'pointer',
            letterSpacing: '1px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            zIndex: 10
        }
  };

  return (
    <div style={styles.container}>

      <div style={styles.logo} onClick={() => navigate('/')}>
            Bookafé
        </div>
      
      <div style={styles.content}>
        <h2 style={styles.title}>Admin Approval Portal</h2>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading pending requests...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Applicant</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Profile Details</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length > 0 ? (
                pendingUsers.map(user => (
                  <tr key={user.id}>
                    <td style={styles.td}>
                      <strong>{user.firstName} {user.lastName}</strong><br/>
                      <small>{user.role}</small>
                    </td>
                    <td style={styles.td}>
                      {user.email}<br/>
                      <small>{user.phoneNumber}</small>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => setSelectedUser(user)} style={{ background: 'none', border: 'none', color: '#6F4E37', textDecoration: 'underline', cursor: 'pointer' }}>
                        View Info & ID
                      </button>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleAction(user.id, 'Approved')} style={{ ...styles.actionBtn, backgroundColor: '#28a745', color: 'white' }}>Approve</button>
                      <button onClick={() => handleAction(user.id, 'Denied')} style={{ ...styles.actionBtn, backgroundColor: '#dc3545', color: 'white' }}>Deny</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No pending applications.</td></tr>
              )}
            </tbody>
          </table>
        )}

        {/* DETAIL MODAL */}
        {selectedUser && (
          <>
            <div style={styles.overlay} onClick={() => setSelectedUser(null)} />
            <div style={styles.modal}>
              <h3 style={{ color: '#4B2C20', marginTop: 0 }}>Review Application</h3>
              <p><strong>Address:</strong> {selectedUser.plotNo}, {selectedUser.street}, {selectedUser.city} - {selectedUser.pincode}</p>
              
              <h4 style={{ marginBottom: '5px' }}>Academic History:</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                {selectedUser.academicHistory?.map((edu, i) => (
                  <li key={i}>{edu.degree} from {edu.institution} ({edu.yearOfPassing})</li>
                ))}
              </ul>

              {selectedUser.workExperience && (
                <>
                  <h4>Work Experience:</h4>
                  <p style={{ fontSize: '14px' }}>{selectedUser.workExperience}</p>
                </>
              )}

                <button 
                  onClick={() => viewDocument(selectedUser.govtProofPath)}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#A67B5B', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}
                >
                  Open Government ID Proof
                </button>
              
              <button onClick={() => setSelectedUser(null)} style={{ width: '100%', background: 'none', border: '1px solid #ccc', padding: '8px', borderRadius: '5px' }}>Close</button>
            </div>
          </>
        )}
      </div>
      
    </div>
  );
};

export default AdminDashboard;