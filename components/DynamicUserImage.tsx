// @ts-nocheck
import { useSession } from 'next-auth/react';
import Image from 'react-bootstrap/Image';
import Avatar from '@mui/material/Avatar';

export default function DynamicUserImage() {
  const { data: session, status } = useSession();

  if (status === 'authenticated' && session.user.image === null) {
    return <a>{session.user.name}</a>;
  }

  if (status === 'authenticated' && session.user.image !== null) {
    return (
      <Avatar
        alt={session?.user.name}
        src={session?.user.image}
        sx={{ width: 24, height: 24 }}
      />
    );
  }

  if (status === 'unauthenticated') {
    return <div>Not logged in</div>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
}
