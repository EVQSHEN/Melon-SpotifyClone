import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserPlaylists } from '@/api/spotify';
import { usePlayer } from '@/contexts/player';
import IconSVG from '@/components/IconSVG/IconSVG';
import liked_songs from '../../public/liked_songs.png';

const Aside = () => {
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [myPlaylists, setMyPlaylists] = React.useState<SpotifyApi.PlaylistObjectSimplified[]>();
  const [currentTrack, setCurrentTrack] = React.useState<string | undefined>();

  async function fetchMyPlaylists() {
    const playlists = await getUserPlaylists(50);
    playlists && setMyPlaylists(playlists.items);
  }

  React.useEffect(() => {
    fetchMyPlaylists();
  }, []);

  React.useEffect(() => {
    player && setCurrentTrack(player.context.metadata.context_description);
  }, [player]);

  return (
    <aside className="w-20 sm:w-44 h-[calc(100vh-5.75rem)] mr-1 text-center">
      <div className="mb-1 bg-gradient-to-b from-[#202020] to-neutral-900 rounded-lg text-2xl">
        <NavLink
          className={({ isActive }) => {
            return `flex items-center pl-7 w-20 sm:w-44 h-12 border-l-2 border-opacity-0 hover:bg-gradient-to-r hover:from-sky-400 to-sky-1000 hover:border-l-2 hover:border-opacity-100 rounded-t-lg border-sky-500 duration-200 font-normal ${
              isActive
                ? 'text-sky-100 fill-sky-100 bg-gradient-to-r from-sky-600 to-sky-1000 border-l-2 border-opacity-100 border-sky-500 rounded-t-lg'
                : 'fill-white'
            }`;
          }}
          to="/"
        >
          <IconSVG name="home" viewBox="0 0 29 29" />
          <p className="hidden sm:block text-neutral-200">Home</p>
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return `flex items-center pl-7 w-20 sm:w-44 h-12 border-l-2 border-opacity-0 hover:bg-gradient-to-r hover:from-sky-400 to-sky-1000 hover:border-l-2 hover:border-opacity-100 rounded-b-lg border-sky-500 duration-200 font-normal ${
              isActive
                ? 'text-sky-100 fill-sky-100 bg-gradient-to-r from-sky-600 to-sky-1000 border-l-2 border-opacity-100 border-sky-500 rounded-b-lg'
                : 'fill-white'
            }`;
          }}
          to="/search"
        >
          <IconSVG name="search" viewBox="0 0 29 29" />
          <p className="hidden sm:block text-neutral-200">Search</p>
        </NavLink>
      </div>
      <div className="h-[calc(100vh-1.9rem-9.4rem)] bg-gradient-to-b from-[#181818] to-neutral-950 rounded-lg overflow-y-auto">
        <h2 className="text-xl text-neutral-200 py-2 bg-gradient-to-b from-[#202020] to-neutral-900 font-medium top-0 sticky">
          My library
        </h2>
        {myPlaylists && (
          <div
            onClick={() => navigate(`/playlist/liked_songs`)}
            className="flex justify-center sm:justify-start  mx-3 mb-3 pr-1 cursor-pointer"
          >
            <img
              className="mr-0 sm:mr-2 min-w-10 max-w-10 w-10 h-10 rounded-lg "
              src={liked_songs}
              alt=""
            />

            <div className="hidden sm:flex flex-col truncate text-ellipsis">
              <h3 className={`text-sm text-left truncate transition-all duration-700 `}>
                Liked songs
              </h3>
              <p className="text-xs text-left text-neutral-400 truncate">Spotify</p>
            </div>
          </div>
        )}
        {myPlaylists &&
          myPlaylists.map((el) => (
            <div
              key={el.id}
              onClick={() => navigate(`/playlist/${el.id}`)}
              className="flex justify-center sm:justify-start  mx-3 mb-3 pr-1 cursor-pointer"
            >
              <img
                className="mr-0 sm:mr-2 min-w-10 max-w-10 w-10 h-10 rounded-lg "
                src={el.images[0].url}
                alt=""
              />
              <div className="hidden sm:flex flex-col truncate text-ellipsis">
                <h3
                  className={`text-sm text-left truncate transition-all duration-700 ${
                    currentTrack === el.name ? '!text-sky-500 font-bold' : ''
                  }`}
                >
                  {el.name}
                </h3>
                <p className="text-xs text-left text-neutral-400 truncate">
                  {el.owner?.display_name}
                </p>
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default Aside;
