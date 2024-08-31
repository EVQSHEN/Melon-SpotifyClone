import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ControlPanelType } from '@/types/interface';
import {
  play,
  shufflePlayback,
  isFollowingArtists,
  followArtist,
  unfollowArtists,
  followPlaylist,
  unfollowPlaylist,
  getAreFollowingPlaylist,
  getMySavedAlbums,
  addToMySavedAlbums,
  removeFromMySavedAlbums,
  addToMySavedTracks,
  removeFromMySavedTracks,
  containsMySavedTracks,
} from '@/api/spotify';
import IconSVG from '../IconSVG/IconSVG';

const ControlPanel: React.FC<ControlPanelType> = ({ tracks, id, colors }) => {
  const { pathname } = useLocation();
  const params = useParams();
  const [shuffle, setShuffle] = React.useState(false);
  const [isFollowing, setIsFollowing] = React.useState<undefined | boolean>();
  const [type, setType] = React.useState<string>('');

  async function playTrack() {
    if (tracks) {
      shufflePlayback(!shuffle);
      if (params.id === 'liked_songs') {
        play(tracks.items[0].track.id, 0, 'liked_songs');
      } else if (type === 'track') {
        return play(tracks.album.uri, tracks.track_number - 1, type);
      } else return play(tracks.uri, 0, type);
    }
  }

  async function getFollowing(id: string) {
    if (type === 'artist') {
      const isFollowingResponse = await isFollowingArtists(id);
      setIsFollowing(isFollowingResponse[0]);
    } else if (type === 'playlist') {
      const isFollowingResponse = await getAreFollowingPlaylist(id);
      setIsFollowing(isFollowingResponse);
    } else if (type === 'album') {
      const isFollowingResponse = await getMySavedAlbums(id);
      setIsFollowing(isFollowingResponse);
    } else if (type === 'track') {
      const isFollowingResponse = await containsMySavedTracks(id);
      setIsFollowing(isFollowingResponse);
    }
  }

  async function follow(tracks: SpotifyApi.SingleArtistResponse, isFollowing: boolean) {
    if (id) {
      switch (type) {
        case 'artist':
          followArtist(tracks.id);
          setIsFollowing(!isFollowing);
          break;
        case 'playlist':
          followPlaylist(id);
          setIsFollowing(!isFollowing);
          break;
        case 'album':
          addToMySavedAlbums(id);
          setIsFollowing(!isFollowing);
          break;
        case 'track':
          addToMySavedTracks(id);
          setIsFollowing(!isFollowing);
          break;
        default:
          break;
      }
    }
  }

  async function unfollow(tracks: SpotifyApi.SingleArtistResponse, isFollowing: boolean) {
    if (id) {
      switch (type) {
        case 'artist':
          unfollowArtists(tracks.id);
          setIsFollowing(!isFollowing);
          break;
        case 'playlist':
          unfollowPlaylist(id);
          setIsFollowing(!isFollowing);
          break;
        case 'album':
          removeFromMySavedAlbums(id);
          setIsFollowing(!isFollowing);
          break;
        case 'track':
          removeFromMySavedTracks(id);
          setIsFollowing(!isFollowing);
          break;
        default:
          break;
      }
    }
  }

  //  need fix
  const followIcon = () => {
    if (isFollowing) {
      if (type === 'track') {
        return (
          <IconSVG
            name={isFollowing ? 'hearthFill' : 'hearth'}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            onClick={() =>
              isFollowing ? unfollow(tracks, isFollowing) : follow(tracks, isFollowing)
            }
          />
        );
      } else
        return (
          <p
            onClick={() =>
              isFollowing ? unfollow(tracks, isFollowing) : follow(tracks, isFollowing)
            }
            className="inline-block cursor-pointer px-3 text-center transition-all duration-400 hover:border-white text-lg rounded-xl border-gray-400 border"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </p>
        );
    }
  };

  React.useEffect(() => {
    setType(pathname.split('/')[1]);
    id && getFollowing(id);
  }, [type, id]);

  if (!tracks || !id) {
    return <div className="h-[88px] bg-[#171717]"></div>;
  }

  return (
    <div
      className="z-100 flex items-center bg-neutral-900/60 p-4 py-5 bg-opacity-60"
      style={{
        background: `linear-gradient(to right, ${
          colors?.transparency ? colors.transparency[0] : '#161616'
        }, ${colors?.transparency ? colors.transparency[1] : '#161616'}, ${
          colors?.transparency ? colors.transparency[2] : '#161616'
        })`,
      }}
    >
      <div className="w-12 h-12 mr-5">
        <IconSVG
          onClick={() => playTrack()}
          name="play"
          className="cursor-pointer bg-sky-500 rounded-full fill-gray-100 hover:w-12 hover:h-12 duration-400 transition-all"
          width="46"
          height="46"
        />
      </div>
      {type === 'artist' && (
        <IconSVG
          name="shuffle"
          onClick={() => setShuffle(!shuffle)}
          className={`${
            shuffle ? 'fill-sky-500 hover:fill-white' : 'fill-white hover:fill-sky-500'
          }  cursor-pointer  duration-200 active:w-9 mr-4`}
        />
      )}
      {followIcon()}
    </div>
  );
};

export default ControlPanel;
