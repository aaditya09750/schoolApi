const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // your MySQL username
  password: 'Chhatrapati0975@___', // your MySQL password
  database: 'school_db' // your database name
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL');
  }
});

/* =========== Add School API =========== */
app.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (
    !name || !address ||
    typeof latitude !== 'number' || typeof longitude !== 'number' ||
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const sql = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'School added successfully', schoolId: result.insertId });
  });
});

/* =========== List Schools API =========== */
app.get('/listSchools', (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLng = parseFloat(req.query.longitude);

  if (
    isNaN(userLat) || isNaN(userLng) ||
    userLat < -90 || userLat > 90 ||
    userLng < -180 || userLng > 180
  ) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  // Fetch all schools
  const sql = 'SELECT * FROM schools';

  db.query(sql, (err, schools) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Calculate distance for each school
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      function toRad(x) { return x * Math.PI / 180; }

      const R = 6371; // Radius of Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    // Add distance property
    schools.forEach(school => {
      school.distance = haversineDistance(userLat, userLng, school.latitude, school.longitude);
    });

    // Sort by distance ascending
    schools.sort((a, b) => a.distance - b.distance);

    res.json(schools);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
