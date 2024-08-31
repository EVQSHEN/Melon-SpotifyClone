interface DevicePopupProps {
  device: SpotifyApi.UserDevice[] | [];
  activeDevice: string | boolean;
  setActiveDevice: React.Dispatch<React.SetStateAction<string | boolean>>;
  setDevice: React.Dispatch<React.SetStateAction<SpotifyApi.UserDevice[] | []>>;
}

export type { DevicePopupProps };
