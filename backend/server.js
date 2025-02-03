const express = require('express');  // Import Express.js library
const mysql = require('mysql');  // Import MySQL library
const cors = require('cors');  // Import CORS middleware for cross-origin requests
const jwt = require('jsonwebtoken');  // Import JWT (JSON Web Token) for authentication
const secretKey = 'a8cc1ff8f4bc3b7b4d7611509c97f4b6e5836962f24c2c014453838e6aaa348e'; // Secret key for JWT (make sure to keep it secure)
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { log } = require('console');

const app = express();  // Create an Express app
const port = 5000;  // Define the server port
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Use JSON parser middleware for handling POST request bodies

function getBaseUrl() {
  return "http://localhost"; // Use localhost for development purposes
}

const generatePaymentId = () => {// Generate the payment ID without the "pay_" prefix
  return crypto.randomBytes(12).toString('base64').slice(0, 16);
};

let server;  // Declare the server connection

// Function to handle MySQL connection and automatic reconnection
function handleDatabaseConnection() {
  server = mysql.createConnection({
    host: 'localhost',  // MySQL server hostname (localhost for local testing)
    user: 'root',  // MySQL username
    password: '',  // MySQL password
    database: 'mydata'  // The name of the database you are using
  });

  server.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      setTimeout(handleDatabaseConnection, 2000);  // Retry after 2 seconds if connection fails
    } else {
      console.log('Database connected successfully');
    }
  });

  // Handle connection loss
  server.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Database connection lost. Reconnecting...');
      handleDatabaseConnection();  // Reconnect
    } else {
      console.error('MySQL error:', err);
    }
  });
}

// Initialize the database connection
handleDatabaseConnection();
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

