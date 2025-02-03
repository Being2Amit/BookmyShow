import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import BookingModal from '../bookingTicket/BookingTicket'; 
import TrailerModal from '../trailer/Trailer'; // Import TrailerModal
import Rating from "../rating/Rating";

function MovieDetails() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  // eslint-disable-next-line no-unused-vars
  const [Trailers,setTrailers] = useState(null); // State to store trailer data
  const [certification, setCertification] = useState(null);
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  // Fetch movie details
  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=41c953dc7d1c21d27df7b693e9740a3c`)
      .then(res => {console.log(res.data);setMovieDetails(res.data);})
      .catch(err => {console.log(err);});
  }, [id]);
  // Fetch cast and crew
  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=41c953dc7d1c21d27df7b693e9740a3c`)
      .then((res) => setCredits(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // Fetch trailers
  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=41c953dc7d1c21d27df7b693e9740a3c`)
      .then((res) => setTrailers(res.data.results))
      .catch((err) => console.log(err));
  }, [id]);

  // Fetch certification data for India
  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=41c953dc7d1c21d27df7b693e9740a3c`)
      .then((res) => {
        const indiaRelease = res.data.results.find((release) => release.iso_3166_1 === "IN");
        if (indiaRelease) {
          // Find the certification code (filter out age suffix)
          const certification = indiaRelease.release_dates.find((date) => date.certification);
          if (certification?.certification) {
            // Remove any age suffix (like 16+, 13+)
            const certificationWithoutAge = certification.certification.replace(/\d+\+/, "").trim();
            setCertification(certificationWithoutAge || "UA");
          } else {setCertification("U/A");}
        } else {setCertification("UA");}
      })
      .catch((err) => console.log(err));
  }, [id]);
  if (!movieDetails || !credits) {
    return <p>Loading...</p>; 
  }
  const backDropUrl = `https://image.tmdb.org/t/p/w500/${movieDetails.backdrop_path}`; 
  const genres = movieDetails.genres.map(genre => genre.name).join(', ');
  const language = movieDetails.original_language;
  const formattedLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  // Convert runtime (minutes) to hours and minutes
  const runtimeHours = Math.floor(movieDetails.runtime / 60);
  const runtimeMinutes = movieDetails.runtime % 60;
  const formattedRuntime = `${runtimeHours}h ${runtimeMinutes}m`;

  // Format the release date (example: 24 Oct, 2024)
  const releaseDate = new Date(movieDetails.release_date);
  const formattedReleaseDate = releaseDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  // Rating and votes
  const rating = movieDetails.vote_average ? `${movieDetails.vote_average.toFixed(1)}/10` : "N/A";
  const votes = movieDetails.vote_count ? `${(movieDetails.vote_count / 1000).toFixed(1)}K` : "N/A";

  // Get top 8 cast members
  const topCast = credits.cast.slice(0, 8);

  // Group crew members by unique id and concatenate roles, only include those with profile_path
  const uniqueCrew = Array.from(
    credits.crew.reduce((map, crewMember) => {
      if (crewMember.profile_path) { // Only include crew with an image
        if (!map.has(crewMember.id)) {
          map.set(crewMember.id, { ...crewMember, jobs: [crewMember.job] });
        } else {
          map.get(crewMember.id).jobs.push(crewMember.job);
        }
      }
      return map;
    }, new Map()).values()
  );
  const handleRatting = () => {
    if (loggedIn) {setShowRatingModal(true);} 
    else {navigate("/login"); }
  };
  const handleCloseRating = () => {
    setShowRatingModal(false);
  };
  // Function to handle the modal opening
  const handleShowModal = () => { setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); };
  const handleShowBookingModal = () => {setShowBookingModal(true);};
  const handleCloseBookingModal = () => {setShowBookingModal(false);
  };
  return (
    <div className="movie" style={{ minHeight: '100vh' }}>
      <section className="mb-4" style={{ height: 'auto' }}>
        <div className="py-4 mx-auto d-flex align-items-center flex-column flex-lg-row" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${backDropUrl})`, backgroundRepeat: "no-repeat",
          backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: 'white',minHeight: '400px',
        }}>
          <div className="container d-flex align-items-center flex-column flex-lg-row">
            {/* Image div */}
            <div className="position-relative me-3 mb-3 mb-lg-0" style={{ width: '261px', height: '392px' }}>
              <div className="card text-center bg-dark" style={{ padding: '0.1px', backgroundColor: '#171717', width: '261px', height: '392px' }}>
                <img className="card-img-top"  src={movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}alt={`${movieDetails.title} poster`} style={{ width: '100%', height: '360px', objectFit: "center" }} />
                <button onClick={handleShowModal}
                  className="btn btn-info position-absolute top-50 start-50 translate-middle px-4 py-2"
                  style={{ fontSize: "16px", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", border: "none", borderRadius: "20px", zIndex: 10, transition: "transform 0.3s ease, background-color 0.3s ease",cursor: "pointer" }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = "gray"; e.target.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; e.target.style.transform = "scale(1)"; }}
                ><i className="bi bi-play-circle me-2"></i> Trailer
                </button>
                <p className="text-light">{new Date(movieDetails.release_date) < new Date() &&(new Date() - new Date(movieDetails.release_date)) <= 60 * 24 * 60 * 60 * 1000
                  ? "In cinemas"  // Movie released within last 60 days
                  : new Date(movieDetails.release_date).toLocaleDateString() === new Date().toLocaleDateString()
                  ? "In cinemas"  // Movie released today
                  : new Date(movieDetails.release_date) < new Date()
                  ? `Released on ${formattedReleaseDate}`  // Movie already released but not within the last 60 days
                  : `Upcoming Movie ${formattedReleaseDate}`}
                </p>
              </div>
            </div>
            {/* details div */}
            <div className="text-white text-center text-lg-start" style={{ maxWidth: '500px' }}>
              <h1 className="text-warning mb-3">{movieDetails.title}</h1>
              <div className="btn btn-dark mb-2"><i className="text-danger px-1 bi bi-star-fill"></i> <span className="px-1">{rating}</span><span className="px-1">({votes} votes){">"}</span>&nbsp;&nbsp;
                <button className="btn btn-light mx-2 me-2"  onClick={handleRatting}>Rate now</button></div>
              <p className="mb-3">{formattedRuntime} • {genres}• {certification}  • {formattedReleaseDate}</p>
              {(new Date(movieDetails.release_date) < new Date() &&
               (new Date() - new Date(movieDetails.release_date)) <= 60 * 24 * 60 * 60 * 1000) ||
               (new Date(movieDetails.release_date) > new Date() &&
               (new Date(movieDetails.release_date) - new Date()) <= 5 * 24 * 60 * 60 * 1000) ? (
               <button className="btn btn-danger btn-lg" onClick={handleShowBookingModal}>Book Tickets</button>
               ) : (<button className="btn btn-danger btn-lg" disabled>Tickets Unavailable</button>)
              }
            </div>
          </div>
        </div>
      </section>
      <hr />
      {/* Overview*/}
      <div className="container">
        <h4 className="text-dark mb-3">About the movie:</h4>
        <p className="text-muted">{movieDetails.overview}</p>
      </div>
      <hr />
      {/* Cast Section */}
      <div className="container">
        <h4 className="text-dark mb-3 fs-bold">Cast:</h4>
        <div className="d-flex  justify-content-start overflow-auto gap-2">
          {topCast.map((actor) => (
            <div key={actor.id} className="textAlign-center"style={{minWidth: "120px", maxWidth: "120px",}}>
              <img className="rounded-pill " src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                alt={actor.name} style={{ width: "100px", height: "100px", objectFit: "center" }} />
              <p className="mt-2 mb-1 text-truncate">{actor.name}</p>
              <p className="text-muted small text-truncate">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
      <hr />
      {/* Crew Section */}
      <div className="container">
        <h4 className="text-dark mb-3 fw-bold">Crew:</h4>
        <div className="d-flex  justify-content-start overflow-auto gap-2">{uniqueCrew.slice(0, 8).map((crewMember) => (
          <div key={crewMember.id} className="text-center textAlign-center"style={{minWidth: "120px", maxWidth: "120px"}}>
            <img className="rounded-pill" src={`https://image.tmdb.org/t/p/w200/${crewMember.profile_path}`} alt={crewMember.name} style={{ width: "100px", height: "100px", objectFit: "center", }} />
            <p className="my-2 text-truncate">{crewMember.name}</p>
            <p className="text-muted small text-truncate">{crewMember.jobs.map((job, index) => (<span key={index}>{job}{(index % 2 !== 1 && index !== crewMember.jobs.length - 1) ? ", " : ""}{index % 2 === 1 && <br />}</span>))}</p>
          </div>))}
        </div>
      </div>
      {/*Modal */}
      <TrailerModal show={showModal} onClose={handleCloseModal} movieId={id}/>
      <BookingModal show={showBookingModal} onClose={handleCloseBookingModal} movieId={id} />
      <Rating show={showRatingModal} onClose={handleCloseRating} movieId={id} />
    </div>
  );
}

export default MovieDetails;
