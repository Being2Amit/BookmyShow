import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "./modal/PopModal";
function Personal() {
  const [details, setDetails] = useState({ age: '', gender: '', address: '', });
  const [originalDetails, setOriginalDetails] = useState({ age: '', gender: '', address: '', });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for the confirmation modal
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleGenderChange = (gender) => {
    setDetails((prev) => ({ ...prev, gender }));
    setErrors((prev) => ({ ...prev, gender: "" }));
  };
  const validateFields = () => {
    const validationErrors = {};
  
    // Age validation
    if (!details.age || isNaN(details.age) || details.age <= 13 || details.age > 100) {
      validationErrors.age = "Age must be a number between 13 and 100.";
    }
  
    // Gender validation
    if (!["Male", "Female", "Others"].includes(details.gender)) {
      validationErrors.gender = "Please select gender.";
    }
  
    // Address validation
    if (!details.address || details.address.trim().length < 10) {
      validationErrors.address = "Address must be at least 10 characters long.";
    }
  
    setErrors(validationErrors);
  
    // Display all error messages using toast
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => {
        toast.error(error); // Show each error in a separate toast
      });
    }
  
    return Object.keys(validationErrors).length === 0; // Return true if no errors
  };
  
  // Cancel function: Show confirmation modal
  const handleCancel = () => {
    setShowModal(true); 
  };
  // Handle "No" action in the modal
  const handleCloseModal = () => { 
    setShowModal(false);
  };
  // Handle "Yes" action in the modal
  const handleConfirmCancel = () => {
    setDetails(originalDetails); // Reset to original data
    setIsEditing(false); // Exit edit mode
    setShowModal(false); // Close the modal
  };

  const fetchDetails = async () => {
    const token = localStorage.getItem('token');
    try { const response = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetails(response.data);
      setOriginalDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
     toast.error(error.response?.data?.message || "Unable to fetch personal details.");
    }
  };
  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    const updatedData = {};
    // Check for changes
    if (details.age !== originalDetails.age) { updatedData.age = details.age;}
    if (details.gender !== originalDetails.gender) { updatedData.gender = details.gender;}
    if (details.address !== originalDetails.address) { updatedData.address = details.address;}
    if (Object.keys(updatedData).length > 0) {
      const token = localStorage.getItem('token');
      try { const response = await axios.put('http://localhost:5000/profile', updatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          console.log(response.data)
          setIsUpdateSuccessful(true);
          toast.success("Details updated successfully!");
          setIsEditing(false);
          setOriginalDetails((prev) => ({ ...prev, ...updatedData }));
          setDetails((prev) => ({ ...prev, ...updatedData }));
        }
      } catch (error) {
        console.error("Error updating details:", error);
        setIsUpdateSuccessful(false);
        toast.error("Failed to update details.");
      }
    } else { toast.info("No changes detected!");}
    
  };
  
  return (
    <div className="mt-3">
      <form className='p-3 px-5' style={{ backgroundColor: 'ButtonShadow', borderRadius: '5px' }}>
        <h4 className="fs-3 mb-2">Personal Details:</h4>
        {/* Age Input */}
        <div className="input-group mb-2">
          <span className="input-group-text px-4">Age</span>
          <input className="form-control" type="tel" placeholder="Age" name="age" value={details.age} maxLength={3}
           onChange={(e) => { const Value = e.target.value.replace(/[^\d]/g, '');setDetails((prev) => ({ ...prev, age: Value }));}}
            style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} disabled={!isEditing}
          />
           {errors.age && <div className="invalid-feedback">{errors.age}</div>}
        </div>
        
        {/* Gender Selection */}
        <div className="form-control m-0 p-0 mb-2 d-flex flex-wrap">
          <span className="input-group d-flex">
            <span className="input-group-text">Gender</span>
            <div className="badge d-flex justify-content-center align-items-center flex-column flex-sm-row gap-2" role="group" aria-label="Gender Selection" style={{ border: "none" }}>
              <button className={`btn ${details.gender === 'Male' ? 'btn-danger' : 'btn-outline-secondary'} w-100 mb-sm-2`}
                type="button" onClick={() => handleGenderChange('Male')} disabled={!isEditing}>
                <i className="bi bi-gender-male me-2"></i>Male 
              </button>
              <button className={`btn ${details.gender === 'Female' ? 'btn-danger' : 'btn-outline-secondary'} w-100 mb-sm-2 `}
                type="button" onClick={() => handleGenderChange('Female')} disabled={!isEditing}>
                <i className="bi bi-gender-female me-2"></i> Female
              </button>
              <button className={`btn ${details.gender === 'Others' ? 'btn-danger' : 'btn-outline-secondary'} w-100 mb-sm-2`}
                type="button" onClick={() => handleGenderChange('Others')} disabled={!isEditing}>
                <i className="bi bi-gender-ambiguous me-2"></i> Others
              </button>
            </div>
          </span>
          {errors.gender && <div className="text-danger mt-1">{errors.gender}</div>}
        </div>

        {/* Address Input */}
        <div className="input-group mb-2 ">
          <span className="input-group-text px-4 fs-6"><i className="px-2 bi bi-house-fill"></i></span>
          <textarea className="form-control" placeholder="Physical Address" name="address" value={details.address} onChange={handleChange}
            style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} disabled={!isEditing}
          />
           {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>
        {/* Submit / Edit Button */}
        <div className="d-flex flex-row">
          {isEditing ? (<div className="d-flex flex-grow-1 gap-2 mb-2">
            <button type="button" className={`btn text-truncate ${isUpdateSuccessful ? 'btn-success' : 'btn-danger'}`} onClick={handleSubmit}>
              {isUpdateSuccessful ? 'Changes Saved' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary text-truncate me-2" onClick={handleCancel}>Cancel</button>
          </div>) : (<button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </form>
      <Modal show={showModal} onConfirm={handleConfirmCancel} onClose={handleCloseModal} />

    </div >
  );
}

export default Personal;
