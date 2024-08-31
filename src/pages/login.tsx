import { LINK, LINK_SPOTIFY } from '@/api/constants';

const Login = () => {
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-b from-black to-slate-500">
        <a
          className="py-2 px-6 m-6 bg-sky-500 rounded-lg hover:py-3 hover:px-8 transition-all transition-duration:150ms;"
          href={LINK}
        >
          Login to MELOS
        </a>
      </div>
      <a
        href={LINK_SPOTIFY}
        target="_blank"
        className="relative cursor-pointer flex-wrap flex justify-center items-center text-gray-700 bottom-20 text-center hover:underline m-3"
      >
        You must have a premium subscription to Spotify to listen to the songs
      </a>
    </>
  );
};

export default Login;
