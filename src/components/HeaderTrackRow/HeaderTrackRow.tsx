import React from 'react';
import { useLocation } from 'react-router-dom';
import IconSVG from '../IconSVG/IconSVG';

const HeaderTrackRow = () => {
  const { pathname } = useLocation();
  const [type, setType] = React.useState<string>('');
  const mainDivClassName = `grid grid-cols-[1fr,0.05fr] gap-x-4 items-center text-sm pb-2 px-3 text-white/90 overflow-ellipsis fill-white/90 border-b border-neutral-600/50 mb-2 ${
    type === 'album'
      ? 'md:grid-cols-[35px,1fr,0.05fr]'
      : type === 'artist'
      ? 'md:grid-cols-[35px,1fr,0.05fr]'
      : type === 'track'
      ? 'md:grid-cols-[35px,1fr,0.05fr]'
      : 'md:grid-cols-[35px,0.7fr,0.4fr,0.05fr]'
  } ${
    type === 'album'
      ? 'xl:grid-cols-[35px,1fr,0.05fr]'
      : type === 'artist'
      ? 'xl:grid-cols-[35px,0.7fr,0.4fr,0.05fr]'
      : type === 'track'
      ? 'xl:grid-cols-[35px,0.7fr,0.4fr,0.05fr]'
      : 'xl:grid-cols-[35px,0.7fr,0.4fr,0.2fr,0.05fr]'
  }`;

  React.useEffect(() => {
    setType(pathname.split('/')[1]);
  }, []);

  return (
    <div className={mainDivClassName}>
      <p className="text-center hidden md:block">№</p>
      <p>Title</p>
      {type === 'playlist' && <p className="hidden md:block">Album</p>}
      {type !== 'album' && <p className="hidden xl:block">Date</p>}
      <IconSVG
        name="clock"
        viewBox="0 0 48 48"
        width="20"
        height="20"
        className="justify-self-center"
      />
    </div>
  );
};

export default HeaderTrackRow;
