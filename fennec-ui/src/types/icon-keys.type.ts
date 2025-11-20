export const ICON_KEYS = {
  moon: "moon",
  sun: "sun",
} as const;

export type IconKey = keyof typeof ICON_KEYS;
