import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '@/contexts/player';
import {
  play,
  pause,
  skipToPrevious,
  skipToNext,
  changeDevice,
  shufflePlayback,
  repeatPlayback,
  setVolume,
  seekToPosition,
  getMe,
} from '@/api/spotify';
import secondsToTime from '@/utils/secondsToTime';
import IconSVG from '@/components/IconSVG/IconSVG';
import DevicePopup from '@/components/DevicePopup/DevicePopup';

const Player = () => {
  const { player, setPlayer } = usePlayer();
  const [device, setDevice] = React.useState<SpotifyApi.UserDevice[] | []>([]);
  const [activeDevice, setActiveDevice] = React.useState<string | boolean>(false);
  const [positionTrack, setPosition] = React.useState(0);
  const [repeat, setRepeat] = React.useState(0);
  const [volume, setVolumes] = React.useState('0.4');
  const [scaleImage, setScaleImage] = React.useState(false);

  async function fetchUserData() {
    const data = await getMe();
    if (data?.product === 'premium') {
      renderPlayer();
    }
  }

  function renderPlayer() {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = window.localStorage.getItem('token');
      if (!token) {
        return false;
      }
      const player = new window.Spotify.Player({
        name: 'MELOS',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }) => {
        changeDevice(device_id, setDevice, setActiveDevice);
      });

      player.addListener('player_state_changed', (state) => {
        if (state) {
          const currentPosition: number = state.position;
          setPosition(currentPosition);
          setPlayer(state);
        }
      });

      player.connect();

      return () => {
        player.removeListener('player_state_changed');
        player.disconnect();
      };
    };
  }

  React.useEffect(() => {
    fetchUserData();
  }, []);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (player && !player.paused) {
      intervalId = setInterval(() => {
        setPosition((positionTrack) => positionTrack + 1000);
      }, 1000);
    } else if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [player]);

  if (player === undefined) {
    return (
      <div className="h-[4.5rem] w-[calc(100vw-0.5rem)] bg-gradient-to-b from-[#202020] to-neutral-950 rounded-lg flex justify-between items-center"></div>
    );
  }

  return (
    <div className="h-[4.5rem] w-[calc(100vw-0.5rem)] bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-lg flex justify-between items-center">
      <div className="items-center ml-2 w-80 flex">
        <img
          src={player?.track_window?.current_track?.album?.images[0]?.url}
          className={` mr-3  rounded-md md:block hidden ${
            scaleImage ? 'w-44 h-44 left-1 absolute bottom-1' : 'w-16 h-16'
          }`}
          alt=""
          onClick={() => setScaleImage(!scaleImage)}
        />
        <div className={`${scaleImage ? 'hidden ' : ''} max-w-[90px] md:max-w-none`}>
          <h3 className="text-xs overflow-hidden truncate mr-4">
            {player?.track_window?.current_track?.name}
          </h3>
          <p className="text-xs text-neutral-400 overflow-hidden truncate">
            {player?.track_window?.current_track?.artists.map((el) => {
              return (
                <Link
                  className="hover:underline"
                  to={`/artist/${el.uri.split(':')[2]}`}
                  key={el.name}
                >{`${el.name}  `}</Link>
              );
            })}
          </p>
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <IconSVG
            onClick={() => repeatPlayback(repeat, setRepeat)}
            name="repeat"
            width="20"
            height="33"
            className={`${
              repeat ? ' fill-sky-500' : 'fill-white'
            } cursor-pointer text-center hover:fill-sky-500 duration-200 active:w-7`}
          />
          <IconSVG
            onClick={() => skipToPrevious()}
            name="skipToPrevious"
            width="35"
            height="33"
            className="cursor-pointer fill-white text-center hover:fill-sky-500 duration-200 active:w-10"
          />

          {player.paused ? (
            <IconSVG
              onClick={() => play('', 0, '')}
              name="play"
              width="40"
              height="33"
              className="cursor-pointer fill-white hover:fill-sky-500 duration-200 active:w-11"
            />
          ) : (
            <IconSVG
              onClick={() => pause()}
              name="pause"
              width="40"
              height="33"
              className="cursor-pointer fill-white text-center hover:fill-sky-500 duration-200 active:w-11"
            />
          )}
          <IconSVG
            onClick={() => skipToNext()}
            name="skipToNext"
            width="35"
            height="33"
            className="cursor-pointer fill-white text-center hover:fill-sky-500 duration-200 active:w-10"
          />
          <IconSVG
            onClick={() => shufflePlayback(player.shuffle)}
            name="shuffle"
            width="20"
            height="33"
            className={`${
              player?.shuffle ? ' fill-sky-500' : 'fill-white'
            } cursor-pointer hover:fill-sky-500 duration-200 active:w-7`}
          />
        </div>
        <div className="flex">
          <p className="text-xs text-neutral-400 w-8 text-center">{secondsToTime(positionTrack)}</p>
          <input
            onChange={(event) => seekToPosition(event)}
            type="range"
            max={player.duration}
            value={positionTrack}
            step="1"
            className={INPUT_RANGE_PLAYBACK_STYLE}
            id="customRange1"
          />
          <p className="text-xs text-neutral-400 w-8 text-center">
            {secondsToTime(player.duration)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end relative w-80">
        <div>
          <DevicePopup
            device={device}
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
            setDevice={setDevice}
          />
        </div>
        <div className="md:flex hidden items-center">
          {(Number(volume) == 0 && (
            <IconSVG
              onClick={() => play('', 0, '')}
              name="lowVolume"
              width="28"
              height="23"
              className="fill-white text-center"
            />
          )) ||
            (0.01 <= Number(volume) && Number(volume) < 0.6 && (
              <IconSVG
                onClick={() => play('', 0, '')}
                name="mediumVolume"
                width="28"
                height="23"
                className="fill-white text-center"
              />
            )) ||
            (0.61 < Number(volume) && Number(volume) <= 1 && (
              <IconSVG
                onClick={() => play('', 0, '')}
                name="hightVolume"
                width="28"
                height="23"
                className="fill-white text-center"
              />
            ))}
          <input
            onMouseUp={(event) => setVolume(event, setVolumes)}
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={volume}
            className={INPUT_RANGE_VOLUME_STYLE}
            id="customRange1"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;

const INPUT_RANGE_PLAYBACK_STYLE =
  'md:w-72 w-38 appearance-none flex items-center cursor-pointer bg-transparent z-30 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-1 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:appearance-none [&::-ms-thumb]:bg-blue-500 [&::-ms-thumb]:rounded-full [&::-ms-thumb]:border-0 [&::-ms-thumb]:w-2.5 [&::-ms-thumb]:h-2.5 [&::-ms-thumb]:appearance-none [&::-webkit-slider-runnable-track]:bg-neutral-200 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:overflow-hidden [&::-moz-range-track]:bg-neutral-200 [&::-moz-range-track]:rounded-full [&::-ms-track]:bg-neutral-200 [&::-ms-track]:rounded-full [&::-moz-range-progress]:bg-blue-400 [&::-moz-range-progress]:rounded-full [&::-ms-fill-lower]:bg-blue-400 [&::-ms-fill-lower]:rounded-full [&::-webkit-slider-thumb]:shadow-[-999px_0px_0px_990px_#4e97ff]';

const INPUT_RANGE_VOLUME_STYLE =
  'md:w-28 w-14 h-3 pr-3 appearance-none flex items-center cursor-pointer bg-transparent z-30 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-1 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:appearance-none [&::-ms-thumb]:bg-blue-500 [&::-ms-thumb]:rounded-full [&::-ms-thumb]:border-0 [&::-ms-thumb]:w-2.5 [&::-ms-thumb]:h-2.5 [&::-ms-thumb]:appearance-none [&::-webkit-slider-runnable-track]:bg-neutral-200 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:overflow-hidden [&::-moz-range-track]:bg-neutral-200 [&::-moz-range-track]:rounded-full [&::-ms-track]:bg-neutral-200 [&::-ms-track]:rounded-full [&::-moz-range-progress]:bg-blue-400 [&::-moz-range-progress]:rounded-full [&::-ms-fill-lower]:bg-blue-400 [&::-ms-fill-lower]:rounded-full [&::-webkit-slider-thumb]:shadow-[-999px_0px_0px_990px_#4e97ff]';
