import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { play } from '@/api/spotify';
import { usePlayer } from '@/contexts/player';
import { TrackRowProps } from '@/types/interface';
import dateFormated from '@/utils/dateFormated';
import millisecondsToMinutesAndSeconds from '@/utils/millisecondsToMinutesAndSeconds';
import unknown from '@/assets/unknown.svg';

const TrackRow: React.FC<TrackRowProps> = ({ added_at, track, nubmer, id, additionalType }) => {
  const { pathname } = useLocation();
  const { player } = usePlayer();
  const [type, setType] = React.useState<string>('');
  const [isActive, setIsActive] = React.useState<boolean>();

  const mainDivClassName = `grid grid-cols-[1fr,0.05fr] gap-x-4 items-center text-sm hover:bg-gray-600 hover:bg-opacity-20 p-2 px-3 rounded-lg text-neutral-400 overflow-ellipsis ${
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

  async function playTrack(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).tagName !== 'A' && id) {
      await play(id, nubmer, additionalType ? additionalType : type);
    }
  }

  React.useEffect(() => {
    setType(pathname.split('/')[1]);
  }, []);

  React.useEffect(() => {
    if (player?.track_window?.current_track?.name === track?.name) {
      setIsActive(true);
    } else setIsActive(false);
  }, [player?.track_window?.current_track?.name]);

  return (
    <div onClick={(e) => playTrack(e)} className={mainDivClassName}>
      <div className="text-center hidden md:block">{type === 'track' ? 1 : nubmer + 1}</div>
      <div className="flex min-w-[180px] max-w-md">
        {type === 'playlist' && track && 'album' in track && (
          <img
            className="w-12 h-12 mr-4 rounded-lg"
            src={track?.album?.images[0]?.url ? track?.album.images[0].url : unknown}
            alt=""
          />
        )}
        <div className="flex flex-col justify-between truncate overflow-ellipsis ">
          <h3
            className={`${
              isActive ? 'text-sky-400' : 'text-white'
            } text-base truncate overflow-ellipsis`}
          >
            {track?.name}
          </h3>
          <div className="truncate overflow-ellipsis ">
            {track?.artists.map((el: any) => {
              return (
                <Link
                  className="hover:underline text-xs"
                  to={`/artist/${el.uri?.split(':')[2]}`}
                  key={el.name}
                >{`${el.name}  `}</Link>
              );
            })}
          </div>
        </div>
      </div>
      {type === 'playlist' && track && 'album' in track && (
        <div className="hidden md:block min-w-[150px] max-w-[320px] whitespace-nowrap truncate overflow-ellipsis">
          {track?.album?.name}
        </div>
      )}
      {type !== 'album' && <div className="hidden xl:block">{dateFormated(added_at)}</div>}
      <div className="text-center">
        {track && millisecondsToMinutesAndSeconds(track.duration_ms)}
      </div>
    </div>
  );
};

export default TrackRow;
