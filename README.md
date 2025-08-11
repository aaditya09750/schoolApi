# School Management API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)

A robust, scalable RESTful API for school management built with Node.js and Express.js. This system provides comprehensive school data management with location-based proximity sorting and enterprise-grade validation.

**Live API Base URL:** [https://schoolapi-dswp.onrender.com](https://schoolapi-dswp.onrender.com)

**Postman Collection:** [API Testing Collection](https://aadigunjal0975-3046795.postman.co/workspace/Aaditya-Gunjal's-Workspace~da459a98-c435-4a33-8fea-dc9ef267de00/collection/47499417-42ffa4a4-4b74-4b39-b49e-888afbe4b8f5?action=share&source=copy-link&creator=47499417)

## Key Features

**Location-Based Intelligence** - Advanced geographical distance calculation using Haversine formula for precise proximity-based school sorting and discovery.

**Robust Data Validation** - Comprehensive input validation ensuring data integrity with proper coordinate range checking and type validation.

**Enterprise Architecture** - Built with connection pooling, error handling, and scalable database design for high-performance production environments.

**RESTful Design** - Clean, intuitive API endpoints following REST conventions with proper HTTP methods and status codes.

**Real-Time Processing** - Dynamic distance calculations and instant sorting capabilities for responsive user experiences.

## Technical Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Server-side JavaScript runtime with async capabilities |
| Express.js | 4.x | Fast, minimalist web framework for robust API development |
| MySQL | 8.x | Reliable relational database with ACID compliance |
| MySQL2 | Latest | Enhanced MySQL client with connection pooling |
| Body-Parser | Latest | Middleware for parsing incoming request bodies |

## API Endpoints

### Add School API
```
POST /addSchool
Content-Type: application/json
```

**Request Payload:**
```json
{
  "name": "Springfield Elementary",
  "address": "123 Education Street, Springfield, IL",
  "latitude": 39.7817,
  "longitude": -89.6501
}
```

**Response (Success):**
```json
{
  "message": "School added successfully",
  "schoolId": 12
}
```

**Validation Rules:**
- All fields are required and non-empty
- Latitude must be between -90 and 90 degrees
- Longitude must be between -180 and 180 degrees
- Coordinates must be valid numbers

### List Schools API
```
GET /listSchools?latitude={lat}&longitude={lng}
```

**Query Parameters:**
- `latitude` - User's latitude coordinate (required)
- `longitude` - User's longitude coordinate (required)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Springfield Elementary",
    "address": "123 Education Street, Springfield, IL",
    "latitude": 39.7817,
    "longitude": -89.6501,
    "distance": 2.45
  },
  {
    "id": 2,
    "name": "Riverside High School",
    "address": "456 River Road, Springfield, IL",
    "latitude": 39.7901,
    "longitude": -89.6445,
    "distance": 3.12
  }
]
```

## Database Schema

### Schools Table Structure
```sql
CREATE TABLE schools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  INDEX idx_coordinates (latitude, longitude)
);
```

**Field Specifications:**
- `id` - Auto-incrementing primary key
- `name` - School name (up to 255 characters)
- `address` - Full address (up to 500 characters)
- `latitude` - Geographic latitude (-90 to 90)
- `longitude` - Geographic longitude (-180 to 180)

## Quick Start

### Prerequisites
- Node.js 18+ and npm package manager
- MySQL 8.x database server
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/aaditya09750/schoolApi.git
cd schoolApi

# Install dependencies
npm install

# Configure database connection
# Update MySQL credentials in index.js

# Start the server
npm start

# Server will run on http://localhost:3000
```

### Environment Setup

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Distance Calculation Algorithm

### Haversine Formula Implementation
The API uses the Haversine formula to calculate the great-circle distance between two points on Earth:

```javascript
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};
```

**Accuracy:** ±0.5% for distances up to 20,000km
**Performance:** O(n log n) complexity for sorting operations

## Deployment Architecture

### Production Environment
- **Platform:** Render Cloud Platform
- **Database:** FreeSQLDatabase (MySQL 8.x)
- **SSL:** Automatic HTTPS with Let's Encrypt
- **Monitoring:** Built-in health checks and logging

### Database Configuration
```javascript
const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12794590',
  database: 'sql12794590',
  port: 3306,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true
});
```

## Error Handling & Validation

### Input Validation
**Coordinate Validation:**
- Latitude range: -90° to +90°
- Longitude range: -180° to +180°
- Type checking for numeric values
- Non-null and non-empty field validation

**Error Response Format:**
```json
{
  "error": "Invalid input data",
  "details": "Latitude must be between -90 and 90 degrees"
}
```

### HTTP Status Codes
- `200` - Success with data
- `400` - Bad Request (validation errors)
- `500` - Internal Server Error (database/system errors)

## Testing with Postman

### Collection Features
**Pre-configured Requests** - Ready-to-use requests with sample data and proper headers
**Environment Variables** - Base URL and common parameters for easy testing
**Test Scripts** - Automated validation of response formats and status codes
**Documentation** - Comprehensive API documentation with examples

### Sample Test Cases
```javascript
// Add School Test
POST {{baseUrl}}/addSchool
{
  "name": "Test School",
  "address": "Test Address",
  "latitude": 40.7128,
  "longitude": -74.0060
}

// List Schools Test
GET {{baseUrl}}/listSchools?latitude=40.7128&longitude=-74.0060
```

## Performance Optimizations

**Connection Pooling** - MySQL connection pool with 10 concurrent connections for optimal resource utilization
**Efficient Sorting** - In-memory sorting after database retrieval for faster response times
**Input Validation** - Early validation to prevent unnecessary database operations
**Error Caching** - Proper error handling to prevent cascade failures

## Security Features

**Input Sanitization** - SQL injection prevention through parameterized queries
**Data Type Validation** - Strict type checking for all input parameters
**Connection Security** - Secure database connections with proper authentication
**Error Message Security** - Sanitized error responses to prevent information leakage

## Browser & Client Support

**HTTP Clients** - Compatible with all REST clients (Postman, curl, Insomnia)
**Frontend Integration** - CORS-ready for web application integration
**Mobile Apps** - RESTful design suitable for mobile app backends
**Third-party Services** - Standard JSON API format for easy integration

## Contributing Guidelines

### Development Process
1. Fork repository and create feature branch from `main`
2. Follow established coding conventions and error handling patterns
3. Add comprehensive input validation for new endpoints
4. Test with various edge cases and invalid inputs
5. Update documentation and Postman collection
6. Submit pull request with detailed description

### Code Standards
- Use consistent error handling patterns
- Implement proper input validation for all endpoints
- Follow RESTful API design principles
- Include comprehensive logging for debugging
- Maintain backward compatibility

## Contact & Support

![Email](https://img.shields.io/badge/Email-aadigunjal0975%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-aaditya09750-181717?style=for-the-badge&logo=github&logoColor=white)

**Get in Touch**

For technical support, feature requests, or collaboration opportunities:

- **Email:** [aadigunjal0975@gmail.com](mailto:aadigunjal0975@gmail.com)
- **GitHub:** [aaditya09750](https://github.com/aaditya09750)
- **Resume:** [View Professional Profile](https://aaditya-gunjal-resume.tiiny.site)
- **Phone:** +91 8433509521

**Response Time:** Typically within 24-48 hours for technical inquiries.

---

**School Management API** demonstrates modern backend development practices with robust error handling, efficient algorithms, and scalable architecture. Built for educational institutions requiring reliable, location-aware school discovery and management capabilities.
