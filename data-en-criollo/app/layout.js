import { Playfair_Display, DM_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal'],
  variable: '--font-dm-mono',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  display: 'swap',
});

export const metadata = {
  title: 'Data en Criollo',
  description: 'Data en Criollo — periodismo de datos en argentino',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dmMono.variable} ${sourceSerif.variable}`}
    >
      <body
        style={{
          backgroundColor: '#E9E4D8',
          color: '#1A1A18',
          fontFamily: 'var(--font-source-serif), Georgia, serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
