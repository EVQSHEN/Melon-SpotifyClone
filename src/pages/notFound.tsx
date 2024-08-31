import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-8">Page not found</h1>
      <Link
        to="/"
        className="py-2 my-1 px-6 bg-sky-500 font-medium rounded-lg hover:py-3 hover:px-8 hover:my-0 transition-all transition-duration: 150ms;"
      >
        Back to main
      </Link>
    </div>
  );
};

export default NotFound;
