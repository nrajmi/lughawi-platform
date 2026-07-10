import React, { useState, useMemo } from 'react';
import { RELIGIOUS_GLOSSARY } from '@/lib/dictionaries';
import { TECH_GLOSSARY } from '@/lib/dictionaries';
import { MEDICAL_GLOSSARY } from '@/lib/dictionaries';
import { LEGAL_GLOSSARY } from '@/lib/dictionaries';
import { cn } from '@/lib/utils';
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

type CardDomain = 'religious' | 'tech' | 'medical' | 'legal';

interface FlashCard {
  id: string;
  front: string;         // Arabic term
  back: string;          // Preferred English
  pronunciation?: string; // Transliteration
  source?: string;       // Scholarly source
  domain: CardDomain;
  domainIcon: string;
}

interface AcademicFlashcardsProps {
  isRTL: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function AcademicFlashcards({ isRTL }: AcademicFlashcardsProps) {
  const [activeDomain, setActiveDomain] = useState<CardDomain>('religious');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deck, setDeck] = useState<FlashCard[] | null>(null);

  // Build cards from glossaries
  const allCards = useMemo<Record<CardDomain, FlashCard[]>>(() => {
    const religious: FlashCard[] = RELIGIOUS_GLOSSARY.slice(0, 40).map(g => ({
      id: `rel-${g.arabic}`,
      front: g.arabic,
      back: g.preferred_en,
      pronunciation: g.transliteration,
      source: g.scholarly_source,
      domain: 'religious',
      domainIcon: '☽',
    }));

    const tech: FlashCard[] = TECH_GLOSSARY.slice(0, 40).map(g => ({
      id: `tech-${g.english}`,
      front: g.arabic,
      back: g.english,
      source: g.industry_standard,
      domain: 'tech',
      domainIcon: '⌨',
    }));

    const medical: FlashCard[] = MEDICAL_GLOSSARY.slice(0, 40).map(g => ({
      id: `med-${g.english}`,
      front: g.arabic,
      back: g.english,
      source: g.who_standard,
      domain: 'medical',
      domainIcon: '⚕',
    }));

    const legal: FlashCard[] = LEGAL_GLOSSARY.slice(0, 40).map(g => ({
      id: `leg-${g.english}`,
      front: g.arabic,
      back: g.english,
      source: g.legal_source,
      domain: 'legal',
      domainIcon: '⚖',
    }));

    return { religious, tech, medical, legal };
  }, []);

  const currentDeck = useMemo(() => {
    return deck ?? allCards[activeDomain];
  }, [deck, allCards, activeDomain]);

  const currentCard = currentDeck[currentIndex];

  const handleDomainChange = (d: CardDomain) => {
    setActiveDomain(d);
    setDeck(null);
    setCurrentIndex(0);
    setFlipped(false);
  };

