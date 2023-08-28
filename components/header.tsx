// @ts-nocheck
'use client';
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { MenuItem } from 'primereact/menuitem';
import 'primeicons/primeicons.css';
import DynamicUserImage from './DynamicUserImage';
import DynamicUserIdentity from './DynamicUserIdentity';
import { Container } from 'react-bootstrap';
import styles from './styles/Header.module.css';

export default function Header() {
  const items: MenuItem[] = [
    {
      label: 'Unresolved Open Accounts',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/unres',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/unres/archived',
        },
      ],
    },
    {
      label: 'CC Sheet',
      icon: 'pi pi-fw pi-credit-card',
      url: '/ccsheet',
    },
    {
      label: 'Refund Sheet',
      icon: 'pi pi-fw pi-dollar',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/refund',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/refund/archived',
        },
      ],
    },
    {
      label: 'Tracer Request',
      icon: 'pi pi-fw pi-map-marker',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/tracer',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/tracer/archived',
        },
      ],
    },
    {
      label: 'Replacements Sent',
      icon: 'pi pi-fw pi-truck',
      items: [
        {
          label: 'Open',
          icon: 'pi pi-fw pi-folder-open',
          url: '/replacement',
        },
        {
          label: 'Closed',
          icon: 'pi pi-fw pi-folder',
          url: '/replacement/archived',
        },
      ],
    },
    {
      label: <DynamicUserIdentity />,
      icon: <DynamicUserImage />,
      items: [
        {
          label: 'System',
          icon: 'pi pi-fw pi-cog',
          items: [
            {
              label: 'Settings',
              icon: 'pi pi-fw pi-pencil',
              url: '/settings',
            },
            {
              label: 'Audit Log',
              icon: 'pi pi-fw pi-book',
              url: '/audit-log',
            },
          ],
        },
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-sign-out',
          url: '/api/auth/signout',
        },
      ],
    },
  ];

  const start = (
    <a href='/'>
      <img alt='' src='/brandshopper-logo2png.png' className='mr-2'></img>
    </a>
  );

  return (
    <Container className={styles.container}>
      <a href='/'>
        <img src='/brandshopper-logo.svg' className={styles.logo}></img>
      </a>

      <div className='card'>
        <Menubar model={items} />
      </div>
    </Container>
  );
}
