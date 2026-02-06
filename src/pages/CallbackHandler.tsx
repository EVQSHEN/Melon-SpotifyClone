import React from 'react';
import { exchangeCodeForToken } from '@/api/auth';
import { setToken } from '@/api/spotify';
import { useNavigate } from 'react-router-dom';

const CallbackHandler = () => {
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    const init = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        const existingToken = localStorage.getItem('access_token');
        if (existingToken) {
          setToken(existingToken);
          navigate('/');
          return;
        }
        if (!code) {
          setError('No code found in URL');
          return;
        }
        const tokenData = await exchangeCodeForToken(code);
        localStorage.setItem('access_token', tokenData.access_token);
        setToken(tokenData.access_token);
        navigate('/');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };
    init();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-b from-black to-slate-500">
      <div className="py-2 px-6 bg-sky-500 rounded-lg hover:py-3 hover:px-8 transition-all duration-150">
        {error ? `Error: ${error}` : ''}
      </div>
    </div>
  );
};

export default CallbackHandler;
