const CLIENT_ID: string = '89e70a536c8343338907581a8967e763';
const REDIRECT_URI_BUILD: string = 'http://localhost:5173/';
const REDIRECT_URI: string = 'https://spotify-2-8cg4.vercel.app/';
const AUTH_ENDPOINT: string = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE: string = 'token';
const SCOPE: string =
  'user-read-private playlist-read-private user-read-email user-library-read streaming app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing user-follow-modify playlist-modify-public user-library-modify user-library-read playlist-modify-private playlist-read-collaborative playlist-read-private user-follow-read user-read-recently-played user-read-playback-position user-top-read user-read-recently-played';
const LINK: string = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
const LINK_SPOTIFY = 'https://www.spotify.com/ua-en/account/';

export {
  CLIENT_ID,
  REDIRECT_URI,
  REDIRECT_URI_BUILD,
  AUTH_ENDPOINT,
  RESPONSE_TYPE,
  LINK,
  LINK_SPOTIFY,
};
