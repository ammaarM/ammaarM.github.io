import headshotFallback from "../assets/images/1723628031938.jpeg";

export const profile = {
  name: "Ammaar Murshid",
  role: "Cloud & Platform Engineer",
  headshot: {
    url: headshotFallback.src,
    alt: "Portrait of Ammaar Murshid",
    width: 320,
    height: 320,
  },
  fallback: headshotFallback,
} as const;

export type Profile = typeof profile;
