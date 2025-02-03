import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Plays = () => {
  const [kdramas, setKdramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = '41c953dc7d1c21d27df7b693e9740a3c'; // Replace with your TMDb API key
  useEffect(() => {
    const fetchPlays = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-IN&with_original_language=ko&sort_by=vote_count.desc`);
        setKdramas(response.data.results);
      } catch (err) { setError('Failed to fetch data');
      } finally { setLoading(false);}
    };fetchPlays();
  }, [apiKey]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="container my-5">
      <h5 className="text-muted">Plays/Dramas:</h5>
      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
        {kdramas.map((kdrama) => (
          <Link to={`/kdrama/${kdrama.id}`} key={kdrama.id} className="col d-flex justify-content-center text-decoration-none">
            <div className="movie card bg-dark text-center text-light " style={{ width: '250px', height: '250px' }}>
              <img className="card-img-top" style={{ width: '100%', height: '200px', objectFit: 'center' }}
                src={kdrama.poster_path ? `https://image.tmdb.org/t/p/w500${kdrama.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'} alt={kdrama.title || 'No title available'} />
              <p className="card-title text-truncate mt-2">{kdrama.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <style>
        {`.movie { transition: transform 0.3s ease, box-shadow 0.3s ease;overflow: hidden;}
          .movie:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);}`
        }
      </style>
    </div>
  );
};

export default Plays;
