import React from 'react';
import { useParams } from 'react-router-dom';
import { getTracks } from '@/api/spotify';
import { pickColors } from '@/utils/getColor';
import { colorType } from '@/types/interface';
import TrackRow from '@/components/TrackRow/TrackRow';
import SkeletonTrackRow from '@/components/Skeleton/SkeletonTrackRow';
import HeaderTrackRow from '@/components/HeaderTrackRow/HeaderTrackRow';
import TypedHeader from '@/components/TypedHeader/TypedHeader';
import ControlPanel from '@/components/ControlPanel/ControlPanel';

const Track = () => {
  const skeletonArray = [...new Array(3)];
  const { id } = useParams();
  const [colors, setColors] = React.useState<colorType>();
  const [trackData, setTrackData] = React.useState<
    SpotifyApi.SingleTrackResponse & { album: { release_date?: string } }
  >();

  async function fetchTracks() {
    if (id) {
      const track = await getTracks(id);
      setTrackData(track);
      pickColors(track.album.images[0].url, setColors);
    }
  }
  React.useEffect(() => {
    setColors(undefined);
    fetchTracks();
  }, [id]);

  return (
    <>
      <TypedHeader
        color={colors}
        picture={trackData?.album.images[0].url}
        name={trackData?.name}
        artist={trackData?.artists}
        release_date={trackData?.album.release_date}
        duration_ms={trackData?.duration_ms}
      />
      <ControlPanel tracks={trackData} id={id} colors={colors} />
      <div
        className="w-full bg-neutral-900/60 p-3 rounded-lg rounded-t-none rounded-r-2xl min-h-[calc(100vh-0.5rem-8rem-240px-72px)] max-h-fit px-2"
        style={{
          background: `linear-gradient(to right, ${
            colors?.transparency ? colors.transparency[0] : ''
          }, ${colors?.transparency ? colors.transparency[1] : ''}, ${
            colors?.transparency ? colors.transparency[2] : ''
          })`,
        }}
      >
        <HeaderTrackRow />
        {trackData ? (
          <TrackRow
            id={trackData.album.uri}
            added_at={trackData.album?.release_date || 'Unknown'}
            nubmer={trackData.track_number - 1}
            track={trackData}
            key={trackData.album.uri}
          />
        ) : (
          <div className="m-0 bg-neutral-900/60 p-3 rounded-lg rounded-r-2xl">
            {skeletonArray.map((_, indx) => (
              <SkeletonTrackRow key={indx} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Track;
