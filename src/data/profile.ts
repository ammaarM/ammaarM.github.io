import headshotFallback from "../assets/images/ammaar-headshot.svg";

export const profile = {
  name: "Ammaar Murshid",
  role: "Cloud & Platform Engineer",
  headshot: {
    url: "https://media.licdn.com/dms/image/v2/D4E03AQEXmnoYFvs5OQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1723628031913?e=1761782400&v=beta&t=8F-vTxYfQQ5GASHGkc58dqKEJlj7CACcOMyppw2039w",
    alt: "Portrait of Ammaar Murshid",
    width: 320,
    height: 320,
  },
  fallback: headshotFallback,
} as const;

export type Profile = typeof profile;
