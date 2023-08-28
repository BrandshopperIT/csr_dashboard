import { SessionProvider } from 'next-auth/react';
import RootLayout from './layout';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';

import { ComponentType } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: ComponentType<any>;
  pageProps: any; // You can specify the type for pageProps here if possible
}) {
  return (
    <SessionProvider session={session}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}
