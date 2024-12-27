import { useState, useEffect } from "react";
import getMovies from "../../api/Api";
import MovieCard from "../moviecard/MovieCard";
import "./RecomendedMovies.css"; // Include custom CSS for hover effect

function RecomendedMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovies()
      .then((res) => {
        setMovies(res.data.results);
      })
      .catch((err) => {
        console.log("Error fetching movies:", err.message || err);
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
              <div
                key={i}
                className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
              >
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
    </div>
  );
}

export default RecomendedMovies;
