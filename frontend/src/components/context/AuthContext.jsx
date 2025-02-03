// src/context/AuthContext.js
import { createContext, useContext, useState ,useEffect} from 'react';
import Cookies from 'js-cookie';
const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('token')); // Check cookies for the login state
  const login = (token) => {
    // Save token in cookies and localStorage
    Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
    localStorage.setItem('token', token, {expires: 7});
    setLoggedIn(true);
  };
  const logout = () => {
    // Remove token from cookies and localStorage
    localStorage.clear();
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
    setLoggedIn(false);
  };

  useEffect(() => {
    // On mount, check for token in cookies and localStorage
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ loggedIn, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
