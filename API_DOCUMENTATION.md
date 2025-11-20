# WE Trip - API Documentation

## Frontend API Routes (Next.js)

### `/api/gemini/generate`
**Method:** `POST`  
**Description:** יוצר מסלול טיול מתיאור טקסט חופשי באמצעות Gemini AI

**Request Body:**
```json
{
  "transcript": "string (required, max 10,000 chars)",
  "targetAudience": "string (optional)",
  "tripLength": "number (optional)"
}
```

**Response:**
```json
{
  "summary": "string",
  "points": [
    {
      "name": "string",
      "description": "string",
      "placeId": "string",
      "googleMapsUrl": "string",
      "area": "string"
    }
  ],
  "days": [
    {
      "title": "string",
      "dateLabel": "string",
      "area": "string",
      "summary": "string",
      "tips": ["string"],
      "points": ["string"]
    }
  ]
}
```

**Features:**
- ✅ Rate limiting (60 requests/minute)
- ✅ Retry logic (2 retries on failure)
- ✅ Timeout protection (30 seconds)
- ✅ CORS headers
- ✅ Input validation

---

### `/api/places/search`
**Method:** `GET`  
**Description:** מחפש מקומות ב-Google Maps Places API

**Query Parameters:**
- `query` (required): מחרוזת חיפוש

**Example:**
```
GET /api/places/search?query=ירושלים
```

**Response:**
```json
{
  "places": [
    {
      "id": "place_id",
      "name": "string",
      "address": "string",
      "url": "string",
      "photo": "string (optional)",
      "lat": "number",
      "lng": "number"
    }
  ]
}
```

**Features:**
- ✅ Rate limiting (60 requests/minute)
- ✅ Caching (5 minutes TTL)
- ✅ CORS headers
- ✅ Input validation

---

### `/api/places/details`
**Method:** `GET`  
**Description:** מקבל פרטים מלאים על מקום לפי place_id

**Query Parameters:**
- `placeId` (required): Google Maps place_id

**Example:**
```
GET /api/places/details?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4
```

**Response:**
```json
{
  "place": {
    "id": "place_id",
    "name": "string",
    "address": "string",
    "url": "string",
    "photo": "string (optional)",
    "lat": "number",
    "lng": "number"
  }
}
```

**Features:**
- ✅ Rate limiting (60 requests/minute)
- ✅ Caching (30 minutes TTL - place details don't change often)
- ✅ CORS headers
- ✅ Input validation

---

### `/api/speech/transcribe`
**Method:** `POST`  
**Description:** Speech-to-Text מומש client-side (Web Speech API)

**Response:**
```json
{
  "error": "Speech-to-Text is implemented client-side",
  "message": "This application uses the Web Speech API in the browser.",
  "clientImplementation": "Use navigator.mediaDevices.getUserMedia() and Web Speech API"
}
```

**Note:** Speech-to-Text פועל ישירות בדפדפן, לא דורש שרת.

---

## Backend API Routes (Express)

### Base URL
`http://localhost:4000/api`

### Authentication
כל ה-routes המוגנים דורשים `Authorization` header:
```
Authorization: Bearer <firebase-id-token>
```

---

### Itineraries

#### `GET /api/itineraries/public`
**Public** - רשימת מסלולים ציבוריים

**Query Parameters:**
- `limit` (optional): מספר מסלולים (default: 50)

**Response:**
```json
{
  "itineraries": [...]
}
```

---

#### `GET /api/itineraries/:id`
**Public** - מסלול ספציפי

**Response:**
```json
{
  "itinerary": {...}
}
```

---

#### `POST /api/itineraries`
**Protected** - יצירת מסלול חדש

**Request Body:**
```json
{
  "title": "string (required, min 3 chars)",
  "primaryDestination": "string (required, min 2 chars)",
  "summary": "string (optional)",
  "regions": ["string"],
  "categories": ["string"],
  "budget": {...}
}
```

**Response:**
```json
{
  "id": "itinerary-id"
}
```

---

#### `PUT /api/itineraries/:id`
**Protected** - עדכון מסלול (רק הבעלים)

**Request Body:**
```json
{
  "title": "string",
  "summary": "string",
  ...
}
```

---

#### `DELETE /api/itineraries/:id`
**Protected** - מחיקת מסלול (בעלים או admin)

---

#### `GET /api/itineraries/user/:ownerId`
**Protected** - מסלולים של משתמש ספציפי

---

### Users

#### `GET /api/users/:userId`
**Public** - פרופיל משתמש (מידע מוגבל)

**Response:**
```json
{
  "id": "user-id",
  "displayName": "string",
  "photoURL": "string",
  "bio": "string"
}
```

---

#### `POST /api/users`
**Protected** - יצירת/עדכון פרופיל

**Request Body:**
```json
{
  "email": "string (required)",
  "displayName": "string",
  "photoURL": "string"
}
```

---

#### `PUT /api/users/:userId`
**Protected** - עדכון פרופיל (בעלים או admin)

**Request Body:**
```json
{
  "displayName": "string (min 2 chars)",
  "bio": "string"
}
```

---

### Reports

#### `POST /api/reports`
**Protected** - יצירת דיווח

**Request Body:**
```json
{
  "itineraryId": "string (required)",
  "reason": "offensive" | "spam" | "copyright" | "other",
  "notes": "string (optional)"
}
```

---

#### `GET /api/reports`
**Admin Only** - רשימת דיווחים

**Query Parameters:**
- `status` (optional): "open" | "reviewing" | "closed"

---

#### `PUT /api/reports/:id/status`
**Admin Only** - עדכון סטטוס דיווח

**Request Body:**
```json
{
  "status": "open" | "reviewing" | "closed"
}
```

---

#### `DELETE /api/reports/:id`
**Admin Only** - מחיקת דיווח

---

## Error Responses

כל ה-API routes מחזירים שגיאות בפורמט אחיד:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Rate Limiting

**Frontend API Routes:**
- 60 requests per minute per IP

**Backend API Routes:**
- אין rate limiting מובנה (מומלץ להוסיף ב-production)

---

## Caching

**Frontend API Routes:**
- `/api/places/search` - 5 minutes cache
- `/api/places/details` - 30 minutes cache

**Backend API Routes:**
- אין caching (מומלץ להוסיף ב-production)

---

## Security

- ✅ CORS headers על כל ה-routes
- ✅ Input validation
- ✅ Authentication middleware
- ✅ Rate limiting (frontend)
- ⚠️ ב-production: הוסף HTTPS, rate limiting ל-backend, ו-Redis ל-caching

