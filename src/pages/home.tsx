import React from 'react';
import { useNavigate } from 'react-router-dom';
import RowCard from '@/components/RowCard/RowCard';
import AlbumCard from '@/components/AlbumCard/AlbumCard';
import adaptiveCardRow from '@/utils/adaptiveCardRow';
import PlaylistCard from '@/components/PlaylistCard/PlaylistCard';
import SkeletonCard from '@/components/Skeleton/SkeletonCard';
import { getUserPlaylists, getNewReleases, getMe, getMyRecentlyPlayedTracks } from '@/api/spotify';
import SkeletomRowCard from '@/components/Skeleton/SkeletomRowCard';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = React.useState<any>();
  const [gridRowLength, setGridRowLength] = React.useState(8);

  async function fetchData() {
    const userRepsonse = await getMe();
    setData({
      user: userRepsonse,
      recentlyPlayed: await getMyRecentlyPlayedTracks(),
      myPlaylists: await getUserPlaylists(8),
      newReleases: userRepsonse && (await getNewReleases(8, userRepsonse.country)),
    });
  }

  React.useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="m-3 md:p-2">
      <h1 className="font-bold text-xl sm:text-3xl mb-4 sm:mb-6">
        {`HI ${data?.user ? data.user.display_name : ''}`}
      </h1>
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl mb-3 md:mb-0 font-medium">Recently played</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 m-auto w-11/12 sm:w-4/5 md:w-3/5 gap-2">
          {data?.recentlyPlayed
            ? data.recentlyPlayed.items.map((item: any, indx: number) => (
                <RowCard
                  key={item.track?.uri + indx}
                  name={item.track.name}
                  picture={item.track.album.images[0].url}
                  id={item.context?.uri.split(':')[2]}
                  type={item?.context?.type}
                />
              ))
            : [...new Array(6)].map((_, indx) => <SkeletomRowCard key={indx} />)}
        </div>
      </div>
      <div className="mb-8">
        <div className="flex justify-between mb-3 ">
          <h2 className="text-lg sm:text-xl  font-medium">My playlists</h2>
          {data?.user && (
            <p
              onClick={() => navigate(`section/my_playlists/${data.user?.id}`)}
              className="text-gray-30 cursor-pointer hover:underline"
            >
              Show all
            </p>
          )}
        </div>
        <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5  sm: grid-cols-3  md:grid flex overflow-auto gap-2">
          {data?.myPlaylists
            ? data.myPlaylists.items
                .slice(0, gridRowLength)
                .map((el: any) => <PlaylistCard key={el.name} {...el} />)
            : [...new Array(gridRowLength)].map((_, indx) => <SkeletonCard key={indx} />)}
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-medium">Last releases in {data?.user?.country}</h2>
          {data?.newReleases && (
            <p
              onClick={() => navigate(`section/popular/${data.user && data.user.country}`)}
              className="text-gray-30 cursor-pointer hover:underline"
            >
              Show all
            </p>
          )}
        </div>
        <div className="xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5  sm: grid-cols-3  md:grid flex overflow-auto gap-2">
          {data?.newReleases
            ? data.newReleases?.albums.items
                .slice(0, gridRowLength)
                .map((el: any) => <AlbumCard key={el.name} {...el} />)
            : [...new Array(gridRowLength)].map((_, indx) => <SkeletonCard key={indx * 17} />)}
        </div>
      </div>
    </div>
  );
};

export default Home;
