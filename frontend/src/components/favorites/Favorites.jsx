import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

function Favorites() {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]); // Changed to array
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN&language=en-IN`);
        setGenres(response.data.genres || []);
      } catch (error) {
        setError("Failed to fetch genres");
      }
    };
    const fetchMovies = async (page = 1) => {
      try {
        let genreQuery = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(",")}` : "";
        const indianMoviesResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=41c953dc7d1c21d27df7b693e9740a3c&language=en-IN&region=IN&with_original_language=hi|te|ta|bn|mr|gu|pa|ml|kn&page=${page}${genreQuery}`);
        const englishMoviesResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=41c953dc7d1c21d27df7b693e9740a3c&language=en-IN&region=IN&with_original_language=en&page=${page}${genreQuery}`);
        const mergedMovies = [...(indianMoviesResponse.data.results || []), ...(englishMoviesResponse.data.results || [])];
        setMovies(mergedMovies);
        setTotalPages(indianMoviesResponse.data.total_pages || englishMoviesResponse.data.total_pages || 1);
      } catch (error) {
        setError("Failed to fetch movies");
      }
    };
    fetchGenres();
    fetchMovies(currentPage);
  }, [currentPage, selectedGenres]); // Trigger on genre change and page change
  const handleGenreClick = (genreId) => {
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genreId)) {
        return prevGenres.filter((id) => id !== genreId); // Remove if already selected
      } else {
        return [...prevGenres, genreId]; // Add if not selected
      }
    });
    setCurrentPage(1); // Reset to first page when genres change
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="container my-4">
      <h5 className="text-muted">Favorites Genre Filter:</h5>
      <div className="genres d-inline-block">
        <button className={`btn btn-sm m-2 ${selectedGenres.length === 0 ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setSelectedGenres([])}>All Movies</button>
        {genres.map((genre) => (
          <button key={genre.id} className={`btn btn-sm m-2 ${selectedGenres.includes(genre.id) ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleGenreClick(genre.id)} > {genre.name}
          </button>
        ))}
      </div>
      <div className="movies mt-4">
        <h5 className="text-muted">{selectedGenres.length > 0 
          ? `Movies Based on selected Genres: "${selectedGenres.map((id) => genres.find((g) => g.id === id)?.name).join(", ")}"`
          : "Favorites Movies :"}
        </h5>
        {error && <p className="text-danger">{error}</p>}
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
          {movies.length > 0 ? ( movies.map((movie) => (
            <Link to={`/movies/${movie.id}`} key={movie.id} className="col d-flex justify-content-center text-decoration-none">
              <div className="movie card bg-dark text-center text-light " style={{ width: '250px', height: '250px' }}>
                <img className="card-img-top" style={{ width: '100%', height: '200px', objectFit: 'center' }}
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'} alt={movie.title || 'No title available'} />
                <p className="card-title text-truncate mt-2">{movie.title}</p>
              </div>
            </Link>
          ))) : (<small className="text-muted">No movies to display. Try again later.</small>)}
        </div>
      </div>
      <div className="pagination mt-4 text-center">
        <button className="btn btn-outline-secondary" onClick={() => { handlePageChange(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={currentPage <= 1}> Previous </button>
        <span className="mx-2 my-2" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Page {currentPage}</span>
        <button className="btn btn-outline-secondary" onClick={() => { handlePageChange(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={currentPage >= totalPages}> Next</button>
      </div>
      <style>
        {`.movie { transition: transform 0.3s ease, box-shadow 0.3s ease;overflow: hidden;}
          .movie:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);}`
        }
      </style>
    </div>
  );
}

export default Favorites;
