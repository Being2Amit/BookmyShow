import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { useState, useContext, useEffect, useRef } from 'react';
import LocationModal from '../location/Location';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loggedIn, user} = useAuth();
  const { city, handleChange, location, otherCities } = useContext(AppContext);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const handleCitySelect = async (newCity) => {
    handleChange(newCity);
    setShowModal(false);
    navigate('/stream', { state: { location: newCity } });
  };
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/movies?query=${searchQuery}`);
      setSearchQuery([]); 
      setSuggestions([]);
    }
  };
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setLoading(true);
      const fetchSuggestions = async () => {
        try { const response = await fetch( `https://api.themoviedb.org/3/search/movie?api_key=41c953dc7d1c21d27df7b693e9740a3c&query=${e.target.value}`);
          const data = await response.json();
          setSuggestions(data.results || []);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container d-flex justify-content-between align-items-center gap-x-2">
        {/* Logo */}
        <Link to="/" className="navbar-brand ms-2">
          <img src="/public/assets/MovieHive.png" alt="MovieHive Logo" style={{ width: '100px', height: '50px' }}/>
        </Link>
        {/* Search Bar */}
        <form className="d-flex position-relative mt-2" style={{ width:'100%', minWidth:'100px',maxWidth: '415px' }}
          onSubmit={(e) => { e.preventDefault(); handleSearch();}}>
          <div className="input-group">
            <input type="search" className="form-control text-dark" value={searchQuery} onChange={handleInputChange} 
              style={{outline: 'none', boxShadow: 'none', border: '1px solid #ced4da',}}
              placeholder="Search for Movies, Events, Plays, Sports and Activities"/>
            <button className="btn btn-outline-light bg-light" type="button" onClick={handleSearch}>
              <i className="bi bi-search text-dark"></i>
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="list-group position-absolute mt-5" style={{ zIndex: 10, width: '100%' }}>
              {loading ? ( <li className="list-group-item">Loading...</li>
              ) : ( suggestions.slice(0, 5).map((suggestion) => (
              <li key={suggestion.id} className="list-group-item" onClick={() => {
                setSearchQuery('');  
                navigate(`/movies?query=${suggestion.title}`);
                setSuggestions([]);}}>
                {suggestion.title}
              </li>
             )))}
            </ul>
          )}
        </form>
        <button type="button" className="navbar-toggler mt-3" aria-controls="navbarNav" aria-expanded={isOpen}
          onClick={toggleNavbar} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon align-items-center"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 mr-3">
            <li className="nav-item"><Link className="nav-link text-light" to="/movie"> Movies </Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/stream"> Stream </Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/events"> Events </Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/plays"> Plays </Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/sports"> Sports </Link></li>
          </ul>
          {/* Location Selector Button */}
          <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
            <button className="btn btn-outline-light" onClick={() => setShowModal(true)}>
              {city === 'Location' ? 'Location' : city}
            </button>
            {/* Profile or Sign-in Button */}
            {loggedIn ? (
              <Link to="/profile" className="btn btn-primary">
                <i className="bi bi-person-circle me-2"></i>Hi,{user ? user.name : 'User'}
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">Sign in</Link>
            )}
          </div>
        </div>
      </div>
      {/* Location Modal */}
      <LocationModal showModal={showModal} location={location} otherCities={otherCities} selectedCity={city} 
        handleCitySelect={handleCitySelect} modalRef={modalRef}
      />
    </nav>
  );
}
export default Navbar;
