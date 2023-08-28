'use client';
import { SessionProvider } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';

// export const metadata = {
//   title: 'Brandshopper Customer Service Dashboard',
//   description:
//     'Dashboard for customer service operations internally at Brandshopper.',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
