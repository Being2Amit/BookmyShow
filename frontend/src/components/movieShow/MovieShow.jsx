import React, { useEffect, useState } from "react";
import SeatsModal from "./SeatsModal"; 
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { GrNext,GrPrevious} from "react-icons/gr";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function MovieShow() {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [theaters, setTheaters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {movieTitle, selectedLanguage, selectedFormat, movieId } = location.state || {};
  const [certification, setCertification] = useState(null);
  const [genres, setGenres] = useState([]);
  const [dateOffset, setDateOffset] = useState(0);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null); 
  const [selectedFilters, setSelectedFilters] = useState({ morning: false, afternoon: false, evening: false, night: false,});
  const navigate = useNavigate();

  // Fetch movie details (certification and genres)
  useEffect(() => {
    if (movieId) {
      const fetchMovieData = async () => {
        try {// Fetch movie details (genres)
          const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=41c953dc7d1c21d27df7b693e9740a3c&language=en-IN`);
          setGenres(movieResponse.data.genres.map((genre) => genre.name));
          const releaseResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=41c953dc7d1c21d27df7b693e9740a3c`);
          const indiaRelease = releaseResponse.data.results.find((release) => release.iso_3166_1 === "IN");
          if (indiaRelease) {
            const certificationData = indiaRelease.release_dates.find((date) => date.certification);
            if (certificationData?.certification) {
              const certificationWithoutAge = certification.certification.replace(/\d+\+/, "").trim();
              setCertification(certificationWithoutAge || "U/A");
            } else { setCertification("UA"); }
          } else { setCertification("UA"); }
        } catch (error) { console.error("Error fetching movie data:", error); setCertification("UA"); }
      }; fetchMovieData();
    }
  }, [movieId]);
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get('https://mocki.io/v1/722b8a59-ce98-435e-98f0-5a271774f36e');
        setTheaters(response.data);
      } catch (error) {
        console.error("Error fetching theaters data:", error);
      }
    };
    fetchTheaters();
  }, []);
  const toggleModal = () => {setIsModalVisible(!isModalVisible);};
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return {day,date: dayNum,month,fullDate: date.toISOString().split("T")[0],formattedDate: `${dayNum} ${month}, ${year}`, };
  });
  
  const handlePrevious = () => { setDateOffset((prevOffset) => Math.max(prevOffset - 1, 0)); };
  const handleNext = () => { setDateOffset((prevOffset) => Math.min(prevOffset + 1, dates.length - 1)); };

  // Handle when a user clicks a showtime
  const handleShowtimeClick = (time) => {
    setSelectedShowtime(time);
    setShowModal(true); // Open modal when showtime is clicked
  };
  const handleTheaterSelect = (theater) => {
    setSelectedTheater(theater);
  };
  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };
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
    navigate("/seats", {state: {theaterLocation: selectedTheater.location,theaterName: selectedTheater.theater,
      movieTitle,certification,selectedDate,selectedShowtime,seats,category,selectedLanguage,selectedFormat},
    });
  };

  
  return (
    <>
      <div className="rounded shadow bg-white">
        <div className="mx-4 my-1 p-3">
          <h1>{movieTitle} <small className="text-muted">({selectedLanguage})</small></h1>{/* Movie Title and Language */}
          {certification && genres.length > 0 && (
            <div className="d-flex flex-wrap gap-x-2">{/* Certification,Format and Genres  */}
              <button id="badge" style={{width:'25px', height:'25px'}} className="btn badge border-secondary text-secondary rounded-circle d-flex align-items-center justify-content-center "> <small>{certification}</small> </button>
              <button id='badge' className="btn badge border-secondary text-secondary">{selectedFormat}</button>
              {genres.map((genre, index) => (<button id='badge' key={index} className="btn badge border-secondary text-secondary">{genre.toUpperCase()}</button>))}
            </div>
          )}
        </div>
      </div>
      <div className="d-flex flex-row rounded shadow bg-white">
        <div className="d-flex col-4 align-items-center p-3">
          <button className="btn" onClick={handlePrevious}><GrPrevious /></button>
          {/* Date Buttons */}
          <div className="d-flex badge text-secondary justify-content-center gap-1 position-relative">
            {dates.slice(dateOffset, dateOffset + 5).map((date, index) => (
              <div key={index} className={`text-center px-3 py-2 rounded ${selectedDate === date.fullDate ? "bg-danger text-white" : "bg-light"}`} style={{ cursor: "pointer" }}
                onClick={() => setSelectedDate(date.fullDate)}><div>{date.day}</div><div>{date.date}</div><div>{date.month}</div>
              </div>
            ))}
          </div>
          <button className="btn" onClick={handleNext}><GrNext /></button>
        </div>
        <div className="col-3"></div>
        <hr />
        {/* Filters Section */}
        <div className="filter-container d-flex align-items-center gap-3 border-start px-2">
          <div className="col-4 px-3 badge text-secondary">{`${selectedLanguage} - ${selectedFormat}`}</div>
        </div>
        <div className="filter-container d-flex align-items-center border-start px-2">
          <div className="filter-item px-3">
            <div className="filter-dropdown d-flex flex-column">
              <button className=" btn badge text-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Filter Price Range</button>
              <ul className="dropdown-menu p-3">
                <li><input type="checkbox" id="price-0-200" value="0-200" /><label className="px-2">Rs. 0-200</label></li>
                <li><input type="checkbox" id="price-201-300" value="201-300" /><label className="px-2">Rs. 201-300</label></li>
                <li><input type="checkbox" id="price-301-400" value="301-400" /><label className="px-2">Rs. 301-400</label></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="filter-container d-flex align-items-center border-start px-2">
          <div className="col-4 px-2 filter-item position-relative" style={{ display: "inline-block" }}>
            <button className="btn badge text-secondary" onClick={toggleModal}> Filter Show Timings</button>
            {isModalVisible && (
              <div className="modal-content position-absolute shadow bg-light"
                style={{ top: "calc(100% + 5px)", left: "0", zIndex: "1050", borderRadius: "5px", width: "230px", padding: "10px", }}>
                <div className="form-check"><small><input type="checkbox" id="Morning" value="Morning" />
                  <label htmlFor="Morning" className="px-2">Morning 12:00-11:59 AM</label></small>
                </div>
                <div className="form-check"><small><input type="checkbox" id="Afternoon" value="Afternoon" />
                  <label htmlFor="Afternoon" className="px-2">Afternoon 12:00-3:59 PM</label></small>
                </div>
                <div className="form-check"><small><input type="checkbox" id="Evening" value="Evening" />
                  <label htmlFor="Evening" className="px-2">Evening 4:00-6:59 PM</label></small>
                </div>
                <div className="form-check"><small><input type="checkbox" id="Night" value="Night" />
                  <label htmlFor="Night" className="px-2">Night 7:00-11:59 PM</label></small>
                </div>
                <div className="text-center">
                  <button type="button" className="btn btn-primary btn-sm mt-2 me-2" onClick={() => alert("Filters Applied!")}>Apply</button>
                  <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={toggleModal}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="filter-container d-flex align-items-center border-start ">
          <button className="search-button px-4"><FaSearch /></button>
        </div>
      </div>
      <div className="rounded shadow bg-white p-3 mt-3">
        <div className="theater-list card border-bottom px-3">
          {theaters.map((theater, index) => (
            <div key={index} className="theater-item-card border-bottom py-3 row"  onClick={() => handleTheaterSelect(theater)} >
              <div className="col-4"><i className="bi bi-heart"></i>
                <div className="badge text-muted fs-6 px-3">{theater.theater} : {theater.location}</div>
                <div className="amenities px-3">
                  <span className="badge text-success me-2"><i className="bi bi-phone fs-5"></i> M-Ticket</span>
                  <span className="badge" style={{ color: "#ffa426" }}><i className="bi bi-cup-straw fs-5"></i> Food & Beverage</span>
                </div>
              </div>
              <div className="col-4">
                <div className="showtimes">
                  {theater.features?.showtimes?.length > 0 ? (
                    theater.features.showtimes.map((time, idx) => (
                      <button key={idx} className="btn btn-outline-secondary mx-1 my-1" onClick={() => handleShowtimeClick(time)}>{time}</button>)))
                    : (<p className="text-muted">No showtimes available</p>)
                  }
                </div>
                <div className="note">
                <span className={`badge fs-6 ${index % 2 === 0 ? "text-warning" : "text-success"}`}>•</span>
                  {index % 2 === 0 ? "Non-cancellable" : "Cancellation Available"}
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
       selectedShowtime={selectedShowtime} onConfirm={handleConfirmSeats}/>
      <ToastContainer />
    </>
  );
}
export default MovieShow;
