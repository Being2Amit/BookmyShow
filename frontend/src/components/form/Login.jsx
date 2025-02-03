import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { TbPasswordUser} from "react-icons/tb";
import { toast} from 'react-toastify';
function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ mobile: '', password: '' });
  const [errors, setErrors] = useState({ mobile: '', password: '', server: '' });
  const { mobile, password } = data;
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: '', server: '' });
    setData({ ...data, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.mobile.trim() || !data.password.trim()) {
      setErrors({
        ...errors,
        mobile: !data.mobile.trim() ? 'Please enter your mobile/email' : '',
        password: !data.password.trim() ? 'Please enter your password' : '',
      });
      return;
    }
    if (!validateEmail(data.mobile) && !/^\d+$/.test(data.mobile)) {
      setErrors({ ...errors, mobile: 'Please enter a valid email or mobile number' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/login', data);
      if (res.data.success) {
        const token = res.data.token;
        const name = res.data.result[0].fullname;
        console.log('Login successful:', res.data);
        // Store in both cookies and localStorage
        Cookies.set('token', token, { expires: 7 }); // Set cookie for token
        localStorage.setItem('token', token); // Optional: Keep token in localStorage
        localStorage.setItem('name', name); // Store user name or other non-sensitive info in localStorage
        setErrors({ mobile: '', password: '', server: '' });
        login(token); // Pass the token to the context's login function
        navigate('/');
        toast.success('Login successful!');
      } else {
        if (res.data.message === 'User not found') {
          setErrors({ ...errors, mobile: 'Invalid email or mobile' });
        } else if (res.data.message === 'Invalid password') {
          setErrors({ ...errors, password: 'Invalid password' });
        } else {
          setErrors({ ...errors, server: res.data.message || 'Invalid credentials' });
        }
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      if (err.response?.status === 404) {
        setErrors({ ...errors, mobile: 'User not found' });
      } else if (err.response?.status === 401) {
        setErrors({ ...errors, password: `Passwords don't match`});
      } else {
        setErrors({ ...errors, server: 'An unexpected error occurred in Server. Please try again later.' });
      }
    }
    setIsLoading(false);
  };
  const handleClose = () => {
    navigate('/');
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="container my-5 text-center">
      <div className="row justify-content-center">
        <div className=" card p-0 col-12 col-md-8 col-lg-5">
          <form className="shadow p-4 rounded position-relative" onSubmit={handleSubmit}>
          <button type="button" onClick={handleClose} className="btn btn-sm btn-outline-muted position-absolute top-0 end-0 mx-3 mt-3" >X</button>
            <h1 className="fs-4 text-center mb-3">Login</h1>
            <div className='input-group mb-2'>
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
            <input type="text" className="form-control border-outline-none" name="mobile" placeholder="Enter your Mobile/Email" value={mobile} onChange={handleChange} 
            style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }}/>
            </div>
            {errors.mobile && <div className="text-danger text-start mb-3"><small>{errors.mobile}</small></div>}
            <div className='input-group mb-2 position-relative '>
              <span className="input-group-text"><TbPasswordUser /></span>
              <input type={isPasswordVisible ? "text" : "password"} className="form-control border-outline-none" name="password"
                placeholder="Enter your password" value={password} onChange={handleChange} style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', }}/>
              <button type="button" onClick={togglePasswordVisibility} className="position-absolute top-50 end-0 translate-middle-y me-2" style={{ zIndex: 1 }} >
                <i className={`bi ${isPasswordVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>
            {errors.password && <div className="text-danger text-start mb-3"><small>{errors.password}</small></div>}
            <button type="submit" className="btn btn-danger" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
            {errors.server && <div className="text-danger text-center mb-3"><small>{errors.server}</small></div>}
            <div className="mt-2 text-center">
              <p className='col-12'>Forgot password? <Link to="/forgot" className="text-decoration-none">Reset</Link></p>
              <p className="col-12">Don't have an account? <Link to="/register" className="text-decoration-none">Sign up</Link></p>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Login;