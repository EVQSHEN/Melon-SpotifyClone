import React from 'react';
import { useParams } from 'react-router-dom';
import { getUserPlaylists, getNewReleases, getArtistAlbums } from '@/api/spotify';
import PlaylistCard from '@/components/PlaylistCard/PlaylistCard';
import AlbumCard from '@/components/AlbumCard/AlbumCard';

const MusicHub = () => {
  const { musicHubType, id } = useParams();
  const [title, setTitle] = React.useState('');
  const [data, setData] = React.useState<any>();

  async function fetchData() {
    if (musicHubType === 'my_playlists') {
      const dataResponse = await getUserPlaylists(50);
      dataResponse && setData(dataResponse?.items);
      setTitle('My playlists');
    } else if (musicHubType === 'popular' && id) {
      const dataResponse = await getNewReleases(50, id);
      setData(dataResponse.albums.items);
      setTitle(`Popular in ${id}`);
    } else if (musicHubType === 'artist_albums' && id) {
      const dataResponse: any = await getArtistAlbums(id);
      setData(dataResponse.items);
      setTitle(`${dataResponse.items[0].artists[0].name} discography`);
    }
  }

  function renderComponents(currentType: string | undefined) {
    if (data && currentType) {
      switch (currentType) {
        case 'my_playlists':
          return data?.map((el: any) => <PlaylistCard key={el.name} {...el} />);
        case 'popular':
          return data?.map((el: any) => <AlbumCard key={el.name} {...el} />);
        case 'artist_albums':
          return data?.map((el: any) => <AlbumCard key={el.name} {...el} />);
        default:
          break;
      }
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="m-3 p-2">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div className="grid xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5  sm: grid-cols-4 gap-3">
        {renderComponents(musicHubType)}
      </div>
    </div>
  );
};

export default MusicHub;
