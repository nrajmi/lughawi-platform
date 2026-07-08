import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | Privacy Policy" },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="classic-navbar sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-5 h-[60px] flex items-center justify-between">
          <Link to="/" className="font-display font-bold tracking-tight hover:opacity-80 transition-opacity">
            العودة للمترجم
          </Link>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-3xl font-bold mb-6 text-primary">سياسة الخصوصية</h1>
        <div className="prose prose-slate dark:prose-invert">
          <p className="text-lg leading-relaxed mb-4">
            تلتزم منصة لغوي بأعلى معايير الخصوصية لحماية بيانات مستخدميها.
          </p>
          <ul className="list-disc ps-5 space-y-2 text-lg">
            <li><strong>تشفير البيانات:</strong> يتم تشفير سجل الترجمة الخاص بك وحفظه محلياً في متصفحك (Client-side) فقط.</li>
            <li><strong>خصوصية النصوص:</strong> النصوص المدخلة لا تُحفظ في قواعد بياناتنا، وتُرسل مباشرة عبر خوادمنا الآمنة إلى نماذج الذكاء الاصطناعي بغرض الترجمة فقط.</li>
            <li><strong>عدم تتبع الهوية:</strong> المنصة لا تستخدم ملفات تعريف الارتباط التتبعية (Tracking Cookies) لأغراض إعلانية.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
