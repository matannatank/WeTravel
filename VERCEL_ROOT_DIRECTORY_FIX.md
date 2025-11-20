# תיקון שגיאת Root Directory ב-Vercel

## הבעיה:
```
No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies".
```

זה קורה כי Vercel מחפש את `package.json` ב-root, אבל הוא נמצא ב-`frontend/`.

## הפתרון - הגדרת Root Directory:

### שלב 1: לך ל-Vercel Dashboard

1. לך ל-[vercel.com](https://vercel.com)
2. התחבר
3. בחר את הפרויקט שלך (או צור חדש)

### שלב 2: הגדר Root Directory

**אם אתה יוצר פרויקט חדש:**
1. אחרי בחירת ה-repository `matannatank/WeTravel`
2. לחץ על **"Configure Project"** (לא "Deploy" ישירות!)
3. גלול למטה ל-**"Root Directory"**
4. לחץ על **"Edit"** או **"Set"**
5. הזן: `frontend`
6. לחץ על **"Continue"** או **"Deploy"**

**אם הפרויקט כבר קיים:**
1. לך ל-**Project Settings** (⚙️)
2. לך ל-**General**
3. גלול למטה ל-**"Root Directory"**
4. לחץ על **"Edit"**
5. הזן: `frontend`
6. לחץ על **"Save"**
7. לך ל-**Deployments** ולחץ על **"Redeploy"** על ה-deployment האחרון

### שלב 3: ודא שההגדרות נכונות

אחרי הגדרת Root Directory, Vercel אמור לזהות אוטומטית:
- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

### שלב 4: Deploy

לחץ על **"Deploy"** או **"Redeploy"**

---

## אם Root Directory לא מופיע:

אם אתה לא רואה את האפשרות "Root Directory":

1. **לך ל-Project Settings → General**
2. **גלול למטה**
3. **אם אתה לא רואה "Root Directory"** - זה אומר שהפרויקט כבר מוגדר
4. **נסה למחוק את הפרויקט וליצור מחדש** עם Root Directory

---

## דרך חלופית - Vercel CLI:

אם Dashboard לא עובד, נסה דרך CLI:

```bash
# התקן Vercel CLI
npm i -g vercel

# התחבר
vercel login

# פרוס מתוך תיקיית frontend
cd frontend
vercel

# כששואל "What's your project's root directory?"
# תשובה: . (נקודה - התיקייה הנוכחית)
```

---

## בדיקה שהכל תקין:

אחרי הפריסה, בדוק:
1. ✅ Build עבר בהצלחה
2. ✅ האפליקציה נטענת
3. ✅ אין שגיאות ב-Logs

---

## אם עדיין לא עובד:

1. **מחק את הפרויקט ב-Vercel**
2. **צור פרויקט חדש**
3. **בחר את ה-repository**
4. **לפני Deploy - לחץ על "Configure Project"**
5. **הגדר Root Directory: `frontend`**
6. **Deploy**

---

**הערה:** Root Directory חייב להיות `frontend` (בדיוק ככה, ללא `/` בהתחלה).

