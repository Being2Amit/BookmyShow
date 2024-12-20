function Foot () {
  return (
    <footer className="bg-dark text-light py-3">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="w-40 col-md-4">
            <h5>About BookMyShow</h5>
            <p className="text-secondary">
              BookMyShow is a leading entertainment ticketing platform that provides access to movies, events, and experiences. Enjoy the best of entertainment with easy booking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-20 col-md-4">
            <h5>Quick Links</h5>
            <ul className="d-flex flex-wrap gap-x-9 list-unstyled">
              <li><a href="/" className="text-secondary text-decoration-none">Home</a></li>
              <li><a href="/movies" className="text-secondary text-decoration-none">Movies</a></li>
              <li><a href="/events" className="text-secondary text-decoration-none">Events</a></li>
              <li><a href="/sports" className="text-secondary text-decoration-none">Sports</a></li>
              <li><a href="/offers" className="text-secondary text-decoration-none">Offers</a></li>
              <li><a href="/contact" className="text-secondary text-decoration-none">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="w-10 col-md-4">
            <h5>Follow Us</h5>
            <div className="d-flex">
              <a href="https://facebook.com" className="text-secondary me-3"><i className="bi bi-facebook"></i></a>
              <a href="https://twitter.com" className="text-secondary me-3"><i className="bi bi-twitter"></i></a>
              <a href="https://instagram.com" className="text-secondary me-3"><i className="bi bi-instagram"></i></a>
              <a href="https://youtube.com" className="text-secondary"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>

        <hr className="bg-secondary" />

        {/* Copyright */}
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} BookMyShow. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Foot;
