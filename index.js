const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL connection pool setup
const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12794590',
  password: 'KQ1ZdLKVbH',
  database: 'sql12794590',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
  pool.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Database error', details: err.sqlMessage });
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

  const sql = 'SELECT * FROM schools';

  pool.query(sql, (err, schools) => {
    if (err) {
      console.error('Database select error:', err);
      return res.status(500).json({ error: 'Database error', details: err.sqlMessage });
    }

    // Calculate Haversine distance for each school
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      function toRad(x) { return x * Math.PI / 180; }

      const R = 6371; // Earth radius in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    schools.forEach(school => {
      school.distance = haversineDistance(userLat, userLng, school.latitude, school.longitude);
    });

    schools.sort((a, b) => a.distance - b.distance);

    res.json(schools);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
