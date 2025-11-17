# WE Trip (Monorepo Skeleton)

פרויקט חדש שמאגד את גרסת ה-MVP של WE Trip – אפליקציית מסלולי טיול קהילתית. כרגע קיימת תיקיית `frontend/` (Next.js 14). בהמשך ניתן להוסיף `backend/`, `shared/` וכו'.

## מבנה ראשוני

```
frontend/      # Next.js app, Tailwind, Firebase SDKs
docs/          # Roadmap ותיעוד זרמים עתידיים
.gitignore     # מניעת קבצים רגישים (env, node_modules, build)
README.md      # קובץ זה
```

## הגדרת סביבת פיתוח

1. התקן תלויות:
   ```bash
   cd frontend
   npm install
   ```
2. העתק את `frontend/config/env.example` לקובץ `.env.local` ועדכן את המפתחות:
   - `NEXT_PUBLIC_FIREBASE_*`
   - `GEMINI_API_KEY`
   - `GOOGLE_MAPS_API_KEY`
   - `SPEECH_TO_TEXT_API_KEY`
3. הרץ `npm run dev` מתוך `frontend/`.

## חיבור ל-GitHub

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git add .
git commit -m "chore: bootstrap we trip mvp skeleton"
git push -u origin main
```

> מומלץ להגדיר הגנה על הענף הראשי ולחבר CI (Lint/Test) כאשר יתווספו שירותים נוספים.

