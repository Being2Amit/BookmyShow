import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Stream() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [error, setError] = useState(null);

  // Fetch movies dynamically
  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN`
        );
        if (!response.ok) throw new Error('Failed to fetch now-playing movies');
        const data = await response.json();
        setNowPlayingMovies(data.results || []);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUpcomingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN`
        );
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
    <div className="container">
      {error && <p className="text-danger">{error}</p>}
      {/* Now Playing Movies Section */}
      <p className="my-4 fs-2">Now Playing Movies:</p>
      <div className="row">
        {nowPlayingMovies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-3 style={{ width: '270px', height: '210px' }} ">
            <div className="card text-center">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} style={{ width: '100%', height: '200px' }}
                className="card-img-top"
              />
              <div className="card-body bg-dark">
                <Link className='text-decoration-none text-center' to={`/movies/${movie.id}`} >
                  <p className="card-title text-light" style={{ margin: "0", padding: "0", height: '10px' }}>{movie.title}</p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Movies Section */}
      <p className="my-4 fs-2">Upcoming Movies:</p>
      <div className="row ">
        {upcomingMovies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-3 style={{ width: '270px', height: '210px' }} ">
            <div className="card text-center">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} style={{ width: '100%', height: '206px' }}
                className="card-img-top"
              />
              <div className="card-body bg-dark">
                <Link className='text-decoration-none text-center' to={`/movies/${movie.id}`} >
                  <p className="card-title text-light mb-1" style={{ margin: "0", padding: "0", height: '10px' }}>{movie.title}</p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stream;
