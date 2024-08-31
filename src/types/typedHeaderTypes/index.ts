import { colorType } from '../colorTypes';

type TypedHeaderType = {
  color: colorType | undefined;
  picture: string | undefined;
  name: string | undefined;
  description?: string | undefined | null;
  trackTotal?: number | undefined;
  artist?: any;
  release_date?: string;
  duration_ms?: number;
  className?: string;
};

interface ControlPanelType {
  tracks: SpotifyApi.SingleArtistResponse | SpotifyApi.PlaylistTrackResponse | any;
  id: string | undefined;
  colors?: colorType;
}

export type { TypedHeaderType, ControlPanelType };
