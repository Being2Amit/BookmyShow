import axios from "axios";

const apiKey = 'ea82902854df64de97bf78fcce420594';
const baseUrl = 'https://api.themoviedb.org/3/movie/now_playing';

const getAllMovies = async () => {
  let allMovies = [];
  let movieIds = new Set(); // To keep track of unique movie IDs
  let page = 1;
  const totalPages = 5;

  while (page <= totalPages) {
    try {
      const response = await axios.get(baseUrl, {
        params: {
          api_key: apiKey,
          region: 'IN',
          language: 'en-US',
          page: page,
          append_to_response: 'credits,videos',
        },
      });

      const uniqueMovies = response.data.results.filter((movie) => {
        if (!movieIds.has(movie.id)) {
          movieIds.add(movie.id);
          return true;
        }
        return false;
      });

      allMovies = [...allMovies, ...uniqueMovies];
      page += 1;
    } catch (error) {
      console.error('Error fetching movies:', error);
      break;
    }
  }

  return allMovies;
};

export default getAllMovies;
