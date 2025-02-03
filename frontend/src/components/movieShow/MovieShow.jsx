import { useEffect,useRef, useState } from "react";
import SeatsModal from "./SeatsModal";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function MovieShow() {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchVisible, setSearchVisible] = useState(false);
  const [originalTheaters, setOriginalTheaters] = useState([]);
  const [searchTheaters, setSearchTheaters] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { movieTitle, selectedLanguage, selectedFormat, movieId } = location.state || {};
  const [certification, setCertification] = useState(null);
  const [genres, setGenres] = useState([]);
  const dateRefs = useRef([]); 
  const scrollContainerRef = useRef(null); 
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [Filters, setFilters] = useState({ morning: false, afternoon: false, evening: false, night: false, });
  const navigate = useNavigate();

  // Fetch movie details (certification and genres)
  useEffect(() => {
    if (movieId) {
      const fetchMovieData = async () => {
        try {
          // Fetch movie details (genres)
          const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=41c953dc7d1c21d27df7b693e9740a3c&language=en-IN`);
          setGenres(movieResponse.data.genres.map((genre) => genre.name));
          const releaseResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=41c953dc7d1c21d27df7b693e9740a3c`);
          const indiaRelease = releaseResponse.data.results.find((release) => release.iso_3166_1 === "IN");
          if (indiaRelease) {
            const certificationData = indiaRelease.release_dates.find((date) => date.certification);
            if (certificationData && certificationData.certification) {
              const certificationWithoutAge = certificationData.certification.replace(/\d+\+/, "").trim();
              setCertification(certificationWithoutAge || "U/A");
            } else { setCertification("UA"); }
          } else { setCertification("UA"); }
        } catch (error) {
          console.error("Error fetching movie data:", error);
          setCertification("UA"); // Default to "UA" if there is an error fetching certification
        }
      };
      fetchMovieData();
    }
  }, [movieId]);  
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get('https://mocki.io/v1/6b16e4b4-ad24-4ef0-ab48-c50f986cde00');
        setTheaters(response.data);
        setOriginalTheaters(response.data);
      }
      catch (error) { console.error("Error fetching theaters data:", error); }
    };
    fetchTheaters();
  }, []);
  const toggleSearchField = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      setSearchTheaters(""); // Reset search field
      setTheaters(originalTheaters); // Reset theaters to original
    }
  };
  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;  // Preserve the case of the input
    setSearchTheaters(value); // Store the original input
    const searchTerms = value.toLowerCase().split(/\s+/);
    // Filter theaters based on the search input (case-insensitive comparison)
    const filteredTheaters = originalTheaters.filter((theater) => {
      return searchTerms.every((term) => {
        return (theater.theater.toLowerCase().includes(term) || theater.location.toLowerCase().includes(term));
      });
    });
    setTheaters(filteredTheaters);
  };

  // Clear search and restore all theaters
  const clearSearch = () => {
    setSearchTheaters("");  // Clear the search input
    setTheaters(originalTheaters);  // Restore original theaters list
    setSearchVisible(false);  // Hide the search field
  };
  const toggleModal = () => { setIsModalVisible(!isModalVisible); };
  const handleMouseLeave = () => {
    setIsModalVisible(false); // Close the modal when the mouse leaves
  };
  const dates = Array.from({ length: 9 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return { day, date: dayNum, month, fullDate: date.toISOString().split("T")[0], formattedDate: `${dayNum} ${month}, ${year}`, };
  });

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "next" ? 100 : -100,
        behavior: "smooth",
      });
    }
  };

  const handleDateSelect = (fullDate, index) => {
    setSelectedDate(fullDate);
    dateRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    
  };

  // Handle when a user clicks a showtime
  const handleShowtimeClick = (time) => {
    setSelectedShowtime(time);
    // Create a Date object for the selected showtime
    const showtime = new Date(`${selectedDate} ${time}`);
    console.log("Clicked selectedShowtime:",time);
    // Current date and time
    const currentDate = new Date(); const currentTime = new Date();
    // Ensure the selected date is not earlier than the current date
    const isFutureDate = new Date(selectedDate).setHours(0, 0, 0, 0) >= currentDate.setHours(0, 0, 0, 0);
    // Check if the showtime for the selected date has not already passed
    const isTimeValid = isFutureDate ? showtime > currentTime : true;
    // The showtime is valid if both the date and time conditions are satisfied
    const isShowtimeValid = isFutureDate && isTimeValid;
    if (!isShowtimeValid) {
      toast.warning("This showtime is no longer available.");
      return; // Exit if the showtime is not valid
    }setShowModal(true); // Open modal when showtime is clicked
  };

  const handleTheaterSelect = (theater) => { setSelectedTheater(theater); };
  // Close modal
  const handleCloseModal = () => { setShowModal(false); };
  const handleConfirmSeats = ({ seats, category, date }) => {
    // Check for required fields: theater, date, time, and seats
    if (!date || !selectedShowtime || !seats || !selectedTheater) {
      if (!date) toast.warning("Please select a date!");
      if (!selectedShowtime) toast.warning("Please select a showtime!");
      if (!seats) toast.warning("Please select the number of seats!");
      if (!selectedTheater) toast.warning("Please select a theater!");
      return; // Stop if any required field is missing
    }

    // Construct success message based on whether the category is provided
    const successMessage = category
      ? `You have selected ${seats} seat(s) in the ${category} category for the showtime ${selectedShowtime} on ${date}`
      : `You have selected ${seats} seat(s) for the showtime ${selectedShowtime} on ${date}`;
    toast.success(successMessage);
    setShowModal(false); // Close the modal after confirming the seats
    navigate("/seats",{ 
      state: {
        theaterLocation: selectedTheater.location, theaterName: selectedTheater.theater, movieTitle,
        certification, selectedDate, selectedShowtime, seats, category, selectedLanguage, selectedFormat
      },
    });
  };
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [id.toLowerCase()]: checked, };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };
  const applyFilters = (filters) => {
    const filteredTheaters = theaters.map((theater) => {
      // Use originalShowtimes if it exists, otherwise use showtimes
      const showtimes = theater.originalShowtimes || theater.features.showtimes;
      const filteredShowtimes = showtimes.filter((time) => {
        const [timePart, meridiem] = time.split(" ");
        const [hours] = timePart.split(":").map(Number);
        const convertedHours = meridiem === "PM" && hours !== 12 ? hours + 12 : meridiem === "AM" && hours === 12 ? 0 : hours;
        const isMorning = filters.morning && convertedHours >= 0 && convertedHours < 12;
        const isAfternoon = filters.afternoon && convertedHours >= 12 && convertedHours < 16;
        const isEvening = filters.evening && convertedHours >= 16 && convertedHours < 19;
        const isNight = filters.night && convertedHours >= 19 && convertedHours <= 23;
        return isMorning || isAfternoon || isEvening || isNight;
      });
      return {
        ...theater, features: { ...theater.features, showtimes: filters.morning || filters.afternoon || filters.evening || filters.night ? filteredShowtimes : showtimes, },
        originalShowtimes: theater.originalShowtimes || theater.features.showtimes,
      };
    }); setTheaters(filteredTheaters);
  };
  // Get the active filter labels
  const activeFilters = () => {
    const activeFilters = [];
    if (Filters.morning) activeFilters.push("Morning Show");
    if (Filters.afternoon) activeFilters.push("Afternoon Show");
    if (Filters.evening) activeFilters.push("Evening Show");
    if (Filters.night) activeFilters.push("Night Show");
    return activeFilters.length > 0 ? activeFilters.join(", ") : "Filter Show Timings";
  };
    
  return (
    <>
      <div className="container-fluid rounded shadow bg-white mb-3 py-3">
        <div className="px-3 py-2">
          <h3>{movieTitle} <span className="text-muted">({selectedLanguage})</span></h3>{/* Movie Title and Language */}
          {certification && genres.length > 0 && (
            <div className="d-flex flex-wrap gap-1 align-items-center mt-2">{/* Certification,Format and Genres  */}
              <button style={{ width: '25px', height: '25px', cursor: 'context-menu' }} className="btn badge border-secondary text-secondary rounded-circle d-flex align-items-center justify-content-center "> <small>{certification}</small> </button>
              <button className="btn badge border-secondary text-secondary" style={{ cursor: 'context-menu' }}>{selectedFormat}</button>
              {genres.map((genre, index) => (<button key={index} className="btn badge border-secondary text-secondary" style={{ cursor: 'context-menu' }}>{genre.toUpperCase()}</button>))}
            </div>
          )}
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row rounded shadow bg-white p-3">
        <div className="d-flex flex-column flex-md-row col-12 col-md-3 align-items-center position-relative">
          <button className="btn position-absolute" style={{ left: 0, zIndex: 1 }} onClick={() => handleScroll("prev")} ><GrPrevious /></button>
          {/* Date Buttons */}
          <div ref={scrollContainerRef} className="d-flex badge text-secondary gap-2 flex-nowrap overflow-auto position-absolute" style={{ left: 40, scrollBehavior: "smooth", whiteSpace: "nowrap", scrollbarWidth: "none", overflowX: "scroll", width: "260px",}}>
            {dates.map((date, index) => (
              <div key={index} ref={(el) => (dateRefs.current[index] = el)} className={`text-center  px-2 py-2 rounded ${selectedDate === date.fullDate ? "bg-danger text-white" : "bg-light"} hover`} style={{ cursor: "pointer", minWidth: "20px", display: 'block', flex: "0 0 auto" }}
                onClick={() => handleDateSelect(date.fullDate, index)}><div>{date.day}</div><div>{date.date}</div><div>{date.month}</div>
              </div>
            ))}
          </div>
          <button className="btn position-absolute " style={{ right: -25, zIndex: 1 }} onClick={() => handleScroll("next")}><GrNext /></button>
        </div>
        <div className="col-md-4"></div>
        <hr />
        {/* Filters Section */}
        <div className="d-flex flex-column flex-md-row justify-content-center">
          {/* Filter Language and Format */}
          <div className="filter-container d-flex align-items-center gap-2 border-start col-12 col-md-4"style={{ borderBottom: "2px solid #dc3545", }}>
            <div className="col-12 px-2 badge text-secondary">{`${selectedLanguage} - ${selectedFormat}`}</div>
          </div>
          {/* Filter Show Timings */}
          <div className="filter-container d-flex align-items-center justify-content-center gap-2 border-start px-5 col-12 col-md-4">
            <div className="col-12 px-4 d-flex justify-content-center align-items-center filter-item position-relative">
              <button className="btn badge text-secondary" onClick={toggleModal}>  {activeFilters()}
              <i  className={`bi ${isModalVisible ? " " : "bi-chevron-down px-1"}`} onClick={toggleModal}></i></button>
              {isModalVisible && (
                <div className="modal-content position-absolute shadow bg-light" onMouseLeave={handleMouseLeave}
                  style={{ top: "calc(100% + 5px)", left: "-80px", zIndex: "1050", borderRadius: "5px", width: "270px", padding: "10px", }}>
                  <div className="form-check">
                    <small>
                      <input type="checkbox" id="Morning" value="Morning" checked={Filters.morning} onChange={handleCheckboxChange} />
                      <label htmlFor="Morning" className="px-2">Morning &nbsp;<span>12:00-11:59 AM</span></label>
                    </small>
                  </div>
                  <div className="form-check">
                    <small>
                      <input type="checkbox" id="Afternoon" value="Afternoon" checked={Filters.afternoon} onChange={handleCheckboxChange} />
                      <label htmlFor="Afternoon" className="px-2">Afternoon <span className="px-1">12:00-3:59 PM</span></label>
                    </small>
                  </div>
                  <div className="form-check">
                    <small>
                      <input type="checkbox" id="Evening" value="Evening" checked={Filters.evening} onChange={handleCheckboxChange} />
                      <label htmlFor="Evening" className="px-2">Evening <span className="px-3">04:00-6:59 PM</span></label>
                    </small>
                  </div>
                  <div className="form-check">
                    <small>
                      <input type="checkbox" id="Night" value="Night" checked={Filters.night} onChange={handleCheckboxChange} />
                      <label htmlFor="Night" className="px-2">Night &nbsp; <span className="px-3">07:00-11:59 PM</span></label>
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Search Button */}
          <div className="filter-container d-flex align-items-center gap-2 border-start px-3 col-12 col-md-4 justify-content-center">
            {searchVisible ? (<div className="d-flex align-items-center w-100 position-relative">
              <input type="text" className="form-control" placeholder="Search" value={searchTheaters} onChange={handleSearchChange}
              style={{ outline: "none", boxShadow: "none", border: "1px solid #ced4da" }}/>
              <button className="btn btn-muted position-absolute end-0" onClick={clearSearch}>X</button>
              </div>) : (<button className="d-flex justify-content-center align-items-center filter-item" onClick={toggleSearchField}><FaSearch /></button>)}
          </div>
        </div>
      </div>
      <div className="rounded shadow bg-white p-3 mt-3">
        <div className="theater-list card border-bottom px-3">
          {theaters.map((theater, index) => (
            <div key={index} className="theater-item-card border-bottom py-3 row d-flex flex-column flex-md-row flex-sm-row" onClick={() => handleTheaterSelect(theater)} >
              <div className="col-12 col-md-4 col-sm-1"><i className="bi bi-heart"></i>
                <span className="mx-2 text-muted fs-6 fw-bold">{theater.theater} : {theater.location}</span>
                <div className="amenities px-3 d-flex flex-row">
                  <span className="badge text-success me-2"><i className="bi bi-phone fs-5"></i> M-Ticket</span>
                  <span className="badge" style={{ color: "#ffa426" }}><i className="bi bi-cup-straw fs-5"></i> Food & Beverage</span>
                </div>
              </div>
              <div className="col-12 col-md-6 mt-2 mt-md-0">
                <div className="d-flex flex-wrap">
                  {theater.features?.showtimes?.length > 0 ? (
                    theater.features.showtimes.map((time, idx) => (
                      <button key={idx} className="btn btn-outline-secondary btn-sm mx-1 my-1" onClick={() => handleShowtimeClick(time)}>{time}</button>)))
                    : (<p className="text-muted">No showtimes available</p>)
                  }
                </div>
                <div className="notes">
                  <span className={`badge fs-4 ${theater.features?.screen_type.includes("Cancellable") ? "text-success" : "text-warning"}`}>•</span>
                  {theater.features?.screen_type.includes("Cancellable") ? "Cancellation Available" : "Non-Cancellable"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal for "How Many Seats?" */}
      <SeatsModal show={showModal} onClose={handleCloseModal}
        movieTitle
        selectedDate={dates.find(date => date.fullDate === selectedDate)?.formattedDate}
        selectedShowtime={selectedShowtime} onConfirm={handleConfirmSeats} />
      <style>{`.hover:hover { color: #dc3545; }`}</style>
      <ToastContainer />
    </>
  );
}
export default MovieShow;