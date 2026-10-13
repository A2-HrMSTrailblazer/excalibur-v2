import { forbidden, unauthorized } from '../lib/errors.js';

export const currentUser = (request) => request.session.get('user') ?? null;

export async function requireUser(request) {
  if (!currentUser(request)) throw unauthorized();
}

export async function requireAdmin(request) {
  const user = currentUser(request);
  if (!user) throw unauthorized();
  if (user.role !== 'admin') throw forbidden();
}
