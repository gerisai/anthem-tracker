'use client';

import { useSession } from 'next-auth/react';
import { canCreate, canModify } from '@/lib/permissions';

// Renders children only for logged-in users. With `editor`, only for users who can
// create services and songs; with `ownerId`, only for users who can modify that
// owner's service. The API enforces the same rules (lib/permissions.ts).
export default function AuthCheck({ children, editor, ownerId }: {
  children: React.ReactNode,
  editor?: boolean,
  ownerId?: string
}) {
  const { data: session, status } = useSession();

  if (status !== 'authenticated') {
    return <></>;
  }
  if (editor && !canCreate(session.user)) {
    return <></>;
  }
  if (ownerId !== undefined && !canModify(session.user, ownerId)) {
    return <></>;
  }

  return <>{children}</>;
}
