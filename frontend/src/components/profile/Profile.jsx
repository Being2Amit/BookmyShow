import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from '../logout/Logout'; 
import { toast } from 'react-toastify';
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {toast.success("Profile loaded successfully");}, []);
  const handleLogout = () => {
    logout(); setShowLogoutModal(false);
    toast.success("Profile have been logged out.");
    navigate("/", { state: { loggedOut: true } }); // Redirect to home
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        {/* Left Side Navigation */}
        <div className="col-md-3 bg-light border-end p-0">
          <div className="list-group list-group-flush">
            <NavLink to="details" className={({ isActive }) => `list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-person-circle me-2 fs-3"></i> My Profile
            </NavLink>
            <NavLink to="history"className={({ isActive }) =>`list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-film me-2 fs-3"></i> My Bookings
            </NavLink>
            <NavLink to="favorites" className={({ isActive }) =>`list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-star me-2 fs-3"></i> Favourites
            </NavLink>
            <NavLink to="changepass" className={({ isActive }) =>`list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-key me-2 fs-3"></i> Change Password
            </NavLink>
            <NavLink to="support" className={({ isActive }) =>`list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-question-circle me-2 fs-3"></i> Help & Support
            </NavLink>
            <NavLink to="settings"className={({ isActive }) =>`list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-gear me-2 fs-3"></i> Account & Settings
            </NavLink>
            <button onClick={() => setShowLogoutModal(true)}className="list-group-item list-group-item-action d-flex align-items-center text-danger">
              <i className="bi bi-box-arrow-right me-2 fs-3"></i> Logout
            </button>
          </div>
        </div>
        {/* Right Side Content */}
        <div className="col-md-9 p-0">
          <div className="h-100 shadow-sm">
            <div className="card-body">
              <Outlet /> {/* Nested routes will render here */}
            </div>
          </div>
        </div>
      </div>
      <LogoutModal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </div>
  );
};

export default Profile;
