import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import actionCreater from '../redux/action';
import store from '../redux/store';
import getallmovies from './tmdbmovies'
import { useSelector } from 'react-redux';

function Movies() {
  const [moviesmovie, setmoviesmovie] = useState([]);
  const [genres, setGenres] = useState([]);
  const locationmovie = useSelector((store) => { return store.location });
  const languageFilters = {
    te: moviesmovie.filter((ele) => ele.original_language === "te"),
    ta: moviesmovie.filter((ele) => ele.original_language === "ta"),
    hi: moviesmovie.filter((ele) => ele.original_language === "hi"),
    kn: moviesmovie.filter((ele) => ele.original_language === "kn"),
    ml: moviesmovie.filter((ele) => ele.original_language === "ml"),
    mr: moviesmovie.filter((ele) => ele.original_language === "mr"),
    bn: moviesmovie.filter((ele) => ele.original_language === "bn"),
    pa: moviesmovie.filter((ele) => ele.original_language === "pa"),
    gu: moviesmovie.filter((ele) => ele.original_language === "gu"),
    en: moviesmovie.filter((ele) => ele.original_language === "en"),
  };
  
  // Location-based recommendations
  const locationRecommendations = {
    otherCities: ['te', 'hi', 'en'],
    Hyderabad: ['te', 'hi', 'en'],
    Mumbai: ['mr', 'hi', 'en'],
    'Delhi-NCR': ['hi', 'en'],
    Bangalore: ['kn', 'hi', 'en'],
    Ahmedabad: ['gu', 'hi', 'en'],
    Chandigarh: ['pa', 'hi'],
    Chennai: ['ta', 'en'],
    Pune: ['hi', 'mr', 'en'],
    Kolkata: ['bn', 'hi', 'en'],
    Kochi: ['ml', 'en'],
  };
  useEffect(() => {
    getallmovies().then((res) => {
      if (res) { 
        setmoviesmovie(res);
       }
    })
  }, [])
  const movietitles = moviesmovie.map((ele) => {
    return ({ title: ele.title, id: ele.id })
  })
  const actionobj = actionCreater(movietitles)
  store.dispatch(actionobj)

  //gets moviesinfo based on the location
  function getMovieInfo(location) {
    const languages = locationRecommendations[location] || [ 'hi', 'ta', 'te','en'];
    // Combine movies for the selected languages
    const recommendedMovies = languages.flatMap((lang) => languageFilters[lang] || []);
    return recommendedMovies;
  }
  
  const getmovies = getMovieInfo(locationmovie);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=ea82902854df64de97bf78fcce420594&language=en-IN`);
        const movie = await response.json();
        setGenres(movie.genres); // Store genres in state
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);
  const getGenreNames = (genreIds) => {
    const genreNames = genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter((name) => name); // Remove undefined values
    return genreNames.length > 0 ? genreNames.join('/') : "Drama";
  };

  return (
    <div className="container mt-5">
      <h5 className='mb-3 text-muted'>Recommended Movies :</h5>
      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
        {getmovies.slice(0, 20).map((movie) => (
          <Link to={`/movies/${movie.id}`} key={movie.id} className="col d-flex flex-wrap text-dark justify-content-start text-start text-decoration-none">
            <div className="movie card bg-dark text-light" style={{ width: '255px', height: '250px', }}>
              <img className="card-img-top" style={{ width: '100%', height: '220px', objectFit: "center" }} alt="poster"
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'} />
              <p className="mb-1 px-3 small">
                <i className="bi bi-star-fill star-icon text-danger"></i> &nbsp;&nbsp;&nbsp;
                {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : "Not Rated"}&nbsp;&nbsp;&nbsp;{movie.vote_count ? `${movie.vote_count}K Votes` : ""}
              </p>
            </div>
            <div className='px-2 text-truncate'>
              <h6 className=" my-1 fw-bold " style={{ fontSize: '15px' }}>{movie.title}</h6>
              <h6 className="text-muted">{getGenreNames(movie.genre_ids)}</h6>
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
  )
}

export default Movies



//api key = ea82902854df64de97bf78fcce420594
