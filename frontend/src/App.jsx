import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/form/Login";
import Register from "./components/form/Register";
import ForgotPassword from "./components/forgot/Forgot";
import Newpassword from "./components/verify/Newpassword";
import Profile from "./components/profile/Profile";
import PersonalDetails from "./components/details/Account";
import BookingHistory from "./components/bookingHistory/BookingHistory";
import Favorites from "./components//favorites/Favorites";
import ChangePassword from './components/changePassword/ChangePassword';
import HelpSupport from "./components/support/HelpSupport";
import Card from "./components/card/Card";
import Home from "./components/pages/Home";
import LocationMovies from "./components/locationMovies/LocationMovies";
import RecomendedMovies from './components/recomended movies/RecomendedMovies';
import Movies from "./components/movie/Movie";
import Theaters from "./components/theaters/Theaters";
import MovieDetails from "./components/movieDetails/MovieDetails";
import Stream from "./components/Stream/Stream";
import Events from "./components/events/Events";
import EventDetails from "./components/eventDetails/EventDetails";
import Plays from "./components/plays/Plays";
import KdramaDetails from "./components/playsDetails/PlaysDetails";
import Sports from "./components/sports/Sports";
import SportsDetails from './components/sportsDetails/SportsDetails';
import MovieShow from "./components/movieShow/MovieShow";
import SeatBooking from "./components/seat/Seats";
import BookingSummary from "./components/bookingSummary/BookingSummary";
import Payment from"./components/payment/Payment";
import OrderSummary from "./components/order/OrderSummary";
import Devlop from './components/devlop/Devlop';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword/>} />
        <Route path="/location" element={<LocationMovies/>} />
        <Route path="/Newpassword" element={<Newpassword/>} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie" element={<Theaters />} />
        <Route path="/movies/genre/:genreId" element={<RecomendedMovies/>} />
        <Route path="/stream" element={<Stream />} />
        <Route path="/plays" element={<Plays/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/events/:id" element={<EventDetails />} /> 
        <Route path="/sports" element={<Sports />} />
        <Route path="/sports/:id" element={<SportsDetails/>} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/kdrama/:id" element={<KdramaDetails />} />
        <Route path="/MovieShow" element={<MovieShow />} />
        <Route path="/seats" element={<SeatBooking />} />
        <Route path="/bookingSummary" element={<BookingSummary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/profile/*" element={<Profile />}>
          <Route index element={<PersonalDetails />} />
          <Route path="details" element={<PersonalDetails />} />
          <Route path="favorites" element={<Favorites/>} />
          <Route path="changepass" element={<ChangePassword />} />n
          <Route path="support" element={<HelpSupport />} /> 
          <Route path="settings" element={<Card/>} /> 
          <Route path="history" element={<BookingHistory />} />        
        </Route>
        <Route path={"*"} element={<Devlop/>}/>
      </Routes>
    </>
  );
}

export default App;
