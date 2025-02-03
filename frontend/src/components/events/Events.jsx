import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]); // Renamed shows to events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = "41c953dc7d1c21d27df7b693e9740a3c"; // API Key
  const fetchAllEvents = async () => {
    const allEvents = [];
    try {// Loop through pages 1 to 5 and fetch data
      for (let page = 1; page <= 5; page++) {
        const apiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-IN&sort_by=first_air_date.desc&first_air_date.gte=2025-01-01&first_air_date.lte=2025-12-31&page=${page}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        allEvents.push(...data.results); // Combine all results
      }
      setEvents(allEvents); // Store all events in the state    
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllEvents();
  }, []); // Fetch all events when the component mounts

  if (loading) return <p className="text-center">Loading Events...</p>; // Loading message
  if (error) return <p className="text-center text-danger">Error: {error}</p>; // Error message
  if (events.length === 0) return <p className="text-center">No events found for releases.</p>; // No events found message
  return (
    <div className="container  my-5">
      <h4 className="mb-3">TV Shows/Events :</h4>
      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
        {events.map((event) => { if (!event.poster_path) return null;
          return (
            <Link to ={`/events/${event.id}`}  key={event.id}  className="col d-flex justify-content-center text-decoration-none">
              <div className="movie card bg-dark text-white text-center"style={{width:'250px', height:'250px'}}>
                <img className="card-img-top" src={`https://image.tmdb.org/t/p/w200${event.poster_path}`} alt={event.name}style={{ height: '200px', objectFit: 'center' }}/>
                <p className="card-title text-truncate my-2">{event.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <style>
        {`.movie { transition: transform 0.3s ease, box-shadow 0.3s ease;overflow: hidden;}
          .movie:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);}`
        }
      </style>
    </div>
  );
};

export default Events;
