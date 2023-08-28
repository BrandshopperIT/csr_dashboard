'use client';
import UnauthorizedComponent from '@/components/UnauthorizedComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
// import NavbarComponent from '../Navbar';
import Header from '@/components/header';

export default function Page() {
  return (
    <>
      <Header />
      <UnauthorizedComponent />
    </>
  );
}
