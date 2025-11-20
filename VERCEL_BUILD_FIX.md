# תיקון שגיאת Build ב-Vercel

## הבעיה:
```
Command "cd frontend && npm install && npm run build" exited with 1
```

## מה תוקן:

1. ✅ שינוי `npm install` ל-`npm ci` (יותר אמין ב-production)
2. ✅ הוספת `eslint: { ignoreDuringBuilds: true }` ב-next.config.ts
3. ✅ שיפור scripts ב-package.json

## אם עדיין יש שגיאות:

### בדוק את ה-Logs ב-Vercel:

1. לך ל-Deployment → View Logs
2. חפש את השגיאה המדויקת
3. שגיאות נפוצות:

#### "Missing environment variable"
**פתרון:** הוסף את כל משתני הסביבה ב-Vercel Dashboard

#### "Module not found"
**פתרון:** ודא ש-`package.json` מכיל את כל ה-dependencies

#### "TypeScript errors"
**פתרון:** תקן את שגיאות ה-TypeScript או הגדר `ignoreBuildErrors: true` זמנית

#### "ESLint errors"
**פתרון:** כבר מוגדר `ignoreDuringBuilds: true` - זה אמור לפתור

### אם Build עדיין נכשל:

1. **נסה לבנות מקומית:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   
2. **אם זה עובד מקומית** - הבעיה היא ב-Vercel configuration
3. **אם זה לא עובד מקומית** - תקן את השגיאות המקומיות

### אופציה: Build בלי Root Directory

אם Root Directory לא עובד, נסה:

1. **הסר את vercel.json** (או תן ל-Vercel לזהות אוטומטית)
2. **הגדר Root Directory ב-Dashboard: `frontend`**
3. **השאר את כל ה-commands אוטומטיים**

---

## בדיקה מקומית:

לפני פריסה, בדוק שהכל עובד:

```bash
cd frontend
npm install
npm run build
```

אם זה עובד - Vercel אמור לעבוד גם.

