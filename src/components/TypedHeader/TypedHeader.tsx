import React from 'react';
import secondsToTime from '@/utils/secondsToTime';
import { TypedHeaderType } from '@/types/interface';
import SkeletonHeaderTitle from '@/components/Skeleton/SkeletonHeaderTitle';
import SkeletonHeaderPicture from '@/components/Skeleton/SkeletonHeaderPicture';
import liked_songs_image from '../../../public/liked.png';
const TypedHeader: React.FC<TypedHeaderType> = ({
  color,
  picture,
  name,
  description,
  trackTotal,
  artist,
  release_date,
  duration_ms,
}) => {
  if (!picture) {
    return (
      <div className="flex flex-col items-center md:flex-row md:items-stretch p-4 rounded-lg rounded-b-none">
        <SkeletonHeaderPicture />
        <SkeletonHeaderTitle />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center md:flex-row md:items-stretch md:justify-between p-4 rounded-lg rounded-b-none"
      style={{
        background: `linear-gradient(to right, ${color ? color.color[0] : ''}, ${
          color ? color.color[1] : ''
        }, ${color ? color.color[2] : ''})`,
      }}
    >
      <img
        className="mb-5 md:mr-8 md:mb-0 aspect-square md:max-h-48 rounded-lg"
        src={picture !== 'liked' ? picture : liked_songs_image}
        alt=""
      />
      <div className="w-full flex flex-col justify-between truncate overflow-ellipsis">
        <h2 className="text-2xl md:text-4xl flex flex-wrap justify-center md:justify-start mb-2 md:mb-0 whitespace-pre-wrap md:truncate md:overflow-ellipsis">
          {name}
        </h2>
        {description && (
          <p className="text-base whitespace-pre-wrap hidden md:inline">{description}</p>
        )}
        {trackTotal && (
          <p className="hidden md:inline text-baset whitespace-wrap break-normal">{`${trackTotal} songs, about ${Math.round(
            trackTotal * 3.17,
          )} minutes `}</p>
        )}
        {artist && (
          <div className="flex flex-wrap justify-center md:justify-start tbreak-normal">
            {artist?.map((el: any) => {
              return <span key={el.name}>{`${el.name} x\u00A0`}</span>;
            })}
            <>{`${release_date?.split('-')[0] || 'Unknown'}`}</>
            {duration_ms !== undefined ? `x ${secondsToTime(duration_ms)}` : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypedHeader;
