import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Stream() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [error, setError] = useState(null);
  const placeholderImage = 'https://via.placeholder.com/200x300?text=No+Image';
  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN`);
        if (!response.ok) throw new Error('Failed to fetch now-playing movies');
        const data = await response.json();
        setNowPlayingMovies(data.results || []);
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchUpcomingMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN`);
        if (!response.ok) throw new Error('Failed to fetch upcoming movies');
        const data = await response.json();
        setUpcomingMovies(data.results || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchNowPlayingMovies();
    fetchUpcomingMovies();
  }, []);
  return (
    <div className="container my-5">
      {/* Now Playing Movies Section */}
      <h3 className="fs-4 my-3 text-start">Now Playing Movies :</h3>
      {error && <p className="text-danger ">{error}</p>}
      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
        {nowPlayingMovies.map((movie) => (
          <Link to={`/movies/${movie.id}`} key={movie.id} className="col d-flex justify-content-center text-decoration-none">
            <div className="movie card bg-dark text-center text-light " style={{ width: '250px', height: '250px' }}>
              <img className="card-img-top" style={{ width: '100%', height: '200px', objectFit: 'center' }}
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImage} alt={movie.title || 'No title available'} />
              <p className="card-title text-truncate mt-2">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Movies Section */}
      <h3 className="fs-4 my-3 text-start">Upcoming Movies :</h3>
      <div className="row justify-content-center row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {upcomingMovies.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`} className="col d-flex justify-content-center text-decoration-none">
            <div className="card bg-dark text-light text-center" style={{ width: '250px', height: '250px' }}>
              <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImage}
                alt={movie.title || 'No title available'} className="card-img-top" style={{width: '100%', height: '200px', objectFit: 'center' }} />
              <p className="card-title text-truncate mt-2">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Stream;
