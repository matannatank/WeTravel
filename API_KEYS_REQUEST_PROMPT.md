# פרומפט לבקשת מפתחות API

העתק את הטקסט הבא והדבק ב-ChatGPT או AI אחר:

---

## בקשת מפתחות API לפרויקט WE Trip

אני מפתח אפליקציית מסלולי טיול קהילתית בשם **WE Trip** (WeTravel) - פלטפורמה בעברית שמאפשרת למשתמשים ליצור, לשתף ולגלות מסלולי טיול.

האפליקציה בנויה עם:
- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth

אני צריך להוציא **3 מפתחות API** עבור הפיצ'רים הבאים:

### 1. Gemini API Key
**שימוש:** יצירת מסלולי טיול אוטומטיים מתיאור טקסט חופשי בעברית. המשתמש יכול לתאר טיול במילים, וה-AI יזהה מקומות, יציע ימים, ויארגן את המסלול.

**מה אני צריך:**
- מפתח API ל-Google Gemini (Gemini Pro)
- הוראות איך להוציא את המפתח
- מידע על pricing/quotas
- איך להגדיר את המפתח ב-Google Cloud Console

### 2. Google Maps API Key
**שימוש:** 
- חיפוש מקומות (Places API - Text Search)
- קבלת פרטים על מקומות (Places API - Place Details)
- אימות place IDs
- ייבוא רשימות מ-Google Maps

**מה אני צריך:**
- מפתח API ל-Google Maps Platform
- אילו APIs ספציפיים להפעיל (Places API, Geocoding API)
- הוראות הגדרה ב-Google Cloud Console
- מידע על pricing/quotas
- איך להגביל את המפתח ל-domains ספציפיים (security)

### 3. Speech-to-Text API Key (אופציונלי)
**שימוש:** המרת דיבור לטקסט בעברית - המשתמש יכול לתאר טיול בקול, והטקסט יומר ויישלח ל-Gemini.

**הערה:** כרגע אני משתמש ב-Web Speech API בדפדפן, אבל אני רוצה לדעת על האפשרות של Google Cloud Speech-to-Text לשיפור הדיוק.

**מה אני צריך:**
- מפתח API ל-Google Cloud Speech-to-Text
- הוראות הגדרה
- מידע על pricing
- האם זה שווה את זה לעומת Web Speech API

---

**שאלות נוספות:**
1. מה הדרך הטובה ביותר לאבטח את המפתחות? (Environment Variables, Vercel Secrets)
2. איך להגביל את השימוש במפתחות ל-domains/APIs ספציפיים?
3. מה ה-pricing הצפוי עבור שימוש בסיסי (100-1000 משתמשים)?
4. האם יש free tier או credits להתחלה?

תודה רבה!

---

