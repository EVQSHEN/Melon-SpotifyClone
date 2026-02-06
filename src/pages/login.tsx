import { getSpotifyAuthLink } from '@/api/auth';

const Login = () => {
  const handleLogin = async () => {
    const link = await getSpotifyAuthLink();
    window.location.href = link;
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-b from-black to-slate-500">
      <button
        onClick={handleLogin}
        className="py-2 px-6 bg-sky-500 rounded-lg hover:py-3 hover:px-8 transition-all duration-150"
      >
        Login to Spotify
      </button>
    </div>
  );
};

export default Login;
