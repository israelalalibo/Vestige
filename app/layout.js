import './globals.css';
import AuthSessionProvider from '@/components/SessionProvider';
import CartProvider from '@/context/CartContext';
import Chrome from '@/components/Chrome';
import VisitTracker from '@/components/VisitTracker';

export const metadata = {
  title: 'Vestige — Clothing',
  description: 'Timeless pieces for the modern wardrobe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <CartProvider>
            <VisitTracker />
            <Chrome>{children}</Chrome>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
