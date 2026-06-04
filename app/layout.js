import './globals.css';
import AuthSessionProvider from '@/components/SessionProvider';
import CartProvider from '@/context/CartContext';
import Chrome from '@/components/Chrome';

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
            <Chrome>{children}</Chrome>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
