import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "عن لغوي | About Lughawi" },
    ],
  }),
});

function AboutPage() {
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
        <h1 className="font-display text-3xl font-bold mb-6 text-primary">عن منصة لغوي</h1>
        <div className="prose prose-slate dark:prose-invert">
          <p className="text-lg leading-relaxed mb-4">
            لغوي (Lughawi) هي منصة ترجمة أكاديمية متخصصة تهدف إلى كسر حواجز اللغة في المجالات الدقيقة (LSP) كالقانون، الطب، التقنية، والدين.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            نحن نؤمن بأن الترجمة ليست مجرد استبدال كلمات، بل هي نقل دقيق للمعاني والسياقات. لذلك، تعتمد المنصة على معاجم موثقة عالمياً (مثل ICD-11 و Black's Law) مقترنة بأحدث تقنيات الذكاء الاصطناعي التوليدي.
          </p>
          <h2 className="font-display text-2xl font-bold mt-8 mb-4 text-primary">تواصل معنا</h2>
          <p className="text-lg leading-relaxed">
            للاستفسارات والمقترحات، يرجى التواصل مع مطور المنصة: <strong className="text-foreground">nrajmi</strong>
          </p>
        </div>
      </main>
    </div>
  );
}
