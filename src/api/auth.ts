const CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-top-read',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify',
    'streaming',
  ].join(' '),
};

const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (x) => chars[x % chars.length]).join('');
};

const sha256 = (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
};

const base64urlEncode = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const getSpotifyAuthLink = async (): Promise<string> => {
  const codeVerifier = generateRandomString(128);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  const params = new URLSearchParams({
    client_id: CONFIG.CLIENT_ID,
    response_type: 'code',
    redirect_uri: CONFIG.REDIRECT_URI,
    scope: CONFIG.SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  return `${CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) throw new Error('Auth session expired (code_verifier missing)');
  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CONFIG.CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: CONFIG.REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  };
  try {
    const res = await fetch(CONFIG.TOKEN_ENDPOINT, payload);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || 'Token exchange failed');
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.removeItem('spotify_code_verifier');
    return data;
  } catch (error) {
    console.error('Spotify Auth Error:', error);
    throw error;
  }
};
