import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  // State for form data, validation errors, and submission status
  const [data, setData] = useState({ fullname: '', mobile: '', email: '', password: '', confirmpwd: '' });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form has been submitted
  const [showMessage, setShowMessage] = useState(false);

  const { fullname, mobile, email, password, confirmpwd } = data;

  // Function to validate a single field
  const validateField = (name, value, isSubmitted) => {
    // Check for blank fields only if the form has been submitted
    if (isSubmitted && !value) return 'This field should not be left blank';

    switch (name) {
      case 'fullname':
        if (/[\d]/.test(value)) return 'Full Name cannot contain numbers';
        if (/[^a-zA-Z\s]/.test(value)) return 'Full Name cannot contain special characters';
        if (/^\s|\s$/.test(value)) return 'No spaces allowed at the beginning or end of the name';
        return '';
      case 'mobile':
        if (/^[0-5]/.test(value) || value.length !== 10 || /[^0-9]/.test(value)) {
          return 'Mobile number must start with 6-9 and be exactly 10 digits';
        }
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(value)) return 'Enter a valid email address';
        return '';
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters long';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[@$!%*?&]/.test(value)) return 'Password must contain at least one special character (@$!%*?&)';
        return '';
      case 'confirmpwd':
        if (value !== password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {// Function to handle input changes
    const { name, value } = e.target;
    setData({ ...data, [name]: value }); // Update form data
    setErrors({ ...errors, [name]: validateField(name, value, formSubmitted) });// Remove blank-field validation dynamically on user input
  };

  const handleSubmit = (e) => {// Function to handle form submission
    e.preventDefault();
    setFormSubmitted(true); // Mark form as submitted
    const newErrors = Object.keys(data).reduce((acc, key) => {// Validate all fields during form submission
      const error = validateField(key, data[key], true); // Include blank-field validation
      if (error) acc[key] = error; // Collect errors
      return acc;
    }, {});
    
    if (Object.keys(newErrors).length > 0) {// If there are validation errors, set errors and stop submission
      setErrors(newErrors);
      return;
    }
    axios.post('http://localhost:5000/register', data)// Proceed with server-side registration
      .then(() => {
        setShowMessage(true); // Show success message
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
      })
      .catch(err => setErrors({ submit: err.response?.data || 'Registration failed. Try again later.' })
    );
    setData({ fullname: '', mobile: '', email: '', password: '', confirmpwd: '' });// Clear form data after submission
    setErrors({});
  };
  return (
    <form className="m-auto my-5 shadow p-3" onSubmit={handleSubmit} style={{ width: '40%' }}>
      <h1 className="fs-2 text-center">Register Here</h1>
      <div className='d-flex'>
        <label className="w-50">Full Name<span className="text-danger">*&nbsp;</span></label>
        <input className="form-control mb-3" name="fullname" type="text" placeholder="Enter your Full Name" value={fullname} onChange={handleChange} />
      </div>
      {errors.fullname && <div className="form-text text-danger">{errors.fullname}</div>}

      {/* <input className="form-control mb-3" name="user_name" type="text" placeholder="Username" value={user_name} onChange={handleChange} />
      {errors.user_name && <div className="form-text text-danger">{errors.user_name}</div>} */}

      <div className='d-flex'>
        <label className="w-50">Mobile Number<span className="text-danger">*&nbsp;</span></label>
        <input className="form-control mb-3" name="mobile" type="tel" placeholder="Enter your Mobile number" value={mobile} onChange={handleChange} />
      </div>
      {errors.mobile && <div className="form-text text-danger">{errors.mobile}</div>}

      <div className='d-flex'>
        <label className="w-50">Email<span className="text-danger">*&nbsp;</span></label>
        <input className="form-control mb-3" name="email" type="email" placeholder="Enter your email" value={email} onChange={handleChange} />
      </div>
      {errors.email && <div className="form-text text-danger">{errors.email}</div>}

      <div className='d-flex'>
        <label className="w-50">Password<span className="text-danger">*&nbsp;</span></label>
        <input className="form-control mb-3" name="password" type="password" placeholder="Enter your password" value={password} onChange={handleChange} />
      </div>
      {errors.password && <div className="form-text text-danger">{errors.password}</div>}

      <div className='d-flex'>
        <label className="w-50">Confirm Password<span className="text-danger">*&nbsp;</span></label>
        <input className="form-control mb-3" name="confirmpwd" type="password" placeholder="Confirm your password" value={confirmpwd} onChange={handleChange} />
      </div>
      {errors.confirmpwd && <div className="form-text text-danger">{errors.confirmpwd}</div>}

      <div className='text-center'>
        <button type="submit" className=" btn btn-primary">Submit</button>
        <p className="p-2">Already have an account? <Link to="/login" className="text-decoration-none">Login.</Link></p>

        {showMessage && <div className="alert alert-success mt-3">Registration successful! Redirecting to login</div>}
        {errors.submit && <div className="text-danger mt-3">{errors.submit}</div>}
      </div>

    </form>
  );
}

export default Register;
