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
    description: 'description',
    openGraph: {
      type: 'website',
      title: 'Rate Now',
      description: 'description',
      url: 'https://rate-now.vercel.app/',
      images: [
        {
          url: 'https://rate-now.vercel.app/image.jpg',
          width: 1200,
          height: 630,
        },
      ],
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
