import { badRequest } from './errors.js';

/** Validates the text fields of the add/edit product form. */
export function parseProductFields(fields) {
  const title = String(fields.title ?? '').trim();
  if (!title) throw badRequest('Product name is required.');
  if (title.length > 150) throw badRequest('Product name is too long.');

  const price = Number(fields.price);
  if (!Number.isFinite(price) || price < 0) throw badRequest('Price must be a number of 0 or more.');

  const releaseDate = fields.release_date ? String(fields.release_date) : null;
  if (releaseDate && Number.isNaN(Date.parse(releaseDate))) throw badRequest('Release date is not valid.');

  const categoryId = fields.category_id ? Number.parseInt(fields.category_id, 10) : null;
  if (fields.category_id && !Number.isInteger(categoryId)) throw badRequest('Category is not valid.');

  return {
    title,
    price: Math.round(price * 100) / 100,
    releaseDate,
    description: fields.description ? String(fields.description) : null,
    categoryId,
  };
}
