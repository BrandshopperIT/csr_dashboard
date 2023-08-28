// @ts-nocheck
import { useSession } from 'next-auth/react';

export default function DynamicUserIdentity() {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return <div>{session.user.name}</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Not logged in</div>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
}
