'use client';

export default function NewsletterForm() {
  return (
    <form className="flex max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 bg-transparent border border-gray-600 px-4 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
      />
      <button
        type="submit"
        className="bg-vestige-accent text-vestige-black px-6 py-3.5 text-xs tracking-widest uppercase font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
      >
        Join
      </button>
    </form>
  );
}
