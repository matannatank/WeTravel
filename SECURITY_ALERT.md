# ⚠️ התראת אבטחה - מפתחות API נחשפו

## מה קרה?

המפתחות API נחשפו ב-GitHub בקובץ `UPDATE_API_KEYS.md`. Google שלח התראה על כך.

## מה צריך לעשות עכשיו:

### 1. ליצור מפתחות חדשים (חובה!)

כל המפתחות שנחשפו צריכים להיות מוחלפים:

#### Gemini API:
1. לך ל-[Google AI Studio](https://makersuite.google.com/app/apikey)
2. לחץ על "Create API Key"
3. צור מפתח חדש
4. **הסר את המפתח הישן**

#### Google Maps API:
1. לך ל-[Google Cloud Console](https://console.cloud.google.com/)
2. בחר את הפרויקט: `tour-app-478313`
3. לך ל-APIs & Services → Credentials
4. מצא את המפתח: `AIzaSyBVBUWUPDLZGnbiG0ganJAcCUZLvyZisNs`
5. לחץ על "Regenerate Key" או "Delete" ויצור חדש

#### Speech-to-Text API:
1. לך ל-[Google Cloud Console](https://console.cloud.google.com/)
2. לך ל-APIs & Services → Credentials
3. מצא את המפתח שנחשף
4. לחץ על "Regenerate Key" או "Delete" ויצור חדש

### 2. להוסיף הגבלות למפתחות החדשים

**חשוב מאוד!** הוסף הגבלות לכל מפתח:

#### Google Maps API:
1. לך ל-Credentials → בחר את המפתח
2. ב-"API restrictions" → בחר רק:
   - Places API (Text Search)
   - Places API (Place Details)
3. ב-"Application restrictions" → בחר:
   - HTTP referrers (web sites)
   - הוסף את ה-domains שלך:
     - `localhost:3000`
     - `*.vercel.app` (או domain שלך)
     - `your-domain.com`

#### Gemini API:
1. לך ל-Credentials → בחר את המפתח
2. ב-"API restrictions" → בחר רק:
   - Generative Language API
3. ב-"Application restrictions" → בחר:
   - IP addresses (אם יש לך IP קבוע)
   - או HTTP referrers עם domains שלך

### 3. לעדכן את `.env.local`

עדכן את הקובץ `frontend/.env.local` עם המפתחות החדשים:

```env
GEMINI_API_KEY="new-key-here"
GOOGLE_MAPS_API_KEY="new-key-here"
SPEECH_TO_TEXT_API_KEY="new-key-here"
```

### 4. לעדכן ב-Vercel (אם כבר פרסת)

אם כבר פרסת ל-Vercel:
1. לך ל-Project Settings → Environment Variables
2. עדכן את כל 3 המפתחות עם הערכים החדשים
3. עשה Redeploy

### 5. לבדוק שימוש חריג

1. לך ל-Google Cloud Console
2. בדוק את ה-Usage & Billing
3. ודא שאין שימוש חריג במפתחות הישנים
4. אם יש - דווח ל-Google

## מניעת בעיות בעתיד:

✅ **תמיד** שמור מפתחות ב-`.env.local` בלבד  
✅ **אל תכניס** מפתחות לקבצי markdown או תיעוד  
✅ **ודא** ש-`.env.local` ב-`.gitignore`  
✅ **הוסף הגבלות** לכל מפתח API  
✅ **בדוק** את ה-commits לפני push ל-GitHub  

## קבצים בטוחים:

- ✅ `.env.local` - לא ב-git (ב-.gitignore)
- ✅ `env.example` - מכיל רק "replace-me"
- ❌ `UPDATE_API_KEYS.md` - עודכן, לא מכיל מפתחות

## מה כבר תוקן:

- ✅ הסרתי את המפתחות מ-`UPDATE_API_KEYS.md`
- ✅ עדכנתי את הקובץ כך שלא יכיל מפתחות
- ✅ דחפתי את התיקון ל-GitHub

## צעדים הבאים:

1. ✅ יצירת מפתחות חדשים (חובה!)
2. ✅ הוספת הגבלות למפתחות
3. ✅ עדכון `.env.local`
4. ✅ עדכון Vercel (אם צריך)
5. ✅ בדיקת שימוש חריג

---

**חשוב:** גם אם הסרתי את המפתחות מה-GitHub, הם עדיין נגישים בהיסטוריית ה-commits. לכן **חובה** ליצור מפתחות חדשים!

