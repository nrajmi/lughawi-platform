import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "شروط الاستخدام | Terms of Use" },
    ],
  }),
});

function TermsPage() {
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
        <h1 className="font-display text-3xl font-bold mb-6 text-primary">شروط الاستخدام</h1>
        <div className="prose prose-slate dark:prose-invert">
          <p className="text-lg leading-relaxed mb-4">
            باستخدامك لمنصة لغوي، فإنك توافق على الشروط الآتية:
          </p>
          <ul className="list-disc ps-5 space-y-2 text-lg">
            <li><strong>الاستخدام الأكاديمي:</strong> المنصة مخصصة للترجمة السياقية المتخصصة. يُمنع استخدامها في إغراق الخوادم بطلبات عشوائية (Spam).</li>
            <li><strong>المسؤولية الطبية والقانونية:</strong> رغم اعتمادنا على معاجم رصينة، الترجمات الطبية والقانونية مُقدمة بغرض الإرشاد ولا تغني عن الاستشارة التخصصية الرسمية.</li>
            <li><strong>حدود الاستخدام:</strong> نحتفظ بالحق في تقييد الوصول مؤقتاً في حال استنفاد الحصص المخصصة لـ API بغرض الحفاظ على جودة الخدمة لجميع المستخدمين.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
