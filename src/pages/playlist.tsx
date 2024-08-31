import React from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistTracks, getPlaylist, getMySavedTracks } from '@/api/spotify';
import { pickColors } from '@/utils/getColor';
import { colorType } from '@/types/interface';
import TrackRow from '@/components/TrackRow/TrackRow';
import SkeletonTrackRow from '@/components/Skeleton/SkeletonTrackRow';
import HeaderTrackRow from '@/components/HeaderTrackRow/HeaderTrackRow';
import TypedHeader from '@/components/TypedHeader/TypedHeader';
import ControlPanel from '@/components/ControlPanel/ControlPanel';

const Playlist = () => {
  const { id } = useParams();
  const [trackData, setTrackData] = React.useState<
    SpotifyApi.PlaylistTrackResponse | SpotifyApi.UsersSavedTracksResponse
  >();
  const [playlistData, setPlaylistData] = React.useState<SpotifyApi.SinglePlaylistResponse>();
  const [colors, setColors] = React.useState<colorType>();

  async function fetchPlaylist() {
    if (id) {
      if (id === 'liked_songs') {
        const savedTracks = await getMySavedTracks();
        setTrackData(savedTracks);
      } else {
        const playlist = await getPlaylist(id);
        setPlaylistData(playlist);
        const tracks = await getPlaylistTracks(id);
        setTrackData(tracks);
      }
    }
  }

  function TypedHeaderRenderComponents() {
    if (id) {
      if (id === 'liked_songs') {
        return (
          <TypedHeader
            color={colors}
            picture="liked"
            name={'Liked songs'}
            trackTotal={trackData?.total}
          />
        );
      } else {
        return (
          <TypedHeader
            color={colors}
            picture={playlistData?.images[0]?.url}
            name={playlistData?.name}
            description={playlistData?.description}
            trackTotal={playlistData?.tracks.total}
          />
        );
      }
    }
  }

  React.useEffect(() => {
    if (playlistData || trackData || colors) {
      setPlaylistData(undefined);
      setTrackData(undefined);
      setColors(undefined);
    }
    fetchPlaylist();
  }, [id]);

  React.useEffect(() => {
    if (id === 'liked_songs') {
      pickColors('/src/assets/liked_songs.png', setColors);
    } else pickColors(playlistData?.images[0]?.url, setColors);
  }, [playlistData]);

  return (
    <>
      {TypedHeaderRenderComponents()}
      <ControlPanel
        tracks={id === 'liked_songs' ? trackData : playlistData}
        id={id}
        colors={colors}
      />
      <div
        className="w-full bg-neutral-900/60 rounded-lg rounded-t-none rounded-r-2xl min-h-[calc(100vh-0.5rem-8rem-240px-88px)] max-h-fit px-2"
        style={{
          background: `linear-gradient(to right, ${
            colors?.transparency ? colors.transparency[0] : '#171717'
          }, ${colors?.transparency ? colors.transparency[1] : '#171717'}, ${
            colors?.transparency ? colors.transparency[2] : '#171717'
          })`,
        }}
      >
        <HeaderTrackRow />
        {trackData?.items ? (
          trackData.items.map((el, indx) => (
            <TrackRow
              key={el.track?.id + indx}
              id={id === 'liked_songs' ? el?.track?.uri : playlistData?.uri}
              nubmer={indx}
              {...el}
              additionalType={id === 'liked_songs' ? 'liked_songs' : undefined}
            />
          ))
        ) : (
          <div className="m-0 bg-neutral-900/60 p-3 rounded-lg rounded-r-2xl">
            {[...new Array(20)].map((_, indx) => (
              <SkeletonTrackRow key={indx} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Playlist;
