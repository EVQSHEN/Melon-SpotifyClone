type TrackRowProps = {
  added_at: string;
  track:
    | SpotifyApi.SingleTrackResponse
    | SpotifyApi.TrackObjectFull
    | SpotifyApi.TrackObjectSimplified
    | any;
  nubmer: number;
  id: string | undefined;
  key: number | string;
  additionalType?: string;
};

export type { TrackRowProps };
