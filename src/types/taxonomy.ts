// Primary competition categories (immutable, system-defined)
export const PrimaryCategory = {
  AMERICAN_SMOOTH: 'AMERICAN_SMOOTH',
  AMERICAN_RHYTHM: 'AMERICAN_RHYTHM',
  INTERNATIONAL_STANDARD: 'INTERNATIONAL_STANDARD',
  INTERNATIONAL_LATIN: 'INTERNATIONAL_LATIN',
  CLUB_LATIN: 'CLUB_LATIN',
  COUNTRY_WESTERN: 'COUNTRY_WESTERN',
  ARGENTINE_TANGO: 'ARGENTINE_TANGO',
  SPECIALTY: 'SPECIALTY',
} as const;

export type PrimaryCategory = (typeof PrimaryCategory)[keyof typeof PrimaryCategory];

// Cross-cutting musical/historical groupings
export const DanceFamily = {
  SWING: 'SWING',
  LATIN: 'LATIN',
  SMOOTH: 'SMOOTH',
  RHYTHM: 'RHYTHM',
  STANDARD: 'STANDARD',
  TANGO: 'TANGO',
  COUNTRY: 'COUNTRY',
  NIGHTCLUB: 'NIGHTCLUB',
  BACHATA: 'BACHATA',
  SALSA: 'SALSA',
} as const;

export type DanceFamily = (typeof DanceFamily)[keyof typeof DanceFamily];

export type TimeSignature = '2/4' | '3/4' | '4/4' | '6/8';

export interface TempoRange {
  min: number;
  max: number;
  sweet?: number;
}
