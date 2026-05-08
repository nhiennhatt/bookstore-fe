import { v4 as uuidv4 } from 'uuid';

const WHITESPACE = /\s+/g;
const DIACRITICS = /\p{Diacritic}/gu;
const NON_ALPHANUMERIC = /[^a-zA-Z0-9-]/g;
const MULTIPLE_HYPHENS = /-{2,}/g;
const TRIM_HYPHENS = /^-|-$/g;

const generateFallbackString = (): string => {
  return uuidv4().substring(0, 12);
};

export const slugify = (name: string | null | undefined, maxLength: number): string => {
  if (!name || name.trim() === '') {
    return generateFallbackString();
  }

  const suffixUnique = uuidv4().substring(0, 8);
  const suffixLength = suffixUnique.length + 1;
  const availableLength = maxLength - suffixLength;

  if (availableLength < 0) {
    throw new Error("Slug length exceeds the maximum allowed length");
  }

  let slug = name.replace(WHITESPACE, '-');
  
  slug = slug.normalize('NFD').replace(DIACRITICS, '');
  
  slug = slug
    .replace(NON_ALPHANUMERIC, '')
    .replace(MULTIPLE_HYPHENS, '-')
    .replace(TRIM_HYPHENS, '')
    .toLowerCase();

  if (slug.length > availableLength) {
    slug = slug.substring(0, availableLength);
    slug = slug.replace(/-$/, '');
  }

  if (slug.length === 0) {
    return generateFallbackString();
  }

  return `${slug}-${suffixUnique}`;
};