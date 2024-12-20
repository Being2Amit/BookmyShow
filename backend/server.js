const express = require('express');  // Import Express.js library
const mysql = require('mysql');  // Import MySQL library
const cors = require('cors');  // Import CORS middleware for cross-origin requests
const jwt = require('jsonwebtoken');  // Import JWT (JSON Web Token) for authentication
const secretKey = 'a8cc1ff8f4bc3b7b4d7611509c97f4b6e5836962f24c2c014453838e6aaa348e'; // Secret key for JWT (make sure to keep it secure)
const bcrypt = require('bcrypt');  // Import bcrypt for hashing passwords
const app = express();  // Create an Express app
const port = 5000;  // Define the server port
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Use JSON parser middleware for handling POST request bodies

const generatePaymentId = () => {// Generate the payment ID without the "pay_" prefix
  return crypto.randomBytes(12).toString('base64').slice(0, 16);
};
// Create a MySQL database connection
const server = mysql.createConnection({
  host: 'localhost',  // MySQL server hostname (localhost for local testing)
  user: 'root',  // MySQL username
  password: '',  // MySQL password
  database: 'mydata'  // The name of the database you are using
});

// Attempt to connect to the MySQL server
server.connect(err => {
  if (err) {
    console.error('Error Connecting to database:', err);
  } // Log any connection errors
  console.log("Connection Successful");  // Log a success message
});
// Helper function to format 24-hour time to 12-hour format
const formatShowtime = (time) => {
  const [hour, minute] = time.split(':');
  const parsedHour = parseInt(hour, 10);
  const isAM = parsedHour < 12;
  const formattedHour = parsedHour % 12 === 0 ? 12 : parsedHour % 12;
  const formattedMinute = minute.length === 1 ? `0${minute}` : minute;
  const meridian = isAM ? 'AM' : 'PM';
  return `${formattedHour < 10 ? `0${formattedHour}` : formattedHour}:${formattedMinute} ${meridian}`;
};

// Middleware to check if JWT is valid
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  if (!token) return res.status(401)
    .json({ message: 'Access denied. No token provided.' });
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403)
      .json({ message: 'Invalid token.' });
    req.user = user; // Attach user info to the request
    next(); // Pass control to the next handler
  });
}

// POST endpoint to register a new user
app.post('/register', (req, res) => {
  const { fullname, mobile, email, password } = req.body;
  if (!fullname || !mobile || !email || !password) {// Check if all required fields are provided
    return res.status(400)
      .json({ message: 'Please fill all fields' });
  }
  const insertQuery = 'INSERT INTO users (fullname, mobile, email, password) VALUES (?, ?, ?, ?)';// Insert user into the database with plain-text password
  server.query(insertQuery, [fullname, mobile, email, password], (error, results) => {
    if (error) {
      console.log('Error inserting data:', error.message);
      return res.status(500)
        .json({ message: 'Failed to register user', error: error.message });
    }
    res.status(201)
      .json({ message: 'User registered successfully', userId: results.insertId });
  });
});

// POST endpoint for user login (check credentials)
app.post('/login', (req, res) => {
  const { mobile, password } = req.body;
  let query;
  // Determine if login is with email or mobile
  if (mobile.includes('@')) {
    query = `SELECT * FROM users WHERE email = ?`;  // Email login
  } else if (/^\d+$/.test(mobile)) {
    query = `SELECT * FROM users WHERE mobile = ?`;  // Mobile login
  } else {
    return res.status(400)
      .json({ success: false, message: 'Invalid mobile or email format' }); // Return a bad request error
  }
  // Query the database to find user
  server.query(query, [mobile], (error, result) => {  // Execute the query on the database with the mobile/email
    if (error) {  // If an error occurs during the query execution
      console.error('Database error:', error);  // Log the error in the server console
      return res.status(500)
        .json({ message: 'Database error' });  // Return a 500 internal server error response
    }
    if (result.length > 0) {// Check if user exists
      const user = result[0]; // Assign the first result (user) to a variable
      if (user.password === password) {// Compare password (using plain text, but ideally should use bcrypt for hashing)
        const token = jwt.sign({ id: user.id, fullname: user.fullname, email: user.email, mobile: user.mobile, password: user.password },
          secretKey, { expiresIn: '1h' });// Generate a JWT token with userId and a secret key, set to expire in 1 hour
        return res.status(200)
          .json({ success: true, message: 'Login successful', token, result });// Send a successful response with the token and username
      } else {
        return res.status(401)
          .json({ success: false, message: 'Invalid password' }); // Return a 401 Unauthorized error response
      }
    } else {
      return res.status(404)
        .json({ success: false, message: 'User not found' }); // Return a 404 Not Found error response
    }
  });
});

// GET endpoint to retrieve user profile information
app.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id; // Assuming JWT contains user ID
  server.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500)
        .json({ success: false, message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404)
        .json({ success: false, message: 'User not found' });
    }
    const user = results[0];
    res.status(200)
      .json({
        fullname: user.fullname, mobile: user.mobile, email: user.email, password: user.password, age:user.age, gender:user.gender,address:user.address ,// Avoid sending sensitive info
      });
  });
});

