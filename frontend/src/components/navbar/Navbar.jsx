import { NavLink,Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { useState, useContext, useEffect, useRef } from 'react';
import LocationModal from '../location/Location';
import actionCreater2 from '../redux/action2';
import store from '../redux/store';
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loggedIn} = useAuth();
  const { city, handleChange, location, otherCities } = useContext(AppContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const modalRef = useRef(null);
  const name = localStorage.getItem('name');  // Get the name from localStorage
  
  const toggleNavbar = () => {setIsOpen(!isOpen);};
  const handleCitySelect = async (newCity) => {
    handleChange(newCity);
    setShowModal(false);
    navigate('/', { state: { location: newCity } });
   store.dispatch( actionCreater2(newCity) )
   
  };
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setError('');
    } else if (/^[^a-zA-Z0-9]/.test(searchQuery)) {
      setError('No special characters allowed at the beginning');
    } else if (/[^a-zA-Z0-9\s-]|(\s{2,})|(--)/.test(searchQuery)) {
      setError('Consecutive special characters are not allowed.');
    } else {
      navigate(`/movies?query=${searchQuery}`);
      setSearchQuery(''); // Clear search input
      setSuggestions([]); // Clear suggestions
      setError(''); // Clear error message
    }
  };
  
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (error) {setError('');}
    if (e.target.value.trim() !== '') {
      setLoading(true);
      const fetchSuggestions = async () => {
        try { const response = await fetch( `https://api.themoviedb.org/3/search/movie?api_key=41c953dc7d1c21d27df7b693e9740a3c&query=${e.target.value}`);
          const data = await response.json();
          if (data.results?.length === 0) {
            setError('No Results Found.');
          }
          setSuggestions(data.results || []);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setErrorMessage('Failed to fetch suggestions. Please try again.');
          setLoading(false);
        }
      }; fetchSuggestions();
    } else { setSuggestions([]); }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
      if ( searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery('');
        setSuggestions(''); // Clear suggestions when clicking outside
        setError(''); // Clear any error
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container d-flex flex-row flex-lg-row justify-content-between align-items-center">
        {/* Logo */}
        <Link to="/" className="navbar-brand w-25 d-flex flex-row flex-lg-row justify-content-between align-items-center me-2">
          <img src="/BookanyTickets.png" alt="BookanyTickets Logo" style={{ width: '100px', height: '50px' }}/>
        </Link>
        {/* Search Bar */}
        <form ref={searchRef} className="d-flex flex-grow-1 position-relative mt-3 mt-lg-0 me-2" style={{width: '100%', minWidth: '50px', maxWidth: '460px' }}
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="input-group">
            <input type="search" className="form-control text-dark text-truncate" value={searchQuery} onChange={handleInputChange} 
              style={{outline: 'none', boxShadow: 'none', border: '1px solid rgb(255, 255, 255)',}}
              placeholder="Search for Movies, Events, Plays, Sports and Activities"/>
            <button className="btn btn-outline-light bg-light" type="button" onClick={handleSearch}>
              <i className="bi bi-search text-dark"></i>
            </button>
          </div>
          {suggestions.length > 0 || error? (
            <ul className="list-group position-absolute mt-5" style={{ zIndex: 1, width: '100%', minWidth: '50px', maxWidth: '450px' }}>
              {loading ? ( <li className="list-group-item">Loading...</li>
              ) : error? ( <li className="list-group-item text-danger">{error}</li>
              ) : ( suggestions.slice(0, 5).map((suggestion) => (
              <li key={suggestion.id} className="list-group-item cursor-pointer" onClick={() => {
                setSearchQuery('');  
                navigate(`/movies?query=${suggestion.title}`);
                setSuggestions([]);
                setError('');
              }}>{suggestion.title}
              </li>
             )))}
            </ul>
          ): null}
        </form>
        <button type="button" className="navbar-toggler mt-3" aria-controls="navbarNav" aria-expanded={isOpen}
          onClick={toggleNavbar} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon align-items-center"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav d-flex flex-row flex-lg-row align-items-center align-items-lg-center gap-2 mr-3">
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                `nav-link text-decoration-none ${isActive ? 'text-info' : 'text-light'}`} to="/movie"> Movies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => 
                `nav-link text-decoration-none ${isActive ? 'text-info' : 'text-light'}`} to="/stream"> Stream
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                `nav-link text-decoration-none ${isActive ? 'text-info' : 'text-light'}` }to="/events"> Events
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => 
                `nav-link text-decoration-none ${isActive ? 'text-info' : 'text-light'}`} to="/plays"> Plays
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                `nav-link text-decoration-none ${isActive ? 'text-info' : 'text-light'}`} to="/sports"> Sports
              </NavLink>
            </li>
          </ul>
          {/* Location Selector Button */}
          <div className="d-flex flex-row flex-lg-row align-items-center gap-3">
            <button className="btn btn-outline-light text-truncate" onClick={() => setShowModal(true)}>
              <span className=" mx-1" style={{ maxWidth: '100%' }}>
                {city === 'Location' ? 'Location' : city}
              </span>
              <i className="bi bi-chevron-down" style={{ fontSize: '10px' }}></i>
            </button>
            {/* Profile or Sign-in Button */}
            {loggedIn ? ( 
              <Link to="/profile" className="btn btn-primary text-truncate">
                <i className="bi bi-person-circle me-2 text-truncate"></i>Hi, {name?.split(" ")[0] || "User"}
              </Link>
            ) : (<Link to="/login" className="btn btn-primary text-truncate">Sign in</Link>)}
          </div>
        </div>
      </div>
      {/* Location Modal */}
      <LocationModal showModal={showModal} location={location} otherCities={otherCities} selectedCity={city} 
        handleCitySelect={handleCitySelect} modalRef={modalRef} setShowModal = {setShowModal}
      />
      <style>
        {`.nav-link:after {content: "";bottom: 35%;position: relative;width: 0%;display: block;transition: all 0.3s ease;}
          .nav-link:hover::after {width: 100%;height: 1px;background-color: #fff;}`
        }
      </style>
    </nav>
  );
}
export default Navbar;
