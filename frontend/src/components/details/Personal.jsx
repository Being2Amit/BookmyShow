import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
function Personal() {
  const [details, setDetails] = useState({ age: '', gender: '', address: '', });
  const [originalDetails, setOriginalDetails] = useState({ age: '', gender: '', address: '', });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender) => {
    setDetails((prev) => ({ ...prev, gender }));
  };

  const fetchDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetails(response.data);


      setOriginalDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Unable to fetch personal details.");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {};
    // Check for changes
    if (details.age !== originalDetails.age) {
      updatedData.age = details.age;
    }
    if (details.gender !== originalDetails.gender) {
      updatedData.gender = details.gender;
    }
    if (details.address !== originalDetails.address) {
      updatedData.address = details.address;
    }

    if (Object.keys(updatedData).length > 0) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.put('http://localhost:5000/profile', updatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          console.log(response.data)
          toast.success("Details updated successfully!");
          setIsEditing(false);
          setOriginalDetails((prev) => ({ ...prev, ...updatedData }));
          setDetails((prev) => ({ ...prev, ...updatedData }));
        }
      } catch (error) {
        console.error("Error updating details:", error);
        toast.error("Failed to update details.");
      }
    } else {
      toast.info("No changes detected!");
    }
  };

  return (
    <div className="mt-3">
      <form className='p-3 px-5' style={{ backgroundColor: 'ButtonShadow', borderRadius: '5px' }}>
        <h4 className="fs-3 mb-2">Personal Details:</h4>
        {/* Age Input */}
        <div className="input-group mb-2">
          <span className="input-group-text px-4">Age</span>
          <input className="form-control" type="tel" placeholder="Age" name="age" value={details.age} onChange={handleChange}
            style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} disabled={!isEditing}
          />
        </div>

        {/* Gender Selection */}
        <div className="input-group mb-2">
          <span className="input-group-text">Gender</span>
          <div className="btn" role="group" aria-label="Gender Selection" style={{ border: "none" }}>
            <button className={`btn ${details.gender === 'Male' ? 'btn-danger' : 'btn-outline-secondary'} mx-2`}
              type="button" onClick={() => handleGenderChange('Male')} disabled={!isEditing}>
              <i className="bi bi-gender-male me-2"></i> Male
            </button>
            <button className={`btn ${details.gender === 'Female' ? 'btn-danger' : 'btn-outline-secondary'} mx-2`}
              type="button" onClick={() => handleGenderChange('Female')} disabled={!isEditing}>
              <i className="bi bi-gender-female me-2"></i> Female
            </button>
            <button className={`btn ${details.gender === 'Others' ? 'btn-danger' : 'btn-outline-secondary'} mx-2`}
              type="button" onClick={() => handleGenderChange('Others')} disabled={!isEditing} >
              <i className="bi bi-gender-ambiguous me-2"></i> Others
            </button>
          </div>
        </div>


        {/* Address Input */}
        <div className="input-group mb-2">
          <span className="input-group-text px-4 fs-6"><i className="px-2 bi bi-house-fill"></i></span>
          <textarea className="form-control" placeholder="Physical Address" name="address" value={details.address} onChange={handleChange}
            style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} disabled={!isEditing}
          />
        </div>

        {/* Submit / Edit Button */}
        {isEditing ? (<button type="button" className="btn btn-danger" onClick={handleSubmit}>Save Changes</button>)
          : (<button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Details</button>)
        }
      </form>
    </div >

  );
}

export default Personal;
