import { useState } from 'react';
import { Scene } from './Artwork';
import manifest from './photo-manifest.json';
import type { DestinationCode } from './content';

export interface DestinationPhoto {
  src: string; smallSrc: string; width: number; height: number;
  alt: string; caption: string; position: string; title: string;
  sourceUrl: string; author: string; license: string; licenseUrl: string; changes: string;
}
export const destinationPhotos: Record<string, DestinationPhoto> = manifest;

export function SpotPhoto({ name, code }: { name: string; code: DestinationCode }) {
  const photo = destinationPhotos[name];
  const [failed, setFailed] = useState(false);
  return <div className="spot-art">
    {photo && !failed ? <img className="spot-photo" src={photo.src} srcSet={`${photo.smallSrc} 480w, ${photo.src} ${photo.width}w`} sizes="(max-width: 480px) calc(100vw - 42px), (max-width: 640px) 428px, (max-width: 900px) calc((100vw - 110px) / 3), 264px" width={photo.width} height={photo.height} alt={photo.alt} style={{objectPosition:photo.position}} loading="lazy" decoding="async" onError={() => setFailed(true)}/> : <Scene code={code} variant={name}/>}
    {photo?.caption && !failed && <span className="photo-caption">{photo.caption}</span>}
  </div>;
}

export function PhotoCredits({ names }: { names: readonly string[] }) {
  const photos = names.map(name => ({ name, photo: destinationPhotos[name] })).filter(item => item.photo);
  if (!photos.length) return null;
  return <details className="photo-credits">
    <summary>Photo credits <span aria-hidden="true">＋</span></summary>
    <div className="photo-credits-content"><p>Photographs from Wikimedia Commons. Resized and converted to WebP; cropped to fit the cards. Each photograph remains under its linked license.</p>
      <ul>{photos.map(({name,photo}) => <li key={name}>
        <strong>{name}</strong>
        <span><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.title}<span className="sr-only"> (original photo, opens in a new tab)</span></a></span>
        <span>Photo by {photo.author} · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}<span className="sr-only"> (license, opens in a new tab)</span></a></span>
        <span>{photo.changes}</span>
      </li>)}</ul>
    </div>
  </details>;
}
