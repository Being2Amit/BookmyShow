import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Personal from "./Personal";

function ProfileD() {
  const [userData, setUserData] = useState({ fullname: '', mobile: '', email: '', password: '' });
  const [originalUserData, setOriginalUserData] = useState({ fullname: '', mobile: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
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
    console.log('Current Data:', userData);
    console.log('Original Data:', originalUserData);
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
        const response = await axios.put('http://183.82.106.55:9098/profile', updatedData, {
          headers: { Authorization: `Bearer ${token}`, },
        });
        if (response.data.success) {
          toast.success('Profile updated successfully!');
          setIsEditing(false); // Exit edit mode after successful update
          // Update user data with the response data from the backend
          setUserData((prevData) => ({
            ...prevData,
            ...updatedData
          }));
          // Update original user data to reflect changes
          setOriginalUserData((prevData) => ({
            ...prevData,
            ...updatedData
          }));
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      }
    } else {
      toast.info("No changes detected!");
    }
  };

  return (
    <div className="p-3" style={{ maxWidth: '1250px', }}>
      <form className='p-3 px-5' style={{ backgroundColor: 'ButtonShadow', borderRadius: '5px' }}>
        <h4 className="fs-3 mb-2">Account Details:</h4>
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
          <input type="text" className="form-control" placeholder="Full Name" name="fullname" value={userData.fullname} onChange={handleChange} disabled={!isEditing} />
        </div>
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="bi bi-envelope-fill"></i> </span>
          <input type="email" className="form-control" placeholder="Email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing} />
        </div>
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
          <input type="tel" className="form-control" placeholder="Mobile Number" pattern="[0-9]{10}" maxLength="10" name="mobile" value={userData.mobile} onChange={handleChange} disabled={!isEditing} />
        </div>

        {isEditing ? (<button type="button" className="btn btn-danger" onClick={handleSubmit}>Save Changes</button>)
          : (<button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>)
        }
      </form>
      {/* Toast container for displaying notifications */}
      <Personal />
      <ToastContainer />
    </div>
  );
}


export default ProfileD;
