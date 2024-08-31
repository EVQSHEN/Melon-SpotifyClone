import React from 'react';
import { getArtist, getArtistTopTracks, getArtistAlbums } from '@/api/spotify';
import { useNavigate, useParams } from 'react-router-dom';
import IconSVG from '@/components/IconSVG/IconSVG';
import TrackRow from '@/components/TrackRow/TrackRow';
import AlbumCard from '@/components/AlbumCard/AlbumCard';
import adaptiveCardRow from '@/utils/adaptiveCardRow';
import HeaderTrackRow from '@/components/HeaderTrackRow/HeaderTrackRow';
import ControlPanel from '@/components/ControlPanel/ControlPanel';

const Artist = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [visibleItems, setVisibleItems] = React.useState(5);
  const [gridRowLength, setGridRowLength] = React.useState(8);
  const [artistData, setArtistData] = React.useState<SpotifyApi.SingleArtistResponse>();
  const [topTracks, setTopTracks] = React.useState<SpotifyApi.TrackObjectFull[]>();
  const [atristAlbums, setArtistAlbums] = React.useState<SpotifyApi.ArtistsAlbumsResponse>();

  async function fetchArtistData() {
    if (id) {
      const artistResponse = await getArtist(id);
      setArtistData(artistResponse);
      const artistTrackResponse = await getArtistTopTracks(artistResponse.id);
      setTopTracks(artistTrackResponse.tracks);
    }
  }

  async function fetchArtistAlbums(id: string) {
    if (id) {
      const response = await getArtistAlbums(id);
      setArtistAlbums(response);
    }
  }
  console.log(topTracks);
  React.useEffect(() => {
    fetchArtistData();
  }, [id]);

  React.useEffect(() => {
    artistData && fetchArtistAlbums(artistData.id);
  }, [artistData]);

  React.useEffect(() => {
    const handleResize = () => {
      adaptiveCardRow(gridRowLength, setGridRowLength);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gridRowLength]);

  if (!artistData || !topTracks || !atristAlbums || !id) {
    return <div></div>;
  }

  return (
    <>
      <div className="flex h-96 relative">
        <div className="z-30 w-full flex flex-col justify-end truncate overflow-ellipsis m-4 mb-16">
          <h2 className="md:text-7xl text-2xl font-bold truncate overflow-ellipsis mb-2">
            {artistData?.name}
          </h2>
          <p className="text-base tbreak-normal">{`Followers: ${artistData?.followers.total}`}</p>
          <p className="text-base text-neutral-400 tbreak-normal"></p>
        </div>
        <img
          className="absolute z-20 w-full h-full rounded-lg  backdrop-blur-sm object-cover md:object-scale-down "
          src={artistData?.images[0].url}
          alt=""
        />
        <img
          className="absolute z-10 w-full max-h-full rounded-lg rounded-b-none object-cover bg-black opacity-70"
          src={artistData?.images[0].url}
          alt=""
        />
      </div>
      <ControlPanel tracks={artistData} id={id} />
      <div className=" bg-neutral-900 p-2 rounded-lg rounded-t-none mb-10">
        <h3 className="text-2xl my-5 ml-4 font-semibold">Popular songs</h3>
        <HeaderTrackRow />
        {topTracks.slice(0, visibleItems).map((el: any, indx) => (
          <TrackRow
            key={el.uri}
            added_at={el.album.release_date || 'Unknown'}
            track={el}
            nubmer={indx}
            id={id}
            additionalType="topTracks"
          />
        ))}
        <div className=" px-3 transition-all duration-400 hover:text-white text-base flex justify-center text-gray-300">
          {visibleItems === 5 ? (
            <IconSVG
              onClick={() => setVisibleItems(10)}
              name="arrow"
              className="fill-white cursor-pointer hover:fill-sky-400"
              width="28"
              height="28"
            />
          ) : (
            <IconSVG
              onClick={() => setVisibleItems(5)}
              name="arrow"
              className="rotate-180 cursor-pointer fill-white hover:fill-sky-400"
              width="28"
              height="28"
            />
          )}
        </div>
      </div>

      <div className="flex justify-between mb-3 mx-4">
        <h2 className="text-xl font-semibold">Discography</h2>
        <p
          onClick={() => navigate(`/section/artist_albums/${artistData && artistData.id}`)}
          className="text-gray-30 cursor-pointer hover:underline"
        >
          Show all
        </p>
      </div>
      <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5  sm: grid-cols-3  md:grid flex overflow-auto gap-2">
        {atristAlbums &&
          atristAlbums.items.slice(0, gridRowLength).map((el) => <AlbumCard key={el.id} {...el} />)}
      </div>
    </>
  );
};

export default Artist;
