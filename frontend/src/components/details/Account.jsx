import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Personal from "./Personal";
import Modal from "./modal/PopModal";

function ProfileD() {
  const [userData, setUserData] = useState({ fullname: '', mobile: '', email: '', password: '' });
  const [originalUserData, setOriginalUserData] = useState({ fullname: '', mobile: '', email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for the confirmation modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    validateInput(name, value);
  };
  const validateInput = (name, value) => {
    const errors = {};
    
    // Full name validation: Non-empty and allows letters, spaces, and basic characters
    if (name === "fullname") {
      const fullnameRegex = /^[a-zA-Z\s]{2,}$/; // Minimum 2 characters, letters, and spaces only
      errors.fullname = !fullnameRegex.test(value.trim())
        ? "Full name is required and should contain only letters and spaces."
        : "";
    }
  
    // Email validation
    if (name === "email") {
      const emailRegex = /^\S+@\S+\.\S+$/;
      errors.email = !emailRegex.test(value.trim())
        ? "Please enter a valid email address."
        : "";
    }
  
    // Mobile number validation
    if (name === "mobile") {
      const mobileRegex = /^[6-9][0-9]{9}$/; // Starts with 6-9 and contains exactly 10 digits
      errors.mobile = !mobileRegex.test(value.trim())
        ? "Mobile number must start with 6-9 and be exactly 10 digits long."
        : "";
    }
  
    // Update validationErrors state
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      ...errors,
      [name]: errors[name], // Update only the field being validated
    }));
  };
  

  // Fetch profile
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${token}`, },
      });
      setUserData(response.data);
      setOriginalUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.response?.data?.message || "Unable to fetch profile details.");
    }
  };
  useEffect(() => { fetchProfile(); }, []);

  // Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {};
    const fieldsToValidate = ["fullname", "email", "mobile"];
    let hasErrors = false;
    fieldsToValidate.forEach((field) => {
      validateInput(field, userData[field]);
      if (validationErrors[field]) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    //console.log('Current Data:', userData);
    //console.log('Original Data:', originalUserData);
    // Check for changes and add only modified fields
    if (userData.fullname.trim() !== originalUserData.fullname.trim()) {
      updatedData.fullname = userData.fullname.trim();
    }
    if (userData.email.trim() !== originalUserData.email.trim()) {
      updatedData.email = userData.email.trim();
    }
    if (userData.mobile.trim() !== originalUserData.mobile.trim()) {
      updatedData.mobile = userData.mobile.trim();
    }
    // If there are any modified fields, send them to the backend
    if (Object.keys(updatedData).length > 0) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.put('http://localhost:5000/profile', updatedData, {
          headers: { Authorization: `Bearer ${token}`, },
        });
        if (response.data.success) {
          setIsUpdateSuccessful(true); 
          toast.success('Profile updated successfully!');
          setIsEditing(false); // Exit edit mode after successful update
          // Update user data with the response data from the backend
          setUserData((prevData) => ({
            ...prevData,...updatedData
          }));
          // Update original user data to reflect changes
          setOriginalUserData((prevData) => ({
            ...prevData,...updatedData
          }));
        }
      } catch (error) {
        setIsUpdateSuccessful(false);
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      }
    } else {
      toast.info("No changes detected!");
    }
  };
  // Cancel function: Show confirmation modal
  const handleCancel = () => {
    setShowModal(true); // Show the modal
  };

  // Handle "Yes" action in the modal
  const handleConfirmCancel = () => {
    setUserData(originalUserData); // Reset to original data
    setIsEditing(false); // Exit edit mode
    setShowModal(false); // Close the modal
  };

  // Handle "No" action in the modal
  const handleCloseModal = () => {
    setShowModal(false); // Just close the modal without making any changes
  };

  return (
    <div className="p-3" style={{ maxWidth: '1250px', }}>
      <form className='p-3 px-5' style={{ backgroundColor: 'ButtonShadow', borderRadius: '5px' }}>
        <h4 className="fs-3 mb-2">Account Details:</h4>
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
          <input type="text" className="form-control" placeholder="Full Name" name="fullname" value={userData.fullname} onChange={handleChange} disabled={!isEditing} />
        </div>
        {validationErrors.fullname && <small className="text-danger">{validationErrors.fullname}</small>}
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="bi bi-envelope-fill"></i> </span>
          <input type="email" className="form-control text-truncate" placeholder="Email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing} />
        </div>
        {validationErrors.email && <small className="text-danger">{validationErrors.email}</small>}
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
          <input type="tel" className="form-control" placeholder="Mobile Number" pattern="[0-9]{10}" maxLength="10" name="mobile" value={userData.mobile} onChange={handleChange} disabled={!isEditing} />
        </div>
        {validationErrors.mobile && <small className="text-danger">{validationErrors.mobile}</small>}
        <div className="d-flex flex-row">
          {isEditing ? (<div className="d-flex flex-grow-1 gap-2 mb-2">
            <button type="button" className={`btn  text-truncate ${isUpdateSuccessful ? 'btn-success' : 'btn-danger'}`} onClick={handleSubmit}>
              {isUpdateSuccessful ? 'Changes Saved' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary text-truncate ms-2" onClick={handleCancel}>Cancel</button>
            </div>) : ( <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

      </form>
      {/* Confirmation Modal */}
      <Modal show={showModal} onConfirm={handleConfirmCancel} onClose={handleCloseModal}/>
      {/* Toast container for displaying notifications */}
      <Personal />
      <ToastContainer />
    </div>
  );
}


export default ProfileD;
