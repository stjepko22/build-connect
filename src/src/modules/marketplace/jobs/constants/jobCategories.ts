export const JOB_CATEGORIES = [
  'Gradnja',
  'Renovacija',
  'Fasade',
  'Krovovi',
  'Keramika',
  'Elektro',
  'Vodoinstalacije',
  'Grijanje',
  'Stolarija',
  'Ostalo',
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];