  const next = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex(i => (i + 1) % currentDeck.length), 150);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex(i => (i - 1 + currentDeck.length) % currentDeck.length), 150);
  };

  const handleShuffle = () => {
    setDeck(shuffleArray(allCards[activeDomain]));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const handleReset = () => {
    setDeck(null);
    setCurrentIndex(0);
    setFlipped(false);
  };

  const domainConfig: Record<CardDomain, { label: string; color: string; borderColor: string; bgFront: string; bgBack: string }> = {
    religious: {
      label: isRTL ? 'ديني' : 'Religious',
      color: 'text-amber-700 dark:text-amber-400',
      borderColor: 'border-amber-300 dark:border-amber-700',
      bgFront: 'bg-amber-50 dark:bg-amber-900/20',
      bgBack: 'bg-amber-100/80 dark:bg-amber-900/40',
    },
    tech: {
      label: isRTL ? 'تقني' : 'Technical',
      color: 'text-cyan-700 dark:text-cyan-400',
      borderColor: 'border-cyan-300 dark:border-cyan-700',
      bgFront: 'bg-cyan-50 dark:bg-cyan-900/20',
      bgBack: 'bg-cyan-100/80 dark:bg-cyan-900/40',
    },
    medical: {
      label: isRTL ? 'طبي' : 'Medical',
      color: 'text-emerald-700 dark:text-emerald-400',
      borderColor: 'border-emerald-300 dark:border-emerald-700',
      bgFront: 'bg-emerald-50 dark:bg-emerald-900/20',
      bgBack: 'bg-emerald-100/80 dark:bg-emerald-900/40',
    },
    legal: {
      label: isRTL ? 'قانوني' : 'Legal',
      color: 'text-stone-700 dark:text-stone-400',
      borderColor: 'border-stone-400 dark:border-stone-600',
      bgFront: 'bg-stone-50 dark:bg-stone-900/20',
      bgBack: 'bg-stone-100/80 dark:bg-stone-900/40',
    },
  };

  const cfg = domainConfig[activeDomain];

  return (
    <div className="space-y-5">
      {/* Domain selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(domainConfig) as CardDomain[]).map(d => (
          <button
            key={d}
            onClick={() => handleDomainChange(d)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded border text-[12px] font-semibold transition-all',
              activeDomain === d
                ? `bg-primary text-primary-foreground border-primary shadow-sm`
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
          >
            <span>{({ religious: '☽', tech: '⌨', medical: '⚕', legal: '⚖' } as const)[d]}</span>
            {domainConfig[d].label}
            <span className="text-[10px] opacity-70">({allCards[d].length})</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / currentDeck.length) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">
          {currentIndex + 1} / {currentDeck.length}
        </span>
      </div>

      {/* Flip Card */}
      {currentCard && (
        <div className="flex justify-center">
          <div
            className="flashcard-container cursor-pointer select-none"
            onClick={() => setFlipped(f => !f)}
            role="button"
            aria-label={isRTL ? 'اضغط لقلب البطاقة' : 'Click to flip card'}
          >
            <div className={cn('flashcard-inner', flipped && 'flashcard-flipped')}>
              {/* Front — Arabic term */}
              <div className={cn('flashcard-face flashcard-front', cfg.bgFront, cfg.borderColor)}>
                <div className={cn('text-2xl mb-3 leading-none', cfg.color)}>
                  {currentCard.domainIcon}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium">
                  {cfg.label} · {isRTL ? 'عربي' : 'Arabic'}
                </p>
                <p className="font-arabic text-3xl font-bold text-foreground text-center leading-relaxed mb-2" dir="rtl">
                  {currentCard.front}
                </p>
                {currentCard.pronunciation && (
                  <p className="text-xs text-muted-foreground font-mono italic mt-2">
                    [{currentCard.pronunciation}]
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground/50 mt-4 absolute bottom-4">
                  {isRTL ? '← انقر للكشف' : 'Click to reveal →'}
                </p>
              </div>

              {/* Back — English term */}
              <div className={cn('flashcard-face flashcard-back', cfg.bgBack, cfg.borderColor)}>
                <div className={cn('text-2xl mb-3 leading-none', cfg.color)}>
                  {currentCard.domainIcon}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium">
                  {cfg.label} · English
                </p>
                <p className="text-2xl font-bold text-foreground text-center leading-snug mb-2">
                  {currentCard.back}
                </p>
                {currentCard.source && (
                  <div className="mt-3 px-3 py-1.5 rounded border border-border bg-card/80 text-[10px] text-muted-foreground text-center max-w-[280px]">
                    <span className="font-semibold text-foreground">{isRTL ? 'المصدر:' : 'Source:'}</span>{' '}
                    {currentCard.source}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground/50 mt-4 absolute bottom-4">
                  {isRTL ? '← انقر للعودة' : 'Click to flip back →'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prev}
          className="flex items-center gap-1 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          {isRTL ? 'السابق' : 'Prev'}
        </button>

        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-[12px]"
          title={isRTL ? 'خلط البطاقات' : 'Shuffle cards'}
        >
          <Shuffle className="h-3.5 w-3.5" />
          {isRTL ? 'خلط' : 'Shuffle'}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-[12px]"
          title={isRTL ? 'إعادة التشغيل' : 'Reset'}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {isRTL ? 'إعادة' : 'Reset'}
        </button>

        <button
          onClick={next}
          className="flex items-center gap-1 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm"
        >
          {isRTL ? 'التالي' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-[10px] text-muted-foreground/50">
        {isRTL ? 'اضغط على البطاقة للكشف عن الإجابة' : 'Click the card to reveal the answer'}
      </p>
    </div>
  );
}
