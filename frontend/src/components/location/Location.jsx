import { useState,useEffect  } from "react";

function LocationModal({ showModal,location, otherCities, handleCitySelect, modalRef ,selectedCity,setShowModal }) {
  const [filteredCities, setFilteredCities] = useState(otherCities); // To handle filtered cities
  const [showOtherCities, setShowOtherCities] = useState(false); // To toggle visibility of "Other Cities"
  const [searchQuery, setSearchQuery] = useState(""); // To handle debounce input
  const [isFocused, setIsFocused] = useState(false); // State to track focus
  // Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = otherCities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }, 300); // Debounce delay (300ms)
    return () => clearTimeout(timer); // Cleanup timeout
  }, [searchQuery, otherCities]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };
  const handleCitySelection = (city) => {
    handleCitySelect(city); // Pass selected city to parent
    setSearchQuery(""); // Clear the search query
    setFilteredCities([...otherCities]); // Reset to full list of cities
  };
  return (
    showModal && (
      <div className="modal show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} aria-labelledby="locationModalLabel" aria-hidden="false">
        <div className="modal-dialog" style={{ maxWidth: "900px" }} ref={modalRef}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="locationModalLabel">Select Your Location</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {/* Search Bar with Icon */}
              <div className="input-group">
                <span className="input-group-text"  style={{backgroundColor:'white'}}><i className="bi bi-search " style={{fontSize:'10px'}}></i></span>
                <input type="text" className="form-control" placeholder="Search for your city" aria-label="Search for your city" onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} style={{ backgroundColor: isFocused ? "" : "", boxShadow: isFocused ? "none" : "",  outline: "none",}}/>
              </div>
              <div style={{ maxHeight: showOtherCities ? "none" : "110px", overflow: "hidden", }}>
                <p className="text-center" style={{ fontSize: "1rem" }}> Popular Cities </p>
                <div className="d-flex flex-nowrap overflow-auto gap-2 mb-4 px-sm-5">
                  {location.filter((loc) => loc.name.toLowerCase().includes(searchQuery.toLowerCase())).map((loc) => (
                    <div key={loc.name} className="d-flex flex-column align-items-center" onClick={() => handleCitySelection(loc.name)} style={{ cursor: "pointer", width: "80px" }}>
                      <img src={selectedCity === loc.name ? loc.selectedLink : loc.link}  style={{ width: "40px", height: "50px", }} />
                      <div style={{ fontSize: "0.8rem", textAlign: "center" }}>{loc.name}</div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-dark"> Hyderabad Area</p>
                <div className="d-flex flex-wrap justify-content-between gap-2 px-2">
                  {filteredCities.map((city, index) => (
                    <div key={index} className="col-4 col-sm-3 col-md-2 mb-2" style={{ fontSize: "0.9rem", cursor: "pointer", color: 'gray' }} onClick={() => handleCitySelection(city)}>{city}</div>))}
                </div>
              </div>
            </div>
            {/* Toggle Button */}
            <div className="text-center mb-3">
              <span className='text-danger' style={{ cursor: "pointer", fontSize: "0.9rem" }} onClick={() => setShowOtherCities(!showOtherCities)}>
                {showOtherCities ? "Hide All Cities" : "View All Cities"}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default LocationModal;
