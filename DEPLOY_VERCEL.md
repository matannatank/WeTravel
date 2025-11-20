# פריסת WE Trip ב-Vercel 🚀

## שלב 1: הכנת הפרויקט

הפרויקט כבר מוכן לפריסה! כל הקבצים הנדרשים קיימים.

## שלב 2: התחברות ל-Vercel

### דרך 1: דרך GitHub (מומלץ)

1. **לך ל-[Vercel](https://vercel.com)**
2. **התחבר עם GitHub**
3. **לחץ על "Add New Project"**
4. **בחר את ה-repository:** `matannatank/WeTravel`
5. **הגדר את הפרויקט:**
   - **Framework Preset:** Next.js (זיהוי אוטומטי)
   - **Root Directory:** `frontend` ⚠️ **חשוב!**
   - **Build Command:** `npm run build` (אוטומטי)
   - **Output Directory:** `.next` (אוטומטי)
   - **Install Command:** `npm install` (אוטומטי)

### דרך 2: דרך Vercel CLI

```bash
# התקן Vercel CLI
npm i -g vercel

# התחבר
vercel login

# פרוס
cd frontend
vercel
```

## שלב 3: הגדרת משתני סביבה

**חשוב מאוד!** הוסף את כל משתני הסביבה ב-Vercel Dashboard:

1. **לך ל-Project Settings → Environment Variables**
2. **הוסף את המשתנים הבאים:**

### Firebase (חובה)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

### API Keys (אופציונלי)
```
GEMINI_API_KEY=your-gemini-key
GOOGLE_MAPS_API_KEY=your-maps-key
SPEECH_TO_TEXT_API_KEY=not-used
```

**⚠️ חשוב:**
- סמן את כל המשתנים כ-**Production**, **Preview**, ו-**Development**
- ודא שאין רווחים לפני/אחרי ה-`=`
- אל תשים את הערכים ב-quotes (אלא אם כן הם חלק מהערך)

## שלב 4: פריסה

### דרך GitHub (אוטומטי)
1. **לחץ על "Deploy"**
2. Vercel יבנה את הפרויקט אוטומטית
3. כל push ל-`master` יפרס אוטומטית

### דרך CLI
```bash
vercel --prod
```

## שלב 5: בדיקה

לאחר הפריסה:
1. **לך ל-Deployment URL** (למשל: `we-trip.vercel.app`)
2. **בדוק שהאפליקציה נטענת**
3. **נסה להתחבר עם Google**
4. **צור מסלול ראשון**

## פתרון בעיות

### ❌ Build Fails - "Missing environment variable"
**פתרון:** ודא שהוספת את כל משתני הסביבה ב-Vercel Dashboard

### ❌ Build Fails - "Cannot find module"
**פתרון:** ודא ש-Root Directory מוגדר ל-`frontend`

### ❌ Runtime Error - Firebase not initialized
**פתרון:** 
1. ודא שכל משתני `NEXT_PUBLIC_FIREBASE_*` מוגדרים
2. ודא שהם מסומנים כ-Production
3. עשה Redeploy

### ❌ CORS Error
**פתרון:** זה לא אמור לקרות - Vercel מטפל ב-CORS אוטומטית

## הגדרות מתקדמות

### Custom Domain
1. **Project Settings → Domains**
2. **הוסף domain**
3. **עקוב אחר ההוראות ל-DNS**

### Environment Variables per Environment
- **Production:** משתנים ל-production
- **Preview:** משתנים ל-preview deployments
- **Development:** משתנים ל-local development

### Build Settings
אם צריך לשנות את ה-Build Settings:
1. **Project Settings → General**
2. **Override** את ה-commands אם צריך

## Monitoring & Analytics

Vercel מספק:
- ✅ **Analytics** - ביצועים וטראפיק
- ✅ **Logs** - לוגים של כל deployment
- ✅ **Speed Insights** - ניתוח מהירות

## מה הלאה?

לאחר הפריסה:
1. ✅ בדוק שהכל עובד
2. ✅ הגדר Custom Domain (אופציונלי)
3. ✅ הוסף Analytics
4. ✅ הגדר Auto-deployments מ-GitHub

---

**🎉 מזל טוב! האפליקציה שלך עכשיו ב-production!**

