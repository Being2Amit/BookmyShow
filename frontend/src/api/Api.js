import axios from 'axios';

function getMovies(){
    return axios.get('https://api.themoviedb.org/3/movie/popular?api_key=20e9eb61289b500057554b5df063f221');
};
    
    

export default getMovies;