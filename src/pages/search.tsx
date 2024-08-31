import React from 'react';
import { useParams } from 'react-router-dom';
import { search } from '@/api/spotify';
import AlbumCard from '@/components/AlbumCard/AlbumCard';
import TrackCard from '@/components/TrackCard/TrackCard';
import ArtistCard from '@/components/ArtistCard/ArtistCard';
import adaptiveCardRow from '@/utils/adaptiveCardRow';
import SkeletonCard from '@/components/Skeleton/SkeletonCard';
import PlaylistCard from '@/components/PlaylistCard/PlaylistCard';
import CategoryBlock from '@/components/CategoryBlock/CategoryBlock';

const SearchPage = () => {
  const { value } = useParams();
  const [gridRowLength, setGridRowLength] = React.useState(8);
  const [searchResults, setSearchResults] = React.useState<any>();

  async function fetchSearchResults() {
    if (value) {
      const { artists } = await search(value, ['artist']);
      const { tracks } = await search(value, ['track']);
      const { albums } = await search(value, ['album']);
      const { playlists } = await search(value, ['playlist']);
      setSearchResults({
        artists: artists,
        tracks: tracks,
        albums: albums,
        playlists: playlists,
      });
    }
  }

  React.useEffect(() => {
    fetchSearchResults();
  }, [value]);

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

  if (value === undefined) {
    return (
      <div className="flex min-h-[calc(100vh-8.5rem)] justify-center items-center">
        <p className="p-2 text-center text-2xl">Enter the value to be searched</p>
      </div>
    );
  }

  return (
    <div className="m-3 p-2">
      <CategoryBlock />
      <h2 className="text-xl mb-3">Artists</h2>
      <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 md:grid flex overflow-auto gap-2 mb-10">
        {(searchResults?.artists &&
          searchResults.artists.items
            .slice(0, gridRowLength)
            .map((el: any) => <ArtistCard key={el.id} {...el} />)) ||
          [...new Array(gridRowLength)].map((_, id) => <SkeletonCard key={100 + id} />)}
      </div>
      <h2 className="text-xl mb-3">Tracks</h2>
      <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 md:grid flex overflow-auto gap-2 mb-10">
        {(searchResults?.tracks &&
          searchResults.tracks.items
            .slice(0, gridRowLength)
            .map((el: any) => <TrackCard key={el.id} {...el} />)) ||
          [...new Array(gridRowLength)].map((_, id) => <SkeletonCard key={100 + id} />)}
      </div>
      <h2 className="text-xl mb-3">Albums</h2>
      <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 md:grid flex overflow-auto gap-2 mb-10">
        {(searchResults?.albums &&
          searchResults.albums.items
            .slice(0, gridRowLength)
            .map((el: any) => <AlbumCard key={el.id} {...el} />)) ||
          [...new Array(gridRowLength)].map((_, id) => <SkeletonCard key={100 + id} />)}
      </div>
      <h2 className="text-xl mb-3">Playlists</h2>
      <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 md:grid flex overflow-auto gap-2 mb-10">
        {(searchResults?.playlists &&
          searchResults.playlists.items
            .slice(0, gridRowLength)
            .map((el: any) => <PlaylistCard key={el.id} {...el} />)) ||
          [...new Array(gridRowLength)].map((_, id) => <SkeletonCard key={100 + id} />)}
      </div>
    </div>
  );
};

export default SearchPage;