app.post('/register', (req, res) => {
  const { fullname, mobile, email, password } = req.body;
  if (!fullname || !mobile || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  // Check if the email or mobile already exists in the database
  const checkQuery = 'SELECT * FROM users WHERE email = ? OR mobile = ?';
  server.query(checkQuery, [email, mobile], (err, results) => {
    if (err) {
      console.log('Error checking user existence:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: 'User already registered with this email or mobile' }); // 409 Conflict
    }
    // Proceed to register the new user
    const insertQuery = 'INSERT INTO users (fullname, mobile, email, password) VALUES (?, ?, ?, ?)';
    server.query(insertQuery, [fullname, mobile, email, password], (error, results) => {
      if (error) {
        console.log('Error inserting data:', error.message);
        return res.status(500).json({ message: 'Failed to register user', error: error.message });
      }
      res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
    });
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
          secretKey, { expiresIn: '7d' });// Generate a JWT token with userId and a secret key, set to expire in 1 hour
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
        fullname: user.fullname, mobile: user.mobile, email: user.email, password: user.password, age: user.age, gender: user.gender, address: user.address,// Avoid sending sensitive info
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
    const { fullname, mobile, email, age, gender, address } = req.body; // Extract fields from the request body
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
  if (!movieTitle || !theater || !Location || !screen || !selectedSeats || !selectedDate || !selectedShowtime || !totalSeatsPrice || !convenienceFee || !totalAmount || !paymentId) {
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
  const bookingData = [bookingId, userId, movieTitle, theater, Location, screen, JSON.stringify(selectedSeats), selectedDate, formattedShowtime,
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

// Add this to your backend code
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  server.query(query, [email], (error, result) => {
    if (error) {return res.status(500).json({ message: 'Database error' });}
    if (result.length > 0) {// Here, you'd send an email with password reset instructions // For now, just simulate a successful response
      return res.status(200).json({ success: true, message: 'Password reset email sent' });
    } else {
      return res.status(404).json({ success: false, message: 'Email is not registered' });
    }
  });
});

app.post("/sendmail", async (req, res) => {
  try {
    const to = req.body.to;
    const subject = req.body.subject;
    const text = req.body.text;
    if (!to || !subject || !text) {
      return res.json({ message: "invalid Input Data" })
    }
    const sendmail = async (to, mailOptions) => {
      const transport = nodemailer.createTransport({
        host: 'smtp.zeptomail.in',
        port: 587,
        auth: {
          user: "emailapikey",
          pass: 'PHtE6r0LReju2DYu9RJTsfC+F5alZtx/r+lgLglGt4wWCPEGGk0D+I99ljbm/R4iXfVLQfOfmYppsO7JtbrXc2rvNGoaCGqyqK3sx/VYSPOZsbq6x00ct1QffkTYUILscd5v3SHWstjeNA=='
        }
      })
      const options =
      {
        to: to,
        from: 'noreply@ramanasoft.in',
        ...mailOptions
      }
      try {
        await transport.sendMail(options);
        console.log("email sent successfully")
        return { status: 200, message: 'email sent successfully' }
      }
      catch (err) {
        console.error("Error in mail sending", err)
        return { status: 500, message: 'Error in mail sending' }
      }
    }
    const response = await sendmail(to, {
      subject,
      text
    })
    res.status(response.status).send(response.message)
  }
  catch (err) {
    console.error("error ", err);
    res.status(500).json({ message: "error" })
  }
})

app.get("/checkemail", async (req, res) => {
  const sql = "select password from users where email=?";
  const email = req.query.email;
  const subject = "Reset Password || BookAnyTickets Consulting Services"
  const baseUrl = getBaseUrl(); // Use localhost
  const text = `Dear User,

  We have received a request to reset your password for your BookAnyTickets account. 
  
  To proceed with resetting your password, please click the link below:
  ${baseUrl}:5173/Newpassword
  
  If you did not request this change, please ignore this email.

  Best regards,
  The BookAnyTickets Team`;
  server.query(sql, email, async (err, result) => {
    if (err) {
      console.error("Database query error:", err); // Log the error for debugging purposes.
      return res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
    if (result.length > 0) {
      try {
        const response = await sendmail(email, { subject, text });
        if (response.status === 200) {
          //console.log("Reset mail sent successfully");
          return res.status(200).json({ status: "200", message: `Reset email sent to ${email}` });
        } else {
          console.log("Error in reset mail:", response.message);
          return res.status(500).json({ status: "500", message: response.message });
        }
      } catch (error) {
        console.error("Unexpected error in sendmail:", error); // Log unexpected errors
        return res.status(500).json({ status: "500", message: "Error sending reset email" });
      }
    } else {
      // If the email doesn't exist in the database
      return res.status(404).json({ status: "404", message: "Email does not exist" });
    }
  })
  const sendmail = async (to, mailOptions) => {
    const transport = nodemailer.createTransport({
      host: 'smtp.zeptomail.in',
      port: 587,
      auth: {
        user: "emailapikey",
        pass: 'PHtE6r0LReju2DYu9RJTsfC+F5alZtx/r+lgLglGt4wWCPEGGk0D+I99ljbm/R4iXfVLQfOfmYppsO7JtbrXc2rvNGoaCGqyqK3sx/VYSPOZsbq6x00ct1QffkTYUILscd5v3SHWstjeNA=='
      }
    })
    const options =
    {
      to: to,
      from: 'noreply@ramanasoft.in',
      ...mailOptions
    }
    try {
      await transport.sendMail(options);
      //console.log("email sent successfully")
      return { status: 200, message: 'email sent successfully' }
    }
    catch (err) {
      console.error("Error in mail sending", err)
      return { status: 500, message: 'Error in mail sending' }
    }
  }

})

app.post("/update_password", (req, res) => {
  const { userEmail, password } = req.body;
  console.log(userEmail, password);
  const query = "update users set password = ? where email=?";
  server.query(query, [password, userEmail], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(404).send("Invalid Email ");
    }
    return res.status(200).send("password updated successfully");
  })
})
// Post endpoint to save card details (with authentication)
app.post('/savecard', authenticateToken, (req, res) => {
  const { cardNumber, cardholderName, expiryDate, cvv } = req.body;
  //console.log('Received card data:', req.body);
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing or invalid' });
  }
  // Validate that all fields are present
  if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  // Remove spaces from card number for consistency
  const cleanedCardNumber = cardNumber.replace(/\s/g, '');
  // Check if the card already exists for the user
  const checkCardQuery = 'SELECT id FROM cards WHERE userId = ? AND REPLACE(cardNumber, " ", "") = ?';
  server.query(checkCardQuery, [userId, cleanedCardNumber], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      return res.status(400).json({ error: 'This card has already been saved.' });
    }
    // Validate the expiry date (MM/YY format and not expired)
    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return res.status(400).json({ error: 'Card has expired.' });
    }
    // Proceed to save the new card
    const insertCardQuery = `INSERT INTO cards (userId, cardNumber, cardholderName, expiryDate, cvv) VALUES (?, ?, ?, ?, ?)`;
    server.query(insertCardQuery, [userId, cleanedCardNumber, cardholderName, expiryDate, cvv], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Card saved successfully' });
    });
  });
});
// Get endpoint to get cards details (with authentication)
app.get('/getcards', authenticateToken, (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing or invalid' });
  }
  // Query to get saved cards for the user
  const getCardsQuery = 'SELECT id, cardNumber, cardholderName, expiryDate FROM cards WHERE userId = ?';
  server.query(getCardsQuery, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'No saved cards found.' });
    }
    res.status(200).json({ cards: results });
  });
});
// Delete endpoint to delete a card (with authentication)
app.delete('/deletecard/:id', authenticateToken, (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID
  const cardId = req.params.id; // Get the card ID from the URL parameter
  if (!userId || !cardId) {
    return res.status(400).json({ error: 'User ID or card ID is missing or invalid' });
  }
  // Query to delete the card from the database
  const deleteCardQuery = 'DELETE FROM cards WHERE id = ? AND userId = ?';
  server.query(deleteCardQuery, [cardId, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Card not found or not authorized to delete this card' });
    }
    res.status(200).json({ message: 'Card deleted successfully' });
  });
});



// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);  // Log a message when the server is started
});
