import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer,toast  } from 'react-toastify';
import Carousel from '../carousel/Carousel';
import RecomendedMovies from '../recomended movies/RecomendedMovies';
import Footer from '../footer/Footer';

function Home() {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.loggedOut) {toast.success("Profile successfully logged out");}
  }, [location]);
  return (
    <div>
      <Carousel />
      <RecomendedMovies />
      <Footer />
      <ToastContainer/>
    </div>
  );
}

export default Home;
