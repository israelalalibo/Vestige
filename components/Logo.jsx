import Image from 'next/image';

// The source logo is black script on a white background. We drop the white
// using CSS blend modes so it sits cleanly on either surface:
//   tone="light" → multiply (white vanishes on light backgrounds)
//   tone="dark"  → invert + screen (renders white on dark backgrounds)
export default function Logo({ tone = 'light', className = 'h-9 w-auto', priority = false }) {
  const blend = tone === 'dark' ? 'invert mix-blend-screen' : 'mix-blend-multiply';
  return (
    <Image
      src="/logo.png"
      alt="Vestige"
      width={1004}
      height={489}
      priority={priority}
      className={`${className} ${blend}`}
    />
  );
}
