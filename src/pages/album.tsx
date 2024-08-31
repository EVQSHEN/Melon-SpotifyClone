import React from 'react';
import { useParams } from 'react-router-dom';
import { getAlbum } from '@/api/spotify';
import { colorType } from '@/types/interface';
import { pickColors } from '@/utils/getColor';
import TrackRow from '@/components/TrackRow/TrackRow';
import SkeletonTrackRow from '@/components/Skeleton/SkeletonTrackRow';
import TypedHeader from '@/components/TypedHeader/TypedHeader';
import HeaderTrackRow from '@/components/HeaderTrackRow/HeaderTrackRow';
import SkeletonHeaderTitle from '@/components/Skeleton/SkeletonHeaderTitle';
import SkeletonHeaderPicture from '@/components/Skeleton/SkeletonHeaderPicture';
import ControlPanel from '@/components/ControlPanel/ControlPanel';

const Album = () => {
  const { id } = useParams();
  const [trackData, setTrackData] = React.useState<SpotifyApi.SingleAlbumResponse | undefined>();
  const [albumCover, setAlbumCover] = React.useState<string | undefined>();
  const [colors, setColors] = React.useState<colorType | undefined>();

  async function fetchAlbumData() {
    if (id) {
      const data = await getAlbum(id);
      setTrackData(data);
      setAlbumCover(data.images[0].url);
    }
  }

  React.useEffect(() => {
    setColors(undefined);
    fetchAlbumData();
  }, [id]);

  React.useEffect(() => {
    pickColors(albumCover, setColors);
  }, [albumCover]);

  if (!trackData || !colors || !id) {
    const array = [...new Array(10)];
    return (
      <>
        <div className="flex p-4 mb-3 rounded-lg bg-gradient-to-l from-neutral-900 via-neutral-600 to-neutral-400">
          <SkeletonHeaderPicture />
          <SkeletonHeaderTitle />
        </div>
        <div className="m-0 bg-neutral-900/60 p-3 rounded-lg rounded-r-2xl">
          {array.map((_, indx) => (
            <SkeletonTrackRow key={indx} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <TypedHeader
        color={colors}
        picture={albumCover}
        name={trackData.name}
        artist={trackData?.artists}
        release_date={trackData?.release_date}
      />
      <ControlPanel tracks={trackData} id={id} colors={colors} />
      <div
        className="w-full bg-neutral-900/60 p-3 rounded-lg rounded-t-none rounded-r-2xl min-h-[calc(100vh-8rem-240px-80px)] max-h-fit px-2"
        style={{
          background: `linear-gradient(to right, ${
            colors.transparency ? colors.transparency[0] : ''
          }, ${colors.transparency ? colors.transparency[1] : ''}, ${
            colors.transparency ? colors.transparency[2] : ''
          })`,
        }}
      >
        <HeaderTrackRow />
        {trackData?.tracks?.items?.map((el, indx) => (
          <TrackRow
            key={el.uri}
            added_at={trackData.release_date || 'Unknown'}
            track={el}
            id={trackData.uri}
            nubmer={indx}
          />
        ))}
      </div>
    </>
  );
};

export default Album;
