import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { TbPasswordUser ,TbPassword } from "react-icons/tb";

function Register() {
  const navigate = useNavigate();
  // State for form data, validation errors, and submission status
  const [data, setData] = useState({ fullname: '', mobile: '', email: '', password: '', confirmpwd: '' });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form has been submitted
  const [showMessage, setShowMessage] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
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
        const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
        if (!emailRegex.test(value)) return 'Enter a valid email address';
        return '';
      case 'password':
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[@$!%*?&]/.test(value)) return 'Password must contain at least one special character (@$!%*?&)';
        if (value.length < 8) return 'Password must be at least 8 characters long';
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Validate all fields during form submission
    const newErrors = Object.keys(data).reduce((acc, key) => {
      const error = validateField(key, data[key], true);
      if (error) acc[key] = error;
      return acc;
    }, {});
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    axios.post('http://localhost:5000/register', data)
      .then(() => {
        setShowMessage(true);
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(err => {
        if (err.response?.status === 409) {
          setErrors({ submit: 'User already registered with this email or mobile' });
        } else {
          setErrors({ submit: err.response?.data.message || 'Registration failed. Try again later.' });
        }
      });

    setData({ fullname: '', mobile: '', email: '', password: '', confirmpwd: '' });
    setErrors({});
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };
  const handleClose = () => {
    navigate('/'); // Redirect to home page
  };
  return (
    <div className="container my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <form className="card shadow p-3 position-relative" onSubmit={handleSubmit}>
            <button type="button" onClick={handleClose} className="btn btn-sm btn-outline-muted position-absolute top-0 end-0 mx-3 mt-3" >X</button>
            <h1 className="fs-2 text-center mb-3">Register Here</h1>
            <div className='input-group mb-2'>
              <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
              <input className="form-control" name="fullname" type="text" placeholder="Enter your Full Name" value={fullname} onChange={handleChange}
                style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
            </div>
            {errors.fullname && <div className="form-text text-danger">{errors.fullname}</div>}

            {/* <input className="form-control mb-3" name="user_name" type="text" placeholder="Username" value={user_name} onChange={handleChange} />
      {errors.user_name && <div className="form-text text-danger">{errors.user_name}</div>} */}

            <div className='input-group mb-2'>
              <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
              <input className="form-control" name="mobile" type="tel" placeholder="Enter your Mobile number" maxLength={10} value={mobile} onChange={handleChange}
                style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
            </div>
            {errors.mobile && <div className="form-text text-danger">{errors.mobile}</div>}

            <div className='input-group mb-2'>
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input className="form-control" name="email" type="email" placeholder="Enter your email" value={email} onChange={handleChange}
                style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
            </div>
            {errors.email && <div className="form-text text-danger">{errors.email}</div>}

            <div className='input-group mb-2 position-relative '>
              <span className="input-group-text"><TbPasswordUser /></span>
              <input className="form-control " name="password" type={isPasswordVisible ? "text" : "password"} placeholder="Enter your password" value={password} onChange={handleChange}
                style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
              <button type="button" onClick={togglePasswordVisibility} className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ zIndex: 1 }} >
                <i className={`bi my-2 ${isPasswordVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>
            {errors.password && <div className="form-text text-danger">{errors.password}</div>}

            <div className='input-group mb-2 position-relative '>
              <span className="input-group-text"><TbPassword /></span>
              <input className="form-control" name="confirmpwd" type={isConfirmPasswordVisible ? "text" : "password"} placeholder="Confirm your password" value={confirmpwd} onChange={handleChange}
                style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }} />
              <button type="button" onClick={toggleConfirmPasswordVisibility} className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ zIndex: 1 }} >
                <i className={`bi my-2 ${isConfirmPasswordVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>
            {errors.confirmpwd && <div className="form-text text-danger">{errors.confirmpwd}</div>}

            <div className='text-center'>
              <button type="submit" className=" btn btn-danger">Submit</button>
              <p className="p-2">Already have an account? <Link to="/login" className="text-decoration-none">Login.</Link></p>
              {showMessage && <div className="alert alert-success mt-3">Registration successful! Redirecting to login</div>}
              {errors.submit && <div className="text-danger mt-3">{errors.submit}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
