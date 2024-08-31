import { ChangeEvent } from 'react';
import { getArtistTopTracks, getMySavedTracks, spotifyApi } from './spotify';

type PlaybackRepeatState = 'track' | 'context' | 'off';
export const repeatMode: PlaybackRepeatState[] = ['track', 'context', 'off'];

export async function setActiveDeviceFirstRender(
  setDevice: React.Dispatch<React.SetStateAction<SpotifyApi.UserDevice[]>>,
) {
  try {
    const { devices } = await spotifyApi.getMyDevices();
    setDevice(devices);
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export async function play(uri: string, position: number, type = 'playlist') {
  try {
    if (type === 'topTracks') {
      const tracks = await getArtistTopTracks(uri);
      const uris = tracks.tracks.map((el) => el.uri);
      spotifyApi
        .play({
          uris,
          offset: { position },
        })
        .catch((error) => {
          console.log('Something went wrong!', error);
        });
      return;
    } else if (type === 'liked_songs') {
      const playlist = await getMySavedTracks();
      const uris = playlist.items.map((el) => el.track.uri);
      spotifyApi
        .play({
          uris,
          offset: { position },
        })
        .catch((error) => {
          console.log('Something went wrong!', error);
        });
      return;
    } else if (type === 'album' || type == 'track' || type === 'playlist') {
      spotifyApi
        .play({
          context_uri: uri,
          offset: { position: position },
        })
        .catch((error) => {
          console.log('Something went wrong!', error);
        });
      return;
    }
    spotifyApi.play().catch((error) => {
      console.log('Something went wrong!', error);
    });
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export function pause() {
  try {
    spotifyApi.pause();
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export function skipToNext() {
  try {
    spotifyApi.skipToNext();
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export function skipToPrevious() {
  try {
    spotifyApi.skipToPrevious();
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export async function changeDevice(
  device: string,
  setDevice: React.Dispatch<React.SetStateAction<SpotifyApi.UserDevice[]>>,
  setActiveDevice: React.Dispatch<React.SetStateAction<string | boolean>>,
) {
  try {
    setActiveDevice(device);
    await spotifyApi.transferMyPlayback([device]);
    const { devices } = await spotifyApi.getMyDevices();
    setDevice(devices);
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export function shufflePlayback(shuffle: boolean) {
  try {
    spotifyApi.setShuffle(!shuffle);
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export async function repeatPlayback(
  repeat: number,
  setRepeat: React.Dispatch<React.SetStateAction<number>>,
) {
  try {
    await spotifyApi.setRepeat(repeatMode[repeat]).then(function () {
      if (repeat === 2) setRepeat(0);
      else setRepeat((repeat) => repeat + 1);
    });
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}
export function setVolume(
  event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  setVolumes: React.Dispatch<React.SetStateAction<string>>,
) {
  try {
    const target = event.target as HTMLInputElement;
    setVolumes(String(target.value));
    const newVolume = Number(target.value) * 100;
    spotifyApi.setVolume(Number(newVolume.toFixed(0)));
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export function seekToPosition(event: ChangeEvent<HTMLInputElement>) {
  try {
    const positionValue: number = parseFloat(event.target.value);
    spotifyApi.seek(positionValue);
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}

export function getMyCurrentPlaybackState() {
  try {
    return spotifyApi.getMyCurrentPlaybackState();
  } catch (err) {
    console.log('Something went wrong webplayback!', err);
    throw err;
  }
}
