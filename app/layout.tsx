import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import '@/utils/remove';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export function generateMetadata() {
  return {
    title: 'Rate Now',
    description:
      '即時貨幣匯率查詢與轉換工具。Rate Now 幫你快速換算全球幣值，支援多國貨幣，自動更新匯率，換算無煩惱。',
    openGraph: {
      type: 'website',
      title: 'Rate Now',
      description:
        '即時貨幣匯率查詢與轉換工具。Rate Now 幫你快速換算全球幣值，支援多國貨幣，自動更新匯率，換算無煩惱。',
      url: 'https://rate-now.vercel.app/',
      images: [
        {
          url: 'https://rate-now.vercel.app/0.png',
          width: 1200,
          height: 630,
        },
      ],
    },
    icons: {
      icon: 'https://rate-now.vercel.ap/icon/favicon.ico',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" href="/icon/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-animated-tiles"></div>
        {children}
      </body>
    </html>
  );
}
