import type { Role } from '@prisma/client';

// Who can change what. Shared by the API routes and the UI, so it must stay
// free of server-only imports.
interface Actor {
  id: string;
  role: Role;
}

// Create services and songs
export const canCreate = (user?: Actor | null) =>
  user?.role === 'editor' || user?.role === 'admin';

// Edit or delete a service owned by ownerId
export const canModify = (user: Actor | null | undefined, ownerId: string) =>
  user?.role === 'admin' || (user?.role === 'editor' && user.id === ownerId);
