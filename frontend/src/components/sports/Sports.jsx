import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Sports() {
  const [sportsContent, setSportsContent] = useState([]);
  const [error, setError] = useState(null);
  const placeholderImage = 'https://via.placeholder.com/200x300?text=No+Image';
  const apiKey = '41c953dc7d1c21d27df7b693e9740a3c';

  useEffect(() => {
    const fetchWweContent = async () => {
      try { const response = await fetch( `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=wwe%202024&primary_release_date.gte=2025-01-01&primary_release_date.lte=2025-12-31&region=IN` );
        if (!response.ok) throw new Error('Failed to fetch WWE events');
        const data = await response.json();
        setSportsContent(data.results || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchWweContent();
  }, []);

  return (
    <div className="container my-5">
      <h5 className=" fs-3 mb-3">Latest Sports Event:</h5>
      {error && <p className="text-danger">{error}</p>}
      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
        {sportsContent.map((item) => (
          <Link to={`/sports/${item.id}`} key={item.id} className="col d-flex justify-content-center text-decoration-none">
            <div className="movie card bg-dark text-center text-light" style={{ width: '250px', height: '250px' }}>
              <img className="card-img-top"alt={item.title || 'No title available'} style={{ width: '100%', height: '200px', objectFit: 'center' }}
              src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : placeholderImage}/>
              <p className="card-title text-truncate mt-2">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <style>
        {`.movie { transition: transform 0.3s ease, box-shadow 0.3s ease;overflow: hidden;}
          .movie:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);}`}
      </style>
    </div>
  );
}

export default Sports;
