import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

function BookingModal({ show, onClose, movieId }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId && show) {
      // Fetch movie details
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=41c953dc7d1c21d27df7b693e9740a3c`)
        .then((res) => {
          setMovieDetails(res.data);
          // Set available languages (dummy data for demonstration)
          setLanguages(["English", "Hindi", "Tamil", "Telugu", "Malayalam"]);
          // Set available formats (dummy data for demonstration)
          setFormats(["2D", "3D", "4D/IMAX"]);
        })
        .catch((err) => console.log(err));
    }
  }, [movieId, show]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language === selectedLanguage ? null : language); // Toggle selection
    if (language && selectedFormat) {
      handlenavigate(language, selectedFormat);
    }
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format === selectedFormat ? null : format); // Toggle selection
    if (selectedLanguage && format) {
      handlenavigate(selectedLanguage, format);
    }
  };
  const handlenavigate= (language, format) => {
    navigate("/MovieShow", {
      state: { movieId,movieTitle: movieDetails?.title,selectedLanguage: language,selectedFormat: format},
    });
  };
  return (
    <div className={`modal fade ${show ? "show" : ""}`} tabIndex="-1" aria-labelledby="BookingModalLabel" aria-hidden="true" style={{ display: show ? "block" : "none", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header d-flex">
            <p className="modal-title mb-1 fw-bold">{movieDetails ? movieDetails.title : "Movie Title"}</p>
            <button type="button" className="btn-close position-absolute top-0 end-0 mt-3 me-3" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <h5 className="mb-2">Select Language and Format</h5>
            <div className="mb-3">
              <h6>Languages:</h6>
              <div className="d-flex flex-wrap">
                {languages.map((lang, index) => (
                  <button key={index} className={`btn mx-1 mb-2 ${lang === selectedLanguage ? "btn-success" : "btn-outline-secondary"}`} onClick={() => handleLanguageSelect(lang)}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <h6>Formats:</h6>
              <div className="d-flex flex-wrap">
                {formats.map((format, index) => (
                  <button key={index} className={`btn mx-1 mb-2 ${format === selectedFormat ? "btn-success" : "btn-outline-secondary"}`} onClick={() => handleFormatSelect(format)}>
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
