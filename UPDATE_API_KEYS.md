# עדכון מפתחות API

## המפתחות שקיבלת:

```
GEMINI_API_KEY=AIzaSyD-Pv7zGw2UzDigRNBo5dA6uPYo_usD9SU
GOOGLE_MAPS_API_KEY=AIzaSyAbk2xd2wLwi6F-MGamE2so0KXui10F3M
SPEECH_TO_TEXT_API_KEY=AIzaSyBVBUWUPDLZGnbiG0ganJAcCUZLvyZisNs
```

## איך לעדכן:

### 1. פתח את הקובץ:
`frontend/.env.local`

### 2. עדכן את השורות הבאות:

```env
GEMINI_API_KEY="AIzaSyD-Pv7zGw2UzDigRNBo5dA6uPYo_usD9SU"
GOOGLE_MAPS_API_KEY="AIzaSyAbk2xd2wLwi6F-MGamE2so0KXui10F3M"
SPEECH_TO_TEXT_API_KEY="AIzaSyBVBUWUPDLZGnbiG0ganJAcCUZLvyZisNs"
```

### 3. שמור את הקובץ

### 4. אם האפליקציה רצה, הפעל מחדש:
```bash
# עצור את השרת (Ctrl+C)
# הפעל מחדש
cd frontend
npm run dev
```

---

## ⚠️ חשוב - אבטחה:

1. **אל תעלה את `.env.local` ל-GitHub** - הקובץ כבר ב-.gitignore
2. **ב-Vercel:** הוסף את המפתחות ב-Environment Variables
3. **שמור את המפתחות בסוד** - אל תשתף אותם בפומבי

---

## בדיקה שהמפתחות עובדים:

לאחר העדכון, תוכל לבדוק:

1. **Gemini API:** נסה ליצור מסלול דרך Speech-to-Text או טקסט חופשי
2. **Google Maps API:** נסה לחפש מקום במערכת
3. **Speech-to-Text:** נסה להקליט דיבור

---

## אם יש שגיאות:

- **"API key not configured"** - ודא שהמפתחות ב-`.env.local` ללא רווחים
- **"Invalid API key"** - בדוק שהמפתחות נכונים
- **"Quota exceeded"** - בדוק את ה-quotas ב-Google Cloud Console

