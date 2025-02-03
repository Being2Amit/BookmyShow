import {Link} from 'react-router-dom';
function Foot() {
  return (
    <footer className="w-full bg-dark text-light py-3">
      <div className="container ">
        <div className="row">
          {/* About Section */}
          <div className="w-lg-40 col-md-4">
            <h5>About Bookanytickets</h5>
            <p className="text-secondary">
              Bookanytickets is a leading entertainment ticketing platform that provides access to  socials, events, and experiences. Enjoy the best of entertainment with easy booking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-20 col-md-4 text-start">
            <h5>Quick Links</h5>
            <ul className="d-flex flex-wrap gap-x-9  list-unstyled">
              <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/movie" className="text-secondary text-decoration-none">Movies</Link></li>
              <li><Link to="/stream" className="text-secondary text-decoration-none">Stream</Link></li>
              <li><Link to="/events" className="text-secondary text-decoration-none">Events</Link></li>
              <li><Link to="/plays" className="text-secondary  text-decoration-none">Plays </Link></li>
              <li><Link to="/sports" className="text-secondary px-2 text-decoration-none"> Sports </Link></li>
              <li><Link to="/offers" className="text-secondary text-decoration-none"> Offers </Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none">Contact Us</Link></li>
            </ul>
          </div>

          {/*Media */}
          <div className="w-10 col-md-4">
            <h5>Follow Us</h5>
            <div className="d-flex">
              <Link to="https://facebook.com" className=" social text-secondary text-decoration-none me-3"><i className=" social bi bi-facebook"></i></Link>
              <Link to="https://twitter.com" className=" social text-secondary text-decoration-none me-3"><i className=" social bi bi-twitter"></i></Link>
              <Link to="https://instagram.com" className=" social text-secondary text-decoration-none me-3"><i className=" social bi bi-instagram"></i></Link>
              <Link to="https://youtube.com" className=" social text-secondary text-decoration-none"><i className=" social bi bi-youtube"></i></Link>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center position-relative">
          <hr className="w-50 bg-secondary" />
          <div className="position-absolute start-50 translate-middle-x bg-dark px-3 " style={{ zIndex: "1" }}>
            <span className=" text-decoration-none fw-bold text-light"onClick={()=> {
              window.scrollTo({ top: 0, behavior: 'smooth'});
            }}><img src='/BookanyTicket.png' alt='BookanyTickets' width={150}/></span>
          </div>
          <hr className="w-50 bg-secondary" style={{ zIndex: "0" }} />
        </div>

        {/* Copyright */}
        <div className="text-center mt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} BookanyTickets.in. All Rights Reserved.</p>
        </div>
      </div>
      <style>
        {`.social { transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, background-color 0.3s ease;
            display: inline-flex; align-items: center; justify-content: center; padding: 3px; border-radius: 50%;}
          .social:hover { transform: scale(1.2); background-color: red; color: white;box-shadow: 2px 4px 10px rgba(53, 255, 80, 0.3);}
        `}
      </style>
    </footer>
  );
};

export default Foot;
