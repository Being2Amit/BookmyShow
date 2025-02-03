import Foot from "./Foot";
import React, { useEffect, useState } from "react";
import { RiCustomerService2Line } from "react-icons/ri";
import { ImTicket } from "react-icons/im";
import { SlEnvolopeLetter } from "react-icons/sl";
import { Link } from "react-router-dom";

function Footer() {
  const [nowShowing, setNowShowing] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const nowShowingResponse = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN`);
        const nowShowingData = await nowShowingResponse.json();
        setNowShowing(nowShowingData.results);
        const upcomingResponse = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN`);
        const upcomingData = await upcomingResponse.json();
        setUpcomingMovies(upcomingData.results);
        const genreresponse = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=41c953dc7d1c21d27df7b693e9740a3c&region=IN');
        const genresData = await genreresponse.json();
        setGenres(genresData.genres);
      } catch (err) { setError("Failed to fetch data from TMDB API"); error(err.message); }
    };
    fetchMovies();
  }, []);
  const MovieLinks = (movies) => movies.slice(0, 15).map((movie, index) => (
    <Link key={movie.id} to={`/movies/${movie.id}`} className="movies text-decoration-none text-secondary d-inline-block mb-2 pe-2 ms-2"
      style={{ fontSize: "13px", borderRight: index !== 14 ? "1px solid #7f7f7f" : "none", }}
    >{movie.title}</Link>
  ));
  return (
    <footer className="text-light"style={{ backgroundColor: '#333338' }}>
      {/* Services Section */}
      <div style={{ backgroundColor: "#404043" }}>
          <div className="mx-auto w-11/12 md:w-3/4">
            {/* Services */}
            <div className="flex flex-wrap justify-evenly gap-x-52 p-3">
              {/* customer care */}
              <Link to="#" className="flex flex-col items-center text-decoration-none text-light w-20">
                <RiCustomerService2Line style={{ fontSize: "40px", color: "lightgray" }} />
                <div className="text-center text-xs mt-3 whitespace-nowrap">24/7 CUSTOMER CARE</div>
              </Link>
              {/* resend ticket */}
              <Link to="#" className="flex flex-col items-center text-decoration-none text-light w-20">
                <ImTicket style={{ fontSize: "40px", color: "lightgray" }} />
                <div className="text-center text-xs mt-3 whitespace-nowrap"> RESEND BOOKING CONFIRMATION </div>
              </Link>
              {/* News Letter */}
              <Link to="#" className="flex flex-col items-center text-decoration-none text-light w-20">
                <SlEnvolopeLetter style={{ fontSize: "40px", color: "lightgray", fontWeight: "100" }}/>
                <div className="text-center text-xs mt-3 whitespace-nowrap"> SUBSCRIBE TO THE NEWSLETTER </div>
              </Link>
            </div>
          </div>
        </div>
      {/* Movie Sections */}
      <div className="container py-4" >
        <div className="row">
          {/* Now Showing Movies */}
          <div className="col-12 mb-3">
            <h6 className="text-uppercase text-light mb-3" style={{fontSize:'15px'}}> Movies Now Showing in Hyderabad</h6>
            <div className="">{MovieLinks(nowShowing || [])}</div>
          </div>
          {/* Upcoming Movies */}
          <div className="col-12 mb-3">
            <h6 className="text-uppercase text-light mb-3"style={{fontSize:'15px'}} > Upcoming Movies in Hyderabad</h6>
            <div>{MovieLinks(upcomingMovies || [])}</div>
          </div>
          {/* Movies by Genre */}
          <div className="col-12 mb-3">
            <h6 className="text-uppercase text-light mb-3"style={{fontSize:'15px'}}>Movies by Genre</h6>
            <div>{genres.map((genre,index) => (
              <Link key={genre.id} to={`/movies/genre/${genre.id}`} className="movies text-decoration-none text-secondary d-inline-block mb-2 pe-2 ms-2"
                style={{ fontSize: "13px",  borderRight: index !== genres.length - 1 ? "1px solid #7f7f7f" : "none" }}
              >{genre.name}</Link>
            ))}</div>
          </div>
        </div>
      </div>
      <style>
        {`.movies { transition: all 0.3s ease;}
          .movies:hover,.movies:focus { color: white;font-weight: bold; transform: scale(1.1); }`
        }
      </style>
      <Foot />
    </footer>
  );
}

export default Footer;
