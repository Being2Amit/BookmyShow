import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Theaters() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPopularInTheaters = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=20e9eb61289b500057554b5df063f221`
        );
        const data = await response.json();
        setMovies(data.results || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching popular movies in theaters:", error);
        setLoading(false);
      }
    };

    fetchPopularInTheaters();
  }, []);

  return (
    <div className="container mt-5">
      <h4 className="mb-3">Popular Movies:</h4>
      {loading ? (<p>Loading...</p>) : (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
          {movies.length > 0 ? (movies.map((movie) => (
           <Link to={`/movies/${movie.id}`}  key={movie.id} className="col d-flex justify-content-center text-decoration-none">
              
                <div className="movie card bg-dark text-light" style={{ width: "100%", height: '250px' }}>
                  <img className="card-img-top img-fluid " style={{ width: "100%", height: '200px' }} alt="poster"
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}/>
                  <p className="card-title text-center text-truncate my-2">{movie.title}</p>
                </div>
              </Link>
          ))) : (<p>No popular movies in theaters right now.</p>)}
        </div>
      )}
      <style>
        {`.movie { transition: transform 0.3s ease, box-shadow 0.3s ease;overflow: hidden;}
          .movie:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);}`
        }
      </style>
    </div>
  );
}
export default Theaters;
