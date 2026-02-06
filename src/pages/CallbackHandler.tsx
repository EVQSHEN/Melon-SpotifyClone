import { useEffect, useState } from 'react';
import { exchangeCodeForToken } from '@/api/auth';
import { setToken } from '@/api/spotify';

const CallbackHandler = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        const existingToken = localStorage.getItem('access_token');
        if (existingToken) {
          setToken(existingToken);
          window.location.replace('/');
          return;
        }
        if (!code) {
          setError('No code found in URL');
          return;
        }
        const tokenData = await exchangeCodeForToken(code);
        localStorage.setItem('access_token', tokenData.access_token);
        setToken(tokenData.access_token);
        window.location.replace('/');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };
    init();
  }, []);

  if (error) return <div>Error: {error}</div>;
  return null;
};

export default CallbackHandler;
