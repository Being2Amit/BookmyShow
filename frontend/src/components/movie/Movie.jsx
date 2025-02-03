import { useLocation, Link } from 'react-router-dom'; // Ensure Link is imported
import { useEffect, useState } from 'react';

function Movies() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Access the URL
  const query = new URLSearchParams(location.search).get('query'); // Extract the query param

  useEffect(() => {
    if (query) {
      setLoading(true);
      const fetchMovies = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=41c953dc7d1c21d27df7b693e9740a3c&query=${query}`);
          const data = await response.json();
          setSearchResults(data.results); // Store search results
          setLoading(false);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setLoading(false);
        }
      };
      fetchMovies();
    } else { setSearchResults([]); }
  }, [query]); // Re-fetch if query changes

  return (
    <div className="container mt-5">
      <h2>Search Results for : "{query}"</h2>
      {loading ? (<p>Loading...</p>) : (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
          {searchResults.length > 0 ? (searchResults.map((movie) => (
            <Link to={`/movies/${movie.id}`} className="col d-flex justify-content-center text-center text-decoration-none" key={movie.id}>
              <div className="movie card bg-dark text-center" style={{ width: '250px', height: '250px' }}>
                {/* Check if poster_path is available, if not use placeholder */}
                <img className="card-img-top" style={{ width: '100%', height: '210px' }} alt="poster"
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'} />
                <h6 className="text-light text-truncate mt-2">{movie.title}</h6>
              </div>
            </Link>
          ))) : (<p>No results found for "{query}".</p>)}
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

export default Movies;
