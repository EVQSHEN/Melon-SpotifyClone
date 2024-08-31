import React from 'react';
import { useParams } from 'react-router-dom';
import AlbumCard from '@/components/AlbumCard/AlbumCard';
import TrackCard from '@/components/TrackCard/TrackCard';
import ArtistCard from '@/components/ArtistCard/ArtistCard';
import PlaylistCard from '@/components/PlaylistCard/PlaylistCard';
import SkeletonCard from '@/components/Skeleton/SkeletonCard';
import CategoryBlock from '@/components/CategoryBlock/CategoryBlock';
import { search } from '@/api/spotify';
import { CategoryType } from '@/types/categoryTypes';

const SearchType = () => {
  const { category, value } = useParams<CategoryType>();
  const [searchResults, setSearchResults] = React.useState<any>([]);

  async function fetchSearchResults() {
    if (value && category) {
      const data = await search(value, [category]);
      setSearchResults(data[`${category}s`]);
    }
  }

  function renderCard(category: string, props: any, id: string) {
    switch (category) {
      case 'album':
        return <AlbumCard key={id} {...props} />;
      case 'artist':
        return <ArtistCard key={id} {...props} />;
      case 'track':
        return <TrackCard key={id} {...props} />;
      case 'playlist':
        return <PlaylistCard key={id} {...props} />;
    }
  }

  React.useEffect(() => {
    fetchSearchResults();
  }, [value, category]);

  return (
    <div className="m-3 p-2">
      <CategoryBlock />
      <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 md:grid flex overflow-auto gap-2">
        {(searchResults?.items &&
          searchResults.items.map((el: any) => renderCard(el.type, el, el.id))) ||
          [...new Array(24)].map((_, id) => <SkeletonCard key={10 + id} />)}
      </div>
    </div>
  );
};
export default SearchType;
