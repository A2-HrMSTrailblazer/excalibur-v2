import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { badRequest } from './errors.js';
import { slugify } from './format.js';

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

/**
 * Reads a multipart/form-data request. Text fields go into `fields`,
 * the optional `image` file is saved to uploadDir as `<title>-<timestamp>.<ext>`
 * (same naming as the old multer middleware).
 */
export async function readProductForm(request, uploadDir) {
  const fields = {};
  let image = null;
  for await (const part of request.parts()) {
    if (part.type === 'file') {
      if (part.fieldname !== 'image' || !part.filename) {
        part.file.resume();
        continue;
      }
      const ext = path.extname(part.filename).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        part.file.resume();
        throw badRequest('Image must be a .jpg, .jpeg, .png, .webp or .gif file.');
      }
      image = { ext, file: part.file };
      // The title field may arrive after the file, so buffer the name decision until the end.
      const tmpName = `upload-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      await fs.promises.mkdir(uploadDir, { recursive: true });
      await pipeline(part.file, fs.createWriteStream(path.join(uploadDir, tmpName)));
      image.tmpName = tmpName;
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  let filename = null;
  if (image) {
    filename = `${slugify(fields.title)}-${Date.now()}${image.ext}`;
    await fs.promises.rename(path.join(uploadDir, image.tmpName), path.join(uploadDir, filename));
  }
  return { fields, filename };
}
