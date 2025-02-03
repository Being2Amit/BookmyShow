import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const KdramaDetails = () => {
  const { id } = useParams(); // Get the K-drama ID from the URL
  const [kdrama, setKdrama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(null);
  const [votes, setVotes] = useState(null);
  const [topCast, setTopCast] = useState([]);  // Initialize as an empty array
  const [uniqueCrew, setUniqueCrew] = useState([]);  // Initialize as an empty array
  const apiKey = '41c953dc7d1c21d27df7b693e9740a3c'; // Replace with your TMDb API key

  useEffect(() => {
    const fetchKdramaDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-IN`);
        setKdrama(response.data);

        // Get cast details
        const castResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}`);
        setTopCast(castResponse.data.cast || []);  // Fallback to empty array if undefined
        setUniqueCrew(castResponse.data.crew || []); // Fallback to empty array if undefined
        
        // Set the rating and votes
        setRating(response.data.vote_average.toFixed(1));
        setVotes(response.data.vote_count);
      } catch (err) {
        setError('Failed to fetch K-drama details');
      } finally {
        setLoading(false);
      }
    };

    fetchKdramaDetails();
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div>{error}</div>;
  if (!kdrama) return <div>No details found.</div>;

  // Set background image style
  const backDropUrl = `https://image.tmdb.org/t/p/original${kdrama.poster_path}`;
  const backgroundStyle = {
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${backDropUrl})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: 'white',
    minHeight: '400px',
  };


  return (
    <div className="movie" style={{ minHeight: '100vh' }}>
      <section className="mb-4" style={{ height: 'auto' }}>
        <div className="py-4 mx-auto d-flex align-items-center flex-column flex-lg-row" style={backgroundStyle}>
          <div className="container d-flex align-items-center flex-column flex-lg-row">
            {/* Image div */}
            <div className="position-relative me-3 mb-3 mb-lg-0" style={{ width: '261px', height: '392px' }}>
              <div className="card text-center bg-dark" style={{ padding: '0.1px', backgroundColor: '#171717', width: '261px', height: '392px' }}>
                <img className="card-img-top"  src={kdrama.poster_path ? `https://image.tmdb.org/t/p/w500/${kdrama.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"} alt={`${kdrama.title} poster`} style={{ width: '100%', height: '360px', objectFit: "center" }} />
                <p className="text-light"> {new Date(kdrama.first_air_date) < new Date()
                  ? `Released on ${new Date(kdrama.first_air_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
                  : `Upcoming K-drama on ${new Date(kdrama.first_air_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                </p>
              </div>
            </div>
            {/* details div */}
            <div className="text-white text-center text-lg-start" style={{ maxWidth: '500px' }}>
              <h1 className="text-warning mb-3">{kdrama.name}</h1>
              <div className="btn btn-dark mb-2"> <i className="text-danger px-1 bi bi-star-fill"></i>
                <span className="px-1">{rating && votes ? `${rating}/10` : 'Not Rated'}</span>
                <span className="px-1">{votes ? `(${votes} votes)` : ''}</span>
              </div>
              <p><strong >Genres:</strong> {kdrama.genres?.map((genre) => genre.name).join('/') || 'N/A'}</p> 
              <p><strong >Number of Seasons:</strong> {kdrama.number_of_seasons || 'N/A'}</p>
              <p><strong >Number of Episodes:</strong> {kdrama.number_of_episodes || 'N/A'}</p>
              <p><strong>Status:</strong> {kdrama.status || 'N/A'}</p>              
            </div>
          </div>
        </div>
      </section>
      <hr />
      {/* Overview */}
      <div className="container">
        <h4 className="text-dark mb-3">About the K-drama:</h4>
        <p className="text-muted"> {kdrama.overview || 'No overview available.'}</p>
      </div>
      <hr />
      {/* Cast Section */}
      <div className="container">
        <h4 className="text-dark mb-3 fs-bold">Cast:</h4>
        <div className="d-flex justify-content-start overflow-auto gap-2">
          {topCast.length > 0 ? (
            topCast.map((actor) => (
              <div key={actor.id} className="textAlign-center" style={{ minWidth: "120px", maxWidth: "120px" }}>
                <img className="rounded-pill" src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={actor.name} style={{ width: "100px", height: "100px", objectFit: "center" }} />
                <p className="mt-2 mb-1 text-truncate">{actor.name}</p>
                <p className="text-muted small text-truncate">{actor.character}</p>
              </div>
            ))
          ) : (
            <p>No cast data available</p>
          )}
        </div>
      </div>
      <hr />
      {/* Crew Section */}
      <div className="container">
        <h4 className="text-dark mb-3 fw-bold">Crew:</h4>
        <div className="d-flex justify-content-start overflow-auto gap-2">
          {uniqueCrew.length > 0 ? (
            uniqueCrew.slice(0, 8).map((crewMember) => (
              <div key={crewMember.id} className="text-center textAlign-center" style={{ minWidth: "120px", maxWidth: "120px" }}>
                <img className="rounded-pill" src={crewMember.profile_path ? `https://image.tmdb.org/t/p/w200/${crewMember.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={crewMember.name} style={{ width: "100px", height: "100px", objectFit: "center" }}
                />
                <p className="my-2 text-truncate">{crewMember.name}</p>
              </div>
            ))) : (<p>No crew data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KdramaDetails;
