import { useState, useEffect } from "react";
import getMovies from "../../api/Api";
import MovieCard from "../moviecard/MovieCard";

function RecomendedMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    getMovies()
      .then(res => {
         // setMovies(res.data[0].films)
        // console.log(res.data.results);
        setMovies(res.data.results);
      })
      .catch(err => {
        console.error("Error fetching movies:", err.message || err);
        setError("Could not fetch recommended movies.");
      })
  }, []);

  return (
    <div className="movie me-5 m-5 " >
      <h1 className="text-text-highlight text-2xl font-mono" >Recommend Movies</h1>
      {error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div className="d-flex flex-wrap gap-2 px-3 ">
          {/* {movies.map((movie, i) => (<MovieCard key={i} movie={movie} />))} */}
          {movies.length ? (
            movies.map((movie, i) => <MovieCard key={i} movie={movie} />)
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default RecomendedMovies