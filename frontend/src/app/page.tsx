const featureCards = [
  {
    title: "ייבוא רשימות מגוגל מפות",
    description:
      "העלו רשימה שמורה, סדרו לימים ואזנו את התוכן בעזרת Gemini כדי לקבל מסלול מאושר ומדויק.",
  },
  {
    title: "AI + דיבור לטקסט",
    description:
      "ספרו בקול או כתבו ביומן חופשי – הבינה המלאכותית תזהה מקומות, תוודא אותם מול Google Maps ותציע השלמות.",
  },
  {
    title: "קהילה פתוחה",
    description:
      "מסלולים גלויים, דירוגים, המלצות והעתקת מסלולים בלחיצה. הכל בעברית, לכולם.",
  },
];

const roadmap = [
  "שלב 1: חיבור Firebase, פרופילים ומסלולים ידניים.",
  "שלב 2: עורך מסלול, מועדפים ודירוגים.",
  "שלב 3: אינטגרציית Gemini + Speech-to-Text.",
  "שלב 4: ייבוא רשימות Google Maps והכנסת עלויות לפי אזור.",
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section id="vision" className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase text-indigo-500">
          מסע חדש למטיילים
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-[1.4] text-slate-900 md:text-4xl">
          WE Trip – פלטפורמה קהילתית ליצירה ושיתוף מסלולי טיול עשירים בעברית
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          האפליקציה מאחדת טיולים אישיים, רשימות Google Maps ותובנות בינה מלאכותית
          למסלול אחיד, מאושר ונגיש לכלל הקהילה. המטרה: לצמצם בלגן בקבצים,
          לאפשר ניווט נוח בין ימים ואזורים, ולהציג עלויות משוערות לכל חלק בטיול.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-600">
            רספונסיבי מלא
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
            קהילתי וחינמי
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">
            תמיכה בדיבור לטקסט
          </span>
        </div>
      </section>

      <section
        id="features"
        className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-10"
      >
        {featureCards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section
        id="roadmap"
        className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-500 p-8 text-white"
      >
        <h2 className="text-2xl font-bold">שלבי הפיתוח הבאים</h2>
        <p className="mt-3 text-indigo-100">
          אלו הפעימות שנבצע אחרי הקמה: נתעדף חוויית משתמש, נתונים משותפים
          ואינטגרציות ענן.
        </p>
        <ol className="mt-6 space-y-3 text-sm leading-6">
          {roadmap.map((item, index) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
