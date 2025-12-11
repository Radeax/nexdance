// Colors extracted from mockup
export const DANCE_STYLE_COLORS: Record<string, string> = {
  // American Rhythm
  'cha-cha': '#f97316', // Orange
  rumba: '#ec4899', // Pink
  'east-coast-swing': '#3b82f6', // Blue
  bolero: '#8b5cf6', // Purple
  mambo: '#ef4444', // Red

  // American Smooth
  waltz: '#8b5cf6', // Purple
  tango: '#ef4444', // Red
  foxtrot: '#22c55e', // Green
  'viennese-waltz': '#a855f7', // Violet

  // International Latin
  'intl-cha-cha-cha': '#f97316', // Orange
  samba: '#22c55e', // Green
  'intl-rumba': '#ec4899', // Pink
  'paso-doble': '#ef4444', // Red
  jive: '#3b82f6', // Blue

  // International Standard
  'intl-waltz': '#8b5cf6', // Purple
  'intl-tango': '#ef4444', // Red
  'slow-foxtrot': '#22c55e', // Green
  'intl-viennese-waltz': '#a855f7', // Violet
  quickstep: '#06b6d4', // Cyan

  // Club/Social Latin
  salsa: '#ef4444', // Red
  bachata: '#ec4899', // Pink
  merengue: '#f97316', // Orange
  cumbia: '#eab308', // Yellow
  zouk: '#8b5cf6', // Purple
  kizomba: '#6366f1', // Indigo
  reggaeton: '#22c55e', // Green

  // Country Western
  'country-two-step': '#f97316', // Orange
  'country-waltz': '#8b5cf6', // Purple
  'country-cha-cha': '#f97316', // Orange
  'country-swing': '#3b82f6', // Blue

  // Argentine Tango
  'argentine-tango': '#ef4444', // Red
  vals: '#8b5cf6', // Purple
  milonga: '#f97316', // Orange

  // Specialty
  'west-coast-swing': '#3b82f6', // Blue
  hustle: '#06b6d4', // Cyan
  'nightclub-two-step': '#8b5cf6', // Purple
};

// Fallback color for unknown styles
export const DEFAULT_DANCE_COLOR = '#94a3b8'; // Slate

export function getDanceColor(styleId: string): string {
  return DANCE_STYLE_COLORS[styleId] || DEFAULT_DANCE_COLOR;
}
