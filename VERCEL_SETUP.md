# הגדרת Vercel - הוראות מפורטות

## הבעיה:
Vercel לא מוצא את `package.json` כי הוא מחפש אותו ב-root, אבל הוא נמצא ב-`frontend/`.

## הפתרון:

### אופציה 1: הגדרת Root Directory ב-Vercel Dashboard (מומלץ)

1. **לך ל-Vercel Dashboard**
2. **Project Settings → General**
3. **גלול למטה ל-"Root Directory"**
4. **לחץ על "Edit"**
5. **הזן:** `frontend`
6. **שמור**

**או בעת יצירת הפרויקט:**
1. אחרי בחירת ה-repository
2. לחץ על **"Configure Project"**
3. ב-**"Root Directory"** → בחר `frontend`
4. המשך עם ההגדרות

### אופציה 2: שימוש ב-vercel.json (אם Root Directory לא עובד)

אם הגדרת Root Directory לא עובדת, עדכן את `vercel.json`:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs"
}
```

## שלבים לפריסה:

### 1. ודא שה-Root Directory מוגדר:
- ב-Vercel Dashboard → Project Settings → General
- Root Directory: `frontend`

### 2. הוסף משתני סביבה:
- Project Settings → Environment Variables
- הוסף את כל משתני `NEXT_PUBLIC_FIREBASE_*`
- הוסף את `GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, `SPEECH_TO_TEXT_API_KEY`

### 3. Deploy:
- לחץ על "Deploy" או "Redeploy"

## אם עדיין לא עובד:

### בדוק:
1. ✅ Root Directory מוגדר ל-`frontend`
2. ✅ `frontend/package.json` קיים
3. ✅ `frontend/package.json` מכיל `"next"` ב-dependencies
4. ✅ Build Command: `npm run build` (או `cd frontend && npm run build` אם Root Directory לא מוגדר)

### שגיאות נפוצות:

**"No Next.js version detected"**
- ודא ש-Root Directory מוגדר ל-`frontend`
- או עדכן את `vercel.json` עם `cd frontend &&` לפני כל command

**"Cannot find module"**
- ודא ש-Root Directory נכון
- ודא ש-`package.json` ב-`frontend/`

---

## המלצה:

**השתמש ב-Root Directory ב-Dashboard** - זה הפתרון הכי נקי ופשוט.

