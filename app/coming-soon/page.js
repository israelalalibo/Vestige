import Image from 'next/image';
import PasscodeForm from '@/components/PasscodeForm';
import NewsletterForm from '@/components/NewsletterForm';

export const metadata = {
  title: 'Vestige — Launching Soon',
  description: 'Premium streetwear designed to outlast every season. Launching July 2026.',
};

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden px-6">
      {/* Background */}
      <Image
        src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1600&q=85"
        alt=""
        fill
        priority
        className="object-cover object-top -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-black/70" />

      <div className="max-w-lg w-full">
        <p className="text-[10px] tracking-[0.35em] uppercase mb-4 opacity-70">Drop 01 — Coming Soon</p>
        <h1 className="font-display text-6xl sm:text-7xl font-light tracking-[0.15em] uppercase mb-5">Vestige</h1>
        <p className="text-sm opacity-80 leading-relaxed max-w-sm mx-auto mb-2">
          Premium streetwear designed to outlast every season.
        </p>
        <p className="text-xs tracking-[0.3em] uppercase text-vestige-accent mb-10">Launching July 2026</p>

        {/* Passcode gate */}
        <div className="mb-10">
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">Have early access?</p>
          <PasscodeForm />
        </div>

        {/* Newsletter — collect leads before launch */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">Be the first to know</p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
