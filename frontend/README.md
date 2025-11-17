## WE Trip Frontend (MVP Skeleton)

אפליקציית Next.js 14 (App Router) בעברית שמספקת את שכבת ה-UI ל-WE Trip — פלטפורמת מסלולי טיול קהילתית. הגרסה הנוכחית כוללת:

- תבנית רספונסיבית RTL עם טיפוגרפיית Assistant ותמיכה בעברית.
- תצוגת נחיתה בסיסית עם חלוקה לקטעי חזון, פיצ׳רים ו-Roadmap.
- מעטפת Firebase (Auth/Firestore/Storage) ומודלי נתונים ראשוניים (Itinerary, UserProfile, Costs ועוד).
- Stubs לחיבורים החיצוניים (Gemini, Google Maps Places, Speech-to-Text).

## התקנה והרצה

```bash
npm install
cp config/env.example .env.local # עדכון ערכי Firebase ו-API
npm run dev
```

ברירת המחדל מריצה את האפליקציה ב-[http://localhost:3000](http://localhost:3000).

## מבנה תיקיות

```
src/
├─ app/            # layout, globals, דפי App Router
├─ lib/
│  ├─ firebase/    # אתחול Firebase ו-helpers לאותנטיקציה/DB/Storage
│  └─ integrations/# מעטפת API חיצוניים (Gemini, Google Maps, Speech-to-Text)
└─ types/          # מודלי דומיין משותפים
config/env.example # משתני סביבה נדרשים
```

## חיבורים חיצוניים נדרשים

- `NEXT_PUBLIC_FIREBASE_*` – קונפיג של פרויקט Firebase.
- `GEMINI_API_KEY` – עבור ייצור מסלול מבוסס טקסט/דיבור.
- `GOOGLE_MAPS_API_KEY` – ולידציה של נקודות interest וייבוא רשימות.
- `SPEECH_TO_TEXT_API_KEY` – המרת קבצי אודיו לטקסט.

## שלבי הפיתוח הבאים

1. **CRUD למסלולים** – מודול יצירה/עריכה ידני + שמירת פרופילים ב-Firestore.
2. **חוויית משתמש** – קומפוננטות UI לימים, נקודות interest ועלויות לפי אזור.
3. **חיבורי AI** – חיבור פונקציות שרת ל-Gemini ול-Speech-to-Text בפועל.
4. **ייבוא Google Maps** – העלאת רשימות interest וסידורן בעזרת Gemini.
5. **קהילה** – דירוגים, מועדפים, דיווחים וניהול אדמין.

## פריסה

מומלץ לפרוס ב-Vercel (Frontend) ולחבר לאותו פרויקט Firebase לענן. בעתיד ניתן להרחיב ל-Firebase Hosting / Cloud Run בהתאם לצורכי הבקאנד.
