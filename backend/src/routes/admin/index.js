import { requireAdmin } from '../../plugins/auth.js';
import dashboard from './dashboard.js';
import products from './products.js';
import categories from './categories.js';
import keys from './keys.js';
import lists from './lists.js';

export default async function adminRoutes(app) {
  app.addHook('preHandler', requireAdmin);
  await app.register(dashboard);
  await app.register(products, { prefix: '/products' });
  await app.register(categories, { prefix: '/categories' });
  await app.register(keys, { prefix: '/keys' });
  await app.register(lists);
}
