import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { useState, useContext, useEffect, useRef } from 'react';
import LocationModal from '../location/Location';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [suggestions, setSuggestions] = useState([]); // State for suggestions
  const [loading, setLoading] = useState(false); // Loading state for suggestions
  const { loggedIn } = useAuth();
  const { city, handleChange, location, otherCities } = useContext(AppContext);
  const navigate = useNavigate();  // Initialize useNavigate
  const modalRef = useRef(null);
  const toggleNavbar = () => { setIsOpen(!isOpen); };

  const handleCitySelect = async (newCity) => {
    handleChange(newCity); // Update the city in the AppContext
    setShowModal(false);
    navigate('/stream', { state: { location: newCity } }); // Navigate to Stream with city as state
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/movies?query=${searchQuery}`);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setLoading(true);
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=41c953dc7d1c21d27df7b693e9740a3c&query=${e.target.value}`);
          const data = await response.json();
          setSuggestions(data.results || []);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setLoading(false);
        }
      };
      fetchSuggestions();
    } else { setSuggestions([]); }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand">
          <img src='/logo.png' alt="BookMyShow Logo" style={{ width: "100px", height: "40px" }} />
        </Link>
        <form className="d-flex my-2 position-relative" onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ flexGrow: 1 }}>
          <input className="form-control" style={{ width: '415px' }} type="search"
            aria-label="Search" value={searchQuery} onChange={handleInputChange}
            placeholder={searchQuery ? searchQuery : "Search for Movies, Events, Plays, Sports and Activities"} />
          <button className="btn btn-outline-light ms-2" type="button" onClick={handleSearch}>
            Search
          </button>
          {suggestions.length > 0 && (
            <ul className="list-group position-absolute mt-5" style={{ zIndex: 10, width: '420px' }}>
              {loading ? (
                <li className="list-group-item">Loading...</li>
              ) : (suggestions.slice(0, 5).map((suggestion) => (
                <li key={suggestion.id} className="list-group-item" onClick={() => {
                  setSearchQuery(suggestion.title);
                  navigate(`/movies?query=${suggestion.title}`);
                  setSuggestions([]);
                }}>
                  {suggestion.title}
                </li>
              )))}
            </ul>
          )}
        </form>
        <button className="navbar-toggler" type="button" onClick={toggleNavbar}
          aria-controls="navbarNav" aria-expanded={isOpen} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item"><Link className="nav-link text-light" to="/movie">Movies</Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/stream">Stream</Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/events">Events</Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/plays">Plays</Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/sports">Sports</Link></li>
          </ul>
          <div className="collapse navbar-collapse ms-auto d-flex align-items-center me-2">
            <div className="text-info" onClick={() => setShowModal(true)}>
              {city === "Select Location" ? "Select Location" : ` ${city}`}
            </div>
            <div className="d-flex">
              {loggedIn ? (
                <Link to="/profile" className="btn btn-primary ms-2">Profile</Link>
              ) : (
                <Link to="/login" className="btn btn-primary ms-2">Sign in</Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <LocationModal
        showModal={showModal}
        location={location}
        otherCities={otherCities}
        selectedCity={city}
        handleCitySelect={handleCitySelect}
        modalRef={modalRef}
      />
    </nav>
  );
}
export default Navbar;
