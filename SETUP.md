# WE Trip - הוראות התקנה והרצה

## דרישות מוקדמות

- Node.js 18+ 
- npm או yarn
- פרויקט Firebase עם:
  - Authentication (Google Provider)
  - Firestore Database
  - Storage (אופציונלי)
- מפתחות API:
  - Gemini API Key (אופציונלי)
  - Google Maps API Key (אופציונלי)

## התקנת Frontend

```bash
cd frontend
npm install
```

### הגדרת משתני סביבה

1. העתק את קובץ הדוגמה:
   ```bash
   cp config/env.example .env.local
   ```

2. עדכן את `.env.local` עם המפתחות שלך:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXX"

   GEMINI_API_KEY="your-gemini-key"  # אופציונלי
   GOOGLE_MAPS_API_KEY="your-maps-key"  # אופציונלי
   SPEECH_TO_TEXT_API_KEY="not-used"  # לא בשימוש (משתמש ב-Web Speech API)
   ```

### הרצת Frontend

```bash
npm run dev
```

האפליקציה תרוץ ב- [http://localhost:3000](http://localhost:3000)

## התקנת Backend

```bash
cd backend
npm install
```

### הגדרת משתני סביבה

1. העתק את קובץ הדוגמה:
   ```bash
   cp config/env.example .env
   ```

2. עדכן את `.env` עם פרטי Firebase Admin:
   ```env
   PORT=4000
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

   **איך להשיג Firebase Admin Credentials:**
   1. לך ל-Firebase Console → Project Settings → Service Accounts
   2. לחץ על "Generate New Private Key"
   3. העתק את `project_id`, `client_email`, ו-`private_key` לקובץ `.env`

### הרצת Backend

```bash
npm run dev
```

השרת ירוץ ב- [http://localhost:4000](http://localhost:4000)

**Health Check:** [http://localhost:4000/health](http://localhost:4000/health)

## API Endpoints

### Public Endpoints

- `GET /api/itineraries/public` - רשימת מסלולים ציבוריים
- `GET /api/itineraries/:id` - מסלול ספציפי
- `GET /api/users/:userId` - פרופיל משתמש (מידע מוגבל)

### Protected Endpoints (דורש Bearer Token)

- `POST /api/itineraries` - יצירת מסלול חדש
- `PUT /api/itineraries/:id` - עדכון מסלול
- `DELETE /api/itineraries/:id` - מחיקת מסלול
- `GET /api/itineraries/user/:ownerId` - מסלולים של משתמש
- `POST /api/users` - יצירת/עדכון פרופיל
- `PUT /api/users/:userId` - עדכון פרופיל
- `POST /api/reports` - יצירת דיווח

### Admin Endpoints

- `GET /api/reports` - רשימת דיווחים
- `PUT /api/reports/:id/status` - עדכון סטטוס דיווח
- `DELETE /api/reports/:id` - מחיקת דיווח

## אימות (Authentication)

ה-Backend משתמש ב-Firebase ID Token לאימות. כדי לשלוח בקשות מוגנות:

```javascript
const token = await user.getIdToken();
fetch('http://localhost:4000/api/itineraries', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## מבנה הפרויקט

```
we_trip/
├── frontend/          # Next.js 14 App
│   ├── src/
│   │   ├── app/       # Pages & API routes
│   │   ├── components/ # React components
│   │   ├── lib/       # Utilities & integrations
│   │   └── types/     # TypeScript types
│   └── config/        # Environment config
│
└── backend/           # Express API Server
    ├── src/
    │   ├── routes/    # API routes
    │   ├── services/  # Business logic
    │   ├── middleware/# Auth, validation, errors
    │   └── config/    # Environment config
    └── dist/          # Compiled JavaScript
```

## פתרון בעיות

### שגיאת Firebase
- ודא שמפתחות ה-Firebase נכונים
- ודא ש-Firestore Rules מאפשרים גישה
- ודא ש-Authentication מופעל

### שגיאת CORS
- ה-Backend מוגדר לאפשר CORS מכל מקור (development)
- ב-production, עדכן את ה-CORS settings

### שגיאת Authentication
- ודא שה-token תקף ולא פג תוקף
- ודא שה-`Authorization` header נשלח נכון

## פיתוח נוסף

לפרטים נוספים על תוכנית הפיתוח, ראה:
- `frontend/docs/ROADMAP.md` - תוכנית פיתוח MVP

