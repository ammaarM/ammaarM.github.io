import site from '@content/site.json';
import { useMemo, useState } from 'react';

const SIZES = [128, 192, 256, 384, 512];
const LOCAL_AVATAR_PATH = '/avatar.jpg';
const fallbackInitial = site.name.replace(/[^A-Za-z0-9]/g, '').charAt(0).toUpperCase() || '?';
const FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-label="${site.name} placeholder"><defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23c4b5fd"/><stop offset="100%" stop-color="%2394a3b8"/></linearGradient></defs><rect width="160" height="160" rx="80" fill="url(%23grad)"/><text x="50%" y="54%" font-family="'Inter', 'Segoe UI', sans-serif" font-size="64" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="middle">${fallbackInitial}</text></svg>`);

export function Avatar() {
  const photo = '{{YOUR_LINKEDIN_PHOTO_URL}}';
  const remotePhoto = photo.includes('{{') ? undefined : photo;
  const sources = useMemo(() => {
    const list: string[] = [];
    if (remotePhoto) {
      list.push(remotePhoto);
    }
    list.push(LOCAL_AVATAR_PATH);
    return list;
  }, [remotePhoto]);

  const [sourceIndex, setSourceIndex] = useState(0);

  const activeSrc = sources[sourceIndex] ?? FALLBACK_SVG;
  const activeSrcSet = remotePhoto && sourceIndex === 0
    ? SIZES.map((size) => `${remotePhoto}${remotePhoto.includes('?') ? '&' : '?'}w=${size} ${size}w`).join(', ')
    : undefined;

  return (
    <img
      src={activeSrc}
      srcSet={activeSrcSet}
      sizes="(max-width: 768px) 128px, 256px"
      alt={`${site.name} portrait`}
      loading="lazy"
      decoding="async"
      onError={() => {
        setSourceIndex((previous) => {
          if (previous + 1 <= sources.length) {
            return previous + 1;
          }
          return previous;
        });
      }}
      className="h-40 w-40 rounded-full border-4 border-[hsl(var(--background))] object-cover shadow-xl"
    />
  );
}
