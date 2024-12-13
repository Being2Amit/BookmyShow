/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <Link className='text-decoration-none text-center' to={`/movies/${movie.id}`} >
      <div className="card" style={{ width: '290px', height: '320px' }} >
        <img className="card-img-top" style={{ width: '100%', height: '260px' }} src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="poster" />
        <div className='card-body bg-dark'>
          <h6 className="card-title text-light"style={{ marginTop: "0", paddingTop: "0", height: '10px' }}>{movie.title}</h6>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard