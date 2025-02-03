/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const placeholderImage = 'https://via.placeholder.com/200x300?text=No+Image';
  return (<>
    <Link className='movie-card card bg-dark text-decoration-none text-center' to={`/movies/${movie.id}`} style={{ width: '250px', height: '250px' }} >
        <img className="card-img-top img-fluid" style={{ width: '100%', height: '210px' }} src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : placeholderImage} alt="poster" />
        <h6 className="card-title text-light text-truncate text-center my-2">{movie.title}</h6>
    </Link>
    <style>
    {`.movie-card { transition: transform 0.3s ease, box-shadow 0.3s ease;overflow: hidden;}
      .movie-card:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);}`
    }
  </style>
  </>
  )
}

export default MovieCard