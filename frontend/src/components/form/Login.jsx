import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ mobile: '', password: '' }); // 'mobile' will store User_Name, email or phone number
  const [error, setError] = useState('');
  const { mobile, password } = data; // destructure mobile (either phone or email) and password
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.mobile.trim() || !data.password.trim()) {
      setError('Please fill out all fields');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/login', data);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        console.log(res.data);
        setError('');
        login();
        navigate('/');
      } else {
        // Clear token if login is unsuccessful
        localStorage.removeItem('token');
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      // Clear token in case of an error
      localStorage.removeItem('token');
      setError('An error occurred. Please try again later.');
    }
    setIsLoading(false);
  };

  return (
    <form className="w-25 text-center m-auto my-5 shadow p-3" onSubmit={handleSubmit}>
      <h1 className="fs-2 text-center mb-3">Login</h1>
      <input 
        type="text" 
        className="form-control border-outline-none mb-3" 
        name="mobile" 
        placeholder="Enter your Mobile/Email" 
        value={mobile} 
        onChange={handleChange}
      />
      <input 
        type="password" 
        className="form-control border-outline-none mb-3" 
        name="password" 
        placeholder="Enter your password" 
        value={password} 
        onChange={handleChange}
      />
      <button type="submit" className="btn btn-danger" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
      <div className="mt-2">
        <p className='col-12 text-center'>Forgot password ?<Link to="/forgot" className="text-decoration-none">&nbsp;Reset</Link></p>
        <p className="col-12">Don't have an account?<Link to="/register" className="text-decoration-none">&nbsp;Sign up</Link></p>
      </div>
    </form>
  );
}

export default Login;
