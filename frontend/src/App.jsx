import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/form/Login";
import Register from "./components/form/Register";
import Forgot from './components/forgot/Forgot';
import Profile from "./components/profile/Profile";
import PersonalDetails from "./components/details/Account";
import BookingHistory from "./components/bookingHistory/BookingHistory";
//import Favorites from "./components/profile/Favorites";
import ChangePassword from './components/changePassword/ChangePassword';
import HelpSupport from "./components/support/HelpSupport";
import Home from "./components/pages/Home";
import Movies from "./components/movie/Movie";
import Stream from "./components/Stream/Stream";
import MovieDetails from "./components/movieDetails/MovieDetails";
import MovieShow from "./components/movieShow/MovieShow";
import SeatBooking from "./components/seat/Seats";
import BookingSummary from "./components/bookingSummary/BookingSummary";
import Payment from"./components/payment/Payment";
import OrderSummary from "./components/order/OrderSummary";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/stream" element={<Stream />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/MovieShow" element={<MovieShow />} />
        <Route path="/seats" element={<SeatBooking />} />
        <Route path="/bookingSummary" element={<BookingSummary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/profile/*" element={<Profile />}>
          <Route index element={<PersonalDetails />} />
          <Route path="details" element={<PersonalDetails />} />
          <Route path="changepass" element={<ChangePassword />} />
          <Route path="support" element={<HelpSupport />} /> 
          <Route path="history" element={<BookingHistory />} />        
        </Route>
      </Routes>
    </>
  );
}

export default App;
