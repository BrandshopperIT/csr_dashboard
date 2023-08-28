// @ts-nocheck
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button, NavDropdown } from 'react-bootstrap';
import { BsFillGearFill } from 'react-icons/bs';

export default function SystemNavComponent() {
  const { data: session, status } = useSession();

  if (session?.roles.includes('admin')) {
    return (
      <>
        <NavDropdown title={<BsFillGearFill />} id='basic-nav-dropdown'>
          <NavDropdown.Item href='/settings'>Settings</NavDropdown.Item>
          <NavDropdown.Item href='/audit-log'>Audit Log</NavDropdown.Item>
        </NavDropdown>
      </>
    );
  }

  if (status === 'unauthenticated') {
    return <></>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
}
