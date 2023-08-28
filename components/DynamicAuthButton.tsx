// @ts-nocheck
import { signIn, signOut, useSession } from 'next-auth/react';
import { NavDropdown } from 'react-bootstrap';

export default function DynamicAuthButton() {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return (
      <NavDropdown.Item onClick={() => signOut()}>Logout</NavDropdown.Item>
    );
  }

  if (status === 'unauthenticated') {
    return <NavDropdown.Item onClick={() => signIn()}>Login</NavDropdown.Item>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
}
