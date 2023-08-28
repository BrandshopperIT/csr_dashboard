// @ts-nocheck
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavDropdown } from 'react-bootstrap';
import { BsFillGearFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { DropdownSubmenu } from 'react-bootstrap-submenu';

export default function DynamicSettings() {
  const { data: session, status } = useSession();

  if (session?.roles.includes('admin')) {
    return (
      <>
        <NavDropdown.Divider />
        <DropdownSubmenu
          href='#'
          title={
            <>
              <BsFillGearFill /> System
            </>
          }
        >
          <NavDropdown.Item href='/settings'>Settings</NavDropdown.Item>
          <NavDropdown.Item href='/audit-log'>Audit Log</NavDropdown.Item>
        </DropdownSubmenu>
      </>
    );
  }
}
