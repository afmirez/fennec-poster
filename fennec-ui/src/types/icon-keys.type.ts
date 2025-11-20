export const ICON_KEYS = {
  moon: "moon",
  sun: "sun",
  globe: "globe",
} as const;

export type IconKey = keyof typeof ICON_KEYS;
