'use client';
import { useSession, signIn } from 'next-auth/react';
import DashboardMenuCards from '../components/DashboardCards';
import SpinnerComponent from '@/components/SpinnerComponent';
import UnauthorizedComponent from '@/components/UnauthorizedComponent';
import Header from '@/components/header';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <SpinnerComponent />;
  }

  if (status === 'unauthenticated') {
    signIn('azure-ad');
  }

  if (status === 'authenticated') {
    return (
      <>
        <Header />
        <DashboardMenuCards />
      </>
    );
  }

  return <UnauthorizedComponent />;
}
