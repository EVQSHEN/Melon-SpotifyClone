import { ChangeEvent } from 'react';
import { getArtistTopTracks, getMySavedTracks, spotifyApi } from './spotify';

type PlaybackRepeatState = 'track' | 'context' | 'off';
export const repeatMode: PlaybackRepeatState[] = ['track', 'context', 'off'];

const getAuthOptions = (method: string, body?: any) => ({
  method: method,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json',
  },
  body: body ? JSON.stringify(body) : undefined,
});
const handleResponse = async (response: Response, functionName: string) => {
  if (response.status === 204 || response.status === 200) return;
  const text = await response.text();
  console.warn(`Spotify API (${functionName}):`, response.status, text);
};

export async function setActiveDeviceFirstRender(
  setDevice: React.Dispatch<React.SetStateAction<SpotifyApi.UserDevice[]>>,
) {
  try {
    const { devices } = await spotifyApi.getMyDevices();
    setDevice(devices);
  } catch (err) {
    console.error('Error fetching devices:', err);
  }
}

export async function play(uri?: string, position?: number, type = 'playlist') {
  try {
    let body: any = {};
    if (uri) {
      if (type === 'topTracks') {
        const tracks = await getArtistTopTracks(uri);
        body = { uris: tracks.tracks.map((el) => el.uri), offset: { position } };
      } else if (type === 'liked_songs') {
        const playlist = await getMySavedTracks();
        body = { uris: playlist.items.map((el) => el.track.uri), offset: { position } };
      } else if (['album', 'track', 'playlist'].includes(type)) {
        body = { context_uri: uri, offset: { position } };
      }
    }

    const res = await fetch(
      'https://api.spotify.com/v1/me/player/play',
      getAuthOptions('PUT', uri ? body : undefined),
    );
    await handleResponse(res, 'play');
  } catch (err) {
    console.error('Play error:', err);
  }
}

export async function pause() {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/pause', getAuthOptions('PUT'));
    await handleResponse(res, 'pause');
  } catch (err) {
    console.error('Pause error:', err);
  }
}

export async function skipToNext() {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/next', getAuthOptions('POST'));
    await handleResponse(res, 'skipNext');
  } catch (err) {
    console.error('SkipNext error:', err);
  }
}

export async function skipToPrevious() {
  try {
    const res = await fetch(
      'https://api.spotify.com/v1/me/player/previous',
      getAuthOptions('POST'),
    );
    await handleResponse(res, 'skipPrevious');
  } catch (err) {
    console.error('SkipPrevious error:', err);
  }
}

export async function shufflePlayback(shuffle: boolean) {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}`,
      getAuthOptions('PUT'),
    );
    await handleResponse(res, 'shuffle');
  } catch (err) {
    console.error('Shuffle error:', err);
  }
}

export async function repeatPlayback(
  repeat: number,
  setRepeat: React.Dispatch<React.SetStateAction<number>>,
) {
  try {
    const mode = repeatMode[repeat];
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/repeat?state=${mode}`,
      getAuthOptions('PUT'),
    );
    if (res.ok) {
      setRepeat(repeat === 2 ? 0 : repeat + 1);
    }
  } catch (err) {
    console.error('Repeat error:', err);
  }
}

export async function setVolume(
  event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
  setVolumes: React.Dispatch<React.SetStateAction<string>>,
) {
  try {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    setVolumes(value);
    const volumePercent = Math.round(Number(value) * 100);
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}`,
      getAuthOptions('PUT'),
    );
    await handleResponse(res, 'setVolume');
  } catch (err) {
    console.error('Volume error:', err);
  }
}

export async function seekToPosition(event: ChangeEvent<HTMLInputElement>) {
  try {
    const positionMs = Math.round(parseFloat(event.target.value));
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`,
      getAuthOptions('PUT'),
    );
    await handleResponse(res, 'seek');
  } catch (err) {
    console.error('Seek error:', err);
  }
}

export async function changeDevice(
  device: string,
  setDevice: React.Dispatch<React.SetStateAction<SpotifyApi.UserDevice[]>>,
  setActiveDevice: React.Dispatch<React.SetStateAction<string | boolean>>,
) {
  try {
    setActiveDevice(device);
    const res = await fetch(
      'https://api.spotify.com/v1/me/player',
      getAuthOptions('PUT', { device_ids: [device] }),
    );
    await handleResponse(res, 'changeDevice');
    const { devices } = await spotifyApi.getMyDevices();
    setDevice(devices);
  } catch (err) {
    console.error('Change device error:', err);
  }
}

export function getMyCurrentPlaybackState() {
  return spotifyApi.getMyCurrentPlaybackState();
}
