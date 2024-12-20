import { useState, useEffect } from "react";
import getMovies from "../../api/Api";
import MovieCard from "../moviecard/MovieCard";

function RecomendedMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovies()
      .then((res) => {
        setMovies(res.data.results);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err.message || err);
        setError("Could not fetch recommended movies.");
      });
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-muted fs-3 mb-3">Recommend Movies</h1>
      {error ? (
        <p className="text-danger mt-4">{error}</p>
      ) : (
        <div className="row g-2 justify-content-center">
          {movies.length ? (
            movies.map((movie, i) => (
              <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div className="movie-card">
                  <MovieCard movie={movie} />
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
      <style>
      {`.movie-card {transition: transform 0.3s ease, box-shadow 0.3s ease; border-radius: 8px; overflow: hidden;}
          .movie-card:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);}
        `}
      </style>
    </div>
  );
}

export default RecomendedMovies;
