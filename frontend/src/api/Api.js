import axios from 'axios';

function getMoviesByGenre(genreId) {
  return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=41c953dc7d1c21d27df7b693e9740a3c&with_genres=${genreId}&language=en-IN&with_original_language=hi|te|ta|bn|mr|gu|pa|ml|kn`);
}

export default getMoviesByGenre;
