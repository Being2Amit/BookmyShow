import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getMoviesByGenre from "../../api/Api"; 
import MovieCard from "../moviecard/MovieCard";

function RecomendedMovies() {
  const { genreId } = useParams(); 
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState(""); 
  const [error, setError] = useState(null);
  useEffect(() => {
    const getGenreName = async (id) => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN`);
        const data = await response.json();
        const genre = data.genres.find(genre => genre.id === parseInt(id));
        if (genre) { setGenreName(genre.name);}
      } catch (error) {console.error("Error fetching genre name:", error);}
    };
    getMoviesByGenre(genreId)
      .then((response) => {
        if (response.data.results && response.data.results.length > 0) { setMovies(response.data.results); } 
        else { setError("No movies found for this genre.");}
      })
      .catch((err) => { console.error("Error fetching movies:", err.message);
        setError("Could not fetch movies for this genre.");
      });
    getGenreName(genreId); 
  }, [genreId]); 

  return (
    <div className="container my-5">
      <h1 className="text-muted fs-3 mb-3">Movies in {genreName} Genre:</h1>
      {error ? ( <p className="text-danger mt-4">{error}</p>) : (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
          {movies.length ? ( movies.map((movie, i) => (
            <div key={i} className="col d-flex justify-content-center">
              <MovieCard movie={movie} />
            </div>
          ))) : ( <p>Loading...</p> )}
        </div>
      )}
    </div>
  );
}

export default RecomendedMovies;
