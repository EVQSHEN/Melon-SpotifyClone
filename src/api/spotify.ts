import SpotifyWebApi from 'spotify-web-api-js';
import { LINK } from './constants';
export * from './webplayback';

export const spotifyApi = new SpotifyWebApi();

export async function setToken() {
  const hash: string = window.location.hash;
  if (hash) {
    const token = hash
      .substring(1)
      .split('&')
      .find((elem) => elem.startsWith('access_token'))
      ?.split('=')[1];
    window.location.hash = '';
    token && window.localStorage.setItem('token', token);
  }
  const token: string | undefined | null = window.localStorage.getItem('token');
  token && spotifyApi.setAccessToken(token);
  const data = await getMe();
  return !!data;
}

export async function getMe() {
  try {
    const user = await spotifyApi.getMe();
    return user;
  } catch (err) {
    console.log('Something went wrong!', err);
    window.localStorage.removeItem('token');
    window.location.replace(LINK);
  }
}

export function getTracks(id: string) {
  try {
    return spotifyApi.getTrack(id);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function followPlaylist(id: string) {
  try {
    spotifyApi.followPlaylist(id, {
      public: false,
    });
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function unfollowPlaylist(id: string) {
  try {
    spotifyApi.unfollowPlaylist(id);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export async function getUserPlaylists(limit: number, offset = 0) {
  try {
    const user = await getMe();
    if (user) {
      return spotifyApi.getUserPlaylists(user.id, { limit, offset });
    }
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export async function getPlaylistTracks(id: string, limit = 100) {
  try {
    const tracks = await spotifyApi.getPlaylistTracks(id, { limit });
    let totalTracks = limit;
    while (tracks && totalTracks <= tracks.total) {
      const tracksUPDT = await spotifyApi.getPlaylistTracks(id, { limit, offset: totalTracks });
      tracksUPDT && tracks.items.push(...tracksUPDT.items);
      totalTracks += 100;
    }
    return tracks;
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}
export function getPlaylist(id: string) {
  try {
    return spotifyApi.getPlaylist(id);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export async function getAreFollowingPlaylist(idPlaylist: string) {
  try {
    const playlists = await getUserPlaylists(50);
    if (playlists) {
      return playlists.items.some((playlist) => playlist.id === idPlaylist);
    }
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function getAlbum(id: string) {
  try {
    return spotifyApi.getAlbum(id);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function getAlbumTracks(id: string, limit = 50) {
  try {
    return spotifyApi.getAlbumTracks(id, { limit });
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function addToMySavedTracks(id: string) {
  try {
    return spotifyApi.addToMySavedTracks([id]);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function removeFromMySavedTracks(id: string) {
  try {
    return spotifyApi.removeFromMySavedTracks([id]);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export async function containsMySavedTracks(id: string) {
  try {
    const data = await spotifyApi.containsMySavedTracks([id]);
    return data[0];
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function getMyRecentlyPlayedTracks(limit = 6) {
  try {
    return spotifyApi.getMyRecentlyPlayedTracks({ limit });
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export async function getMySavedTracks(limit = 50) {
  try {
    const tracks = await spotifyApi.getMySavedTracks({ limit });
    let totalTracks = limit;
    while (tracks && totalTracks <= tracks.total) {
      const tracksUPDT = await spotifyApi.getMySavedTracks({ limit, offset: 50 });
      tracksUPDT && tracks.items.push(...tracksUPDT.items);
      totalTracks += 100;
    }
    return tracks;
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function getArtist(id: string) {
  try {
    return spotifyApi.getArtist(id);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function getArtistTopTracks(id: string) {
  try {
    return spotifyApi.getArtistTopTracks(id, 'GB');
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function followArtist(id: string) {
  spotifyApi.followArtists([id]);
}

export function unfollowArtists(id: string) {
  spotifyApi.unfollowArtists([id]);
}

export function isFollowingArtists(id: string) {
  try {
    return spotifyApi.isFollowingArtists([id]);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function getArtistAlbums(id: string) {
  try {
    return spotifyApi.getArtistAlbums(id);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export async function getMySavedAlbums(id: string) {
  try {
    const user = await getMe();
    if (user) {
      const albums = await spotifyApi.getMySavedAlbums(user.id);
      if (albums) {
        return albums.items.some((album) => album.album.id === id);
      }
    }
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function removeFromMySavedAlbums(id: string) {
  try {
    spotifyApi.removeFromMySavedAlbums([id]);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function addToMySavedAlbums(id: string) {
  try {
    spotifyApi.addToMySavedAlbums([id]);
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function search(
  value: string,
  types: ('playlist' | 'track' | 'album' | 'artist')[],
  limit = 32,
) {
  try {
    return spotifyApi.search(value, types, { limit });
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export function getNewReleases(limit: number, country: string, offset = 0) {
  try {
    return spotifyApi.getNewReleases({
      limit: limit,
      offset: offset,
      country: country,
    });
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}

export async function getAudioFeaturesForTracks() {
  try {
    const data = await spotifyApi.getMySavedTracks();
    return data;
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
}