// PUT endpoint to update user profile (with token verification)
app.put('/profile', authenticateToken, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the headers
  if (!token) {
    return res.status(401)
      .json({ message: 'Token missing: Unauthorized' });
  }
  // Verify and decode the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403)
        .json({ message: 'Invalid token: Forbidden' });
    }
    const userId = decoded.id; // Extract `id` from the token payload
    const { fullname, mobile, email,age,gender,address } = req.body; // Extract fields from the request body
    if (!fullname && !mobile && !email && !age && !gender && !address) { return res.status(400).json({ message: 'No fields provided for update' }); }
    // Update query with COALESCE for partial updates
    const query = "UPDATE users SET fullname = COALESCE(?, fullname), mobile = COALESCE(?, mobile), email = COALESCE(?, email), age = COALESCE(?, age), gender = COALESCE(?, gender), address =COALESCE(?, address) WHERE id = ?";
    server.query(query, [fullname, mobile, email, age, gender, address, userId], (error, results) => {
      if (error) {
        console.error('Database query error:', error.message);
        return res.status(500)
          .json({ message: 'Database error' });
      }
      if (results.affectedRows > 0) {
        return res.status(200)
          .json({ success: true, message: 'Profile updated successfully' });
      } else {
        return res.status(404)
          .json({ message: 'User not found' });
      }
    });
  });
});

// PUT endpoint to change password (without bcrypt)
app.put('/changepass', authenticateToken, (req, res) => {
  //console.log('Request body:', req.body); 
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  // Step 1: Check if new password is the same as the current password
  if (currentPassword === newPassword) {
    return res.status(400)
      .json({ message: 'New password cannot be the same as the current password.' });
  }
  // Step 3: Check if current password matches the one in the database
  server.query('SELECT password FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500)
        .json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404)
        .json({ message: 'User not found' });
    }
    const user = results[0];
    if (user.password !== currentPassword) { // Directly compare plain-text passwords
      return res.status(401)
        .json({ message: 'Incorrect current password' });
    }
    // Step 4: Update the password in the database
    server.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId], (err) => {
      if (err) {
        return res.status(500)
          .json({ message: 'Error updating the password' });
      }
      res.status(200)
        .json({ message: 'Password changed successfully' });
    });
  });
});
// POST endpoint to handle booking requests
app.post('/book', authenticateToken, (req, res) => {
  // Extract booking details from the request body
  const { movieTitle, theater, Location, screen, selectedSeats, selectedDate, selectedShowtime, totalSeatsPrice, convenienceFee, totalAmount, paymentId } = req.body; 
  const userId = req.user.id; // Extract the logged-in user's ID from the JWT token

  // Validate that all required fields are provided
  if (!movieTitle || !theater || !Location || !screen|| !selectedSeats || !selectedDate || !selectedShowtime || !totalSeatsPrice || !convenienceFee ||!totalAmount || !paymentId) {
    return res.status(400).json({ message: 'Please provide all booking details' }); // Return an error if any field is missing
  }

  // Remove 'pay_' prefix from the payment ID if it exists, or generate a new one
  const cleanedPaymentId = paymentId.startsWith('pay_') ? paymentId.slice(4) : paymentId;
  const generatedPaymentId = cleanedPaymentId || generatePaymentId(); // Generate a unique payment ID if none provided

  // Convert the selected showtime to 24-hour format
  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(':');
    const period = minutes.slice(-2); // AM/PM indicator
    let hour24 = parseInt(hours, 10);

    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12; // Convert PM hour to 24-hour format
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0; // Midnight case
    }

    return `${String(hour24).padStart(2, '0')}:${minutes.slice(0, -2)}`; // Return in HH:mm format
  };

  const formattedShowtime = convertTo24HourFormat(selectedShowtime);

  // Generate a unique booking ID using the current timestamp and a random number
  const bookingId = `BMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // SQL query to insert booking data into the database
  const insertBookingQuery = `INSERT INTO booking (bookingId, userId, movieTitle, theater, Location, screen, selectedSeats, selectedDate, selectedShowtime, totalSeatsPrice, convenienceFee, totalAmount, paymentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Prepare the booking data for insertion // Convert selected seats array to a JSON string
  const bookingData = [ bookingId, userId, movieTitle, theater, Location, screen, JSON.stringify(selectedSeats), selectedDate, formattedShowtime,
    totalSeatsPrice, convenienceFee, totalAmount, generatedPaymentId,
  ];

  // Execute the query to insert booking data
  server.query(insertBookingQuery, bookingData, (error, results) => {
    if (error) {
      console.error('Error inserting booking:', error.message); 
      return res.status(500).json({ message: 'Failed to save booking', error: error.message }); 
    }

    res.status(201).json({ message: 'Booking saved successfully', bookingId, paymentId: generatedPaymentId });
  });
});

//GET endpoint to retrieve user booking information
app.get('/bookings', authenticateToken, (req, res) => {
  const userId = req.user.id; // Extract the logged-in user's ID from the JWT token
  // SQL query to get all bookings for the logged-in user
  const getAllBookingsQuery = `SELECT * FROM booking WHERE userId = ?`;
  // Execute the query to fetch all the booking data
  server.query(getAllBookingsQuery, [userId], (error, results) => {
    if (error) {
      // Return a server error response
      return res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
    }
    // If no bookings are found, return a message indicating that
    if (results.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }
    // Optionally, parse the selectedSeats JSON string for each booking and format the showtime to 12-hour format
    const bookings = results.map(booking => {
      booking.selectedSeats = JSON.parse(booking.selectedSeats);
      booking.selectedShowtime = formatShowtime(booking.selectedShowtime);
      return booking;
    });
    // Return all the bookings data
    res.status(200).json({ message: 'Bookings retrieved successfully', bookings });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);  // Log a message when the server is started
});
