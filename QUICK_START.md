# WE Trip - התחלה מהירה 🚀

## שלב 1: התקנת תלויות

### Frontend
```bash
cd frontend
npm install
```

### Backend (אופציונלי)
```bash
cd backend
npm install
```

## שלב 2: הגדרת Firebase

1. **צור פרויקט Firebase חדש** ב-[Firebase Console](https://console.firebase.google.com/)

2. **הפעל את השירותים הבאים:**
   - ✅ Authentication → Google Provider
   - ✅ Firestore Database
   - ✅ Storage (אופציונלי)

3. **קבל את מפתחות ה-API:**
   - לך ל-Project Settings → General
   - גלול למטה ל-"Your apps"
   - לחץ על "Web app" (או צור אחד חדש)
   - העתק את המפתחות

## שלב 3: הגדרת Frontend

1. **צור קובץ `.env.local` בתיקיית `frontend/`:**
   ```bash
   cd frontend
   cp config/env.example .env.local
   ```

2. **עדכן את `.env.local` עם המפתחות שלך:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXX"

   # אופציונלי - רק אם אתה רוצה להשתמש ב-Gemini או Google Maps
   GEMINI_API_KEY="your-key"
   GOOGLE_MAPS_API_KEY="your-key"
   ```

3. **הרץ את ה-Frontend:**
   ```bash
   npm run dev
   ```

   האפליקציה תרוץ ב: **http://localhost:3000**

## שלב 4: הגדרת Firestore Rules

**חשוב!** עדכן את ה-Firestore Rules כדי לאפשר גישה:

1. לך ל-Firestore Database → Rules
2. העתק את הכללים הבאים:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Itineraries
    match /itineraries/{itineraryId} {
      allow read: if resource.data.visibility == 'public' 
                  || resource.data.ownerId == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if resource.data.ownerId == request.auth.uid;
    }
    
    // Users
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Favorites
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null 
                         && resource.data.userId == request.auth.uid;
    }
    
    // Ratings
    match /ratings/{ratingId} {
      allow read: if true;
      allow create, update: if request.auth != null 
                           && request.resource.data.userId == request.auth.uid;
    }
    
    // Reports
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read, update, delete: if false; // רק אדמין (נבדק ב-backend)
    }
  }
}
```

## שלב 5: בדיקה ראשונית

1. **פתח את הדפדפן ב-http://localhost:3000**
2. **נסה להתחבר עם Google:**
   - לחץ על "לוח בקרה" בתפריט
   - לחץ על "התחברות עם Google"
   - אשר את ההרשאות

3. **צור מסלול ראשון:**
   - לחץ על "יצירת מסלול חדש"
   - מלא את הפרטים הבסיסיים
   - שמור

## בעיות נפוצות

### ❌ "Missing required Firebase env variable"
**פתרון:** ודא ש-`.env.local` קיים וכל המפתחות מוגדרים

### ❌ "Permission denied" ב-Firestore
**פתרון:** עדכן את ה-Firestore Rules (ראה שלב 4)

### ❌ שגיאת Authentication
**פתרון:** ודא ש-Google Provider מופעל ב-Firebase Console

### ❌ האפליקציה לא נטענת
**פתרון:** 
1. בדוק את ה-console בדפדפן (F12)
2. בדוק את הטרמינל של `npm run dev`
3. ודא שכל התלויות הותקנו (`npm install`)

## Backend (אופציונלי)

ה-Backend **לא חובה** להרצת ה-Frontend. ה-Frontend משתמש ב-Firebase ישירות.

אם אתה רוצה להריץ גם את ה-Backend:

1. **קבל Firebase Admin Credentials:**
   - Firebase Console → Project Settings → Service Accounts
   - לחץ "Generate New Private Key"
   - שמור את הקובץ

2. **צור `.env` בתיקיית `backend/`:**
   ```env
   PORT=4000
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="your-service-account@..."
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. **הרץ:**
   ```bash
   npm run dev
   ```

## הצלחת! 🎉

עכשיו אתה יכול:
- ✅ ליצור מסלולי טיול
- ✅ לערוך מסלולים
- ✅ לדרג ולשמור למועדפים
- ✅ לחפש מסלולים
- ✅ לצפות בפרופילים

**הערה:** פיצ'רים כמו Gemini AI ו-Google Maps דורשים מפתחות API נוספים (אופציונלי).

