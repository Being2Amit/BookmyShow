import { useState, useContext } from 'react';
import { useDispatch } from "react-redux"; // Import Redux Dispatch
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import LogoutModal from '../logout/Logout'; 
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext'; 

function Profile() {
  const dispatch = useDispatch(); // Initialize Redux Dispatch
  const { logout } = useAuth();
  const { clearCity } = useContext(AppContext); 
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });// Dispatch Redux action to clear the store
    logout(); // Call the AuthContext logout function
    clearCity(); // Reset city in context
    setShowLogoutModal(false);// Close modal & show toast
    localStorage.clear();// Clear local storage
    Object.keys(Cookies.get() || {}).forEach((cookie) => Cookies.remove(cookie));// Clear cookies
    navigate("/", { state: { loggedOut: true } });// Redirect to home
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        {/* Left Side Navigation */}
        <div className="col-md-2 bg-light border-end p-0 m-0">
          <div className="list-group list-group-flush">
            <NavLink to="details" className={({ isActive }) => `list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-person-circle me-2 fs-3"></i> My Profile
            </NavLink>
            <NavLink to="history" className={({ isActive }) => `list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-film me-2 fs-3"></i> Booking History
            </NavLink>
            <NavLink to="favorites" className={({ isActive }) => `list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-star me-2 fs-3"></i> Favorite Genres
            </NavLink>
            <NavLink to="changepass" className={({ isActive }) => `list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-key me-2 fs-3"></i> Change Password
            </NavLink>
            <NavLink to="support" className={({ isActive }) => `list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-question-circle me-2 fs-3"></i> Help & Support
            </NavLink>
            <NavLink to="settings" className={({ isActive }) => `list-group-item list-group-item-action d-flex align-items-center 
              ${isActive ? "active" : ""}`}><i className="bi bi-gear me-2 fs-3"></i> Account & Settings
            </NavLink>
            <button onClick={() => setShowLogoutModal(true)} className="list-group-item list-group-item-action d-flex align-items-center text-danger">
              <i className="bi bi-box-arrow-right me-2 fs-3"></i> Logout
            </button>
          </div>
        </div>
        {/* Right Side Content */}
        <div className="col-md-10 p-0">
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
