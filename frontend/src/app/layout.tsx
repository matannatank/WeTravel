import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WE Trip • מסלולי טיול קהילתיים",
  description: "בנו, שתפו וגילו מסלולי טיול עשירים בעברית אחת ולתמיד.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${assistant.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    WE Trip
                  </p>
                  <p className="text-lg font-bold">
                    מסלולי טיול חכמים בקהילה פתוחה
                  </p>
                </div>
                <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
                  <a href="#vision" className="hover:text-indigo-600">
                    למה WE Trip
                  </a>
                  <a href="#features" className="hover:text-indigo-600">
                    פיצ׳רי MVP
                  </a>
                  <a href="#roadmap" className="hover:text-indigo-600">
                    שלבי המשך
                  </a>
                  <a href="/dashboard" className="text-indigo-600">
                    לוח בקרה
                  </a>
                </nav>
              </div>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
              {children}
            </main>
            <footer className="border-t border-slate-200 bg-white/80">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <span>© {new Date().getFullYear()} WE Trip.</span>
                <span>גרסת MVP - תכנון ופיתוח בענן.</span>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
