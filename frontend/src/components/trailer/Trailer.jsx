import { useState, useEffect } from "react";
import axios from "axios";

function TrailerModal({ show, onClose, movieId }) {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [videoSrc, setVideoSrc] = useState("");

  // Fetch trailers from the TMDb API
  useEffect(() => {
    if (movieId) {
      setLoading(true);
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=41c953dc7d1c21d27df7b693e9740a3c`)
        .then((response) => {// Filter only trailers and set the state
          const trailerResults = response.data.results.filter((video) => video.type === "Trailer");
          setTrailers(trailerResults); setLoading(false);
          if (trailerResults.length > 0) { setVideoSrc(`https://www.youtube.com/embed/${trailerResults[0]?.key}`); }// Set the first trailer when the modal is opened
        }).catch((error) => { console.error("Error fetching trailers:", error); setLoading(false); }
        );
    }
  }, [movieId]);

  useEffect(() => {// Reset trailer index when modal is shown
    if (show) { setCurrentTrailerIndex(0); } // Reset to the first trailer when modal is opened
  }, [show]);

  useEffect(() => {// Update the video source when the current trailer changes
    if (trailers.length > 0) { setVideoSrc(`https://www.youtube.com/embed/${trailers[currentTrailerIndex]?.key}`); }
  }, [currentTrailerIndex, trailers]);

  // Close modal and stop the video by clearing the video source and Handle trailer selection
  const handleClose = () => { setVideoSrc(""); onClose(); };// Reset the video source to stop the video
  const handleSelectTrailer = (index) => { setCurrentTrailerIndex(index); };
  return (
    <div className={`modal fade ${show ? "show" : ""}`} id="trailerModal" tabIndex="-1" aria-labelledby="trailerModalLabel" aria-hidden="true" style={{ display: show ? "block" : "none" }}>
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title" id="trailerModalLabel"> Movie Trailer: {trailers[currentTrailerIndex]?.name || "No Title"}</h6>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button> {/*Use handleClose to stop video*/}
          </div>
          <div className="modal-body">
            {loading ? (<div>Loading trailers...</div>) : trailers.length === 0 ? (<div>No trailers available</div>) : (
              <div className="ratio ratio-16x9">
                <iframe src={videoSrc} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <div className="trailer-buttons me-3">
              {trailers.map((_, index) => (
                <button key={index} type="button" className={`btn btn-primary mx-2 ${index === currentTrailerIndex ? "active" : ""}`}
                  onClick={() => handleSelectTrailer(index)}> Trailer {index + 1}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose} >Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
