import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMe } from '@/api/spotify';
import IconSVG from '@/components/IconSVG/IconSVG';

const Header = () => {
  const navigate = useNavigate();
  const searchtRef = React.useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  const { category, value } = useParams();
  const [searchKey, setSearchKey] = React.useState('');
  const [inputFocused, setInputFocused] = React.useState(false);
  const [user, setUser] = React.useState<SpotifyApi.CurrentUsersProfileResponse>();

  async function fetchUserData() {
    const data = await getMe();
    setUser(data);
  }

  const search = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (searchKey === '') {
      return navigate('/search');
    } else {
      return navigate(`search/${searchKey}${category ? `/${category}` : ''}`);
    }
  };

  const logout = () => {
    window.localStorage.getItem('token') && window.localStorage.removeItem('token');
  };

  React.useEffect(() => {
    fetchUserData();
    if (pathname === '/search') {
      setInputFocused(true);
    }
  }, []);

  React.useEffect(() => {
    if (pathname === '/search' && searchtRef.current) {
      setInputFocused(true);
      searchtRef.current.focus();
    } else if (pathname.includes('search')) {
      const handleKeyPress = (event: { key: string }) => {
        if (event.key === 'Enter' && searchtRef.current) {
          searchtRef.current.blur();
        }
      };
      document.addEventListener('keypress', handleKeyPress);
      return () => {
        document.removeEventListener('keypress', handleKeyPress);
      };
    }
  }, [pathname]);

  React.useEffect(() => {
    if (pathname === '/search' && !value) {
      setSearchKey('');
    }
    if (value) {
      setSearchKey(value);
    }
    if (category?.toLowerCase() === 'all' && value) {
      return navigate(`/search/${value}`);
    }
  }, [category, navigate, value, pathname]);

  return (
    <header className="flex justify-between items-center h-12 mb-1 bg-gradient-to-b from-[#202020] to-neutral-900 rounded-lg px-4">
      <div className="flex items-center">
        <IconSVG
          onClick={() => navigate(-1)}
          name="arrow"
          width="30"
          height="35"
          className="rotate-90 hidden sm:block cursor-pointer fill-neutral-500 hover:fill-sky-500 transition-all transition-duration: 500ms"
        />
        <IconSVG
          onClick={() => navigate(+1)}
          name="arrow"
          width="35"
          height="35"
          className="-rotate-90 hidden sm:block cursor-pointer mr-4 fill-neutral-500 hover:fill-sky-500 transition-all transition-duration: 500ms"
        />
        {pathname.includes('/search') && (
          <form
            className={`h-8 px-2 flex justify-between items-center bg-neutral-800 rounded-md border-2 ${
              inputFocused ? ' border-sky-500' : 'border-neutral-800'
            }`}
          >
            <input
              ref={searchtRef}
              type="text"
              placeholder="What do you want to play?"
              className="w-[150px] sm:w-44 mr-2 text-sm text-neutral-500 bg-neutral-800 outline-none"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChange={(e) => setSearchKey(e.target.value)}
              value={searchKey ? searchKey : ''}
            />
            <button type={'submit'} onClick={(e) => search(e)}>
              <IconSVG
                name="search"
                className="fill-neutral-500 hover:fill-sky-500 transition-all transition-duration: 500ms"
              />
            </button>
          </form>
        )}
      </div>
      <div className="flex items-center">
        <p className="text-gray-500/70 mr-4 text-sm hidden md:block">
          {user && user.product.toLocaleUpperCase()}
        </p>
        {user?.images && (
          <img className="h-9 hidden sm:block rounded-full mr-5" src={user.images[0].url} alt="" />
        )}
        <Link to="/login">
          <IconSVG
            onClick={() => logout()}
            name="logout"
            className="fill-neutral-500 hover:fill-sky-500 transition-all transition-duration: 500ms"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
